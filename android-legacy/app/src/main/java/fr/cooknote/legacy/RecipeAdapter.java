package fr.cooknote.legacy;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.StateListDrawable;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.PathInterpolator;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static fr.cooknote.legacy.Palette.*;

final class RecipeAdapter extends BaseAdapter {
    private static final int CARD_MIN_WIDTH_DP = 286;
    private static final int CARD_SPACING_DP = 11;
    private static final int CARD_MIN_HEIGHT_DP = 130;

    private final Context context;
    private final ImageLoader imageLoader;
    private final List<Recipe> items = new ArrayList<Recipe>();
    private Map<String, Integer> collectionCounts;
    private boolean prefetchEnabled = true;
    private int lastPrefetchPosition = -1;
    private int lastPrefetchWidth;
    private int lastPrefetchHeight;

    RecipeAdapter(Context context, ImageLoader imageLoader) {
        this.context = context;
        this.imageLoader = imageLoader;
    }

    void setItems(List<Recipe> recipes) {
        if (sameItems(recipes)) return;
        items.clear();
        if (recipes != null) items.addAll(recipes);
        resetPrefetchWindow();
        notifyDataSetChanged();
    }

    void setCollectionCounts(Map<String, Integer> counts) {
        collectionCounts = counts;
        notifyDataSetChanged();
    }

    void setPrefetchEnabled(boolean enabled) {
        prefetchEnabled = enabled;
        if (!enabled) resetPrefetchWindow();
    }

    void releaseView(View view) {
        if (view == null || imageLoader == null) return;
        Object tag = view.getTag();
        if (!(tag instanceof ViewHolder)) return;
        ViewHolder holder = (ViewHolder) tag;
        imageLoader.detach(holder.image);
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public Recipe getItem(int position) {
        return items.get(position);
    }

    @Override
    public long getItemId(int position) {
        Recipe recipe = getItem(position);
        return recipe == null || recipe.id == null ? position : recipe.id.hashCode();
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            holder = createRow();
            convertView = holder.root;
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        Recipe recipe = getItem(position);
        holder.title.setText(recipe.title);
        Integer collectionCount = collectionCounts == null ? null : collectionCounts.get(recipe.id);
        // Comme le site : le titre seul ; le nombre de recettes pour une categorie.
        if (collectionCount != null && collectionCount > 0) {
            holder.meta.setText(collectionCount + (collectionCount > 1 ? " recettes" : " recette"));
            holder.meta.setVisibility(View.VISIBLE);
        } else {
            holder.meta.setVisibility(View.GONE);
        }
        holder.image.setContentDescription("Image de " + recipe.title);
        int cardWidth = resizeCardForParent(holder, parent);
        int cardHeight = Math.max(dp(cardMinHeightDp()), (cardWidth * 9) / 16);
        imageLoader.load(recipe.image, holder.image, cardWidth, cardHeight);
        if (prefetchEnabled) prefetchAround(position, cardWidth, cardHeight);
        return convertView;
    }

    private void prefetchAround(int position, int cardWidth, int cardHeight) {
        if (position == lastPrefetchPosition && cardWidth == lastPrefetchWidth && cardHeight == lastPrefetchHeight) return;
        lastPrefetchPosition = position;
        lastPrefetchWidth = cardWidth;
        lastPrefetchHeight = cardHeight;
        for (int offset = 1; offset <= 1; offset += 1) {
            int index = position + offset;
            if (index >= items.size()) return;
            imageLoader.prefetch(items.get(index).image, cardWidth, cardHeight);
        }
    }

    private void resetPrefetchWindow() {
        lastPrefetchPosition = -1;
        lastPrefetchWidth = 0;
        lastPrefetchHeight = 0;
    }

    private boolean sameItems(List<Recipe> recipes) {
        if (recipes == null) return items.isEmpty();
        if (recipes.size() != items.size()) return false;
        for (int index = 0; index < recipes.size(); index += 1) {
            Recipe current = items.get(index);
            Recipe next = recipes.get(index);
            if (current == next) continue;
            if (current == null || next == null) return false;
            if (!TextUtils.equals(current.id, next.id)) return false;
        }
        return true;
    }

    private ViewHolder createRow() {
        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(5), dp(5), dp(5), dp(9));
        root.setBackgroundColor(COLOR_BG);
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(160)
        ));

        // Carte comme le site : coins de 12dp qui recadrent l'image (le contour
        // n'est jamais recouvert), filet dore discret par-dessus.
        FrameLayout card = new FrameLayout(context);
        card.setBackground(panel(COLOR_CARD, COLOR_CARD, 0, 12));
        card.setClipToOutline(true);
        root.addView(card, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        FrameLayout frame = new FrameLayout(context);
        frame.setBackgroundColor(COLOR_CARD_SOFT);
        card.addView(frame, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView image = new ImageView(context);
        image.setScaleType(ImageView.ScaleType.CENTER_CROP);
        image.setBackgroundColor(COLOR_CARD_SOFT);
        frame.addView(image, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        View veil = new View(context);
        veil.setBackgroundColor(Color.argb(16, 0, 0, 0));
        frame.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout overlay = new LinearLayout(context);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(17), dp(34), dp(17), dp(16));
        overlay.setBackground(cardTitleOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        TextView title = new TextView(context);
        title.setTextColor(Color.rgb(255, 251, 244));
        title.setTextSize(20);
        title.setTypeface(Ui.DISPLAY);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setIncludeFontPadding(false);
        title.setLineSpacing(dp(1), 1.05f);
        title.setShadowLayer(4.0f, 0, dp(2), Color.argb(240, 0, 0, 0));
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        overlay.addView(title, titleParams);

        TextView meta = new TextView(context);
        meta.setTextColor(Color.rgb(226, 217, 202));
        meta.setTextSize(12);
        meta.setIncludeFontPadding(false);
        meta.setPadding(0, dp(5), 0, 0);
        overlay.addView(meta, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        View rim = new View(context);
        rim.setBackground(panel(Color.TRANSPARENT, Color.argb(110, 214, 158, 64), 1, 12));
        card.addView(rim, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.title = title;
        holder.meta = meta;
        animateIn(card, 0);
        return holder;
    }

    private int resizeCardForParent(ViewHolder holder, ViewGroup parent) {
        int cardWidth = cardWidthForParent(parent);
        int cardHeight = Math.max(dp(cardMinHeightDp()), (cardWidth * 9) / 16);
        ViewGroup.LayoutParams params = holder.root.getLayoutParams();
        if (params == null) {
            holder.root.setLayoutParams(new AbsListView.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    cardHeight
            ));
        } else if (params.height != cardHeight) {
            params.height = cardHeight;
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            holder.root.setLayoutParams(params);
        }
        return cardWidth;
    }

    private int cardWidthForParent(ViewGroup parent) {
        int minWidth = dp(cardMinWidthDp());
        int spacing = dp(cardSpacingDp());
        int available = parent == null ? 0 : parent.getWidth() - parent.getPaddingLeft() - parent.getPaddingRight();
        if (available <= 0) return minWidth;
        int columns = Math.max(1, (available + spacing) / (minWidth + spacing));
        int width = (available - (spacing * (columns - 1))) / columns;
        return Math.max(minWidth, width);
    }

    private int cardMinWidthDp() {
        return CARD_MIN_WIDTH_DP;
    }

    private int cardSpacingDp() {
        return CARD_SPACING_DP;
    }

    private int cardMinHeightDp() {
        return CARD_MIN_HEIGHT_DP;
    }

    private int dp(int value) {
        return (int) (value * context.getResources().getDisplayMetrics().density + 0.5f);
    }

    private boolean motionEnabled() {
        try {
            float scale = Settings.Global.getFloat(
                    context.getContentResolver(),
                    Settings.Global.ANIMATOR_DURATION_SCALE, 1f);
            return scale > 0.0f;
        } catch (Exception ignored) {
            return true;
        }
    }

    private void animateIn(View view, int delayMs) {
        if (view == null) return;
        if (!motionEnabled()) {
            view.setAlpha(1f);
            view.setTranslationY(0f);
            return;
        }
        view.setAlpha(0f);
        view.setTranslationY(dp(12));
        view.animate()
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(delayMs)
                .setDuration(220)
                .setInterpolator(new PathInterpolator(0.22f, 0.72f, 0.2f, 1f))
                .start();
    }

    private GradientDrawable panel(int color, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    private GradientDrawable gradientPanel(int startColor, int endColor, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, new int[]{startColor, endColor});
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    private GradientDrawable cardTitleOverlayGradient() {
        return new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(0, 0, 0, 0),
                Color.argb(60, 0, 0, 0),
                Color.argb(188, 5, 4, 3)
        });
    }

    private StateListDrawable selectablePanel(int normalColor, int pressedColor, int strokeColor, int strokeWidth, int radiusDp) {
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{android.R.attr.state_pressed}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_focused}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{}, panel(normalColor, strokeColor, strokeWidth, radiusDp));
        return drawable;
    }

    private static final class ViewHolder {
        LinearLayout root;
        ImageView image;
        TextView title;
        TextView meta;
    }
}
