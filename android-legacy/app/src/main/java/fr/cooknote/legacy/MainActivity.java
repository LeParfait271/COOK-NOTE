package fr.cooknote.legacy;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.Activity;
import android.os.Build;
import android.provider.Settings;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewAnimationUtils;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.view.animation.PathInterpolator;
import android.view.inputmethod.InputMethodManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.AbsListView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.GridView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.regex.Pattern;

import static fr.cooknote.legacy.Ingredients.*;
import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Texts.*;
import static fr.cooknote.legacy.Ui.*;

public class MainActivity extends Activity {
    final HomeScreen homeScreen = new HomeScreen(this);
    final RecipeScreen recipeScreen = new RecipeScreen(this);
    final ShoppingScreen shoppingScreen = new ShoppingScreen(this);
    static final String PREFS_NAME = "cook_note_legacy";
    static final String PREF_SHOPPING = "shopping";
    static final String PREF_SHOPPING_DONE = "shopping_done";
    static final String PREF_SHOPPING_FACTORS = "shopping_factors";
    static final String PREF_SHOPPING_OWNED = "shopping_owned";
    static final String PREF_SHOPPING_STAPLES = "shopping_staples";
    static final String PREF_INGREDIENT_DONE = "ingredient_done";
    static final String PREF_RECENT_SEARCHES = "recent_searches";
    static final String PREF_KEEP_SCREEN_ON = "keep_screen_on";
    static final String PREF_QUANTITY_FACTOR = "quantity_factor";
    static final String PREF_LAST_RECIPE = "last_recipe";
    static final String STATE_SCREEN = "screen";
    static final String STATE_RECIPE_ID = "recipe_id";
    static final String STATE_QUERY = "query";
    static final String STATE_SEARCH_OPEN = "search_open";
    static final String STATE_BACK_STACK = "back_stack";
    static final String STATE_LIST_FIRST = "list_first";
    static final String STATE_LIST_TOP = "list_top";
    static final int SCREEN_LIST = 0;
    static final int SCREEN_RECIPE = 1;
    static final int SCREEN_SHOPPING = 2;
    static final int DETAIL_IMAGE_MAX_WIDTH = 960;
    static final int BACK_SWIPE_EDGE_DP = 64;
    static final int BACK_SWIPE_TRIGGER_DP = 86;
    static final int SEARCH_DEBOUNCE_MS = 140;
    static final int LIST_PREWARM_DELAY_MS = 220;
    static final int LIST_IDLE_PREWARM_DELAY_MS = 120;
    static final int LIST_PREWARM_LIMIT = 8;
    static final int LIST_VISIBLE_PREFETCH_LIMIT = 6;
    static final int COLLECTION_PREWARM_LIMIT = 8;
    static final int MAX_BACK_STACK = 16;
    static final int TRIM_MEMORY_RUNNING_LOW_LEVEL = 10;
    static final int TRIM_MEMORY_MODERATE_LEVEL = 60;
    static final boolean PERF_LOG_ENABLED = false;
    static final float[] QUANTITY_FACTORS = new float[]{0.5f, 1f, 1.5f, 2f, 3f, 4f};
    static final int MIN_SERVINGS = 1;
    static final int DEFAULT_MAX_SERVING_CHOICES = 12;
    static final int HARD_MAX_SERVING_CHOICES = 24;
    static final Pattern SERVING_COUNT_PATTERN = Pattern.compile(
            "\\b(\\d+)\\s*(?:-|a|\\u00E0)?\\s*(\\d+)?\\s*(personnes?|portions?|pers\\.?|convives?|parts?)\\b",
            Pattern.CASE_INSENSITIVE
    );

    CookNoteRepository repository;
    ImageLoader imageLoader;
    RecipeAdapter adapter;
    GridView recipeGridView;
    LinearLayout searchPanel;
    LinearLayout recentChipsRow;
    Button searchToggle;
    Button clearSearchButton;
    TextView counterView;
    EditText searchBox;
    String currentQuery = "";
    boolean searchPanelOpen;
    boolean showingDetail;
    boolean keepScreenOn;
    float quantityFactor = 1f;
    int currentScreen = SCREEN_LIST;
    String currentRecipeId = "";
    String lastRecipeId = "";
    String lastAppliedQuery = null;
    boolean lastAppliedHomeMode;
    int lastAppliedCount;
    boolean filtersApplied;
    int listFirstVisiblePosition;
    int listTopOffset;
    int listScrollState = AbsListView.OnScrollListener.SCROLL_STATE_IDLE;
    float backSwipeStartX;
    float backSwipeStartY;
    boolean backSwipeCandidate;
    boolean backSwipeTriggered;
    final Handler uiHandler = new Handler(Looper.getMainLooper());
    final Runnable applyFiltersRunnable = new Runnable() {
        @Override
        public void run() {
            homeScreen.applyFilters();
        }
    };
    final Runnable prewarmListRunnable = new Runnable() {
        @Override
        public void run() {
            homeScreen.runScheduledListPrewarm();
        }
    };
    final Runnable visibleRangePrewarmRunnable = new Runnable() {
        @Override
        public void run() {
            homeScreen.runScheduledVisibleRangePrewarm();
        }
    };
    final Stack<NavState> detailBackStack = new Stack<NavState>();
    final Set<String> ingredientDoneKeys = new HashSet<String>();
    final ArrayList<String> recentSearches = new ArrayList<String>();
    ShoppingList shopping;
    final ShoppingList.IngredientSource ingredientSource = new ShoppingList.IngredientSource() {
        @Override
        public List<Recipe.Group> groups(Recipe recipe) {
            return recipeScreen.selectedIngredientGroups(recipe);
        }
    };
    List<Recipe> pendingListPrewarmRecipes = Collections.emptyList();
    final Map<String, Integer> inlineVariantSelections = new HashMap<String, Integer>();
    AppUpdater updater;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Ui.init(this);
        imageLoader = new ImageLoader(this);
        try {
            repository = CookNoteRepository.load(this);
            shopping = new ShoppingList(repository);
            loadUserState();
            applySystemChrome();
            restoreScreenState(savedInstanceState);
            applyKeepScreenOn();
            showCurrentScreen();
            updater = new AppUpdater(this, uiHandler, PREFS_NAME, repository.version);
            updater.checkForUpdatesAsync(false);
        } catch (Exception exception) {
            showNativeError("Cook Note Android 5 Lite", "Catalogue impossible a lire.\n\n" + exception.getMessage());
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putInt(STATE_SCREEN, currentScreen);
        outState.putString(STATE_RECIPE_ID, currentRecipeId);
        outState.putString(STATE_QUERY, currentQuery);
        outState.putBoolean(STATE_SEARCH_OPEN, searchPanelOpen);
        outState.putString(STATE_BACK_STACK, serializeBackStack());
        outState.putInt(STATE_LIST_FIRST, listFirstVisiblePosition);
        outState.putInt(STATE_LIST_TOP, listTopOffset);
        super.onSaveInstanceState(outState);
    }

    void restoreScreenState(Bundle state) {
        if (state == null) return;
        currentQuery = state.getString(STATE_QUERY, "");
        searchPanelOpen = state.getBoolean(STATE_SEARCH_OPEN, false);
        currentScreen = state.getInt(STATE_SCREEN, SCREEN_LIST);
        currentRecipeId = state.getString(STATE_RECIPE_ID, "");
        restoreBackStack(state.getString(STATE_BACK_STACK, ""));
        listFirstVisiblePosition = Math.max(0, state.getInt(STATE_LIST_FIRST, 0));
        listTopOffset = state.getInt(STATE_LIST_TOP, 0);
        if (currentScreen == SCREEN_RECIPE && repository.find(currentRecipeId) == null) {
            currentScreen = SCREEN_LIST;
            currentRecipeId = "";
        }
    }

    void showCurrentScreen() {
        if (currentScreen == SCREEN_RECIPE) {
            Recipe recipe = repository.find(currentRecipeId);
            if (recipe != null) {
                recipeScreen.openRecipe(recipe, false);
                return;
            }
        }
        if (currentScreen == SCREEN_SHOPPING) {
            shoppingScreen.showShoppingList(false);
            return;
        }
        homeScreen.showList();
    }

    String serializeBackStack() {
        StringBuilder builder = new StringBuilder();
        for (NavState state : detailBackStack) {
            if (builder.length() > 0) builder.append('\n');
            builder.append(state.screen).append('|').append(state.recipeId);
        }
        return builder.toString();
    }

    void restoreBackStack(String raw) {
        detailBackStack.clear();
        if (raw == null || raw.length() == 0) return;
        String[] rows = raw.split("\\n");
        for (String row : rows) {
            int separator = row.indexOf('|');
            if (separator <= 0) continue;
            int screen;
            try {
                screen = Integer.parseInt(row.substring(0, separator));
            } catch (Exception ignored) {
                continue;
            }
            String recipeId = row.substring(separator + 1);
            if (screen == SCREEN_RECIPE && repository.find(recipeId) == null) continue;
            if (screen == SCREEN_LIST) continue;
            detailBackStack.push(new NavState(screen, recipeId));
            trimBackStack();
        }
    }

    void addAccentLine(LinearLayout parent, int topMarginDp, int bottomMarginDp) {
        View line = new View(this);
        line.setBackground(gradientPanel(
                Color.argb(156, 251, 191, 36),
                Color.argb(10, 251, 191, 36),
                Color.TRANSPARENT,
                0,
                0
        ));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(1)
        );
        params.topMargin = dp(topMarginDp);
        params.bottomMargin = dp(bottomMarginDp);
        parent.addView(line, params);
    }

    void addFrameAccent(FrameLayout frame) {
        View topEdge = new View(this);
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

        View bottomEdge = new View(this);
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
    }

    void releaseListSurface() {
        homeScreen.cancelListPrewarm();
        homeScreen.cancelVisibleRangePrewarm();
        if (imageLoader != null) imageLoader.cancelPendingPrefetch();
        recipeGridView = null;
        adapter = null;
    }

    void releaseScreenImages() {
        if (imageLoader == null) return;
        // Avec le devoilement en cercle, l'ecran quitte reste visible pendant
        // l'animation : ses images sont liberees a la fin (finishScreenReveal).
        if (screenHost != null && screenRevealEnabled()) return;
        View content = getWindow().getDecorView().findViewById(android.R.id.content);
        releaseImagesInTree(content);
    }

    // ---------- Changement d'ecran : devoilement en cercle (comme le site) ----------
    // Le nouvel ecran se devoile en cercle depuis le dernier toucher (carte
    // ouverte) par-dessus l'ancien ; au retour, l'effet inverse : l'ecran quitte
    // se referme en cercle et laisse voir celui d'arrivee. Animation native
    // d'Android 5 (RenderThread) : aucun dessin supplementaire par image.
    static final int SCREEN_REVEAL_MS = 420;
    static final int SCREEN_REVEAL_TOUCH_MAX_AGE_MS = 1500;
    FrameLayout screenHost;
    View currentScreenView;
    String currentScreenIdentity = "";
    View leavingScreenView;
    Animator screenReveal;
    boolean navigatingBack;
    float lastTouchX = -1f;
    float lastTouchY = -1f;
    long lastTouchAt;

    boolean screenRevealEnabled() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && motionEnabled();
    }

    void showScreen(final View next) {
        if (screenHost == null) {
            screenHost = new FrameLayout(this);
            screenHost.setBackgroundColor(COLOR_BG);
            setContentView(screenHost);
        }
        finishScreenReveal();
        final View previous = currentScreenView;
        final boolean backward = navigatingBack;
        navigatingBack = false;
        currentScreenView = next;
        // Meme ecran reconstruit (coche, portions, quantites) : sans effet.
        String identity = currentScreen + "|" + currentRecipeId;
        boolean sameScreen = identity.equals(currentScreenIdentity);
        currentScreenIdentity = identity;
        FrameLayout.LayoutParams fill = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        if (previous == null || sameScreen || !screenRevealEnabled()) {
            screenHost.removeAllViews();
            if (previous != null) releaseImagesInTree(previous);
            screenHost.addView(next, fill);
            return;
        }
        leavingScreenView = previous;
        // Retour : l'ecran d'arrivee dessous, l'ecran quitte se referme dessus.
        if (backward) screenHost.addView(next, 0, fill);
        else screenHost.addView(next, fill);
        final View animated = backward ? previous : next;
        animated.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                animated.getViewTreeObserver().removeOnPreDrawListener(this);
                startScreenReveal(animated, backward);
                return true;
            }
        });
    }

    void startScreenReveal(final View animated, boolean backward) {
        if (leavingScreenView == null || animated.getWidth() == 0) {
            finishScreenReveal();
            return;
        }
        int width = screenHost.getWidth();
        int height = screenHost.getHeight();
        boolean recentTouch = lastTouchX >= 0 && System.currentTimeMillis() - lastTouchAt < SCREEN_REVEAL_TOUCH_MAX_AGE_MS;
        int x = recentTouch ? Math.round(lastTouchX) : width / 2;
        int y = recentTouch ? Math.round(lastTouchY) : (backward ? height / 2 : 0);
        float radius = (float) Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
        Animator reveal = ViewAnimationUtils.createCircularReveal(animated, x, y, backward ? radius : 0f, backward ? 0f : radius);
        reveal.setDuration(SCREEN_REVEAL_MS);
        reveal.setInterpolator(new PathInterpolator(0.65f, 0f, 0.35f, 1f));
        reveal.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                if (screenReveal == animation) finishScreenReveal();
            }
        });
        screenReveal = reveal;
        reveal.start();
    }

    // Fin (ou interruption) du devoilement : l'ecran quitte part et rend ses images.
    void finishScreenReveal() {
        Animator running = screenReveal;
        screenReveal = null;
        if (running != null) running.cancel();
        View leaving = leavingScreenView;
        leavingScreenView = null;
        if (leaving == null || screenHost == null) return;
        screenHost.removeView(leaving);
        releaseImagesInTree(leaving);
    }

    void releaseImagesInTree(View view) {
        if (view == null) return;
        if (view instanceof ImageView) {
            imageLoader.detach((ImageView) view);
            return;
        }
        if (!(view instanceof ViewGroup)) return;
        ViewGroup group = (ViewGroup) view;
        for (int index = 0; index < group.getChildCount(); index += 1) {
            releaseImagesInTree(group.getChildAt(index));
        }
    }

    LinearLayout addSection(LinearLayout content, String value) {
        return addSection(content, value, null);
    }

    LinearLayout addSection(LinearLayout content, String value, String meta) {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setPadding(dp(14), dp(13), dp(14), dp(14));
        section.setBackground(panel(COLOR_CARD, COLOR_BORDER_SOFT, 1, 10));

        // Titre editorial serif, sans barre d accent : une seule surface par section.
        LinearLayout titleRow = new LinearLayout(this);
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.CENTER_VERTICAL);

        TextView title = text(value, 18, COLOR_TEXT, false);
        title.setTypeface(Ui.DISPLAY);
        title.setIncludeFontPadding(false);
        titleRow.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        if (meta != null && meta.length() > 0) {
            TextView metaPill = text(meta, 11, COLOR_DIM, false);
            metaPill.setGravity(Gravity.CENTER);
            metaPill.setSingleLine(true);
            metaPill.setEllipsize(TextUtils.TruncateAt.END);
            metaPill.setPadding(dp(4), dp(2), 0, dp(2));
            LinearLayout.LayoutParams pillParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
            pillParams.leftMargin = dp(8);
            titleRow.addView(metaPill, pillParams);
        }
        section.addView(titleRow);

        View divider = new View(this);
        divider.setBackgroundColor(COLOR_LINE);
        LinearLayout.LayoutParams dividerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(1)
        );
        dividerParams.topMargin = dp(8);
        dividerParams.bottomMargin = dp(2);
        section.addView(divider, dividerParams);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(12);
        content.addView(section, params);
        return section;
    }

    void subTitle(LinearLayout content, String value) {
        if (content == null || value == null || value.length() == 0) return;
        TextView text = text(value, 12, COLOR_GOLD_SOFT, true);
        text.setLineSpacing(dp(1), 1.05f);
        text.setPadding(0, dp(12), 0, dp(2));
        content.addView(text);
    }

    // Listes de lecture : pas de boite par ligne, un simple repere dore et un
    // texte plus grand, comme les listes de la fiche web.
    void bulletRow(LinearLayout content, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.TOP);
        row.setPadding(0, dp(3), 0, dp(3));

        View marker = new View(this);
        marker.setBackground(panel(COLOR_GOLD_SOFT, COLOR_GOLD_SOFT, 1, 3));
        LinearLayout.LayoutParams markerParams = new LinearLayout.LayoutParams(dp(5), dp(5));
        markerParams.topMargin = dp(9);
        markerParams.rightMargin = dp(10);
        row.addView(marker, markerParams);

        TextView text = text(value, 14, COLOR_TEXT, false);
        text.setLineSpacing(dp(2), 1.16f);
        row.addView(text, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(3);
        content.addView(row, rowParams);
    }

    void stepRow(LinearLayout content, int number, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.TOP);
        // Sans ca, le texte s'aligne sur la ligne de base du numero et sa derniere ligne est rognee.
        row.setBaselineAligned(false);
        row.setPadding(0, dp(8), 0, dp(10));

        TextView index = text(String.valueOf(number), 16, COLOR_GOLD, false);
        index.setTypeface(Ui.DISPLAY);
        index.setGravity(Gravity.CENTER);
        index.setBackground(panel(Color.TRANSPARENT, COLOR_BORDER, 1, 16));
        row.addView(index, new LinearLayout.LayoutParams(dp(30), dp(30)));

        TextView body = text(value, 15, COLOR_TEXT, false);
        body.setTypeface(Ui.READING);
        body.setLineSpacing(dp(3), 1.18f);
        LinearLayout.LayoutParams bodyParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        bodyParams.leftMargin = dp(12);
        bodyParams.topMargin = dp(3);
        row.addView(body, bodyParams);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(2);
        content.addView(row, rowParams);

        View separator = new View(this);
        separator.setBackgroundColor(Color.argb(60, 214, 158, 64));
        LinearLayout.LayoutParams separatorParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 1);
        separatorParams.leftMargin = dp(42);
        content.addView(separator, separatorParams);
    }

    void labelValue(LinearLayout content, String label, String value) {
        LinearLayout block = new LinearLayout(this);
        block.setOrientation(LinearLayout.VERTICAL);
        block.setPadding(0, dp(4), 0, dp(4));
        if (label != null && label.length() > 0) {
            TextView labelView = text(label, 11, COLOR_GOLD_SOFT, true);
            labelView.setPadding(0, 0, 0, dp(2));
            block.addView(labelView);
        }
        TextView valueView = text(value, 14, COLOR_TEXT, false);
        valueView.setLineSpacing(dp(2), 1.14f);
        block.addView(valueView);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(8);
        content.addView(block, params);
    }

    void body(LinearLayout content, String value) {
        body(content, value, COLOR_TEXT);
    }

    void body(LinearLayout content, String value, int color) {
        TextView text = text(value, 15, color, false);
        text.setLineSpacing(dp(2), 1.16f);
        text.setPadding(0, dp(7), 0, dp(3));
        content.addView(text);
    }

    Button sectionButton(String value) {
        return sectionButton(value, true);
    }

    Button sectionButton(String value, boolean primary) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(primary ? COLOR_TEXT_DARK : COLOR_TEXT);
        button.setTextSize(adjustedTextSize(12));
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setPadding(dp(8), 0, dp(8), 0);
        button.setBackground(buttonPanel(primary));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(40)
        );
        params.topMargin = dp(10);
        params.bottomMargin = dp(2);
        button.setLayoutParams(params);
        return button;
    }

    Spinner createSpinner(final List<String> labels) {
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

    void styleSpinnerText(TextView view, boolean dropdown) {
        view.setTextColor(COLOR_TEXT);
        view.setTextSize(adjustedTextSize(14));
        view.setTypeface(Typeface.DEFAULT_BOLD);
        view.setSingleLine(!dropdown);
        view.setMaxLines(dropdown ? 2 : 1);
        view.setEllipsize(TextUtils.TruncateAt.END);
        view.setPadding(dp(12), dp(8), dp(12), dp(8));
        view.setBackgroundColor(dropdown ? COLOR_CARD_SOFT : Color.TRANSPARENT);
    }

    LinearLayout.LayoutParams fullWidthParams(int topMargin, int height) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                height
        );
        params.topMargin = topMargin;
        return params;
    }

    Button actionButton(String value, boolean primary) {
        Button button = new Button(this);
        button.setText(value);
        button.setTextColor(primary ? COLOR_TEXT_DARK : COLOR_TEXT);
        button.setTextSize(adjustedTextSize(11));
        button.setSingleLine(true);
        button.setEllipsize(TextUtils.TruncateAt.END);
        button.setTypeface(Typeface.DEFAULT_BOLD);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinimumHeight(0);
        button.setPadding(dp(10), 0, dp(10), 0);
        button.setBackground(buttonPanel(primary));
        button.setStateListAnimator(null);
        button.setFocusable(false);
        button.setFocusableInTouchMode(false);
        return button;
    }

    TextView text(String value, int sp, int color, boolean bold) {
        TextView text = new TextView(this);
        text.setText(value);
        text.setTextSize(adjustedTextSize(sp));
        text.setTextColor(color);
        text.setIncludeFontPadding(true);
        if (bold) text.setTypeface(Typeface.DEFAULT_BOLD);
        return text;
    }

    int adjustedTextSize(int sp) {
        return sp;
    }

    String shoppingText() {
        return shoppingText(false, true);
    }

    String shoppingText(boolean todoOnly, boolean includeChecks) {
        return shopping.buildText(ingredientSource, quantityFactor, todoOnly, includeChecks);
    }

    String scaleIngredient(String item) {
        return scale(item, quantityFactor);
    }

    static final class NavState {
        final int screen;
        final String recipeId;

        NavState(int screen, String recipeId) {
            this.screen = screen;
            this.recipeId = recipeId == null ? "" : recipeId;
        }
    }

    void loadUserState() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        shopping.clear();
        shopping.stapleKeys.clear();
        keepScreenOn = prefs.getBoolean(PREF_KEEP_SCREEN_ON, false);
        quantityFactor = clampQuantityFactor(prefs.getFloat(PREF_QUANTITY_FACTOR, 1f));
        lastRecipeId = prefs.getString(PREF_LAST_RECIPE, "");
        parseIds(prefs.getString(PREF_SHOPPING, ""), shopping.recipeIds, 0);
        parseRawIds(prefs.getString(PREF_SHOPPING_DONE, ""), shopping.doneKeys);
        shopping.parseFactors(prefs.getString(PREF_SHOPPING_FACTORS, ""));
        parseRawIds(prefs.getString(PREF_SHOPPING_OWNED, ""), shopping.ownedKeys);
        parseRawIds(prefs.getString(PREF_SHOPPING_STAPLES, ""), shopping.stapleKeys);
        parseRawIds(prefs.getString(PREF_INGREDIENT_DONE, ""), ingredientDoneKeys);
        parseRecentSearches(prefs.getString(PREF_RECENT_SEARCHES, ""), recentSearches);
    }

    void saveUserState() {
        SharedPreferences.Editor editor = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
        editor.putString(PREF_SHOPPING, joinIds(shopping.recipeIds));
        editor.putString(PREF_SHOPPING_DONE, joinIds(new ArrayList<String>(shopping.doneKeys)));
        editor.putString(PREF_SHOPPING_FACTORS, shopping.serializeFactors());
        editor.putString(PREF_SHOPPING_OWNED, joinIds(new ArrayList<String>(shopping.ownedKeys)));
        editor.putString(PREF_SHOPPING_STAPLES, joinIds(new ArrayList<String>(shopping.stapleKeys)));
        editor.putString(PREF_INGREDIENT_DONE, joinIds(new ArrayList<String>(ingredientDoneKeys)));
        editor.putString(PREF_RECENT_SEARCHES, joinIds(recentSearches));
        editor.putBoolean(PREF_KEEP_SCREEN_ON, keepScreenOn);
        editor.putFloat(PREF_QUANTITY_FACTOR, quantityFactor);
        editor.putString(PREF_LAST_RECIPE, lastRecipeId == null ? "" : lastRecipeId);
        editor.apply();
    }

    void applySystemChrome() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) return;
        getWindow().setStatusBarColor(Color.rgb(5, 6, 8));
        getWindow().setNavigationBarColor(Color.rgb(5, 6, 8));
    }

    float clampQuantityFactor(float value) {
        if (Float.isNaN(value) || Float.isInfinite(value)) return 1f;
        if (value < 0.25f) return 0.25f;
        return Math.min(value, 6f);
    }

    void parseIds(String raw, List<String> output, int limit) {
        if (raw == null || raw.length() == 0) return;
        String[] ids = raw.split("\\n");
        for (String id : ids) {
            if (id.length() == 0 || repository.find(id) == null || output.contains(id)) continue;
            output.add(id);
            if (limit > 0 && output.size() >= limit) return;
        }
    }

    void parseRawIds(String raw, Set<String> output) {
        if (raw == null || raw.length() == 0) return;
        String[] ids = raw.split("\\n");
        for (String id : ids) {
            if (id.length() > 0) output.add(id);
        }
    }

    void parseRecentSearches(String raw, List<String> output) {
        if (raw == null || raw.length() == 0) return;
        output.clear();
        String[] ids = raw.split("\\n");
        for (String id : ids) {
            if (id.length() >= 2 && !output.contains(id)) output.add(id);
        }
        while (output.size() > 6) output.remove(output.size() - 1);
    }

    static String joinIds(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        for (String id : ids) {
            if (id == null || id.length() == 0) continue;
            if (builder.length() > 0) builder.append('\n');
            builder.append(id);
        }
        return builder.toString();
    }

    boolean isInShopping(String id) {
        return shopping.recipeIds.contains(id);
    }

    void toggleShopping(Recipe recipe) {
        if (shopping.recipeIds.contains(recipe.id)) {
            shopping.recipeIds.remove(recipe.id);
            shopping.removeDoneForRecipe(recipe.id);
            Toast.makeText(this, "Retire des courses", Toast.LENGTH_SHORT).show();
        } else {
            shopping.recipeIds.add(recipe.id);
            // Les courses gardent les portions choisies sur la fiche ;
            // modifiables ensuite recette par recette dans la liste.
            shopping.factors.put(recipe.id, quantityFactor);
            Toast.makeText(this, "Ajoute aux courses", Toast.LENGTH_SHORT).show();
        }
        saveUserState();
        refreshShoppingButton();
    }

    void removeShopping(String id) {
        shopping.recipeIds.remove(id);
        shopping.removeDoneForRecipe(id);
        saveUserState();
        refreshShoppingButton();
    }

    void clearShoppingList() {
        shopping.clear();
        saveUserState();
        refreshShoppingButton();
        shoppingScreen.showShoppingList();
    }

    void refreshShoppingButton() {
        if (shoppingBadge == null) return;
        int count = shopping.recipeIds.size();
        shoppingBadge.setText(String.valueOf(count));
        shoppingBadge.setVisibility(count > 0 ? View.VISIBLE : View.GONE);
    }

    // ---------- Barre du haut, comme le site ----------
    // Gauche : accueil (ou retour sur une fiche). Centre : titre de l'ecran.
    // Droite : recherche, panier (pastille du nombre de recettes), mise a jour.
    TextView shoppingBadge;

    void addTopBar(LinearLayout root, final boolean detail, String title) {
        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setPadding(dp(14), dp(8), dp(14), dp(8));
        bar.setBackgroundColor(COLOR_PANEL_DEEP);
        root.addView(bar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        View hairline = new View(this);
        hairline.setBackgroundColor(Color.argb(64, 214, 158, 64));
        root.addView(hairline, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(1)));

        bar.addView(iconButton(detail ? R.drawable.ic_back : R.drawable.ic_home, detail ? "Retour" : "Accueil", !detail, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (detail) {
                    goBack();
                } else {
                    homeScreen.setSearchPanelOpen(false);
                    homeScreen.clearSearch();
                    if (recipeGridView != null) recipeGridView.smoothScrollToPosition(0);
                }
            }
        }), new LinearLayout.LayoutParams(dp(40), dp(40)));

        TextView titleView = text(title == null ? "" : title, 16, COLOR_TEXT, false);
        titleView.setTypeface(Ui.DISPLAY);
        titleView.setGravity(Gravity.CENTER);
        titleView.setSingleLine(true);
        titleView.setEllipsize(TextUtils.TruncateAt.END);
        titleView.setPadding(dp(10), 0, dp(10), 0);
        bar.addView(titleView, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        bar.addView(iconButton(R.drawable.ic_search, "Rechercher", false, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (currentScreen == SCREEN_LIST) {
                    homeScreen.setSearchPanelOpen(!searchPanelOpen);
                    return;
                }
                // Depuis une fiche : retour a l'accueil, recherche ouverte.
                searchPanelOpen = true;
                navigatingBack = true;
                detailBackStack.clear();
                homeScreen.showList();
            }
        }), topBarIconParams());

        FrameLayout basket = iconButton(R.drawable.ic_basket, "Liste de courses", currentScreen == SCREEN_SHOPPING, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (currentScreen == SCREEN_SHOPPING) return;
                hideKeyboard();
                homeScreen.setSearchPanelOpen(false);
                shoppingScreen.showShoppingList(true);
            }
        });
        shoppingBadge = text("", 10, COLOR_TEXT_DARK, true);
        shoppingBadge.setGravity(Gravity.CENTER);
        shoppingBadge.setIncludeFontPadding(false);
        shoppingBadge.setPadding(dp(4), 0, dp(4), 0);
        shoppingBadge.setMinWidth(dp(18));
        shoppingBadge.setBackground(panel(COLOR_GOLD, COLOR_GOLD, 1, 9));
        basket.setClipChildren(false);
        basket.addView(shoppingBadge, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(18), Gravity.TOP | Gravity.RIGHT));
        bar.addView(basket, topBarIconParams());
        refreshShoppingButton();

        if (!detail) {
            bar.addView(iconButton(R.drawable.ic_update, "Mise a jour", false, new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    updater.checkForUpdatesAsync(true);
                }
            }), topBarIconParams());
        }
    }

    LinearLayout.LayoutParams topBarIconParams() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(dp(40), dp(40));
        params.leftMargin = dp(8);
        return params;
    }

    // Bouton carre a icone : contour clair discret, fond dore quand actif.
    FrameLayout iconButton(int icon, String label, boolean active, View.OnClickListener listener) {
        FrameLayout button = new FrameLayout(this);
        button.setBackground(selectablePanel(
                active ? Color.argb(64, 214, 158, 64) : Color.argb(20, 255, 255, 255),
                Color.argb(80, 214, 158, 64),
                active ? Color.argb(150, 214, 158, 64) : Color.argb(86, 255, 255, 255),
                1,
                9
        ));
        button.setClickable(true);
        button.setContentDescription(label);
        button.setOnClickListener(listener);
        ImageView image = new ImageView(this);
        image.setImageResource(icon);
        image.setScaleType(ImageView.ScaleType.FIT_CENTER);
        button.addView(image, new FrameLayout.LayoutParams(dp(20), dp(20), Gravity.CENTER));
        return button;
    }

    void setKeepScreenOn(boolean enabled) {
        keepScreenOn = enabled;
        applyKeepScreenOn();
        saveUserState();
        Toast.makeText(this, enabled ? "\u00C9cran gard\u00E9 actif" : "Veille automatique", Toast.LENGTH_SHORT).show();
    }

    void applyKeepScreenOn() {
        if (keepScreenOn) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } else {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

    void goBack() {
        navigatingBack = true;
        while (!detailBackStack.empty()) {
            NavState previous = detailBackStack.pop();
            if (previous.screen == SCREEN_RECIPE) {
                Recipe recipe = repository.find(previous.recipeId);
                if (recipe != null) {
                    recipeScreen.openRecipe(recipe, false);
                    return;
                }
            } else if (previous.screen == SCREEN_SHOPPING) {
                shoppingScreen.showShoppingList(false);
                return;
            }
        }
        homeScreen.showList();
    }

    void pushNavigationState() {
        if (currentScreen == SCREEN_RECIPE && currentRecipeId.length() > 0) {
            detailBackStack.push(new NavState(SCREEN_RECIPE, currentRecipeId));
        } else if (currentScreen == SCREEN_SHOPPING) {
            detailBackStack.push(new NavState(SCREEN_SHOPPING, ""));
        }
        trimBackStack();
    }

    void trimBackStack() {
        while (detailBackStack.size() > MAX_BACK_STACK) {
            detailBackStack.remove(0);
        }
    }

    long perfStart() {
        return PERF_LOG_ENABLED ? System.currentTimeMillis() : 0L;
    }

    void perfLog(String label, long startedAt) {
        if (!PERF_LOG_ENABLED) return;
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        if (event.getActionMasked() == MotionEvent.ACTION_DOWN) {
            lastTouchX = event.getX();
            lastTouchY = event.getY();
            lastTouchAt = System.currentTimeMillis();
        }
        if (handleBackSwipe(event)) return true;
        return super.dispatchTouchEvent(event);
    }

    boolean handleBackSwipe(MotionEvent event) {
        int action = event.getActionMasked();
        if (action == MotionEvent.ACTION_DOWN) {
            backSwipeStartX = event.getX();
            backSwipeStartY = event.getY();
            backSwipeCandidate = showingDetail && backSwipeStartX <= dp(BACK_SWIPE_EDGE_DP);
            backSwipeTriggered = false;
            return false;
        }

        if (!backSwipeCandidate && !backSwipeTriggered) return false;

        if (action == MotionEvent.ACTION_MOVE) {
            float deltaX = event.getX() - backSwipeStartX;
            float deltaY = Math.abs(event.getY() - backSwipeStartY);
            if (deltaY > dp(36) && deltaY > Math.abs(deltaX)) {
                backSwipeCandidate = false;
                return false;
            }
            if (deltaX > dp(BACK_SWIPE_TRIGGER_DP) && deltaX > deltaY * 1.55f) {
                backSwipeCandidate = false;
                backSwipeTriggered = true;
                hideKeyboard();
                goBack();
                return true;
            }
        }

        if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL) {
            boolean consumed = backSwipeTriggered;
            backSwipeCandidate = false;
            backSwipeTriggered = false;
            return consumed;
        }

        return backSwipeTriggered;
    }

    @SuppressWarnings("deprecation")
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
        uiHandler.removeCallbacks(applyFiltersRunnable);
        homeScreen.cancelListPrewarm();
        if (updater != null) updater.release();
        if (imageLoader != null) imageLoader.shutdown();
        super.onDestroy();
    }

    @Override
    protected void onStop() {
        if (imageLoader != null) imageLoader.trimMemory(false);
        super.onStop();
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (imageLoader == null) return;
        if (level >= TRIM_MEMORY_RUNNING_LOW_LEVEL) {
            imageLoader.trimMemory(level >= TRIM_MEMORY_MODERATE_LEVEL);
        }
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (imageLoader != null) imageLoader.trimMemory(true);
    }

    void hideKeyboard() {
        try {
            InputMethodManager manager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            View focus = getCurrentFocus();
            if (manager != null && focus != null) manager.hideSoftInputFromWindow(focus.getWindowToken(), 0);
        } catch (Exception ignored) {
            // Keep navigation responsive even if the keyboard service is unavailable.
        }
    }

    void showKeyboard() {
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

    void showNativeError(String title, String detail) {
        releaseScreenImages();
        TextView errorView = text(title + "\n\n" + detail, 18, COLOR_GOLD, true);
        errorView.setBackgroundColor(COLOR_BG);
        errorView.setPadding(dp(24), dp(36), dp(24), dp(24));
        finishScreenReveal();
        screenHost = null;
        currentScreenView = null;
        setContentView(errorView, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
    }

    boolean motionEnabled() {
        try {
            float scale = android.provider.Settings.Global.getFloat(
                    getContentResolver(),
                    android.provider.Settings.Global.ANIMATOR_DURATION_SCALE, 1f);
            return scale > 0.0f;
        } catch (Exception ignored) {
            return true;
        }
    }

    void animateIn(View view, int delayMs) {
        if (view == null) return;
        if (!motionEnabled()) {
            view.setAlpha(1f);
            view.setTranslationY(0f);
            return;
        }
        view.setAlpha(0f);
        view.setTranslationY(dp(10));
        view.animate()
                .alpha(1f)
                .translationY(0f)
                .setStartDelay(delayMs)
                .setDuration(220)
                .setInterpolator(new android.view.animation.PathInterpolator(0.22f, 0.72f, 0.2f, 1f))
                .start();
    }
}
