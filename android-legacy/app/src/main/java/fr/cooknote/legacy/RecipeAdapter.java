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
    private static final int COLOR_CARD = Color.rgb(23, 21, 17);
    private static final int COLOR_CARD_SOFT = Color.rgb(32, 29, 24);
    private static final int COLOR_CARD_ACTIVE = Color.rgb(43, 34, 22);
    private static final int COLOR_TEXT = Color.rgb(255, 247, 237);
    private static final int COLOR_MUTED = Color.rgb(207, 198, 184);
    private static final int COLOR_BORDER = Color.rgb(58, 49, 35);
    private static final int COLOR_GOLD = Color.rgb(251, 191, 36);
    private static final int COLOR_ORANGE = Color.rgb(245, 158, 11);

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
        String badge = recipe.isCollection() ? "Collection - " + collectionCount(recipe) + " fiches" : recipe.primaryCategory();
        holder.badge.setText(favoriteIds.contains(recipe.id) ? "Favori - " + badge : badge);
        holder.count.setText(recipe.isCollection() ? collectionCount(recipe) + " fiches" : "Voir");
        imageLoader.load(recipe.image, holder.image, dp(126), dp(82));
        return convertView;
    }

    private String displayMeta(Recipe recipe) {
        if (!recipe.isCollection()) return recipe.metaLine();
        return recipe.primaryCategory() + " - " + collectionCount(recipe) + " fiches rangees";
    }

    private int collectionCount(Recipe recipe) {
        if (collectionCounts == null) return recipe.variants.size();
        Integer count = collectionCounts.get(recipe.id);
        return count == null ? recipe.variants.size() : count.intValue();
    }

    private ViewHolder createRow() {
        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(8), dp(5), dp(8), dp(5));
        root.setBackgroundColor(COLOR_BG);
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(114)
        ));

        LinearLayout card = new LinearLayout(context);
        card.setOrientation(LinearLayout.HORIZONTAL);
        card.setGravity(Gravity.CENTER_VERTICAL);
        card.setPadding(dp(8), dp(8), dp(9), dp(8));
        card.setBackground(selectablePanel(COLOR_CARD, COLOR_CARD_ACTIVE, COLOR_BORDER, 1, 10));
        root.addView(card, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView image = new ImageView(context);
        image.setScaleType(ImageView.ScaleType.CENTER_CROP);
        image.setBackgroundColor(COLOR_CARD_SOFT);
        LinearLayout.LayoutParams imageParams = new LinearLayout.LayoutParams(dp(126), dp(82));
        imageParams.rightMargin = dp(12);
        card.addView(image, imageParams);

        LinearLayout textColumn = new LinearLayout(context);
        textColumn.setOrientation(LinearLayout.VERTICAL);
        textColumn.setGravity(Gravity.CENTER_VERTICAL);
        card.addView(textColumn, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));

        TextView badge = new TextView(context);
        badge.setTextColor(COLOR_GOLD);
        badge.setTextSize(10);
        badge.setTypeface(Typeface.DEFAULT_BOLD);
        badge.setSingleLine(true);
        badge.setEllipsize(TextUtils.TruncateAt.END);
        badge.setIncludeFontPadding(false);
        badge.setPadding(dp(7), dp(3), dp(7), dp(3));
        badge.setBackground(panel(Color.rgb(37, 28, 15), Color.rgb(93, 67, 26), 1, 12));
        textColumn.addView(badge);

        TextView title = new TextView(context);
        title.setTextColor(COLOR_TEXT);
        title.setTextSize(16);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setIncludeFontPadding(false);
        title.setLineSpacing(dp(1), 1.05f);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(4);
        textColumn.addView(title, titleParams);

        TextView meta = new TextView(context);
        meta.setTextColor(COLOR_MUTED);
        meta.setTextSize(12);
        meta.setSingleLine(true);
        meta.setEllipsize(TextUtils.TruncateAt.END);
        meta.setIncludeFontPadding(false);
        LinearLayout.LayoutParams metaParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        metaParams.topMargin = dp(5);
        textColumn.addView(meta, metaParams);

        TextView count = new TextView(context);
        count.setTextColor(COLOR_ORANGE);
        count.setTextSize(11);
        count.setTypeface(Typeface.DEFAULT_BOLD);
        count.setGravity(Gravity.CENTER);
        count.setSingleLine(true);
        count.setEllipsize(TextUtils.TruncateAt.END);
        count.setIncludeFontPadding(false);
        count.setPadding(dp(8), dp(5), dp(8), dp(5));
        count.setBackground(panel(Color.rgb(39, 30, 18), Color.rgb(93, 67, 26), 1, 14));
        LinearLayout.LayoutParams countParams = new LinearLayout.LayoutParams(dp(62), ViewGroup.LayoutParams.WRAP_CONTENT);
        countParams.leftMargin = dp(8);
        card.addView(count, countParams);

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.badge = badge;
        holder.title = title;
        holder.meta = meta;
        holder.count = count;
        return holder;
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
