package fr.cooknote.legacy;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

final class ImageLoader {
    private static final int CACHE_DIMENSION_BUCKET = 32;
    private static final int PRIORITY_VISIBLE = 0;
    private static final int PRIORITY_PREFETCH = 1;

    private final Context context;
    private final LruCache<String, Bitmap> cache;
    private final ExecutorService executor;
    private final Handler mainHandler;
    private final ColorDrawable placeholder;
    private final Set<String> pendingKeys;
    private final Set<String> visiblePendingKeys;
    private final Map<String, ArrayList<ImageView>> waitingTargets;
    private final AtomicLong taskSequence;
    private final AtomicInteger prefetchGeneration;

    ImageLoader(Context context) {
        this.context = context.getApplicationContext();
        int maxMemoryKb = (int) (Runtime.getRuntime().maxMemory() / 1024);
        int cacheKb = Math.min(14 * 1024, Math.max(5 * 1024, maxMemoryKb / 7));
        this.cache = new LruCache<String, Bitmap>(cacheKb) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getByteCount() / 1024;
            }
        };
        this.executor = new ThreadPoolExecutor(
                1,
                1,
                0L,
                TimeUnit.MILLISECONDS,
                new PriorityBlockingQueue<Runnable>()
        );
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.placeholder = new ColorDrawable(Color.rgb(18, 16, 12));
        this.pendingKeys = Collections.synchronizedSet(new HashSet<String>());
        this.visiblePendingKeys = Collections.synchronizedSet(new HashSet<String>());
        this.waitingTargets = new HashMap<String, ArrayList<ImageView>>();
        this.taskSequence = new AtomicLong();
        this.prefetchGeneration = new AtomicInteger();
    }

    void load(final String imageName, final ImageView imageView, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) {
            detach(imageView);
            return;
        }
        loadAsset("images/" + imageName, imageView, requestedWidth, requestedHeight);
    }

    void loadDetail(final String imageName, final ImageView imageView, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) {
            detach(imageView);
            return;
        }
        loadAsset("detail-images/" + imageName, imageView, requestedWidth, requestedHeight);
    }

    void detach(ImageView imageView) {
        if (imageView == null) return;
        unregisterWaitingTarget(imageView);
        imageView.setTag(null);
        imageView.setImageDrawable(placeholder);
    }

    void prefetch(final String imageName, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) return;
        prefetchAsset("images/" + imageName, requestedWidth, requestedHeight);
    }

    void prefetchDetail(final String imageName, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) return;
        prefetchAsset("detail-images/" + imageName, requestedWidth, requestedHeight);
    }

    private void loadAsset(final String assetPath, final ImageView imageView, final int requestedWidth, final int requestedHeight) {
        final int cacheWidth = normalizedDimension(requestedWidth);
        final int cacheHeight = normalizedDimension(requestedHeight);
        final String cacheKey = cacheKey(assetPath, cacheWidth, cacheHeight);
        unregisterWaitingTarget(imageView);
        imageView.setTag(cacheKey);
        Bitmap cached = cache.get(cacheKey);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }
        imageView.setImageDrawable(placeholder);
        if (!registerWaitingTarget(cacheKey, imageView)) return;
        if (!visiblePendingKeys.add(cacheKey)) return;
        executor.execute(task(PRIORITY_VISIBLE, new Runnable() {
            @Override
            public void run() {
                try {
                    if (!hasWaitingTargets(cacheKey)) return;
                    final Bitmap cachedAfterQueue = cache.get(cacheKey);
                    final Bitmap bitmap = cachedAfterQueue != null
                            ? cachedAfterQueue
                            : decode(assetPath, cacheWidth, cacheHeight);
                    if (bitmap != null && cachedAfterQueue == null) cache.put(cacheKey, bitmap);
                    mainHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            ArrayList<ImageView> targets = takeWaitingTargets(cacheKey);
                            if (targets == null || bitmap == null) return;
                            for (ImageView target : targets) {
                                if (target == null) continue;
                                Object tag = target.getTag();
                                if (cacheKey.equals(tag)) {
                                    target.setImageBitmap(bitmap);
                                }
                            }
                        }
                    });
                } finally {
                    visiblePendingKeys.remove(cacheKey);
                }
            }
        }));
    }

    private void prefetchAsset(final String assetPath, final int requestedWidth, final int requestedHeight) {
        final int cacheWidth = normalizedDimension(requestedWidth);
        final int cacheHeight = normalizedDimension(requestedHeight);
        final String cacheKey = cacheKey(assetPath, cacheWidth, cacheHeight);
        if (cache.get(cacheKey) != null) return;
        if (hasWaitingTargets(cacheKey)) return;
        if (!pendingKeys.add(cacheKey)) return;
        final int generation = prefetchGeneration.get();
        executor.execute(task(PRIORITY_PREFETCH, new Runnable() {
            @Override
            public void run() {
                try {
                    if (generation != prefetchGeneration.get()) return;
                    if (cache.get(cacheKey) != null) return;
                    Bitmap bitmap = decode(assetPath, cacheWidth, cacheHeight);
                    if (bitmap != null) cache.put(cacheKey, bitmap);
                } finally {
                    pendingKeys.remove(cacheKey);
                }
            }
        }));
    }

    void shutdown() {
        executor.shutdownNow();
        prefetchGeneration.incrementAndGet();
        cache.evictAll();
        pendingKeys.clear();
        visiblePendingKeys.clear();
        synchronized (waitingTargets) {
            waitingTargets.clear();
        }
    }

    void trimMemory(boolean aggressive) {
        cancelPendingPrefetch();
        if (aggressive) {
            cache.evictAll();
        } else {
            cache.trimToSize(Math.max(0, cache.maxSize() / 2));
        }
    }

    void cancelPendingPrefetch() {
        prefetchGeneration.incrementAndGet();
        pendingKeys.clear();
    }

    String cacheSummary() {
        return cache.size() + " KB / " + cache.maxSize() + " KB, prefetch " + pendingKeys.size() + ", visibles " + visiblePendingKeys.size() + ", vues " + waitingTargetCount();
    }

    private boolean registerWaitingTarget(String cacheKey, ImageView imageView) {
        synchronized (waitingTargets) {
            removeWaitingTargetLocked(imageView, cacheKey);
            ArrayList<ImageView> targets = waitingTargets.get(cacheKey);
            if (targets != null) {
                if (!targets.contains(imageView)) targets.add(imageView);
                return false;
            }
            targets = new ArrayList<ImageView>();
            targets.add(imageView);
            waitingTargets.put(cacheKey, targets);
            return true;
        }
    }

    private void unregisterWaitingTarget(ImageView imageView) {
        synchronized (waitingTargets) {
            removeWaitingTargetLocked(imageView, null);
        }
    }

    private void removeWaitingTargetLocked(ImageView imageView, String keepKey) {
        if (imageView == null || waitingTargets.isEmpty()) return;
        ArrayList<String> emptyKeys = null;
        for (Map.Entry<String, ArrayList<ImageView>> entry : waitingTargets.entrySet()) {
            if (keepKey != null && keepKey.equals(entry.getKey())) continue;
            ArrayList<ImageView> targets = entry.getValue();
            if (targets == null) continue;
            targets.remove(imageView);
            if (targets.isEmpty()) {
                if (emptyKeys == null) emptyKeys = new ArrayList<String>();
                emptyKeys.add(entry.getKey());
            }
        }
        if (emptyKeys == null) return;
        for (String key : emptyKeys) {
            waitingTargets.remove(key);
        }
    }

    private ArrayList<ImageView> takeWaitingTargets(String cacheKey) {
        synchronized (waitingTargets) {
            return waitingTargets.remove(cacheKey);
        }
    }

    private boolean hasWaitingTargets(String cacheKey) {
        synchronized (waitingTargets) {
            return waitingTargets.containsKey(cacheKey);
        }
    }

    private int waitingTargetCount() {
        synchronized (waitingTargets) {
            int count = 0;
            for (ArrayList<ImageView> targets : waitingTargets.values()) {
                if (targets != null) count += targets.size();
            }
            return count;
        }
    }

    private static String cacheKey(String assetPath, int requestedWidth, int requestedHeight) {
        return assetPath + "@" + requestedWidth + "x" + requestedHeight;
    }

    private static int normalizedDimension(int dimension) {
        int safe = Math.max(1, dimension);
        return ((safe + CACHE_DIMENSION_BUCKET - 1) / CACHE_DIMENSION_BUCKET) * CACHE_DIMENSION_BUCKET;
    }

    private ImageTask task(int priority, Runnable runnable) {
        return new ImageTask(priority, taskSequence.getAndIncrement(), runnable);
    }

    private Bitmap decode(String assetPath, int requestedWidth, int requestedHeight) {
        BitmapFactory.Options bounds = new BitmapFactory.Options();
        bounds.inJustDecodeBounds = true;
        InputStream stream = null;
        try {
            stream = context.getAssets().open(assetPath);
            BitmapFactory.decodeStream(stream, null, bounds);
        } catch (Exception ignored) {
            return null;
        } finally {
            close(stream);
        }

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inPreferredConfig = Bitmap.Config.RGB_565;
        options.inSampleSize = sampleSize(bounds.outWidth, bounds.outHeight, requestedWidth, requestedHeight);

        try {
            stream = context.getAssets().open(assetPath);
            return BitmapFactory.decodeStream(stream, null, options);
        } catch (Exception ignored) {
            return null;
        } finally {
            close(stream);
        }
    }

    private static int sampleSize(int width, int height, int requestedWidth, int requestedHeight) {
        int sample = 1;
        if (height > requestedHeight || width > requestedWidth) {
            int halfHeight = height / 2;
            int halfWidth = width / 2;
            while ((halfHeight / sample) >= requestedHeight && (halfWidth / sample) >= requestedWidth) {
                sample *= 2;
            }
        }
        return Math.max(1, sample);
    }

    private static void close(InputStream stream) {
        if (stream == null) return;
        try {
            stream.close();
        } catch (Exception ignored) {
            // Nothing to close.
        }
    }

    private static final class ImageTask implements Runnable, Comparable<ImageTask> {
        private final int priority;
        private final long sequence;
        private final Runnable runnable;

        ImageTask(int priority, long sequence, Runnable runnable) {
            this.priority = priority;
            this.sequence = sequence;
            this.runnable = runnable;
        }

        @Override
        public void run() {
            runnable.run();
        }

        @Override
        public int compareTo(ImageTask other) {
            if (other == null) return -1;
            if (priority != other.priority) return priority < other.priority ? -1 : 1;
            if (sequence == other.sequence) return 0;
            return sequence < other.sequence ? -1 : 1;
        }
    }
}
