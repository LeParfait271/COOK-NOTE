package fr.cooknote.legacy;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

final class RecipeAdapter extends BaseAdapter {
    private final Context context;
    private final ImageLoader imageLoader;
    private final List<Recipe> items = new ArrayList<Recipe>();

    RecipeAdapter(Context context, ImageLoader imageLoader) {
        this.context = context;
        this.imageLoader = imageLoader;
    }

    void setItems(List<Recipe> recipes) {
        items.clear();
        items.addAll(recipes);
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
        holder.meta.setText(recipe.metaLine());
        holder.badge.setText(recipe.isCollection() ? "Collection" : recipe.primaryCategory());
        imageLoader.load(recipe.image, holder.image, dp(116), dp(74));
        return convertView;
    }

    private ViewHolder createRow() {
        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.HORIZONTAL);
        root.setGravity(Gravity.CENTER_VERTICAL);
        root.setPadding(dp(10), dp(7), dp(10), dp(7));
        root.setBackgroundColor(Color.rgb(10, 9, 8));
        root.setLayoutParams(new AbsListView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(92)
        ));

        ImageView image = new ImageView(context);
        image.setScaleType(ImageView.ScaleType.CENTER_CROP);
        LinearLayout.LayoutParams imageParams = new LinearLayout.LayoutParams(dp(116), dp(74));
        imageParams.rightMargin = dp(10);
        root.addView(image, imageParams);

        LinearLayout textColumn = new LinearLayout(context);
        textColumn.setOrientation(LinearLayout.VERTICAL);
        textColumn.setGravity(Gravity.CENTER_VERTICAL);
        root.addView(textColumn, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));

        TextView badge = new TextView(context);
        badge.setTextColor(Color.rgb(251, 191, 36));
        badge.setTextSize(11);
        badge.setTypeface(Typeface.DEFAULT_BOLD);
        badge.setSingleLine(true);
        textColumn.addView(badge);

        TextView title = new TextView(context);
        title.setTextColor(Color.rgb(255, 247, 237));
        title.setTextSize(16);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setMaxLines(2);
        title.setIncludeFontPadding(false);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(4);
        textColumn.addView(title, titleParams);

        TextView meta = new TextView(context);
        meta.setTextColor(Color.rgb(207, 198, 184));
        meta.setTextSize(12);
        meta.setSingleLine(true);
        LinearLayout.LayoutParams metaParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        metaParams.topMargin = dp(5);
        textColumn.addView(meta, metaParams);

        ViewHolder holder = new ViewHolder();
        holder.root = root;
        holder.image = image;
        holder.badge = badge;
        holder.title = title;
        holder.meta = meta;
        return holder;
    }

    private int dp(int value) {
        return (int) (value * context.getResources().getDisplayMetrics().density + 0.5f);
    }

    private static final class ViewHolder {
        LinearLayout root;
        ImageView image;
        TextView badge;
        TextView title;
        TextView meta;
    }
}
