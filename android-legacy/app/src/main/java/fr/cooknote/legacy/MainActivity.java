package fr.cooknote.legacy;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class MainActivity extends Activity {
    private static final int COLOR_BG = Color.rgb(5, 5, 5);
    private static final int COLOR_PANEL = Color.rgb(18, 16, 12);
    private static final int COLOR_TEXT = Color.rgb(255, 247, 237);
    private static final int COLOR_MUTED = Color.rgb(207, 198, 184);
    private static final int COLOR_GOLD = Color.rgb(251, 191, 36);
    private static final int COLOR_ORANGE = Color.rgb(245, 158, 11);

    private CookNoteRepository repository;
    private ImageLoader imageLoader;
    private RecipeAdapter adapter;
    private LinearLayout categoryStrip;
    private TextView counterView;
    private EditText searchBox;
    private String selectedCategory = "Toutes";
    private String currentQuery = "";
    private boolean showingDetail;
    private final Stack<String> detailBackStack = new Stack<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        imageLoader = new ImageLoader(this);
        try {
            repository = CookNoteRepository.load(this);
            showList();
        } catch (Exception exception) {
            showNativeError("Cook Note Android 5 Lite", "Catalogue impossible a lire.\n\n" + exception.getMessage());
        }
    }

    private void showList() {
        showingDetail = false;
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.VERTICAL);
        header.setPadding(dp(14), dp(12), dp(14), dp(8));
        header.setBackgroundColor(COLOR_PANEL);
        root.addView(header, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView title = text("Cook Note", 28, COLOR_TEXT, true);
        title.setGravity(Gravity.CENTER_VERTICAL);
        header.addView(title);

        TextView subtitle = text("Android 5 Lite - livre local v" + repository.version, 12, COLOR_MUTED, false);
        subtitle.setPadding(0, dp(2), 0, dp(10));
        header.addView(subtitle);

        searchBox = new EditText(this);
        searchBox.setSingleLine(true);
        searchBox.setTextColor(COLOR_TEXT);
        searchBox.setHintTextColor(COLOR_MUTED);
        searchBox.setTextSize(16);
        searchBox.setHint("Rechercher une recette, un ingredient...");
        searchBox.setPadding(dp(12), 0, dp(12), 0);
        searchBox.setBackgroundColor(Color.rgb(31, 29, 24));
        searchBox.setText(currentQuery);
        header.addView(searchBox, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(46)
        ));

        HorizontalScrollView scroller = new HorizontalScrollView(this);
        scroller.setHorizontalScrollBarEnabled(false);
        categoryStrip = new LinearLayout(this);
        categoryStrip.setOrientation(LinearLayout.HORIZONTAL);
        scroller.addView(categoryStrip);
        LinearLayout.LayoutParams scrollerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        scrollerParams.topMargin = dp(10);
        header.addView(scroller, scrollerParams);
        rebuildCategoryChips();

        counterView = text("", 12, COLOR_MUTED, false);
        counterView.setPadding(0, dp(8), 0, 0);
        header.addView(counterView);

        ListView listView = new ListView(this);
        listView.setBackgroundColor(COLOR_BG);
        listView.setCacheColorHint(COLOR_BG);
        listView.setDividerHeight(1);
        listView.setFastScrollEnabled(true);
        listView.setScrollingCacheEnabled(false);
        listView.setAnimationCacheEnabled(false);
        adapter = new RecipeAdapter(this, imageLoader);
        listView.setAdapter(adapter);
        root.addView(listView, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                hideKeyboard();
                openRecipe(adapter.getItem(position), false);
            }
        });

        searchBox.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                currentQuery = String.valueOf(s);
                applyFilters();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        setContentView(root);
        applyFilters();
    }

    private void rebuildCategoryChips() {
        categoryStrip.removeAllViews();
        addCategoryChip("Toutes");
        for (String category : repository.categories) {
            addCategoryChip(category);
        }
    }

    private void addCategoryChip(final String category) {
        TextView chip = text(category, 14, category.equals(selectedCategory) ? Color.rgb(21, 17, 8) : COLOR_TEXT, true);
        chip.setGravity(Gravity.CENTER);
        chip.setPadding(dp(13), dp(8), dp(13), dp(8));
        chip.setBackgroundColor(category.equals(selectedCategory) ? COLOR_ORANGE : Color.rgb(35, 32, 27));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.rightMargin = dp(8);
        categoryStrip.addView(chip, params);
        chip.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectedCategory = category;
                rebuildCategoryChips();
                applyFilters();
            }
        });
    }

    private void applyFilters() {
        if (adapter == null) return;
        List<Recipe> filtered = repository.filter(currentQuery, selectedCategory);
        adapter.setItems(filtered);
        counterView.setText(filtered.size() + " fiches");
    }

    private void openRecipe(Recipe recipe, boolean pushCurrent) {
        if (pushCurrent && showingDetail && !detailBackStack.contains(recipe.id)) {
            detailBackStack.push(recipe.id);
        }
        showingDetail = true;

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        top.setPadding(dp(10), dp(8), dp(10), dp(8));
        top.setBackgroundColor(COLOR_PANEL);
        root.addView(top, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Button back = new Button(this);
        back.setText("Retour");
        back.setTextColor(Color.rgb(21, 17, 8));
        back.setTextSize(13);
        back.setTypeface(Typeface.DEFAULT_BOLD);
        back.setBackgroundColor(COLOR_ORANGE);
        top.addView(back, new LinearLayout.LayoutParams(dp(104), dp(42)));
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                goBack();
            }
        });

        TextView topTitle = text(recipe.primaryCategory(), 14, COLOR_MUTED, true);
        topTitle.setGravity(Gravity.CENTER_VERTICAL);
        topTitle.setPadding(dp(12), 0, 0, 0);
        top.addView(topTitle, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(false);
        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(14), dp(14), dp(14), dp(26));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        ImageView hero = new ImageView(this);
        hero.setScaleType(ImageView.ScaleType.CENTER_CROP);
        content.addView(hero, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(190)
        ));
        imageLoader.load(recipe.image, hero, dp(480), dp(240));

        TextView category = text(recipe.primaryCategory(), 12, COLOR_GOLD, true);
        category.setPadding(0, dp(14), 0, dp(6));
        content.addView(category);

        TextView title = text(recipe.title, 28, COLOR_TEXT, true);
        title.setLineSpacing(0, 1.05f);
        content.addView(title);

        TextView meta = text(recipe.metaLine(), 14, COLOR_MUTED, false);
        meta.setPadding(0, dp(8), 0, dp(10));
        content.addView(meta);

        if (recipe.isCollection()) {
            addVariants(content, recipe);
        } else {
            addIngredients(content, recipe);
            addSteps(content, recipe);
            addNotes(content, recipe);
            addTechnical(content, recipe);
            addPractical(content, recipe);
        }

        setContentView(root);
    }

    private void addVariants(LinearLayout content, Recipe recipe) {
        sectionTitle(content, "Variantes");
        if (recipe.variants.isEmpty()) {
            body(content, "Cette collection ne contient pas de variantes directes.");
            return;
        }
        for (final Recipe.Variant variant : recipe.variants) {
            final Recipe target = repository.find(variant.id);
            String label = variant.label.length() > 0 ? variant.label : variant.id;
            TextView row = text(label, 17, target == null ? COLOR_MUTED : COLOR_TEXT, true);
            row.setPadding(dp(12), dp(12), dp(12), dp(12));
            row.setBackgroundColor(Color.rgb(24, 22, 18));
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
            params.topMargin = dp(8);
            content.addView(row, params);
            if (target != null) {
                row.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        detailBackStack.push(recipe.id);
                        openRecipe(target, false);
                    }
                });
            }
        }
    }

    private void addIngredients(LinearLayout content, Recipe recipe) {
        sectionTitle(content, "Ingredients");
        if (recipe.ingredients.isEmpty()) {
            body(content, "Aucun ingredient detaille pour cette fiche.");
            return;
        }
        for (Recipe.Group group : recipe.ingredients) {
            subTitle(content, group.title);
            for (String item : group.items) {
                bullet(content, item);
            }
            if (group.note.length() > 0) body(content, group.note);
            for (String step : group.steps) {
                bullet(content, step);
            }
        }
    }

    private void addSteps(LinearLayout content, Recipe recipe) {
        sectionTitle(content, "Etapes");
        if (recipe.steps.isEmpty()) {
            body(content, "Aucune etape detaillee pour cette fiche.");
            return;
        }
        for (int index = 0; index < recipe.steps.size(); index += 1) {
            body(content, (index + 1) + ". " + recipe.steps.get(index));
        }
    }

    private void addNotes(LinearLayout content, Recipe recipe) {
        if (recipe.notes.isEmpty()) return;
        sectionTitle(content, "Notes");
        for (String note : recipe.notes) {
            bullet(content, note);
        }
    }

    private void addTechnical(LinearLayout content, Recipe recipe) {
        if (recipe.technical.isEmpty()) return;
        sectionTitle(content, "Technique");
        for (Recipe.Technical item : recipe.technical) {
            String label = item.label.length() > 0 ? item.label + " : " : "";
            body(content, label + item.value);
        }
    }

    private void addPractical(LinearLayout content, Recipe recipe) {
        if (recipe.practical.isEmpty()) return;
        sectionTitle(content, "Pratique");
        for (Recipe.PracticalSection section : recipe.practical) {
            subTitle(content, section.title);
            for (String item : section.items) {
                bullet(content, item);
            }
        }
    }

    private void sectionTitle(LinearLayout content, String value) {
        TextView text = text(value, 20, COLOR_GOLD, true);
        text.setPadding(0, dp(20), 0, dp(8));
        content.addView(text);
    }

    private void subTitle(LinearLayout content, String value) {
        TextView text = text(value, 16, COLOR_TEXT, true);
        text.setPadding(0, dp(12), 0, dp(4));
        content.addView(text);
    }

    private void bullet(LinearLayout content, String value) {
        body(content, "- " + value);
    }

    private void body(LinearLayout content, String value) {
        TextView text = text(value, 15, COLOR_TEXT, false);
        text.setLineSpacing(dp(2), 1.05f);
        text.setPadding(0, dp(4), 0, dp(4));
        content.addView(text);
    }

    private TextView text(String value, int sp, int color, boolean bold) {
        TextView text = new TextView(this);
        text.setText(value);
        text.setTextSize(sp);
        text.setTextColor(color);
        text.setIncludeFontPadding(true);
        if (bold) text.setTypeface(Typeface.DEFAULT_BOLD);
        return text;
    }

    private void goBack() {
        if (!detailBackStack.empty()) {
            Recipe previous = repository.find(detailBackStack.pop());
            if (previous != null) {
                openRecipe(previous, false);
                return;
            }
        }
        showList();
    }

    @Override
    public void onBackPressed() {
        if (showingDetail) {
            goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (imageLoader != null) imageLoader.shutdown();
        super.onDestroy();
    }

    private void hideKeyboard() {
        try {
            InputMethodManager manager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            View focus = getCurrentFocus();
            if (manager != null && focus != null) manager.hideSoftInputFromWindow(focus.getWindowToken(), 0);
        } catch (Exception ignored) {
            // Keep navigation responsive even if the keyboard service is unavailable.
        }
    }

    private void showNativeError(String title, String detail) {
        TextView errorView = text(title + "\n\n" + detail, 18, COLOR_GOLD, true);
        errorView.setBackgroundColor(COLOR_BG);
        errorView.setPadding(dp(24), dp(36), dp(24), dp(24));
        setContentView(errorView, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density + 0.5f);
    }
}
