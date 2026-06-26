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

    RecipeAdapter(Context context, ImageLoader imageLoader) {
        this.context = context;
        this.imageLoader = imageLoader;
    }

    void setItems(List<Recipe> recipes) {
        items.clear();
        items.addAll(recipes);
        notifyDataSetChanged();
    }

    void setFavoriteIds(Set<String> ids) {
        favoriteIds.clear();
        if (ids != null) favoriteIds.addAll(ids);
        notifyDataSetChanged();
    }

    void setCollectionCounts(Map<String, Integer> counts) {
        collectionCounts = counts;
        notifyDataSetChanged();
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
        return position;
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
        holder.meta.setText(displayMeta(recipe));
        holder.badge.setText(recipe.primaryCategory());
        holder.count.setText(cardInfo(recipe));
        int cardWidth = resizeCardForParent(holder, parent);
        int cardHeight = Math.max(dp(CARD_MIN_HEIGHT_DP), (cardWidth * 9) / 16);
        imageLoader.load(recipe.image, holder.image, cardWidth, cardHeight);
        return convertView;
    }

    private String displayMeta(Recipe recipe) {
        if (!recipe.isCollection()) return recipe.metaLine();
        return recipe.primaryCategory() + " - " + collectionCount(recipe) + " fiches rangees";
    }

    private String cardInfo(Recipe recipe) {
        if (favoriteIds.contains(recipe.id)) return "Favori";
        if (recipe.isCollection()) return collectionCount(recipe) + " fiches";
        int totalTime = recipe.activeTime + recipe.cookTime;
        if (totalTime > 0) return formatMinutes(totalTime);
        String difficulty = recipe.difficultyLabel();
        return difficulty.length() > 0 ? difficulty : "Fiche";
    }

    private int collectionCount(Recipe recipe) {
        if (collectionCounts == null) return recipe.variants.size();
        Integer count = collectionCounts.get(recipe.id);
        return count == null ? recipe.variants.size() : count.intValue();
    }

    private ViewHolder createRow() {
        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(2), 0, dp(2), 0);
        root.setBackgroundColor(COLOR_BG);
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(156)
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
        veil.setBackgroundColor(Color.argb(58, 0, 0, 0));
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
        overlay.setPadding(dp(12), dp(7), dp(12), dp(10));
        overlay.setBackground(bottomOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        View overlayEdge = new View(context);
        overlayEdge.setBackground(gradientPanel(
                Color.argb(136, 251, 191, 36),
                Color.argb(12, 251, 191, 36),
                Color.TRANSPARENT,
                0,
                0
        ));
        LinearLayout.LayoutParams overlayEdgeParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(1)
        );
        overlayEdgeParams.bottomMargin = dp(7);
        overlay.addView(overlayEdge, overlayEdgeParams);

        LinearLayout topLine = new LinearLayout(context);
        topLine.setOrientation(LinearLayout.HORIZONTAL);
        topLine.setGravity(Gravity.CENTER_VERTICAL);
        overlay.addView(topLine, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView badge = new TextView(context);
        badge.setTextColor(COLOR_GOLD);
        badge.setTextSize(9);
        badge.setTypeface(Typeface.DEFAULT_BOLD);
        badge.setSingleLine(true);
        badge.setEllipsize(TextUtils.TruncateAt.END);
        badge.setIncludeFontPadding(false);
        badge.setPadding(dp(7), dp(3), dp(7), dp(3));
        badge.setBackground(panel(Color.argb(170, 12, 9, 6), COLOR_BORDER_BRIGHT, 1, 12));
        LinearLayout.LayoutParams badgeParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 0.72f);
        topLine.addView(badge, badgeParams);

        TextView count = new TextView(context);
        count.setTextColor(COLOR_ORANGE);
        count.setTextSize(9);
        count.setTypeface(Typeface.DEFAULT_BOLD);
        count.setGravity(Gravity.CENTER);
        count.setSingleLine(true);
        count.setEllipsize(TextUtils.TruncateAt.END);
        count.setIncludeFontPadding(false);
        count.setPadding(dp(6), dp(3), dp(6), dp(3));
        count.setBackground(panel(Color.argb(170, 22, 13, 6), COLOR_BORDER_BRIGHT, 1, 12));
        LinearLayout.LayoutParams countParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        countParams.leftMargin = dp(6);
        topLine.addView(count, countParams);

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
        titleParams.topMargin = dp(6);
        overlay.addView(title, titleParams);

        TextView meta = new TextView(context);
        meta.setTextColor(Color.rgb(216, 207, 193));
        meta.setTextSize(10.5f);
        meta.setSingleLine(true);
        meta.setEllipsize(TextUtils.TruncateAt.END);
        meta.setIncludeFontPadding(false);
        LinearLayout.LayoutParams metaParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        metaParams.topMargin = dp(4);
        overlay.addView(meta, metaParams);

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.badge = badge;
        holder.title = title;
        holder.meta = meta;
        holder.count = count;
        return holder;
    }

    private int resizeCardForParent(ViewHolder holder, ViewGroup parent) {
        int cardWidth = cardWidthForParent(parent);
        int cardHeight = Math.max(dp(CARD_MIN_HEIGHT_DP), (cardWidth * 9) / 16);
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
        int minWidth = dp(CARD_MIN_WIDTH_DP);
        int spacing = dp(CARD_SPACING_DP);
        int available = parent == null ? 0 : parent.getWidth() - parent.getPaddingLeft() - parent.getPaddingRight();
        if (available <= 0) return minWidth;
        int columns = Math.max(1, (available + spacing) / (minWidth + spacing));
        int width = (available - (spacing * (columns - 1))) / columns;
        return Math.max(minWidth, width);
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

    private GradientDrawable bottomOverlayGradient() {
        return new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(8, 0, 0, 0),
                Color.argb(112, 0, 0, 0),
                Color.argb(226, 5, 4, 3)
        });
    }

    private static String formatMinutes(int minutes) {
        if (minutes >= 60) {
            int hours = minutes / 60;
            int rest = minutes % 60;
            return rest == 0 ? hours + "h" : hours + "h" + (rest < 10 ? "0" : "") + rest;
        }
        return minutes + "min";
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
        TextView badge;
        TextView title;
        TextView meta;
        TextView count;
    }
}
