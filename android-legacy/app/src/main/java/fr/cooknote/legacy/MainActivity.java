package fr.cooknote.legacy;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.StateListDrawable;
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
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.GridView;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;

public class MainActivity extends Activity {
    private static final String UPDATE_APK_URL = "https://github.com/LeParfait271/COOK-NOTE/raw/main/downloads/cook-note-android-legacy.apk";
    private static final String PREFS_NAME = "cook_note_legacy";
    private static final String PREF_FAVORITES = "favorites";
    private static final String PREF_RECENT = "recent";
    private static final String PREF_SHOPPING = "shopping";
    private static final int MAX_RECENT = 18;
    private static final int COLOR_BG = Color.rgb(4, 4, 4);
    private static final int COLOR_PANEL = Color.rgb(17, 16, 13);
    private static final int COLOR_PANEL_DEEP = Color.rgb(8, 7, 6);
    private static final int COLOR_CARD = Color.rgb(18, 17, 14);
    private static final int COLOR_CARD_SOFT = Color.rgb(28, 26, 21);
    private static final int COLOR_CARD_ACTIVE = Color.rgb(52, 39, 20);
    private static final int COLOR_TEXT = Color.rgb(255, 247, 237);
    private static final int COLOR_TEXT_DARK = Color.rgb(22, 17, 8);
    private static final int COLOR_MUTED = Color.rgb(222, 214, 200);
    private static final int COLOR_DIM = Color.rgb(178, 165, 145);
    private static final int COLOR_BORDER = Color.rgb(113, 84, 36);
    private static final int COLOR_BORDER_SOFT = Color.rgb(78, 64, 38);
    private static final int COLOR_LINE = Color.rgb(92, 72, 38);
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
    private Button shoppingButton;
    private TextView counterView;
    private EditText searchBox;
    private String selectedCategory = "Toutes";
    private String selectedSeason = "Toutes";
    private String selectedDifficulty = "Toutes";
    private String currentQuery = "";
    private boolean favoritesOnly;
    private boolean recentOnly;
    private boolean browseAllRecipes;
    private boolean searchPanelOpen;
    private boolean showingDetail;
    private final Stack<String> detailBackStack = new Stack<String>();
    private final Set<String> favoriteIds = new HashSet<String>();
    private final ArrayList<String> recentIds = new ArrayList<String>();
    private final ArrayList<String> shoppingRecipeIds = new ArrayList<String>();
    private final Map<String, Integer> inlineVariantSelections = new HashMap<String, Integer>();

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
        header.setPadding(dp(12), dp(11), dp(12), dp(11));
        header.setBackground(panelGradient(COLOR_PANEL_DEEP, Color.rgb(18, 14, 9), COLOR_BORDER_SOFT, 1, 0));
        root.addView(header, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        LinearLayout brandRow = new LinearLayout(this);
        brandRow.setOrientation(LinearLayout.HORIZONTAL);
        brandRow.setGravity(Gravity.CENTER_VERTICAL);
        brandRow.setPadding(dp(12), dp(10), dp(12), dp(10));
        brandRow.setBackground(panelGradient(Color.rgb(9, 8, 6), Color.rgb(29, 23, 16), COLOR_BORDER, 1, 8));
        header.addView(brandRow, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        FrameLayout logoFrame = new FrameLayout(this);
        logoFrame.setPadding(dp(2), dp(2), dp(2), dp(2));
        logoFrame.setBackground(panelGradient(Color.rgb(7, 6, 5), Color.rgb(33, 25, 15), COLOR_BORDER, 1, 8));
        LinearLayout.LayoutParams logoFrameParams = new LinearLayout.LayoutParams(dp(60), dp(60));
        logoFrameParams.rightMargin = dp(13);
        brandRow.addView(logoFrame, logoFrameParams);

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.ic_launcher);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        logoFrame.addView(logo, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                Gravity.CENTER
        ));

        LinearLayout brandCopy = new LinearLayout(this);
        brandCopy.setOrientation(LinearLayout.VERTICAL);
        brandRow.addView(brandCopy, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        TextView title = text("Cook Note", 30, COLOR_TEXT, true);
        title.setGravity(Gravity.CENTER_VERTICAL);
        title.setIncludeFontPadding(false);
        title.setLetterSpacing(0.02f);
        title.setShadowLayer(4f, 0, dp(1), Color.BLACK);
        brandCopy.addView(title);

        TextView subtitle = text("Carnet tablette Android 5.0+ - v" + repository.version, 12, COLOR_MUTED, true);
        subtitle.setPadding(0, dp(3), 0, 0);
        brandCopy.addView(subtitle);

        LinearLayout stats = new LinearLayout(this);
        stats.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams statsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        statsParams.topMargin = dp(8);
        brandCopy.addView(stats, statsParams);
        addHeaderStat(stats, String.valueOf(repository.homeRecipes().size()), "parents");
        addHeaderStat(stats, String.valueOf(repository.searchableRecipes().size()), "recettes");
        addHeaderStat(stats, String.valueOf(favoriteIds.size()), "favoris");

        LinearLayout actionRow = new LinearLayout(this);
        actionRow.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams actionParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        actionParams.topMargin = dp(10);
        header.addView(actionRow, actionParams);

        searchToggle = actionButton("Recherche", true);
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(0, dp(42), 1);
        searchParams.rightMargin = dp(7);
        actionRow.addView(searchToggle, searchParams);
        searchToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setSearchPanelOpen(!searchPanelOpen);
            }
        });

        shoppingButton = actionButton("Courses (" + shoppingRecipeIds.size() + ")", false);
        LinearLayout.LayoutParams shoppingParams = new LinearLayout.LayoutParams(0, dp(42), 1);
        shoppingParams.rightMargin = dp(7);
        actionRow.addView(shoppingButton, shoppingParams);
        shoppingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                hideKeyboard();
                setSearchPanelOpen(false);
                showShoppingList();
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
        searchPanel.setPadding(dp(12), dp(11), dp(12), dp(12));
        searchPanel.setBackground(panelGradient(COLOR_CARD, Color.rgb(28, 23, 16), COLOR_BORDER, 1, 8));
        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        panelParams.topMargin = dp(10);
        header.addView(searchPanel, panelParams);

        TextView searchLabel = text("RECHERCHE ET FILTRES", 10, COLOR_GOLD, true);
        searchLabel.setIncludeFontPadding(false);
        searchPanel.addView(searchLabel);

        searchBox = new EditText(this);
        searchBox.setSingleLine(true);
        searchBox.setTextColor(COLOR_TEXT);
        searchBox.setHintTextColor(COLOR_MUTED);
        searchBox.setTextSize(16);
        searchBox.setHint("Rechercher une recette, un ingredient...");
        searchBox.setPadding(dp(12), 0, dp(12), 0);
        searchBox.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 8));
        searchBox.setText(currentQuery);
        LinearLayout.LayoutParams searchBoxParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(46)
        );
        searchBoxParams.topMargin = dp(9);
        searchPanel.addView(searchBox, searchBoxParams);

        addFilterGroupLabel(searchPanel, "ACCES RAPIDE", dp(10));
        quickStrip = addChipScroller(searchPanel, dp(6));
        rebuildQuickChips();

        addFilterGroupLabel(searchPanel, "CATEGORIES", dp(10));
        HorizontalScrollView scroller = new HorizontalScrollView(this);
        scroller.setHorizontalScrollBarEnabled(false);
        categoryStrip = new LinearLayout(this);
        categoryStrip.setOrientation(LinearLayout.HORIZONTAL);
        scroller.addView(categoryStrip);
        LinearLayout.LayoutParams scrollerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        scrollerParams.topMargin = dp(6);
        searchPanel.addView(scroller, scrollerParams);
        rebuildCategoryChips();

        addFilterGroupLabel(searchPanel, "SAISON", dp(9));
        seasonStrip = addChipScroller(searchPanel, dp(6));
        rebuildSeasonChips();

        addFilterGroupLabel(searchPanel, "DIFFICULTE", dp(9));
        difficultyStrip = addChipScroller(searchPanel, dp(6));
        rebuildDifficultyChips();

        setSearchPanelOpen(searchPanelOpen);

        counterView = text("", 12, COLOR_MUTED, true);
        counterView.setPadding(dp(10), dp(7), dp(10), dp(7));
        counterView.setSingleLine(true);
        counterView.setEllipsize(TextUtils.TruncateAt.END);
        counterView.setBackground(panel(Color.rgb(12, 10, 8), COLOR_BORDER_SOFT, 1, 8));
        LinearLayout.LayoutParams counterParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        counterParams.topMargin = dp(9);
        header.addView(counterView, counterParams);

        GridView gridView = new GridView(this);
        gridView.setBackgroundColor(COLOR_BG);
        gridView.setCacheColorHint(COLOR_BG);
        gridView.setNumColumns(GridView.AUTO_FIT);
        gridView.setColumnWidth(dp(276));
        gridView.setHorizontalSpacing(dp(10));
        gridView.setVerticalSpacing(dp(12));
        gridView.setStretchMode(GridView.STRETCH_COLUMN_WIDTH);
        gridView.setPadding(dp(10), dp(10), dp(10), dp(18));
        gridView.setClipToPadding(false);
        gridView.setFastScrollEnabled(true);
        gridView.setScrollingCacheEnabled(false);
        gridView.setAnimationCacheEnabled(false);
        adapter = new RecipeAdapter(this, imageLoader);
        adapter.setCollectionCounts(repository.collectionCounts());
        gridView.setAdapter(adapter);
        root.addView(gridView, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
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

    private void addFilterGroupLabel(LinearLayout parent, String value, int topMargin) {
        TextView label = text(value, 9, COLOR_DIM, true);
        label.setIncludeFontPadding(false);
        label.setSingleLine(true);
        label.setLetterSpacing(0.08f);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = topMargin;
        parent.addView(label, params);
    }

    private void addHeaderStat(LinearLayout row, String value, String label) {
        LinearLayout stat = new LinearLayout(this);
        stat.setOrientation(LinearLayout.VERTICAL);
        stat.setPadding(dp(9), dp(6), dp(9), dp(7));
        stat.setBackground(panelGradient(Color.rgb(11, 9, 7), Color.rgb(26, 21, 15), COLOR_BORDER_SOFT, 1, 8));

        TextView valueView = text(value, 13, COLOR_TEXT, true);
        valueView.setIncludeFontPadding(false);
        stat.addView(valueView);

        TextView labelView = text(label, 9, COLOR_DIM, true);
        labelView.setIncludeFontPadding(false);
        labelView.setSingleLine(true);
        stat.addView(labelView);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                1
        );
        params.rightMargin = dp(6);
        row.addView(stat, params);
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
        addFilterChip(quickStrip, "Toutes fiches", browseAllRecipes, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                browseAllRecipes = !browseAllRecipes;
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
        TextView chip = text(label, 14, selected ? COLOR_TEXT_DARK : COLOR_TEXT, true);
        chip.setGravity(Gravity.CENTER);
        chip.setPadding(dp(14), dp(8), dp(14), dp(8));
        chip.setBackground(selected
                ? selectablePanel(COLOR_ORANGE, COLOR_GOLD, COLOR_ORANGE, 1, 16)
                : selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, COLOR_BORDER_SOFT, 1, 16));
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
        browseAllRecipes = false;
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
        if (searchPanelOpen) return "Fermer";
        int activeFilters = countActiveFilters();
        return activeFilters == 0 ? "Recherche" : "Filtres (" + activeFilters + ")";
    }

    private int countActiveFilters() {
        int count = 0;
        if (currentQuery.trim().length() > 0) count += 1;
        if (!"Toutes".equals(selectedCategory)) count += 1;
        if (!"Toutes".equals(selectedSeason)) count += 1;
        if (!"Toutes".equals(selectedDifficulty)) count += 1;
        if (favoritesOnly) count += 1;
        if (recentOnly) count += 1;
        if (browseAllRecipes) count += 1;
        return count;
    }

    private boolean isHomeMode() {
        return !browseAllRecipes
                && currentQuery.trim().length() == 0
                && "Toutes".equals(selectedCategory)
                && "Toutes".equals(selectedSeason)
                && "Toutes".equals(selectedDifficulty)
                && !favoritesOnly
                && !recentOnly;
    }

    private void applyFilters() {
        if (adapter == null) return;
        boolean homeMode = isHomeMode();
        List<Recipe> filtered = homeMode
                ? repository.homeRecipes()
                : repository.filterSearchable(
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
        label.append(filtered.size()).append(homeMode ? " fiches parents" : " fiches visibles");
        if (homeMode) label.append(" - accueil");
        if (browseAllRecipes) label.append(" - toutes fiches");
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
        top.setBackground(panelGradient(COLOR_PANEL_DEEP, Color.rgb(20, 15, 10), COLOR_BORDER, 1, 0));
        root.addView(top, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Button back = new Button(this);
        back.setText("Retour");
        back.setTextColor(COLOR_TEXT_DARK);
        back.setTextSize(13);
        back.setTypeface(Typeface.DEFAULT_BOLD);
        back.setAllCaps(false);
        back.setBackground(buttonPanel(true));
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

        if (!recipe.isCollection()) {
            Button favorite = new Button(this);
            favorite.setText(isFavorite(recipe.id) ? "Favori" : "+ Favori");
            favorite.setTextColor(isFavorite(recipe.id) ? COLOR_TEXT_DARK : COLOR_TEXT);
            favorite.setTextSize(12);
            favorite.setTypeface(Typeface.DEFAULT_BOLD);
            favorite.setAllCaps(false);
            favorite.setBackground(isFavorite(recipe.id) ? buttonPanel(true) : buttonPanel(false));
            top.addView(favorite, new LinearLayout.LayoutParams(dp(96), dp(42)));
            favorite.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    toggleFavorite(recipe.id);
                    openRecipe(recipe, false);
                }
            });
        }

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

        addDetailHero(content, recipe);
        addQuickFacts(content, recipe);

        if (recipe.isCollection()) {
            addCollectionCards(content, recipe);
        } else {
            if (recipe.variantGroups) addInlineVariantPicker(content, recipe);
            addRecipeContentGrid(content, recipe);
        }

        setContentView(root);
    }

    private void addDetailHero(LinearLayout content, final Recipe recipe) {
        FrameLayout heroCard = new FrameLayout(this);
        heroCard.setPadding(dp(1), dp(1), dp(1), dp(1));
        heroCard.setBackground(panelGradient(Color.rgb(8, 7, 6), Color.rgb(29, 23, 16), COLOR_BORDER, 1, 8));
        content.addView(heroCard, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                detailHeroHeight()
        ));

        ImageView hero = new ImageView(this);
        hero.setScaleType(ImageView.ScaleType.CENTER_CROP);
        hero.setBackgroundColor(COLOR_CARD);
        heroCard.addView(hero, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        imageLoader.loadDetail(recipe.detailImage, hero, 960, 540);

        View veil = new View(this);
        veil.setBackgroundColor(Color.argb(recipe.isCollection() ? 118 : 84, 0, 0, 0));
        heroCard.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout overlay = new LinearLayout(this);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(14), dp(13), dp(14), dp(14));
        overlay.setBackground(bottomOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        heroCard.addView(overlay, overlayParams);

        TextView breadcrumb = text(detailBreadcrumb(recipe), 11, COLOR_MUTED, true);
        breadcrumb.setSingleLine(true);
        breadcrumb.setEllipsize(TextUtils.TruncateAt.END);
        overlay.addView(breadcrumb);

        TextView category = text(recipe.primaryCategory(), 11, COLOR_GOLD, true);
        category.setSingleLine(true);
        category.setEllipsize(TextUtils.TruncateAt.END);
        category.setPadding(dp(8), dp(4), dp(8), dp(4));
        category.setBackground(panel(Color.argb(174, 15, 11, 7), COLOR_BORDER, 1, 12));
        LinearLayout.LayoutParams categoryParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        categoryParams.topMargin = dp(7);
        overlay.addView(category, categoryParams);

        TextView title = text(recipe.title, recipe.isCollection() ? 28 : 26, COLOR_TEXT, true);
        title.setMaxLines(3);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setLineSpacing(dp(1), 1.03f);
        title.setShadowLayer(4f, 0, dp(2), Color.BLACK);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(7);
        overlay.addView(title, titleParams);

        String meta = recipe.isCollection()
                ? repository.collectionCount(recipe) + " fiches rangees"
                : recipe.metaLine();
        TextView metaView = text(meta, 12, COLOR_MUTED, true);
        metaView.setSingleLine(false);
        metaView.setPadding(0, dp(4), 0, 0);
        overlay.addView(metaView);

        if (!recipe.isCollection()) addHeroActions(overlay, recipe);
    }

    private String detailBreadcrumb(Recipe recipe) {
        StringBuilder builder = new StringBuilder("Cook Note");
        List<Recipe> trail = repository.parentTrail(recipe);
        for (Recipe parent : trail) {
            builder.append(" / ").append(parent.title);
        }
        if (trail.isEmpty() && recipe.master.length() == 0) {
            builder.append(" / ").append(recipe.primaryCategory());
        }
        return builder.toString();
    }

    private int detailHeroHeight() {
        int width = getResources().getDisplayMetrics().widthPixels - dp(28);
        int height = Math.max(dp(248), (width * 9) / 16);
        return Math.min(dp(430), height);
    }

    private void addHeroActions(LinearLayout overlay, final Recipe recipe) {
        ArrayList<Button> buttons = new ArrayList<Button>();

        Button shopping = actionButton(isInShopping(recipe.id) ? "Dans courses" : "+ Courses", true);
        shopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleShopping(recipe);
                openRecipe(recipe, false);
            }
        });
        buttons.add(shopping);

        Button copy = actionButton("Copier", false);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyRecipe(recipe);
            }
        });
        buttons.add(copy);

        Button share = actionButton("Partager", false);
        share.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                shareRecipe(recipe);
            }
        });
        buttons.add(share);

        Button favorite = actionButton(isFavorite(recipe.id) ? "Favori" : "+ Favori", isFavorite(recipe.id));
        favorite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleFavorite(recipe.id);
                openRecipe(recipe, false);
            }
        });
        buttons.add(favorite);

        int perRow = getResources().getDisplayMetrics().widthPixels >= dp(720) ? 4 : 2;
        LinearLayout row = null;
        for (int index = 0; index < buttons.size(); index += 1) {
            if (index % perRow == 0) {
                row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
                rowParams.topMargin = dp(index == 0 ? 10 : 7);
                overlay.addView(row, rowParams);
            }
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(40), 1);
            if (index % perRow < perRow - 1) params.rightMargin = dp(7);
            row.addView(buttons.get(index), params);
        }
    }

    private void addQuickFacts(LinearLayout content, Recipe recipe) {
        ArrayList<String[]> facts = new ArrayList<String[]>();
        facts.add(new String[]{"Categorie", recipe.primaryCategory()});
        if (!recipe.seasons.isEmpty()) facts.add(new String[]{"Saison", shortList(recipe.seasons, 2)});

        if (recipe.isCollection()) {
            facts.add(new String[]{"Collection", repository.collectionCount(recipe) + " fiches"});
        } else {
            String difficulty = recipe.difficultyLabel();
            if (difficulty.length() > 0) facts.add(new String[]{"Difficulte", difficulty});
            if (recipe.yield.length() > 0) facts.add(new String[]{"Quantite", recipe.yield});
            if (recipe.activeTime > 0) facts.add(new String[]{"Actif", formatMinutes(recipe.activeTime)});
            if (recipe.cookTime > 0) facts.add(new String[]{"Cuisson", formatMinutes(recipe.cookTime)});
            int totalTime = recipe.activeTime + recipe.cookTime;
            if (totalTime > 0) facts.add(new String[]{"Temps", formatMinutes(totalTime)});
            int ingredientCount = countSelectedIngredients(recipe);
            if (ingredientCount > 0) facts.add(new String[]{"Ingredients", String.valueOf(ingredientCount)});
            int stepCount = selectedRecipeSteps(recipe).size();
            if (stepCount > 0) facts.add(new String[]{"Etapes", String.valueOf(stepCount)});
        }

        if (facts.isEmpty()) return;

        LinearLayout block = new LinearLayout(this);
        block.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams blockParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        blockParams.topMargin = dp(12);
        content.addView(block, blockParams);

        int columns = quickFactColumns();
        LinearLayout row = null;
        for (int index = 0; index < facts.size(); index += 1) {
            if (index % columns == 0) {
                row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
                if (index > 0) rowParams.topMargin = dp(8);
                block.addView(row, rowParams);
            }
            addQuickFactCard(row, facts.get(index)[0], facts.get(index)[1], index % columns < columns - 1);
        }

        int missing = facts.size() % columns;
        if (row != null && missing > 0) {
            for (int index = missing; index < columns; index += 1) {
                addQuickFactSpacer(row, index < columns - 1);
            }
        }
    }

    private int quickFactColumns() {
        int width = getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(940)) return 4;
        if (width >= dp(620)) return 3;
        return 2;
    }

    private void addQuickFactCard(LinearLayout row, String label, String value, boolean rightMargin) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(11), dp(9), dp(11), dp(10));
        card.setMinimumHeight(dp(66));
        card.setBackground(panelGradient(COLOR_CARD, Color.rgb(31, 27, 20), COLOR_BORDER_SOFT, 1, 8));

        TextView labelView = text(label, 10, COLOR_GOLD, true);
        labelView.setSingleLine(true);
        labelView.setEllipsize(TextUtils.TruncateAt.END);
        card.addView(labelView);

        TextView valueView = text(value, 13, COLOR_TEXT, true);
        valueView.setMaxLines(2);
        valueView.setEllipsize(TextUtils.TruncateAt.END);
        valueView.setPadding(0, dp(3), 0, 0);
        card.addView(valueView);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        if (rightMargin) params.rightMargin = dp(8);
        row.addView(card, params);
    }

    private void addQuickFactSpacer(LinearLayout row, boolean rightMargin) {
        View spacer = new View(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(1), 1);
        if (rightMargin) params.rightMargin = dp(8);
        row.addView(spacer, params);
    }

    private void addRecipeContentGrid(LinearLayout content, Recipe recipe) {
        int columns = detailColumnCount();
        if (columns <= 1) {
            addIngredients(content, recipe);
            addSteps(content, recipe);
            addBeforePanel(content, recipe);
            return;
        }

        LinearLayout grid = new LinearLayout(this);
        grid.setOrientation(LinearLayout.HORIZONTAL);
        grid.setBaselineAligned(false);
        LinearLayout.LayoutParams gridParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        gridParams.topMargin = dp(2);
        content.addView(grid, gridParams);

        LinearLayout left = detailColumn();
        LinearLayout middle = detailColumn();
        LinearLayout right = columns >= 3 ? detailColumn() : null;

        LinearLayout.LayoutParams leftParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        leftParams.rightMargin = dp(10);
        grid.addView(left, leftParams);

        LinearLayout.LayoutParams middleParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        if (columns >= 3) middleParams.rightMargin = dp(10);
        grid.addView(middle, middleParams);

        if (right != null) {
            grid.addView(right, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        }

        addIngredients(left, recipe);
        addSteps(middle, recipe);
        if (right != null) {
            addBeforePanel(right, recipe);
        } else {
            addBeforePanel(middle, recipe);
        }
    }

    private int detailColumnCount() {
        int width = getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(1120)) return 3;
        if (width >= dp(760)) return 2;
        return 1;
    }

    private LinearLayout detailColumn() {
        LinearLayout column = new LinearLayout(this);
        column.setOrientation(LinearLayout.VERTICAL);
        return column;
    }

    private void addBeforePanel(LinearLayout content, Recipe recipe) {
        if (recipe.notes.isEmpty() && recipe.technical.isEmpty() && recipe.practical.isEmpty()) return;

        LinearLayout section = addSection(content, "Avant de commencer");
        if (!recipe.notes.isEmpty()) {
            subTitle(section, "Notes");
            for (String note : recipe.notes) {
                bulletRow(section, note);
            }
        }
        if (!recipe.technical.isEmpty()) {
            subTitle(section, "Technique");
            for (Recipe.Technical item : recipe.technical) {
                labelValue(section, item.label, item.value);
            }
        }
        if (!recipe.practical.isEmpty()) {
            for (Recipe.PracticalSection practicalSection : recipe.practical) {
                subTitle(section, practicalSection.title);
                for (String item : practicalSection.items) {
                    bulletRow(section, item);
                }
            }
        }
    }

    private int countSelectedIngredients(Recipe recipe) {
        int count = 0;
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            count += group.items.size();
        }
        return count;
    }

    private void addCollectionCards(LinearLayout content, final Recipe recipe) {
        LinearLayout section = addSection(content, "Recettes");
        final List<VariantChoice> choices = collectionVariantChoices(recipe);
        if (choices.isEmpty()) {
            body(section, "Aucune fiche disponible.");
            return;
        }
        body(section, choices.size() + " fiche(s) rangee(s) ici.", COLOR_MUTED);
        int columns = collectionGridColumns();
        int cardHeight = collectionCardHeight(columns);
        LinearLayout row = null;
        for (int index = 0; index < choices.size(); index += 1) {
            if (index % columns == 0) {
                row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
                rowParams.topMargin = dp(10);
                section.addView(row, rowParams);
            }
            addCollectionCard(row, recipe, choices.get(index), cardHeight, index % columns < columns - 1);
        }
        int missing = choices.size() % columns;
        if (row != null && missing > 0) {
            for (int index = missing; index < columns; index += 1) {
                addCollectionSpacer(row, cardHeight, index < columns - 1);
            }
        }
    }

    private int collectionGridColumns() {
        int width = getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(1000)) return 3;
        if (width >= dp(620)) return 2;
        return 1;
    }

    private int collectionCardHeight(int columns) {
        int width = getResources().getDisplayMetrics().widthPixels;
        int available = Math.max(dp(260), width - dp(56) - (dp(10) * (columns - 1)));
        int cardWidth = available / columns;
        return Math.max(dp(132), (cardWidth * 9) / 16);
    }

    private void addCollectionCard(LinearLayout row, final Recipe parentRecipe, final VariantChoice choice, int cardHeight, boolean rightMargin) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(1), dp(1), dp(1), dp(1));
        card.setBackground(selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, COLOR_BORDER, 1, 8));
        card.setClickable(true);

        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(COLOR_CARD);
        card.addView(frame, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView image = new ImageView(this);
        image.setScaleType(ImageView.ScaleType.CENTER_CROP);
        image.setBackgroundColor(COLOR_CARD);
        frame.addView(image, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        imageLoader.load(choice.recipe.image, image, dp(340), cardHeight);

        View veil = new View(this);
        veil.setBackgroundColor(Color.argb(68, 0, 0, 0));
        frame.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout overlay = new LinearLayout(this);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(12), dp(10), dp(12), dp(11));
        overlay.setBackground(bottomOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        LinearLayout topLine = new LinearLayout(this);
        topLine.setOrientation(LinearLayout.HORIZONTAL);
        topLine.setGravity(Gravity.CENTER_VERTICAL);
        overlay.addView(topLine, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView badge = text(choice.recipe.primaryCategory(), 10, COLOR_GOLD, true);
        badge.setSingleLine(true);
        badge.setEllipsize(TextUtils.TruncateAt.END);
        badge.setPadding(dp(7), dp(3), dp(7), dp(3));
        badge.setBackground(panel(Color.argb(174, 15, 11, 7), COLOR_BORDER, 1, 12));
        topLine.addView(badge, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        TextView open = text("Voir", 11, COLOR_ORANGE, true);
        open.setGravity(Gravity.CENTER);
        open.setSingleLine(true);
        open.setEllipsize(TextUtils.TruncateAt.END);
        open.setBackground(panel(Color.argb(182, 20, 13, 7), COLOR_BORDER, 1, 14));
        open.setPadding(dp(8), dp(4), dp(8), dp(4));
        LinearLayout.LayoutParams openParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        openParams.leftMargin = dp(6);
        topLine.addView(open, openParams);

        TextView title = text(choice.label, 16, COLOR_TEXT, true);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setLineSpacing(dp(1), 1.04f);
        title.setShadowLayer(3.5f, 0, dp(2), Color.BLACK);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(7);
        overlay.addView(title, titleParams);

        TextView meta = text(displayMeta(choice.recipe), 11, COLOR_MUTED, false);
        meta.setSingleLine(true);
        meta.setEllipsize(TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams metaParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        metaParams.topMargin = dp(4);
        overlay.addView(meta, metaParams);

        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
                0,
                cardHeight,
                1
        );
        if (rightMargin) cardParams.rightMargin = dp(10);
        row.addView(card, cardParams);
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                detailBackStack.push(parentRecipe.id);
                openRecipe(choice.recipe, false);
            }
        });
    }

    private void addCollectionSpacer(LinearLayout row, int cardHeight, boolean rightMargin) {
        View spacer = new View(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, cardHeight, 1);
        if (rightMargin) params.rightMargin = dp(10);
        row.addView(spacer, params);
    }

    private void addInlineVariantPicker(LinearLayout content, final Recipe recipe) {
        final List<InlineVariantChoice> choices = inlineVariantChoices(recipe);
        if (choices.size() <= 1) return;

        LinearLayout section = addSection(content, "Preparation");
        final int selectedIndex = selectedInlineVariantIndex(recipe, choices);
        final int[] currentIndex = new int[]{selectedIndex};
        Spinner spinner = createSpinner(labelsForInlineChoices(choices));
        spinner.setSelection(selectedIndex);
        section.addView(spinner, fullWidthParams(dp(10), dp(46)));

        final TextView meta = text("", 13, COLOR_MUTED, false);
        meta.setPadding(0, dp(8), 0, 0);
        section.addView(meta);
        updateInlineVariantMeta(meta, recipe, choices.get(selectedIndex));

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position == currentIndex[0]) return;
                currentIndex[0] = position;
                inlineVariantSelections.put(recipe.id, position);
                openRecipe(recipe, false);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private List<VariantChoice> collectionVariantChoices(Recipe recipe) {
        List<VariantChoice> choices = new ArrayList<VariantChoice>();
        Map<String, String> directLabels = new HashMap<String, String>();
        Set<String> added = new HashSet<String>();
        for (Recipe.Variant variant : recipe.variants) {
            directLabels.put(variant.id, variant.label);
        }
        for (Recipe target : repository.childrenForParent(recipe)) {
            String directLabel = directLabels.get(target.id);
            String label = directLabel != null && directLabel.length() > 0 ? directLabel : target.title;
            choices.add(new VariantChoice(label, target));
            added.add(target.id);
        }
        for (Recipe.Variant variant : recipe.variants) {
            Recipe target = repository.find(variant.id);
            if (target == null) continue;
            if (added.contains(target.id)) continue;
            String label = variant.label.length() > 0 ? variant.label : target.title;
            choices.add(new VariantChoice(label, target));
            added.add(target.id);
        }
        Collections.sort(choices, new Comparator<VariantChoice>() {
            @Override
            public int compare(VariantChoice left, VariantChoice right) {
                return left.label.compareToIgnoreCase(right.label);
            }
        });
        return choices;
    }

    private String displayMeta(Recipe recipe) {
        if (!recipe.isCollection()) return recipe.metaLine();
        return recipe.primaryCategory() + " - " + repository.collectionCount(recipe) + " fiches rangees";
    }

    private List<InlineVariantChoice> inlineVariantChoices(Recipe recipe) {
        List<InlineVariantChoice> choices = new ArrayList<InlineVariantChoice>();
        for (int index = 0; index < recipe.ingredients.size(); index += 1) {
            Recipe.Group group = recipe.ingredients.get(index);
            if (!isVariantIngredientGroup(group, recipe)) continue;
            choices.add(new InlineVariantChoice(cleanVariantGroupLabel(group.title), group));
        }
        if (choices.isEmpty() && recipe.variantGroups) {
            for (Recipe.Group group : recipe.ingredients) {
                choices.add(new InlineVariantChoice(cleanVariantGroupLabel(group.title), group));
            }
        }
        return choices;
    }

    private int selectedInlineVariantIndex(Recipe recipe, List<InlineVariantChoice> choices) {
        Integer saved = inlineVariantSelections.get(recipe.id);
        int index = saved == null ? 0 : saved.intValue();
        if (index < 0 || index >= choices.size()) return 0;
        return index;
    }

    private InlineVariantChoice selectedInlineVariantChoice(Recipe recipe) {
        List<InlineVariantChoice> choices = inlineVariantChoices(recipe);
        if (choices.isEmpty()) return null;
        return choices.get(selectedInlineVariantIndex(recipe, choices));
    }

    private List<Recipe.Group> selectedIngredientGroups(Recipe recipe) {
        if (!recipe.variantGroups) return recipe.ingredients;

        List<Recipe.Group> groups = new ArrayList<Recipe.Group>();
        for (Recipe.Group group : recipe.ingredients) {
            if (!isVariantIngredientGroup(group, recipe)) groups.add(group);
        }

        InlineVariantChoice selected = selectedInlineVariantChoice(recipe);
        if (selected != null && !groups.contains(selected.group)) groups.add(selected.group);
        return groups;
    }

    private List<String> selectedRecipeSteps(Recipe recipe) {
        if (!recipe.variantGroups) return recipe.steps;
        InlineVariantChoice selected = selectedInlineVariantChoice(recipe);
        if (selected != null && !selected.group.steps.isEmpty()) return selected.group.steps;
        return recipe.steps;
    }

    private boolean isVariantIngredientGroup(Recipe.Group group, Recipe recipe) {
        String label = CookNoteRepository.normalize(group.title);
        if (label.indexOf("base commune") >= 0 || "base".equals(label) || label.indexOf("commun") >= 0) return false;
        if (label.matches("^\\d+.*")) return true;
        if (label.startsWith("variante") || label.startsWith("version") || label.startsWith("option")) return true;
        return recipe.variantGroups;
    }

    private String cleanVariantGroupLabel(String value) {
        String label = value == null ? "" : value.trim();
        label = label.replaceFirst("(?i)^\\s*(variante|version|option)\\s*[:\\-]?\\s*", "");
        return label.length() == 0 ? "Preparation" : label;
    }

    private List<String> labelsForInlineChoices(List<InlineVariantChoice> choices) {
        List<String> labels = new ArrayList<String>();
        for (InlineVariantChoice choice : choices) {
            labels.add(choice.label);
        }
        return labels;
    }

    private void updateInlineVariantMeta(TextView meta, Recipe recipe, InlineVariantChoice choice) {
        int stepCount = choice.group.steps.isEmpty() ? recipe.steps.size() : choice.group.steps.size();
        StringBuilder builder = new StringBuilder();
        builder.append(choice.group.items.size()).append(choice.group.items.size() > 1 ? " ingredients" : " ingredient");
        if (stepCount > 0) builder.append(" - ").append(stepCount).append(stepCount > 1 ? " etapes" : " etape");
        if (choice.group.note.length() > 0) builder.append(" - note");
        meta.setText(builder.toString());
    }

    private void addRecipeTools(LinearLayout content, final Recipe recipe) {
        LinearLayout section = addSection(content, "Actions");

        Button shopping = sectionButton(isInShopping(recipe.id) ? "Retirer des courses" : "Ajouter aux courses", true);
        section.addView(shopping);
        shopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggleShopping(recipe);
                openRecipe(recipe, false);
            }
        });

        Button copy = sectionButton("Copier fiche", false);
        section.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyRecipe(recipe);
            }
        });

        Button share = sectionButton("Partager fiche", false);
        section.addView(share);
        share.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                shareRecipe(recipe);
            }
        });
    }

    private void addIngredients(LinearLayout content, Recipe recipe) {
        LinearLayout section = addSection(content, "Ingredients");
        List<Recipe.Group> groups = selectedIngredientGroups(recipe);
        if (groups.isEmpty()) {
            body(section, "Aucun ingredient detaille pour cette fiche.");
            return;
        }
        Button copy = sectionButton("Copier ingredients", false);
        section.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyIngredients(recipe);
            }
        });
        for (Recipe.Group group : groups) {
            addIngredientGroup(section, group, !recipe.variantGroups);
        }
    }

    private void addSteps(LinearLayout content, Recipe recipe) {
        LinearLayout section = addSection(content, "Etapes");
        List<String> steps = selectedRecipeSteps(recipe);
        if (steps.isEmpty()) {
            body(section, "Aucune etape detaillee pour cette fiche.");
            return;
        }
        for (int index = 0; index < steps.size(); index += 1) {
            stepRow(section, index + 1, steps.get(index));
        }
    }

    private void addIngredientGroup(LinearLayout section, Recipe.Group group, boolean includeGroupSteps) {
        subTitle(section, group.title);
        for (String item : group.items) {
            bulletRow(section, item);
        }
        if (group.note.length() > 0) body(section, group.note, COLOR_MUTED);
        if (includeGroupSteps) {
            for (String step : group.steps) {
                bulletRow(section, step);
            }
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

    private void addParentPath(LinearLayout content, Recipe recipe) {
        List<Recipe> trail = repository.parentTrail(recipe);
        if (trail.isEmpty()) return;
        StringBuilder builder = new StringBuilder();
        for (Recipe parent : trail) {
            if (builder.length() > 0) builder.append("  /  ");
            builder.append(parent.title);
        }
        TextView path = text(builder.toString(), 12, COLOR_MUTED, true);
        path.setSingleLine(false);
        path.setPadding(dp(10), dp(8), dp(10), dp(8));
        path.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 8));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(10);
        content.addView(path, params);
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
            addInfoChip(row, "Fiches", String.valueOf(repository.collectionCount(recipe)));
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
        chip.setBackground(panelGradient(COLOR_CARD_SOFT, Color.rgb(34, 28, 19), COLOR_BORDER_SOFT, 1, 8));

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
        section.setPadding(dp(14), dp(13), dp(14), dp(15));
        section.setBackground(panelGradient(COLOR_CARD, Color.rgb(27, 23, 17), COLOR_BORDER_SOFT, 1, 8));

        LinearLayout titleRow = new LinearLayout(this);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.CENTER_VERTICAL);
        View accent = new View(this);
        accent.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 3));
        LinearLayout.LayoutParams accentParams = new LinearLayout.LayoutParams(dp(4), dp(22));
        accentParams.rightMargin = dp(9);
        titleRow.addView(accent, accentParams);

        TextView title = text(value, 18, COLOR_GOLD, true);
        title.setIncludeFontPadding(false);
        title.setShadowLayer(2.5f, 0, dp(1), Color.BLACK);
        titleRow.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        section.addView(titleRow);

        View divider = new View(this);
        divider.setBackgroundColor(COLOR_LINE);
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
        row.setPadding(dp(9), dp(8), dp(9), dp(8));
        row.setBackground(panel(Color.rgb(21, 19, 15), Color.rgb(45, 37, 25), 1, 7));

        View marker = new View(this);
        marker.setBackground(panel(COLOR_ORANGE, COLOR_ORANGE, 1, 4));
        LinearLayout.LayoutParams markerParams = new LinearLayout.LayoutParams(dp(7), dp(7));
        markerParams.topMargin = dp(8);
        markerParams.rightMargin = dp(9);
        row.addView(marker, markerParams);

        TextView text = text(value, 15, COLOR_TEXT, false);
        text.setLineSpacing(dp(2), 1.10f);
        row.addView(text, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(7);
        content.addView(row, rowParams);
    }

    private void stepRow(LinearLayout content, int number, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.TOP);
        row.setPadding(dp(10), dp(10), dp(10), dp(10));
        row.setBackground(panelGradient(COLOR_CARD_SOFT, Color.rgb(34, 28, 19), COLOR_BORDER_SOFT, 1, 8));

        TextView index = text(String.valueOf(number), 13, COLOR_TEXT_DARK, true);
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
        block.setPadding(dp(10), dp(9), dp(10), dp(10));
        block.setBackground(panel(Color.rgb(21, 19, 15), Color.rgb(45, 37, 25), 1, 7));
        if (label != null && label.length() > 0) {
            TextView labelView = text(label, 12, COLOR_GOLD, true);
            labelView.setPadding(0, 0, 0, dp(2));
            block.addView(labelView);
        }
        TextView valueView = text(value, 15, COLOR_TEXT, false);
        valueView.setLineSpacing(dp(2), 1.10f);
        block.addView(valueView);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(8);
        content.addView(block, params);
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
        return sectionButton(value, true);
    }

    private Button sectionButton(String value, boolean primary) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(primary ? COLOR_TEXT_DARK : COLOR_TEXT);
        button.setTextSize(13);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setPadding(dp(8), 0, dp(8), 0);
        button.setBackground(buttonPanel(primary));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(42)
        );
        params.topMargin = dp(10);
        params.bottomMargin = dp(2);
        button.setLayoutParams(params);
        return button;
    }

    private Spinner createSpinner(final List<String> labels) {
        Spinner spinner = new Spinner(this);
        spinner.setPadding(dp(8), 0, dp(8), 0);
        spinner.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER, 1, 8));
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, labels) {
            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                TextView view = (TextView) super.getView(position, convertView, parent);
                styleSpinnerText(view, false);
                return view;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                TextView view = (TextView) super.getDropDownView(position, convertView, parent);
                styleSpinnerText(view, true);
                return view;
            }
        };
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        return spinner;
    }

    private void styleSpinnerText(TextView view, boolean dropdown) {
        view.setTextColor(COLOR_TEXT);
        view.setTextSize(15);
        view.setTypeface(Typeface.DEFAULT_BOLD);
        view.setSingleLine(!dropdown);
        view.setMaxLines(dropdown ? 2 : 1);
        view.setEllipsize(TextUtils.TruncateAt.END);
        view.setPadding(dp(12), dp(8), dp(12), dp(8));
        view.setBackgroundColor(dropdown ? COLOR_CARD_SOFT : Color.TRANSPARENT);
    }

    private LinearLayout.LayoutParams fullWidthParams(int topMargin, int height) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                height
        );
        params.topMargin = topMargin;
        return params;
    }

    private void showShoppingList() {
        showingDetail = true;

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        top.setPadding(dp(10), dp(8), dp(10), dp(8));
        top.setBackground(panelGradient(COLOR_PANEL_DEEP, Color.rgb(20, 15, 10), COLOR_BORDER, 1, 0));
        root.addView(top, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Button back = new Button(this);
        back.setText("Retour");
        back.setTextColor(COLOR_TEXT_DARK);
        back.setTextSize(13);
        back.setTypeface(Typeface.DEFAULT_BOLD);
        back.setAllCaps(false);
        back.setBackground(buttonPanel(true));
        top.addView(back, new LinearLayout.LayoutParams(dp(104), dp(42)));
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                goBack();
            }
        });

        TextView title = text("Liste de courses", 20, COLOR_TEXT, true);
        title.setGravity(Gravity.CENTER_VERTICAL);
        title.setPadding(dp(12), 0, 0, 0);
        top.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        ScrollView scroll = new ScrollView(this);
        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(14), dp(14), dp(14), dp(26));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        LinearLayout actions = addSection(content, "Courses");
        body(actions, shoppingRecipeIds.size() + " recette(s) dans la liste", COLOR_MUTED);

        Button copy = sectionButton("Copier la liste", true);
        copy.setEnabled(!shoppingRecipeIds.isEmpty());
        actions.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyShoppingList();
            }
        });

        Button clear = sectionButton("Vider la liste", false);
        clear.setEnabled(!shoppingRecipeIds.isEmpty());
        actions.addView(clear);
        clear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearShoppingList();
            }
        });

        if (shoppingRecipeIds.isEmpty()) {
            body(actions, "Ajoute une recette depuis une fiche pour preparer les courses.");
        } else {
            ArrayList<String> ids = new ArrayList<String>(shoppingRecipeIds);
            for (final String id : ids) {
                final Recipe recipe = repository.find(id);
                if (recipe == null) continue;
                LinearLayout section = addSection(content, recipe.title);
                TextView meta = text(recipe.metaLine(), 12, COLOR_DIM, false);
                meta.setPadding(0, dp(5), 0, dp(3));
                section.addView(meta);

                Button remove = sectionButton("Retirer cette recette", false);
                section.addView(remove);
                remove.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        removeShopping(id);
                        showShoppingList();
                    }
                });

                for (Recipe.Group group : selectedIngredientGroups(recipe)) {
                    addIngredientGroup(section, group, false);
                }
            }
        }

        setContentView(root);
    }

    private Button actionButton(String value, boolean primary) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(primary ? COLOR_TEXT_DARK : COLOR_TEXT);
        button.setTextSize(13);
        button.setSingleLine(true);
        button.setEllipsize(TextUtils.TruncateAt.END);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setPadding(dp(6), 0, dp(6), 0);
        button.setBackground(buttonPanel(primary));
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

    private void copyRecipe(Recipe recipe) {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText(recipe.title, buildRecipeText(recipe)));
        Toast.makeText(this, "Fiche copiee", Toast.LENGTH_SHORT).show();
    }

    private void shareRecipe(Recipe recipe) {
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("text/plain");
        send.putExtra(Intent.EXTRA_SUBJECT, recipe.title);
        send.putExtra(Intent.EXTRA_TEXT, buildRecipeText(recipe));
        try {
            startActivity(Intent.createChooser(send, "Partager"));
        } catch (ActivityNotFoundException exception) {
            copyRecipe(recipe);
        }
    }

    private void copyShoppingList() {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note - liste de courses", buildShoppingText()));
        Toast.makeText(this, "Liste de courses copiee", Toast.LENGTH_SHORT).show();
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

    private String buildIngredientsText(Recipe recipe) {
        StringBuilder builder = new StringBuilder();
        builder.append(recipe.title).append('\n');
        builder.append("Ingredients").append('\n');
        appendIngredients(builder, recipe);
        return builder.toString().trim();
    }

    private String buildRecipeText(Recipe recipe) {
        StringBuilder builder = new StringBuilder();
        builder.append(recipe.title).append('\n');
        String meta = recipe.metaLine();
        if (meta.length() > 0) builder.append(meta).append('\n');

        builder.append('\n').append("Ingredients").append('\n');
        appendIngredients(builder, recipe);

        List<String> steps = selectedRecipeSteps(recipe);
        if (!steps.isEmpty()) {
            builder.append('\n').append("Etapes").append('\n');
            for (int index = 0; index < steps.size(); index += 1) {
                builder.append(index + 1).append(". ").append(steps.get(index)).append('\n');
            }
        }

        if (!recipe.notes.isEmpty()) {
            builder.append('\n').append("Notes").append('\n');
            for (String note : recipe.notes) {
                builder.append("- ").append(note).append('\n');
            }
        }

        return builder.toString().trim();
    }

    private String buildShoppingText() {
        StringBuilder builder = new StringBuilder();
        builder.append("Cook Note - Liste de courses").append('\n');
        if (shoppingRecipeIds.isEmpty()) {
            builder.append('\n').append("Aucune recette.");
            return builder.toString();
        }

        for (String id : shoppingRecipeIds) {
            Recipe recipe = repository.find(id);
            if (recipe == null) continue;
            builder.append('\n').append(recipe.title).append('\n');
            appendIngredients(builder, recipe);
        }
        return builder.toString().trim();
    }

    private void appendIngredients(StringBuilder builder, Recipe recipe) {
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            builder.append('\n').append(group.title).append('\n');
            for (String item : group.items) {
                builder.append("- ").append(item).append('\n');
            }
            if (group.note.length() > 0) builder.append("Note: ").append(group.note).append('\n');
        }
    }

    private GradientDrawable panel(int color, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    private GradientDrawable bottomOverlayGradient() {
        return new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(8, 0, 0, 0),
                Color.argb(122, 0, 0, 0),
                Color.argb(238, 5, 4, 3)
        });
    }

    private StateListDrawable buttonPanel(boolean primary) {
        if (primary) {
            return selectableGradientPanel(
                    COLOR_ORANGE,
                    COLOR_GOLD,
                    Color.rgb(255, 210, 82),
                    Color.rgb(251, 191, 36),
                    COLOR_ORANGE,
                    1,
                    8
            );
        }
        return selectableGradientPanel(
                Color.rgb(23, 21, 17),
                Color.rgb(34, 29, 21),
                Color.rgb(42, 31, 18),
                Color.rgb(55, 40, 22),
                COLOR_BORDER_SOFT,
                1,
                8
        );
    }

    private StateListDrawable selectablePanel(int normalColor, int pressedColor, int strokeColor, int strokeWidth, int radiusDp) {
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{-android.R.attr.state_enabled}, panel(Color.rgb(34, 31, 27), Color.rgb(55, 49, 39), strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_pressed}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_focused}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{}, panel(normalColor, strokeColor, strokeWidth, radiusDp));
        return drawable;
    }

    private StateListDrawable selectableGradientPanel(int normalStart, int normalEnd, int pressedStart, int pressedEnd, int strokeColor, int strokeWidth, int radiusDp) {
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{-android.R.attr.state_enabled}, panel(Color.rgb(34, 31, 27), Color.rgb(55, 49, 39), strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_pressed}, gradientPanel(pressedStart, pressedEnd, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_focused}, gradientPanel(pressedStart, pressedEnd, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{}, gradientPanel(normalStart, normalEnd, strokeColor, strokeWidth, radiusDp));
        return drawable;
    }

    private GradientDrawable panelGradient(int startColor, int endColor, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[]{startColor, endColor});
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

    private static final class VariantChoice {
        final String label;
        final Recipe recipe;

        VariantChoice(String label, Recipe recipe) {
            this.label = label;
            this.recipe = recipe;
        }
    }

    private static final class InlineVariantChoice {
        final String label;
        final Recipe.Group group;

        InlineVariantChoice(String label, Recipe.Group group) {
            this.label = label;
            this.group = group;
        }
    }

    private void loadUserState() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        favoriteIds.clear();
        recentIds.clear();
        shoppingRecipeIds.clear();
        parseIds(prefs.getString(PREF_FAVORITES, ""), favoriteIds, 0);
        parseIds(prefs.getString(PREF_RECENT, ""), recentIds, MAX_RECENT);
        parseIds(prefs.getString(PREF_SHOPPING, ""), shoppingRecipeIds, 0);
    }

    private void saveUserState() {
        SharedPreferences.Editor editor = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
        editor.putString(PREF_FAVORITES, joinIds(new ArrayList<String>(favoriteIds)));
        editor.putString(PREF_RECENT, joinIds(recentIds));
        editor.putString(PREF_SHOPPING, joinIds(shoppingRecipeIds));
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

    private boolean isInShopping(String id) {
        return shoppingRecipeIds.contains(id);
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

    private void toggleShopping(Recipe recipe) {
        if (shoppingRecipeIds.contains(recipe.id)) {
            shoppingRecipeIds.remove(recipe.id);
            Toast.makeText(this, "Retire des courses", Toast.LENGTH_SHORT).show();
        } else {
            shoppingRecipeIds.add(recipe.id);
            Toast.makeText(this, "Ajoute aux courses", Toast.LENGTH_SHORT).show();
        }
        saveUserState();
        refreshShoppingButton();
    }

    private void removeShopping(String id) {
        shoppingRecipeIds.remove(id);
        saveUserState();
        refreshShoppingButton();
    }

    private void clearShoppingList() {
        shoppingRecipeIds.clear();
        saveUserState();
        refreshShoppingButton();
        showShoppingList();
    }

    private void refreshShoppingButton() {
        if (shoppingButton != null) shoppingButton.setText("Courses (" + shoppingRecipeIds.size() + ")");
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
