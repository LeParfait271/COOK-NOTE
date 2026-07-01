package fr.cooknote.legacy;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.StateListDrawable;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

final class RecipeAdapter extends BaseAdapter {
    private static final int COLOR_BG = Color.rgb(4, 4, 4);
    private static final int COLOR_CARD = Color.rgb(18, 17, 14);
    private static final int COLOR_CARD_SOFT = Color.rgb(28, 26, 21);
    private static final int COLOR_CARD_ACTIVE = Color.rgb(52, 39, 20);
    private static final int COLOR_TEXT = Color.rgb(255, 247, 237);
    private static final int COLOR_MUTED = Color.rgb(222, 214, 200);
    private static final int COLOR_BORDER = Color.rgb(113, 84, 36);
    private static final int COLOR_BORDER_BRIGHT = Color.rgb(176, 128, 45);
    private static final int COLOR_GOLD = Color.rgb(251, 191, 36);
    private static final int COLOR_ORANGE = Color.rgb(245, 158, 11);
    private static final int CARD_MIN_WIDTH_DP = 286;
    private static final int CARD_SPACING_DP = 11;
    private static final int CARD_MIN_HEIGHT_DP = 130;

    private final Context context;
    private final ImageLoader imageLoader;
    private final List<Recipe> items = new ArrayList<Recipe>();
    private final Set<String> favoriteIds = new HashSet<String>();
    private Map<String, Integer> collectionCounts;
    private boolean compactCards;
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

    void setFavoriteIds(Set<String> ids) {
        HashSet<String> next = new HashSet<String>();
        if (ids != null) next.addAll(ids);
        if (favoriteIds.equals(next)) return;
        favoriteIds.clear();
        favoriteIds.addAll(next);
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
        root.setPadding(dp(2), 0, dp(2), 0);
        root.setBackgroundColor(COLOR_BG);
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(compactCards ? 134 : 156)
        ));

        LinearLayout card = new LinearLayout(context);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(1), dp(1), dp(1), dp(1));
        card.setBackground(selectablePanel(COLOR_CARD, COLOR_CARD_ACTIVE, COLOR_BORDER, 1, 8));
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
        veil.setBackgroundColor(Color.argb(38, 0, 0, 0));
        frame.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        View topEdge = new View(context);
        topEdge.setBackground(gradientPanel(
                Color.argb(168, 251, 191, 36),
                Color.argb(18, 251, 191, 36),
                Color.TRANSPARENT,
                0,
                0
        ));
        frame.addView(topEdge, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(2),
                Gravity.TOP
        ));

        View bottomEdge = new View(context);
        bottomEdge.setBackground(gradientPanel(
                Color.argb(28, 245, 158, 11),
                Color.argb(158, 245, 158, 11),
                Color.TRANSPARENT,
                0,
                0
        ));
        frame.addView(bottomEdge, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(2),
                Gravity.BOTTOM
        ));

        LinearLayout overlay = new LinearLayout(context);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(12), dp(10), dp(12), dp(12));
        overlay.setBackground(cardTitleOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        TextView title = new TextView(context);
        title.setTextColor(Color.rgb(249, 242, 231));
        title.setTextSize(15);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setIncludeFontPadding(false);
        title.setLineSpacing(dp(1), 1.02f);
        title.setShadowLayer(2.2f, 0, dp(1), Color.BLACK);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        overlay.addView(title, titleParams);

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.title = title;
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
                Color.argb(82, 0, 0, 0),
                Color.argb(206, 5, 4, 3)
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
