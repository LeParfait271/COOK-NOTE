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

final class RecipeAdapter extends BaseAdapter {
    private int COLOR_BG = Color.rgb(7, 6, 5);
    private int COLOR_CARD = Color.rgb(22, 19, 15);
    private int COLOR_CARD_SOFT = Color.rgb(30, 26, 20);
    private int COLOR_CARD_ACTIVE = Color.rgb(58, 43, 22);
    private int COLOR_TEXT = Color.rgb(255, 248, 238);
    private int COLOR_MUTED = Color.rgb(226, 217, 202);
    private int COLOR_BORDER = Color.rgb(120, 90, 42);
    private int COLOR_BORDER_BRIGHT = Color.rgb(184, 134, 52);
    private int COLOR_GOLD = Color.rgb(251, 191, 36);
    private int COLOR_ORANGE = Color.rgb(245, 158, 11);
    private int COLOR_SHEEN = Color.rgb(255, 224, 150);
    private int COLOR_GOLD_SOFT = Color.rgb(214, 158, 64);
    private static final int CARD_MIN_WIDTH_DP = 286;
    private static final int CARD_SPACING_DP = 11;
    private static final int CARD_MIN_HEIGHT_DP = 130;

    private final Context context;
    private final ImageLoader imageLoader;
    private final List<Recipe> items = new ArrayList<Recipe>();
    private Map<String, Integer> collectionCounts;
    private boolean compactCards;
    private boolean lightTheme;
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

    void setCompactCards(boolean compact) {
        if (compactCards == compact) return;
        compactCards = compact;
        resetPrefetchWindow();
        notifyDataSetChanged();
    }

    void setLightTheme(boolean enabled) {
        if (lightTheme == enabled) return;
        lightTheme = enabled;
        applyThemePalette();
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

    private void applyThemePalette() {
        if (lightTheme) {
            COLOR_BG = Color.rgb(245, 239, 228);
            COLOR_CARD = Color.rgb(255, 248, 237);
            COLOR_CARD_SOFT = Color.rgb(243, 234, 220);
            COLOR_CARD_ACTIVE = Color.rgb(234, 210, 174);
            COLOR_TEXT = Color.rgb(32, 23, 15);
            COLOR_MUTED = Color.rgb(77, 66, 54);
            COLOR_BORDER = Color.rgb(185, 133, 67);
            COLOR_BORDER_BRIGHT = Color.rgb(217, 119, 6);
            COLOR_GOLD = Color.rgb(180, 83, 9);
            COLOR_ORANGE = Color.rgb(217, 119, 6);
        } else {
            COLOR_BG = Color.rgb(4, 4, 4);
            COLOR_CARD = Color.rgb(18, 17, 14);
            COLOR_CARD_SOFT = Color.rgb(28, 26, 21);
            COLOR_CARD_ACTIVE = Color.rgb(52, 39, 20);
            COLOR_TEXT = Color.rgb(255, 247, 237);
            COLOR_MUTED = Color.rgb(222, 214, 200);
            COLOR_BORDER = Color.rgb(113, 84, 36);
            COLOR_BORDER_BRIGHT = Color.rgb(176, 128, 45);
            COLOR_GOLD = Color.rgb(251, 191, 36);
            COLOR_ORANGE = Color.rgb(245, 158, 11);
        }
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
        root.setPadding(dp(4), dp(4), dp(4), dp(8));
        root.setBackgroundColor(COLOR_BG);
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(compactCards ? 138 : 160)
        ));

        LinearLayout card = new LinearLayout(context);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackground(selectablePanel(COLOR_CARD, COLOR_CARD_ACTIVE, COLOR_BORDER, 1, 16));
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
        overlay.setPadding(dp(16), dp(26), dp(16), dp(15));
        overlay.setBackground(cardTitleOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        TextView title = new TextView(context);
        title.setTextColor(Color.rgb(255, 251, 244));
        title.setTextSize(17);
        title.setTypeface(Typeface.DEFAULT_BOLD);
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

        TextView accent = new TextView(context);
        accent.setText("COOK NOTE");
        accent.setTextColor(Color.rgb(251, 191, 36));
        accent.setTextSize(10);
        accent.setTypeface(Typeface.DEFAULT_BOLD);
        accent.setLetterSpacing(0.14f);
        accent.setIncludeFontPadding(false);
        accent.setPadding(0, dp(5), 0, 0);
        overlay.addView(accent, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.title = title;
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
        return compactCards ? 244 : CARD_MIN_WIDTH_DP;
    }

    private int cardSpacingDp() {
        return compactCards ? 8 : CARD_SPACING_DP;
    }

    private int cardMinHeightDp() {
        return compactCards ? 112 : CARD_MIN_HEIGHT_DP;
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
    }
}
