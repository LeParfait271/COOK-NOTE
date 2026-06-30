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
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

final class ImageLoader {
    private final Context context;
    private final LruCache<String, Bitmap> cache;
    private final ExecutorService executor;
    private final Handler mainHandler;
    private final ColorDrawable placeholder;
    private final Set<String> pendingKeys;

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
        this.executor = Executors.newSingleThreadExecutor();
        this.mainHandler = new Handler(Looper.getMainLooper());
        this.placeholder = new ColorDrawable(Color.rgb(18, 16, 12));
        this.pendingKeys = Collections.synchronizedSet(new HashSet<String>());
    }

    void load(final String imageName, final ImageView imageView, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) {
            imageView.setImageDrawable(placeholder);
            return;
        }
        loadAsset("images/" + imageName, imageView, requestedWidth, requestedHeight);
    }

    void loadDetail(final String imageName, final ImageView imageView, final int requestedWidth, final int requestedHeight) {
        if (imageName == null || imageName.length() == 0) {
            imageView.setImageDrawable(placeholder);
            return;
        }
        loadAsset("detail-images/" + imageName, imageView, requestedWidth, requestedHeight);
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
        final String cacheKey = assetPath + "@" + Math.max(1, requestedWidth) + "x" + Math.max(1, requestedHeight);
        imageView.setTag(cacheKey);
        Bitmap cached = cache.get(cacheKey);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }
        imageView.setImageDrawable(placeholder);
        executor.execute(new Runnable() {
            @Override
            public void run() {
                final Bitmap cachedAfterQueue = cache.get(cacheKey);
                if (cachedAfterQueue != null) {
                    mainHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            Object tag = imageView.getTag();
                            if (cacheKey.equals(tag)) {
                                imageView.setImageBitmap(cachedAfterQueue);
                            }
                        }
                    });
                    return;
                }
                final Bitmap bitmap = decode(assetPath, requestedWidth, requestedHeight);
                if (bitmap != null) cache.put(cacheKey, bitmap);
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        Object tag = imageView.getTag();
                        if (cacheKey.equals(tag) && bitmap != null) {
                            imageView.setImageBitmap(bitmap);
                        }
                    }
                });
            }
        });
    }

    private void prefetchAsset(final String assetPath, final int requestedWidth, final int requestedHeight) {
        final String cacheKey = assetPath + "@" + Math.max(1, requestedWidth) + "x" + Math.max(1, requestedHeight);
        if (cache.get(cacheKey) != null) return;
        if (!pendingKeys.add(cacheKey)) return;
        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    if (cache.get(cacheKey) != null) return;
                    Bitmap bitmap = decode(assetPath, requestedWidth, requestedHeight);
                    if (bitmap != null) cache.put(cacheKey, bitmap);
                } finally {
                    pendingKeys.remove(cacheKey);
                }
            }
        });
    }

    void shutdown() {
        executor.shutdownNow();
        cache.evictAll();
        pendingKeys.clear();
    }

    void trimMemory(boolean aggressive) {
        pendingKeys.clear();
        if (aggressive) {
            cache.evictAll();
        } else {
            cache.trimToSize(Math.max(0, cache.maxSize() / 2));
        }
    }

    String cacheSummary() {
        return cache.size() + " KB / " + cache.maxSize() + " KB, attentes " + pendingKeys.size();
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
        options.inDither = true;
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
}
