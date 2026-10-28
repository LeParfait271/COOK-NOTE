package fr.cooknote.legacy;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.text.Editable;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.AdapterView;
import android.widget.AbsListView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.GridView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static fr.cooknote.legacy.Ingredients.*;
import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Texts.*;
import static fr.cooknote.legacy.Ui.*;

/** Ecran d accueil : grille des fiches, recherche simple sans filtres, position de liste et prechargement des images. */
final class HomeScreen {
    private final MainActivity host;
    private TextView catalogTitle;

    HomeScreen(MainActivity host) {
        this.host = host;
    }

    void showList() {
        long startedAt = host.perfStart();
        host.releaseScreenImages();
        host.releaseListSurface();
        host.currentScreen = MainActivity.SCREEN_LIST;
        host.currentRecipeId = "";
        host.showingDetail = false;
        host.listScrollState = AbsListView.OnScrollListener.SCROLL_STATE_IDLE;
        LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        host.addTopBar(root, false, "");

        LinearLayout header = new LinearLayout(host);
        header.setOrientation(LinearLayout.VERTICAL);
        header.setBackgroundColor(COLOR_BG);
        root.addView(header, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        // Bandeau comme le site : l'illustration de l'accueil et le logo, fondus
        // dans la page par le bas (plus de rangee logo + version au-dessus).
        FrameLayout homeHero = new FrameLayout(host);
        homeHero.setBackgroundColor(COLOR_BG);
        int screenWidth = host.getResources().getDisplayMetrics().widthPixels;
        int homeHeroHeight = Math.min(dp(250), Math.max(dp(150), (screenWidth * 9) / 25));
        header.addView(homeHero, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, homeHeroHeight));
        homeHeroView = homeHero;
        if (host.searchPanelOpen) homeHero.setVisibility(View.GONE);

        ImageView heroImage = new ImageView(host);
        heroImage.setScaleType(ImageView.ScaleType.CENTER_CROP);
        heroImage.setContentDescription("Univers Cook Note");
        homeHero.addView(heroImage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        host.imageLoader.loadDetail("home-hero.png", heroImage, screenWidth, homeHeroHeight);

        View heroVeil = new View(host);
        heroVeil.setBackground(new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(40, 0, 0, 0),
                Color.argb(70, 0, 0, 0),
                COLOR_BG
        }));
        homeHero.addView(heroVeil, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Logo principal, comme le site (lettrage clin d'oeil a Death Note), sans filets.
        // Drawable leger (640 px, transparence conservee) dans res/drawable-nodpi.
        ImageView heroWordmark = new ImageView(host);
        heroWordmark.setImageResource(R.drawable.cook_note_wordmark);
        heroWordmark.setScaleType(ImageView.ScaleType.FIT_CENTER);
        heroWordmark.setAdjustViewBounds(true);
        heroWordmark.setContentDescription("Cook Note");
        int wordmarkPadding = Math.max(dp(18), homeHeroHeight / 5);
        heroWordmark.setPadding(dp(28), wordmarkPadding, dp(28), wordmarkPadding);
        homeHero.addView(heroWordmark, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                Gravity.CENTER
        ));

        // Recherche : une pilule, texte centre, comme le site. Elle ouvre le
        // panneau de recherche juste dessous.
        host.searchToggle = new Button(host);
        host.searchToggle.setAllCaps(false);
        host.searchToggle.setTextColor(COLOR_TEXT);
        host.searchToggle.setTextSize(host.adjustedTextSize(15));
        host.searchToggle.setTypeface(Typeface.DEFAULT_BOLD);
        host.searchToggle.setGravity(Gravity.CENTER);
        host.searchToggle.setSingleLine(true);
        host.searchToggle.setEllipsize(TextUtils.TruncateAt.END);
        host.searchToggle.setStateListAnimator(null);
        host.searchToggle.setPadding(dp(18), 0, dp(18), 0);
        host.searchToggle.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_search, 0, 0, 0);
        host.searchToggle.setCompoundDrawablePadding(dp(10));
        host.searchToggle.setBackground(selectablePanel(COLOR_PANEL_DEEP, COLOR_CARD_ACTIVE, COLOR_BORDER_SOFT, 1, 26));
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        searchParams.leftMargin = dp(16);
        searchParams.rightMargin = dp(16);
        header.addView(host.searchToggle, searchParams);
        host.searchToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setSearchPanelOpen(!host.searchPanelOpen);
            }
        });

        host.animateIn(header, 0);

        host.searchPanel = new LinearLayout(host);
        host.searchPanel.setOrientation(LinearLayout.VERTICAL);
        host.searchPanel.setPadding(dp(14), dp(11), dp(14), dp(12));
        host.searchPanel.setBackground(panel(COLOR_CARD, COLOR_BORDER_SOFT, 1, 10));
        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        panelParams.leftMargin = dp(20);
        panelParams.rightMargin = dp(20);
        panelParams.topMargin = dp(7);
        header.addView(host.searchPanel, panelParams);

        TextView searchLabel = host.text("RECHERCHE", 9, COLOR_GOLD, true);
        searchLabel.setGravity(Gravity.CENTER);
        searchLabel.setIncludeFontPadding(false);
        host.searchPanel.addView(searchLabel);

        LinearLayout searchRow = new LinearLayout(host);
        searchRow.setOrientation(LinearLayout.HORIZONTAL);
        searchRow.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams searchRowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(42)
        );
        searchRowParams.topMargin = dp(9);
        host.searchPanel.addView(searchRow, searchRowParams);

        host.recentChipsRow = new LinearLayout(host);
        host.recentChipsRow.setOrientation(LinearLayout.HORIZONTAL);
        host.recentChipsRow.setGravity(Gravity.CENTER_VERTICAL);
        host.recentChipsRow.setPadding(dp(2), dp(9), dp(2), dp(2));
        LinearLayout.LayoutParams chipsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        chipsParams.topMargin = dp(2);
        host.searchPanel.addView(host.recentChipsRow, chipsParams);
        refreshRecentChips();

        host.searchBox = new EditText(host);
        host.searchBox.setSingleLine(true);
        host.searchBox.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
        host.searchBox.setImeOptions(EditorInfo.IME_ACTION_SEARCH);
        host.searchBox.setTextColor(COLOR_TEXT);
        host.searchBox.setHintTextColor(COLOR_MUTED);
        host.searchBox.setTextSize(host.adjustedTextSize(14));
        host.searchBox.setHint("Recette ou ingredient...");
        host.searchBox.setPadding(dp(12), 0, dp(12), 0);
        host.searchBox.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 8));
        host.searchBox.setText(host.currentQuery);
        LinearLayout.LayoutParams searchBoxParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
        searchBoxParams.rightMargin = dp(7);
        searchRow.addView(host.searchBox, searchBoxParams);

        host.clearSearchButton = host.actionButton("Effacer", false);
        searchRow.addView(host.clearSearchButton, new LinearLayout.LayoutParams(dp(92), ViewGroup.LayoutParams.MATCH_PARENT));
        host.clearSearchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearSearch();
            }
        });

        setSearchPanelOpen(host.searchPanelOpen);

        // Titre de section comme le site : « Toutes les categories » en serif,
        // le compte a cote, un filet dessous.
        LinearLayout titleRow = new LinearLayout(host);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.BOTTOM);
        titleRow.setPadding(dp(16), dp(22), dp(16), dp(10));
        header.addView(titleRow, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        catalogTitle = host.text("Toutes les cat\u00E9gories", 24, COLOR_TEXT, false);
        catalogTitle.setTypeface(Ui.DISPLAY);
        catalogTitle.setIncludeFontPadding(false);
        titleRow.addView(catalogTitle, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        host.counterView = host.text("", 13, COLOR_DIM, false);
        host.counterView.setSingleLine(true);
        host.counterView.setEllipsize(TextUtils.TruncateAt.END);
        host.counterView.setPadding(dp(10), 0, 0, dp(2));
        titleRow.addView(host.counterView, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        View titleLine = new View(host);
        titleLine.setBackgroundColor(COLOR_LINE);
        LinearLayout.LayoutParams titleLineParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(1));
        titleLineParams.leftMargin = dp(16);
        titleLineParams.rightMargin = dp(16);
        header.addView(titleLine, titleLineParams);

        final GridView gridView = new GridView(host);
        host.recipeGridView = gridView;
        gridView.setBackgroundColor(COLOR_BG);
        gridView.setCacheColorHint(COLOR_BG);
        gridView.setNumColumns(GridView.AUTO_FIT);
        gridView.setColumnWidth(dp(286));
        gridView.setHorizontalSpacing(dp(11));
        gridView.setVerticalSpacing(dp(12));
        gridView.setStretchMode(GridView.STRETCH_COLUMN_WIDTH);
        gridView.setPadding(dp(10), dp(10), dp(10), dp(18));
        gridView.setClipToPadding(false);
        gridView.setFastScrollEnabled(true);
        gridView.setSmoothScrollbarEnabled(true);
        gridView.setVerticalScrollBarEnabled(false);
        gridView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        gridView.setFadingEdgeLength(0);
        gridView.setScrollingCacheEnabled(false);
        host.adapter = new RecipeAdapter(host, host.imageLoader);
        host.adapter.setCollectionCounts(host.repository.collectionCounts());
        gridView.setAdapter(host.adapter);
        gridView.setRecyclerListener(new AbsListView.RecyclerListener() {
            @Override
            public void onMovedToScrapHeap(View view) {
                if (host.adapter != null) host.adapter.releaseView(view);
            }
        });
        root.addView(gridView, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                host.hideKeyboard();
                if (parent instanceof AbsListView) rememberListPosition((AbsListView) parent);
                setSearchPanelOpen(false);
                host.recipeScreen.openRecipe(host.adapter.getItem(position), true);
            }
        });
        gridView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                final Recipe recipe = host.adapter.getItem(position);
                if (recipe == null) return true;
                AlertDialog.Builder builder = new AlertDialog.Builder(host);
                builder.setTitle(recipe.title);
                builder.setItems(new CharSequence[]{"Ajouter aux courses", "Copier la recette", "Ouvrir la fiche"}, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if (which == 0) {
                            host.toggleShopping(recipe);
                            host.refreshShoppingButton();
                        } else if (which == 1) {
                            host.recipeScreen.copyRecipe(recipe);
                        } else {
                            host.hideKeyboard();
                            setSearchPanelOpen(false);
                            host.recipeScreen.openRecipe(recipe, true);
                        }
                    }
                });
                builder.show();
                return true;
            }
        });
        gridView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {
                handleListScrollStateChanged(view, scrollState);
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                rememberListPosition(view);
                if (host.listScrollState != SCROLL_STATE_FLING) {
                    scheduleVisibleRangePrewarm(view, firstVisibleItem, visibleItemCount, totalItemCount);
                }
            }
        });

        host.searchBox.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                host.currentQuery = String.valueOf(s);
                scheduleApplyFilters();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        host.searchBox.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView view, int actionId, android.view.KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH || actionId == EditorInfo.IME_ACTION_DONE) {
                    host.hideKeyboard();
                    return true;
                }
                return false;
            }
        });

        host.showScreen(root);
        resetFilterSnapshot();
        applyFiltersNow();
        restoreListPosition(gridView);
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog("showList", startedAt);
    }

    void clearSearch() {
        host.currentQuery = "";
        if (host.searchBox != null && host.searchBox.getText().length() > 0) host.searchBox.setText("");
        applyFiltersNow();
    }

    void rememberRecentSearch(String query) {
        String q = query == null ? "" : query.trim();
        if (q.length() < 2) return;
        host.recentSearches.remove(q);
        host.recentSearches.add(0, q);
        while (host.recentSearches.size() > 6) host.recentSearches.remove(host.recentSearches.size() - 1);
        host.saveUserState();
        refreshRecentChips();
    }

    void refreshRecentChips() {
        if (host.recentChipsRow == null) return;
        host.recentChipsRow.removeAllViews();
        if (host.recentSearches.isEmpty()) {
            host.recentChipsRow.setVisibility(View.GONE);
            return;
        }
        host.recentChipsRow.setVisibility(View.VISIBLE);
        TextView label = host.text("Récentes", 10, COLOR_DIM, true);
        label.setPadding(0, 0, dp(8), 0);
        host.recentChipsRow.addView(label);
        for (final String query : host.recentSearches) {
            Button chip = chipButton(query);
            chip.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (host.searchBox != null) host.searchBox.setText(query);
                    host.currentQuery = query;
                    applyFiltersNow();
                }
            });
            host.recentChipsRow.addView(chip);
        }
    }

    Button chipButton(String value) {
        Button button = new Button(host);
        button.setText(value);
        button.setTextColor(COLOR_TEXT);
        button.setTextSize(host.adjustedTextSize(11));
        button.setSingleLine(true);
        button.setEllipsize(TextUtils.TruncateAt.END);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setPadding(dp(10), 0, dp(10), 0);
        button.setBackground(selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, COLOR_BORDER_SOFT, 1, 14));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, dp(30));
        params.rightMargin = dp(6);
        button.setLayoutParams(params);
        return button;
    }

    // Bandeau d'accueil replie pendant la recherche : en paysage, le clavier
    // couvrait sinon le champ de saisie.
    View homeHeroView;

    void setSearchPanelOpen(boolean open) {
        host.searchPanelOpen = open;
        if (host.searchPanel != null) {
            host.searchPanel.setVisibility(open ? View.VISIBLE : View.GONE);
        }
        if (homeHeroView != null) homeHeroView.setVisibility(open ? View.GONE : View.VISIBLE);
        if (host.searchToggle != null) {
            host.searchToggle.setText(buildSearchToggleLabel());
        }
        if (open) {
            host.showKeyboard();
        } else {
            host.hideKeyboard();
        }
    }

    String buildSearchToggleLabel() {
        if (host.searchPanelOpen) return "Fermer la recherche";
        String query = host.currentQuery.trim();
        return query.length() == 0 ? "Rechercher une recette ou un ingr\u00E9dient" : "Recherche : " + query;
    }

    boolean isHomeMode() {
        return normalizedQuery().length() == 0;
    }

    String normalizedQuery() {
        return host.currentQuery == null ? "" : host.currentQuery.trim();
    }

    void resetFilterSnapshot() {
        host.filtersApplied = false;
        host.lastAppliedQuery = null;
        host.lastAppliedCount = 0;
    }

    void scheduleApplyFilters() {
        host.uiHandler.removeCallbacks(host.applyFiltersRunnable);
        host.uiHandler.postDelayed(host.applyFiltersRunnable, MainActivity.SEARCH_DEBOUNCE_MS);
    }

    void applyFiltersNow() {
        host.uiHandler.removeCallbacks(host.applyFiltersRunnable);
        applyFilters();
    }

    void applyFilters() {
        if (host.adapter == null) return;
        long startedAt = host.perfStart();
        String query = normalizedQuery();
        boolean homeMode = query.length() == 0;
        boolean filterChanged = host.filtersApplied && (homeMode != host.lastAppliedHomeMode || !query.equals(host.lastAppliedQuery));
        if (host.filtersApplied && homeMode == host.lastAppliedHomeMode && query.equals(host.lastAppliedQuery)) {
            updateFilterControls(homeMode, host.lastAppliedCount);
            return;
        }
        List<Recipe> filtered = homeMode
                ? host.repository.homeRecipes()
                : host.repository.searchSmart(query);
        if (!homeMode) rememberRecentSearch(query);
        host.adapter.setItems(filtered);
        if (filterChanged) resetListPosition();
        scheduleListPrewarm(filtered);
        host.filtersApplied = true;
        host.lastAppliedQuery = query;
        host.lastAppliedHomeMode = homeMode;
        host.lastAppliedCount = filtered.size();
        updateFilterControls(homeMode, filtered.size());
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog(homeMode ? "homeGrid" : "searchGrid", startedAt);
    }

    void updateFilterControls(boolean homeMode, int count) {
        if (host.counterView == null) return;
        if (catalogTitle != null) catalogTitle.setText(homeMode ? "Toutes les cat\u00E9gories" : "R\u00E9sultats");
        host.counterView.setText(homeMode
                ? countLabel(count, "cat\u00E9gorie", "cat\u00E9gories")
                : countLabel(count, "recette", "recettes"));
        if (host.searchToggle != null) host.searchToggle.setText(buildSearchToggleLabel());
        if (host.clearSearchButton != null) host.clearSearchButton.setEnabled(!homeMode);
    }

    void rememberListPosition(AbsListView view) {
        if (view == null || host.currentScreen != MainActivity.SCREEN_LIST) return;
        host.listFirstVisiblePosition = Math.max(0, view.getFirstVisiblePosition());
        View firstChild = view.getChildAt(0);
        host.listTopOffset = firstChild == null ? 0 : firstChild.getTop() - view.getPaddingTop();
    }

    void restoreListPosition(final GridView gridView) {
        if (gridView == null) return;
        if (host.listFirstVisiblePosition <= 0 && host.listTopOffset == 0) return;
        gridView.post(new Runnable() {
            @Override
            public void run() {
                gridView.setSelectionFromTop(Math.max(0, host.listFirstVisiblePosition), host.listTopOffset + gridView.getPaddingTop());
            }
        });
    }

    void resetListPosition() {
        host.listFirstVisiblePosition = 0;
        host.listTopOffset = 0;
        if (host.recipeGridView != null) host.recipeGridView.setSelection(0);
    }

    void handleListScrollStateChanged(AbsListView view, int scrollState) {
        host.listScrollState = scrollState;
        boolean allowPrefetch = scrollState != AbsListView.OnScrollListener.SCROLL_STATE_FLING;
        if (host.adapter != null) host.adapter.setPrefetchEnabled(allowPrefetch);
        if (!allowPrefetch) {
            cancelVisibleRangePrewarm();
            if (host.imageLoader != null) host.imageLoader.cancelPendingPrefetch();
            return;
        }
        if (view != null) {
            scheduleVisibleRangePrewarm(view, view.getFirstVisiblePosition(), view.getChildCount(), view.getCount());
        }
    }

    void scheduleListPrewarm(List<Recipe> recipes) {
        host.uiHandler.removeCallbacks(host.prewarmListRunnable);
        if (recipes == null || recipes.isEmpty() || host.imageLoader == null) {
            host.pendingListPrewarmRecipes = Collections.emptyList();
            return;
        }
        int limit = Math.min(recipes.size(), MainActivity.LIST_PREWARM_LIMIT);
        host.pendingListPrewarmRecipes = new ArrayList<Recipe>(recipes.subList(0, limit));
        host.uiHandler.postDelayed(host.prewarmListRunnable, MainActivity.LIST_PREWARM_DELAY_MS);
    }

    void runScheduledListPrewarm() {
        if (host.currentScreen != MainActivity.SCREEN_LIST || host.pendingListPrewarmRecipes.isEmpty()) return;
        List<Recipe> recipes = host.pendingListPrewarmRecipes;
        host.pendingListPrewarmRecipes = Collections.emptyList();
        prewarmListImages(recipes);
    }

    void cancelListPrewarm() {
        host.uiHandler.removeCallbacks(host.prewarmListRunnable);
        host.pendingListPrewarmRecipes = Collections.emptyList();
    }

    void scheduleVisibleRangePrewarm(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
        if (host.currentScreen != MainActivity.SCREEN_LIST || view == null || host.adapter == null || host.imageLoader == null) return;
        if (visibleItemCount <= 0 || totalItemCount <= 0) return;
        host.uiHandler.removeCallbacks(host.visibleRangePrewarmRunnable);
        host.uiHandler.postDelayed(host.visibleRangePrewarmRunnable, MainActivity.LIST_IDLE_PREWARM_DELAY_MS);
    }

    void runScheduledVisibleRangePrewarm() {
        if (host.currentScreen != MainActivity.SCREEN_LIST || host.recipeGridView == null || host.adapter == null || host.imageLoader == null) return;
        if (host.listScrollState == AbsListView.OnScrollListener.SCROLL_STATE_FLING) return;
        int first = Math.max(0, host.recipeGridView.getFirstVisiblePosition());
        int visible = Math.max(1, host.recipeGridView.getChildCount());
        int start = Math.min(host.adapter.getCount(), first + visible);
        int end = Math.min(host.adapter.getCount(), start + MainActivity.LIST_VISIBLE_PREFETCH_LIMIT);
        if (start >= end) return;
        int width = visibleCardWidth();
        int height = Math.max(dp(130), (width * 9) / 16);
        for (int index = start; index < end; index += 1) {
            host.imageLoader.prefetch(host.adapter.getItem(index).image, width, height);
        }
    }

    void cancelVisibleRangePrewarm() {
        host.uiHandler.removeCallbacks(host.visibleRangePrewarmRunnable);
    }

    int visibleCardWidth() {
        if (host.recipeGridView != null && host.recipeGridView.getColumnWidth() > 0) {
            return host.recipeGridView.getColumnWidth();
        }
        int minWidth = dp(286);
        int available = host.getResources().getDisplayMetrics().widthPixels - dp(20);
        return Math.max(minWidth, available);
    }

    void prewarmListImages(List<Recipe> recipes) {
        if (recipes == null || host.imageLoader == null) return;
        int width = Math.max(dp(286), host.getResources().getDisplayMetrics().widthPixels / 3);
        int height = Math.max(dp(130), (width * 9) / 16);
        int limit = Math.min(recipes.size(), MainActivity.LIST_PREWARM_LIMIT);
        boolean homeMode = isHomeMode();
        for (int index = 0; index < limit; index += 1) {
            Recipe recipe = recipes.get(index);
            host.imageLoader.prefetch(recipe.image, width, height);
            if (!homeMode && index == 0) host.imageLoader.prefetchDetail(recipe.detailImage, host.recipeScreen.detailImageRequestWidth(), host.recipeScreen.detailHeroHeight());
        }
    }
}
