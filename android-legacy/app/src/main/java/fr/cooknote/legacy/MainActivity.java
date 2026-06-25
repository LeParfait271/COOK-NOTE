package fr.cooknote.legacy;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Stack;

public class MainActivity extends Activity {
    private static final String UPDATE_APK_URL = "https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk";
    private static final String PREFS_NAME = "cook_note_legacy";
    private static final String PREF_FAVORITES = "favorites";
    private static final String PREF_RECENT = "recent";
    private static final int MAX_RECENT = 18;
    private static final int COLOR_BG = Color.rgb(5, 5, 5);
    private static final int COLOR_PANEL = Color.rgb(18, 16, 12);
    private static final int COLOR_CARD = Color.rgb(24, 22, 18);
    private static final int COLOR_CARD_SOFT = Color.rgb(31, 28, 23);
    private static final int COLOR_TEXT = Color.rgb(255, 247, 237);
    private static final int COLOR_MUTED = Color.rgb(207, 198, 184);
    private static final int COLOR_DIM = Color.rgb(162, 151, 133);
    private static final int COLOR_BORDER = Color.rgb(84, 70, 43);
    private static final int COLOR_GOLD = Color.rgb(251, 191, 36);
    private static final int COLOR_ORANGE = Color.rgb(245, 158, 11);

    private CookNoteRepository repository;
    private ImageLoader imageLoader;
    private RecipeAdapter adapter;
    private LinearLayout quickStrip;
    private LinearLayout categoryStrip;
    private LinearLayout seasonStrip;
    private LinearLayout difficultyStrip;
    private LinearLayout searchPanel;
    private Button searchToggle;
    private TextView counterView;
    private EditText searchBox;
    private String selectedCategory = "Toutes";
    private String selectedSeason = "Toutes";
    private String selectedDifficulty = "Toutes";
    private String currentQuery = "";
    private boolean favoritesOnly;
    private boolean recentOnly;
    private boolean searchPanelOpen;
    private boolean showingDetail;
    private final Stack<String> detailBackStack = new Stack<String>();
    private final Set<String> favoriteIds = new HashSet<String>();
    private final ArrayList<String> recentIds = new ArrayList<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        imageLoader = new ImageLoader(this);
        try {
            repository = CookNoteRepository.load(this);
            loadUserState();
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
        header.setPadding(dp(14), dp(12), dp(14), dp(10));
        header.setBackgroundColor(COLOR_PANEL);
        root.addView(header, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView title = text("Cook Note", 28, COLOR_TEXT, true);
        title.setGravity(Gravity.CENTER_VERTICAL);
        header.addView(title);

        TextView subtitle = text("Livre local - Android 5 Lite - v" + repository.version, 12, COLOR_MUTED, false);
        subtitle.setPadding(0, dp(2), 0, dp(2));
        header.addView(subtitle);

        LinearLayout actionRow = new LinearLayout(this);
        actionRow.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams actionParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        actionParams.topMargin = dp(8);
        header.addView(actionRow, actionParams);

        searchToggle = actionButton("Rechercher / filtrer", true);
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(0, dp(42), 1);
        searchParams.rightMargin = dp(8);
        actionRow.addView(searchToggle, searchParams);
        searchToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setSearchPanelOpen(!searchPanelOpen);
            }
        });

        Button update = actionButton("Mise a jour", false);
        actionRow.addView(update, new LinearLayout.LayoutParams(0, dp(42), 1));
        update.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openUpdateDownload();
            }
        });

        searchPanel = new LinearLayout(this);
        searchPanel.setOrientation(LinearLayout.VERTICAL);
        searchPanel.setPadding(dp(10), dp(10), dp(10), dp(10));
        searchPanel.setBackground(panel(COLOR_CARD, COLOR_BORDER, 1, 8));
        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        panelParams.topMargin = dp(10);
        header.addView(searchPanel, panelParams);

        searchBox = new EditText(this);
        searchBox.setSingleLine(true);
        searchBox.setTextColor(COLOR_TEXT);
        searchBox.setHintTextColor(COLOR_MUTED);
        searchBox.setTextSize(16);
        searchBox.setHint("Rechercher une recette, un ingredient...");
        searchBox.setPadding(dp(12), 0, dp(12), 0);
        searchBox.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER, 1, 8));
        searchBox.setText(currentQuery);
        searchPanel.addView(searchBox, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(46)
        ));

        quickStrip = addChipScroller(searchPanel, dp(10));
        rebuildQuickChips();

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
        searchPanel.addView(scroller, scrollerParams);
        rebuildCategoryChips();

        seasonStrip = addChipScroller(searchPanel, dp(8));
        rebuildSeasonChips();

        difficultyStrip = addChipScroller(searchPanel, dp(8));
        rebuildDifficultyChips();

        setSearchPanelOpen(searchPanelOpen);

        counterView = text("", 12, COLOR_MUTED, true);
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
                setSearchPanelOpen(false);
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

    private LinearLayout addChipScroller(LinearLayout parent, int topMargin) {
        HorizontalScrollView scroller = new HorizontalScrollView(this);
        scroller.setHorizontalScrollBarEnabled(false);
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        scroller.addView(row);
        LinearLayout.LayoutParams scrollerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        scrollerParams.topMargin = topMargin;
        parent.addView(scroller, scrollerParams);
        return row;
    }

    private void rebuildQuickChips() {
        if (quickStrip == null) return;
        quickStrip.removeAllViews();
        addFilterChip(quickStrip, "Favoris (" + favoriteIds.size() + ")", favoritesOnly, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                favoritesOnly = !favoritesOnly;
                rebuildQuickChips();
                applyFilters();
            }
        });
        addFilterChip(quickStrip, "Derniers (" + recentIds.size() + ")", recentOnly, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                recentOnly = !recentOnly;
                rebuildQuickChips();
                applyFilters();
            }
        });
        addFilterChip(quickStrip, "Reset", false, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearFilters();
            }
        });
    }

    private void rebuildCategoryChips() {
        if (categoryStrip == null) return;
        categoryStrip.removeAllViews();
        addCategoryChip("Toutes");
        for (String category : repository.categories) {
            addCategoryChip(category);
        }
    }

    private void rebuildSeasonChips() {
        if (seasonStrip == null) return;
        seasonStrip.removeAllViews();
        addSeasonChip("Toutes");
        addSeasonChip("Printemps");
        addSeasonChip("Ete");
        addSeasonChip("Automne");
        addSeasonChip("Hiver");
    }

    private void rebuildDifficultyChips() {
        if (difficultyStrip == null) return;
        difficultyStrip.removeAllViews();
        addDifficultyChip("Toutes");
        addDifficultyChip("Facile");
        addDifficultyChip("Moyen");
        addDifficultyChip("Technique");
    }

    private void addCategoryChip(final String category) {
        addFilterChip(categoryStrip, category, category.equals(selectedCategory), new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectedCategory = category;
                rebuildCategoryChips();
                applyFilters();
            }
        });
    }

    private void addSeasonChip(final String season) {
        addFilterChip(seasonStrip, season, season.equals(selectedSeason), new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectedSeason = season;
                rebuildSeasonChips();
                applyFilters();
            }
        });
    }

    private void addDifficultyChip(final String difficulty) {
        addFilterChip(difficultyStrip, difficulty, difficulty.equals(selectedDifficulty), new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectedDifficulty = difficulty;
                rebuildDifficultyChips();
                applyFilters();
            }
        });
    }

    private void addFilterChip(LinearLayout strip, String label, boolean selected, View.OnClickListener listener) {
        TextView chip = text(label, 14, selected ? Color.rgb(21, 17, 8) : COLOR_TEXT, true);
        chip.setGravity(Gravity.CENTER);
        chip.setPadding(dp(13), dp(8), dp(13), dp(8));
        chip.setBackground(panel(selected ? COLOR_ORANGE : COLOR_CARD_SOFT, selected ? COLOR_ORANGE : COLOR_BORDER, 1, 18));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.rightMargin = dp(8);
        strip.addView(chip, params);
        chip.setOnClickListener(listener);
    }

    private void clearFilters() {
        selectedCategory = "Toutes";
        selectedSeason = "Toutes";
        selectedDifficulty = "Toutes";
        favoritesOnly = false;
        recentOnly = false;
        currentQuery = "";
        if (searchBox != null) searchBox.setText("");
        rebuildQuickChips();
        rebuildCategoryChips();
        rebuildSeasonChips();
        rebuildDifficultyChips();
        applyFilters();
    }

    private void setSearchPanelOpen(boolean open) {
        searchPanelOpen = open;
        if (searchPanel != null) {
            searchPanel.setVisibility(open ? View.VISIBLE : View.GONE);
        }
        if (searchToggle != null) {
            searchToggle.setText(buildSearchToggleLabel());
        }
        if (open) {
            showKeyboard();
        } else {
            hideKeyboard();
        }
    }

    private String buildSearchToggleLabel() {
        if (searchPanelOpen) return "Fermer recherche";
        int activeFilters = countActiveFilters();
        return activeFilters == 0 ? "Rechercher / filtrer" : "Filtres actifs (" + activeFilters + ")";
    }

    private int countActiveFilters() {
        int count = 0;
        if (currentQuery.trim().length() > 0) count += 1;
        if (!"Toutes".equals(selectedCategory)) count += 1;
        if (!"Toutes".equals(selectedSeason)) count += 1;
        if (!"Toutes".equals(selectedDifficulty)) count += 1;
        if (favoritesOnly) count += 1;
        if (recentOnly) count += 1;
        return count;
    }

    private void applyFilters() {
        if (adapter == null) return;
        List<Recipe> filtered = repository.filter(
                currentQuery,
                selectedCategory,
                selectedSeason,
                selectedDifficulty,
                favoritesOnly ? favoriteIds : null,
                recentOnly ? recentIds : null
        );
        adapter.setFavoriteIds(favoriteIds);
        adapter.setItems(filtered);
        StringBuilder label = new StringBuilder();
        label.append(filtered.size()).append(" fiches visibles");
        if (!"Toutes".equals(selectedCategory)) label.append(" - ").append(selectedCategory);
        if (favoritesOnly) label.append(" - favoris");
        if (recentOnly) label.append(" - derniers ouverts");
        if (!"Toutes".equals(selectedSeason)) label.append(" - ").append(selectedSeason);
        if (!"Toutes".equals(selectedDifficulty)) label.append(" - ").append(selectedDifficulty);
        counterView.setText(label.toString());
        if (searchToggle != null) searchToggle.setText(buildSearchToggleLabel());
    }

    private void openRecipe(Recipe recipe, boolean pushCurrent) {
        if (pushCurrent && showingDetail && !detailBackStack.contains(recipe.id)) {
            detailBackStack.push(recipe.id);
        }
        rememberRecent(recipe.id);
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
        back.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 8));
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
        topTitle.setSingleLine(true);
        topTitle.setEllipsize(TextUtils.TruncateAt.END);
        top.addView(topTitle, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        Button favorite = new Button(this);
        favorite.setText(isFavorite(recipe.id) ? "Favori" : "+ Favori");
        favorite.setTextColor(isFavorite(recipe.id) ? Color.rgb(21, 17, 8) : COLOR_TEXT);
        favorite.setTextSize(12);
        favorite.setTypeface(Typeface.DEFAULT_BOLD);
        favorite.setBackground(panel(isFavorite(recipe.id) ? COLOR_GOLD : COLOR_CARD_SOFT, isFavorite(recipe.id) ? COLOR_GOLD : COLOR_BORDER, 1, 8));
        top.addView(favorite, new LinearLayout.LayoutParams(dp(96), dp(42)));
        favorite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleFavorite(recipe.id);
                openRecipe(recipe, false);
            }
        });

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
        hero.setBackgroundColor(COLOR_CARD);
        content.addView(hero, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(190)
        ));
        imageLoader.loadDetail(recipe.detailImage, hero, 960, 480);

        TextView category = text(recipe.primaryCategory(), 12, COLOR_GOLD, true);
        category.setPadding(0, dp(14), 0, dp(6));
        content.addView(category);

        TextView title = text(recipe.title, 28, COLOR_TEXT, true);
        title.setLineSpacing(dp(1), 1.06f);
        content.addView(title);

        addInfoChips(content, recipe);

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
        LinearLayout section = addSection(content, "Variantes");
        if (recipe.variants.isEmpty()) {
            body(section, "Cette collection ne contient pas de variantes directes.");
            return;
        }
        for (final Recipe.Variant variant : recipe.variants) {
            final Recipe target = repository.find(variant.id);
            String label = variant.label.length() > 0 ? variant.label : variant.id;
            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.VERTICAL);
            row.setPadding(dp(12), dp(10), dp(12), dp(10));
            row.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER, 1, 8));

            TextView title = text(label, 17, target == null ? COLOR_MUTED : COLOR_TEXT, true);
            title.setLineSpacing(dp(1), 1.06f);
            row.addView(title);
            if (target != null) {
                TextView meta = text(target.metaLine(), 12, COLOR_DIM, false);
                meta.setPadding(0, dp(4), 0, 0);
                row.addView(meta);
            }

            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
            params.topMargin = dp(9);
            section.addView(row, params);
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
        LinearLayout section = addSection(content, "Ingredients");
        if (recipe.ingredients.isEmpty()) {
            body(section, "Aucun ingredient detaille pour cette fiche.");
            return;
        }
        Button copy = sectionButton("Copier ingredients");
        section.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyIngredients(recipe);
            }
        });
        for (Recipe.Group group : recipe.ingredients) {
            subTitle(section, group.title);
            for (String item : group.items) {
                bulletRow(section, item);
            }
            if (group.note.length() > 0) body(section, group.note, COLOR_MUTED);
            for (String step : group.steps) {
                bulletRow(section, step);
            }
        }
    }

    private void addSteps(LinearLayout content, Recipe recipe) {
        LinearLayout section = addSection(content, "Etapes");
        if (recipe.steps.isEmpty()) {
            body(section, "Aucune etape detaillee pour cette fiche.");
            return;
        }
        for (int index = 0; index < recipe.steps.size(); index += 1) {
            stepRow(section, index + 1, recipe.steps.get(index));
        }
    }

    private void addNotes(LinearLayout content, Recipe recipe) {
        if (recipe.notes.isEmpty()) return;
        LinearLayout section = addSection(content, "Notes");
        for (String note : recipe.notes) {
            bulletRow(section, note);
        }
    }

    private void addTechnical(LinearLayout content, Recipe recipe) {
        if (recipe.technical.isEmpty()) return;
        LinearLayout section = addSection(content, "Technique");
        for (Recipe.Technical item : recipe.technical) {
            labelValue(section, item.label, item.value);
        }
    }

    private void addPractical(LinearLayout content, Recipe recipe) {
        if (recipe.practical.isEmpty()) return;
        LinearLayout section = addSection(content, "Pratique");
        for (Recipe.PracticalSection practicalSection : recipe.practical) {
            subTitle(section, practicalSection.title);
            for (String item : practicalSection.items) {
                bulletRow(section, item);
            }
        }
    }

    private void addInfoChips(LinearLayout content, Recipe recipe) {
        HorizontalScrollView scroller = new HorizontalScrollView(this);
        scroller.setHorizontalScrollBarEnabled(false);
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        scroller.addView(row);

        addInfoChip(row, "Categorie", recipe.primaryCategory());
        if (!recipe.seasons.isEmpty()) addInfoChip(row, "Saison", shortList(recipe.seasons, 2));
        if (recipe.isCollection()) {
            addInfoChip(row, "Variantes", String.valueOf(recipe.variants.size()));
        } else {
            String difficulty = recipe.difficultyLabel();
            if (difficulty.length() > 0) addInfoChip(row, "Difficulte", difficulty);
            if (recipe.yield.length() > 0) addInfoChip(row, "Quantite", recipe.yield);
            int totalTime = recipe.activeTime + recipe.cookTime;
            if (totalTime > 0) addInfoChip(row, "Temps", formatMinutes(totalTime));
        }

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(10);
        params.bottomMargin = dp(2);
        content.addView(scroller, params);
    }

    private void addInfoChip(LinearLayout row, String label, String value) {
        LinearLayout chip = new LinearLayout(this);
        chip.setOrientation(LinearLayout.VERTICAL);
        chip.setPadding(dp(11), dp(7), dp(11), dp(8));
        chip.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER, 1, 8));

        TextView labelView = text(label, 10, COLOR_GOLD, true);
        labelView.setSingleLine(true);
        chip.addView(labelView);

        TextView valueView = text(value, 13, COLOR_TEXT, true);
        valueView.setSingleLine(true);
        valueView.setPadding(0, dp(2), 0, 0);
        chip.addView(valueView);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.rightMargin = dp(8);
        row.addView(chip, params);
    }

    private LinearLayout addSection(LinearLayout content, String value) {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setPadding(dp(13), dp(12), dp(13), dp(14));
        section.setBackground(panel(COLOR_CARD, COLOR_BORDER, 1, 8));

        TextView title = text(value, 19, COLOR_GOLD, true);
        title.setIncludeFontPadding(false);
        section.addView(title);

        View divider = new View(this);
        divider.setBackgroundColor(Color.rgb(60, 50, 33));
        LinearLayout.LayoutParams dividerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(1)
        );
        dividerParams.topMargin = dp(10);
        dividerParams.bottomMargin = dp(2);
        section.addView(divider, dividerParams);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(14);
        content.addView(section, params);
        return section;
    }

    private void subTitle(LinearLayout content, String value) {
        if (content == null || value == null || value.length() == 0) return;
        TextView text = text(value, 16, COLOR_TEXT, true);
        text.setLineSpacing(dp(1), 1.05f);
        text.setPadding(0, dp(12), 0, dp(4));
        content.addView(text);
    }

    private void bulletRow(LinearLayout content, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.TOP);
        row.setPadding(0, dp(5), 0, dp(3));

        View marker = new View(this);
        marker.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 3));
        LinearLayout.LayoutParams markerParams = new LinearLayout.LayoutParams(dp(6), dp(6));
        markerParams.topMargin = dp(7);
        markerParams.rightMargin = dp(9);
        row.addView(marker, markerParams);

        TextView text = text(value, 15, COLOR_TEXT, false);
        text.setLineSpacing(dp(2), 1.10f);
        row.addView(text, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        content.addView(row);
    }

    private void stepRow(LinearLayout content, int number, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.TOP);
        row.setPadding(dp(9), dp(9), dp(9), dp(9));
        row.setBackground(panel(COLOR_CARD_SOFT, Color.rgb(58, 49, 35), 1, 8));

        TextView index = text(String.valueOf(number), 13, Color.rgb(21, 17, 8), true);
        index.setGravity(Gravity.CENTER);
        index.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 16));
        row.addView(index, new LinearLayout.LayoutParams(dp(32), dp(32)));

        TextView body = text(value, 15, COLOR_TEXT, false);
        body.setLineSpacing(dp(2), 1.12f);
        LinearLayout.LayoutParams bodyParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        bodyParams.leftMargin = dp(10);
        row.addView(body, bodyParams);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(9);
        content.addView(row, rowParams);
    }

    private void labelValue(LinearLayout content, String label, String value) {
        LinearLayout block = new LinearLayout(this);
        block.setOrientation(LinearLayout.VERTICAL);
        block.setPadding(0, dp(8), 0, dp(2));
        if (label != null && label.length() > 0) {
            TextView labelView = text(label, 12, COLOR_GOLD, true);
            labelView.setPadding(0, 0, 0, dp(2));
            block.addView(labelView);
        }
        TextView valueView = text(value, 15, COLOR_TEXT, false);
        valueView.setLineSpacing(dp(2), 1.10f);
        block.addView(valueView);
        content.addView(block);
    }

    private void body(LinearLayout content, String value) {
        body(content, value, COLOR_TEXT);
    }

    private void body(LinearLayout content, String value, int color) {
        TextView text = text(value, 15, color, false);
        text.setLineSpacing(dp(2), 1.10f);
        text.setPadding(0, dp(7), 0, dp(3));
        content.addView(text);
    }

    private Button sectionButton(String value) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(Color.rgb(21, 17, 8));
        button.setTextSize(13);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 8));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(42)
        );
        params.topMargin = dp(10);
        params.bottomMargin = dp(2);
        button.setLayoutParams(params);
        return button;
    }

    private Button actionButton(String value, boolean primary) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(primary ? Color.rgb(21, 17, 8) : COLOR_TEXT);
        button.setTextSize(13);
        button.setSingleLine(true);
        button.setEllipsize(TextUtils.TruncateAt.END);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setBackground(panel(primary ? COLOR_ORANGE : COLOR_CARD_SOFT, primary ? COLOR_ORANGE : COLOR_BORDER, 1, 8));
        return button;
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

    private void copyIngredients(Recipe recipe) {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText(recipe.title + " - ingredients", buildIngredientsText(recipe)));
        Toast.makeText(this, "Ingredients copies", Toast.LENGTH_SHORT).show();
    }

    private void openUpdateDownload() {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(UPDATE_APK_URL));
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        try {
            startActivity(intent);
            Toast.makeText(this, "Telechargement de la mise a jour", Toast.LENGTH_SHORT).show();
        } catch (ActivityNotFoundException exception) {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null) {
                clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note APK Android 5.0+", UPDATE_APK_URL));
            }
            Toast.makeText(this, "Lien copie dans le presse-papiers", Toast.LENGTH_LONG).show();
        }
    }

    private static String buildIngredientsText(Recipe recipe) {
        StringBuilder builder = new StringBuilder();
        builder.append(recipe.title).append('\n');
        builder.append("Ingredients").append('\n');
        for (Recipe.Group group : recipe.ingredients) {
            builder.append('\n').append(group.title).append('\n');
            for (String item : group.items) {
                builder.append("- ").append(item).append('\n');
            }
            if (group.note.length() > 0) builder.append("Note: ").append(group.note).append('\n');
        }
        return builder.toString().trim();
    }

    private GradientDrawable panel(int color, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    private static String shortList(List<String> values, int maxItems) {
        if (values == null || values.isEmpty()) return "";
        StringBuilder builder = new StringBuilder();
        int count = Math.min(values.size(), maxItems);
        for (int index = 0; index < count; index += 1) {
            if (index > 0) builder.append(", ");
            builder.append(values.get(index));
        }
        if (values.size() > count) builder.append(" +").append(values.size() - count);
        return builder.toString();
    }

    private static String formatMinutes(int minutes) {
        if (minutes >= 60) {
            int hours = minutes / 60;
            int rest = minutes % 60;
            return rest == 0 ? hours + "h" : hours + "h" + (rest < 10 ? "0" : "") + rest;
        }
        return minutes + "min";
    }

    private void loadUserState() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        favoriteIds.clear();
        recentIds.clear();
        parseIds(prefs.getString(PREF_FAVORITES, ""), favoriteIds, 0);
        parseIds(prefs.getString(PREF_RECENT, ""), recentIds, MAX_RECENT);
    }

    private void saveUserState() {
        SharedPreferences.Editor editor = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
        editor.putString(PREF_FAVORITES, joinIds(new ArrayList<String>(favoriteIds)));
        editor.putString(PREF_RECENT, joinIds(recentIds));
        editor.apply();
    }

    private void parseIds(String raw, Set<String> output, int limit) {
        if (raw == null || raw.length() == 0) return;
        String[] ids = raw.split("\\n");
        for (String id : ids) {
            if (id.length() == 0 || repository.find(id) == null) continue;
            output.add(id);
            if (limit > 0 && output.size() >= limit) return;
        }
    }

    private void parseIds(String raw, List<String> output, int limit) {
        if (raw == null || raw.length() == 0) return;
        String[] ids = raw.split("\\n");
        for (String id : ids) {
            if (id.length() == 0 || repository.find(id) == null || output.contains(id)) continue;
            output.add(id);
            if (limit > 0 && output.size() >= limit) return;
        }
    }

    private static String joinIds(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        for (String id : ids) {
            if (id == null || id.length() == 0) continue;
            if (builder.length() > 0) builder.append('\n');
            builder.append(id);
        }
        return builder.toString();
    }

    private boolean isFavorite(String id) {
        return favoriteIds.contains(id);
    }

    private void toggleFavorite(String id) {
        if (favoriteIds.contains(id)) {
            favoriteIds.remove(id);
        } else {
            favoriteIds.add(id);
        }
        saveUserState();
        if (adapter != null) adapter.setFavoriteIds(favoriteIds);
    }

    private void rememberRecent(String id) {
        if (id == null || id.length() == 0) return;
        recentIds.remove(id);
        recentIds.add(0, id);
        while (recentIds.size() > MAX_RECENT) {
            recentIds.remove(recentIds.size() - 1);
        }
        saveUserState();
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

    private void showKeyboard() {
        if (searchBox == null) return;
        searchBox.requestFocus();
        searchBox.post(new Runnable() {
            @Override
            public void run() {
                try {
                    InputMethodManager manager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    if (manager != null) manager.showSoftInput(searchBox, InputMethodManager.SHOW_IMPLICIT);
                } catch (Exception ignored) {
                    // The search panel stays usable even without a software keyboard.
                }
            }
        });
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
