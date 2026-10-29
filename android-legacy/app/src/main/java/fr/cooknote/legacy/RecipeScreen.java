package fr.cooknote.legacy;

import android.graphics.Color;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;


import static fr.cooknote.legacy.Ingredients.*;
import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Texts.*;
import static fr.cooknote.legacy.Ui.*;

/** Ecran fiche recette : hero, infos rapides, quantites, variantes, ingredients, etapes et Avant de commencer. */
final class RecipeScreen {
    private final MainActivity host;

    RecipeScreen(MainActivity host) {
        this.host = host;
    }

    void openRecipe(Recipe recipe, boolean pushCurrent) {
        long startedAt = host.perfStart();
        if (pushCurrent) host.pushNavigationState();
        host.releaseScreenImages();
        host.currentScreen = MainActivity.SCREEN_RECIPE;
        host.currentRecipeId = recipe.id;
        host.lastRecipeId = recipe.id;
        host.showingDetail = true;
        host.releaseListSurface();
        host.applyKeepScreenOn();
        host.saveUserState();
        host.imageLoader.prefetchDetail(recipe.isCollection() ? "home-hero.png" : recipe.detailImage, detailImageRequestWidth(), detailHeroHeight());

        LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        host.addTopBar(root, true, recipe.title);

        ScrollView scroll = new ScrollView(host);
        scroll.setFillViewport(false);
        scroll.setSmoothScrollingEnabled(true);
        scroll.setOverScrollMode(View.OVER_SCROLL_NEVER);
        scroll.setVerticalScrollBarEnabled(false);
        scroll.setFadingEdgeLength(0);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(12), dp(12), dp(12), dp(24));
        // Le bandeau deborde dans la marge (pleine largeur) : pas de rognage.
        content.setClipToPadding(false);
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        addDetailHero(content, recipe);
        if (!recipe.isCollection()) addHeroActions(content, recipe);
        // Categorie : le nombre de recettes est deja dans le bandeau.
        if (!recipe.isCollection()) addQuickFacts(content, recipe);

        // Le reste (reglages, ingredients, etapes, cartes) arrive apres le
        // devoilement, en fondu : le cercle demarre aussitot le toucher.
        final LinearLayout deferred = new LinearLayout(host);
        deferred.setOrientation(LinearLayout.VERTICAL);
        content.addView(deferred, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        final View screen = root;
        host.showScreen(root);
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog("openRecipe:" + recipe.id, startedAt);
        host.runAfterScreenReveal(new Runnable() {
            @Override
            public void run() {
                if (host.currentScreenView != screen) return;
                long fillStartedAt = host.perfStart();
                boolean animate = host.motionEnabled() && host.screenRevealEnabled() && host.leavingScreenView == null && deferred.isAttachedToWindow() && deferred.getWidth() > 0;
                if (recipe.isCollection()) {
                    addCollectionCards(deferred, recipe);
                } else {
                    addQuantityControls(deferred, recipe);
                    if (recipe.variantGroups) addInlineVariantPicker(deferred, recipe);
                    addRecipeContentGrid(deferred, recipe);
                }
                if (animate) {
                    deferred.setAlpha(0f);
                    deferred.animate().alpha(1f).setDuration(180).start();
                }
                if (MainActivity.PERF_LOG_ENABLED) host.perfLog("fillRecipe:" + recipe.id, fillStartedAt);
            }
        });
    }

    void addDetailHero(LinearLayout content, final Recipe recipe) {
        // Bandeau pleine largeur, colle a la barre, comme le site (plus de carte
        // encadree dans la marge).
        FrameLayout heroCard = new FrameLayout(host);
        heroCard.setBackgroundColor(COLOR_CARD);
        int heroHeight = detailHeroHeight();
        LinearLayout.LayoutParams heroParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                heroHeight
        );
        heroParams.leftMargin = -content.getPaddingLeft();
        heroParams.rightMargin = -content.getPaddingRight();
        heroParams.topMargin = -content.getPaddingTop();
        content.addView(heroCard, heroParams);

        ImageView hero = new ImageView(host);
        hero.setScaleType(ImageView.ScaleType.CENTER_CROP);
        hero.setBackgroundColor(COLOR_CARD);
        hero.setContentDescription("Image de " + recipe.title);
        heroCard.addView(hero, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        // Fiche maitre (collection) : l'illustration de l'accueil, plus sobre,
        // comme sur le site ; l'art de categorie reste sur la carte de l'accueil.
        String heroImage = recipe.isCollection() ? "home-hero.png" : recipe.detailImage;
        host.imageLoader.loadDetail(heroImage, hero, detailImageRequestWidth(), heroHeight);

        View veil = new View(host);
        veil.setBackgroundColor(Color.argb(recipe.isCollection() ? 96 : 66, 0, 0, 0));
        heroCard.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // Filet dore en bas du bandeau, comme le site.
        View heroRule = new View(host);
        heroRule.setBackgroundColor(Color.argb(150, 214, 158, 64));
        heroCard.addView(heroRule, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(1), Gravity.BOTTOM));

        // Categorie : titre centre (comme le site) ; fiche : titre en bas a gauche.
        LinearLayout overlay = new LinearLayout(host);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(16), dp(10), dp(16), dp(14));
        overlay.setGravity(recipe.isCollection() ? Gravity.CENTER : Gravity.START);
        if (!recipe.isCollection()) overlay.setBackground(bottomOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                recipe.isCollection() ? ViewGroup.LayoutParams.MATCH_PARENT : ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        heroCard.addView(overlay, overlayParams);

        host.animateIn(heroCard, 0);

        TextView breadcrumb = host.text(detailBreadcrumb(recipe), 10, COLOR_MUTED, true);
        breadcrumb.setSingleLine(true);
        breadcrumb.setEllipsize(TextUtils.TruncateAt.END);
        if (recipe.isCollection()) breadcrumb.setGravity(Gravity.CENTER);
        overlay.addView(breadcrumb);

        TextView title = host.text(recipe.title, recipe.isCollection() ? 32 : 26, COLOR_TEXT, false);
        title.setTypeface(Ui.DISPLAY);
        if (recipe.isCollection()) title.setGravity(Gravity.CENTER);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setLineSpacing(dp(1), 1.03f);
        title.setShadowLayer(3f, 0, dp(1), Color.BLACK);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        titleParams.topMargin = dp(3);
        overlay.addView(title, titleParams);

        String meta = detailMetaLine(recipe);
        TextView metaView = host.text(meta, 11, COLOR_MUTED, true);
        metaView.setSingleLine(false);
        metaView.setPadding(0, dp(2), 0, 0);
        if (recipe.isCollection()) {
            // « 58 recettes » en pastille, comme le site.
            metaView.setPadding(dp(10), dp(3), dp(10), dp(4));
            metaView.setBackground(panel(Color.argb(120, 0, 0, 0), Color.argb(90, 255, 255, 255), 1, 12));
            LinearLayout.LayoutParams metaParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            metaParams.topMargin = dp(6);
            overlay.addView(metaView, metaParams);
            return;
        }
        overlay.addView(metaView);

    }

    String detailBreadcrumb(Recipe recipe) {
        StringBuilder builder = new StringBuilder("Cook Note");
        List<Recipe> trail = host.repository.parentTrail(recipe);
        for (Recipe parent : trail) {
            if (sameText(parent.title, recipe.primaryCategory())) continue;
            if (sameText(parent.title, recipe.title)) continue;
            builder.append(" / ").append(parent.title);
        }
        if (builder.length() == "Cook Note".length()) builder.append(" / ").append(recipe.isCollection() ? recipe.title : "Fiche");
        return builder.toString();
    }

    String detailMetaLine(Recipe recipe) {
        if (recipe.isCollection()) return countLabel(host.repository.collectionCount(recipe), "recette", "recettes");

        ArrayList<String> parts = new ArrayList<String>();
        String serving = servingSummary(recipe);
        if (serving.length() > 0) parts.add(serving);
        int totalTime = recipe.activeTime + recipe.cookTime;
        if (totalTime > 0) parts.add(formatMinutes(totalTime));
        int ingredientCount = countSelectedIngredients(recipe);
        if (ingredientCount > 0) parts.add(countLabel(ingredientCount, "ingr\u00E9dient", "ingr\u00E9dients"));
        return joinMetaParts(parts, "Fiche Cook Note");
    }

    int detailHeroHeight() {
        // Pleine largeur, comme le site : un peu plus haut qu'en carte.
        int width = host.getResources().getDisplayMetrics().widthPixels;
        int height = Math.max(dp(170), (width * 9) / 26);
        return Math.min(dp(280), height);
    }

    int detailImageRequestWidth() {
        int width = host.getResources().getDisplayMetrics().widthPixels - dp(28);
        return Math.max(dp(360), Math.min(width, MainActivity.DETAIL_IMAGE_MAX_WIDTH));
    }

    void addHeroActions(LinearLayout content, final Recipe recipe) {
        // Une seule rangee de boutons, sans cadre : comme les actions du site.
        ArrayList<Button> buttons = new ArrayList<Button>();

        Button shopping = host.actionButton(host.isInShopping(recipe.id) ? "Dans courses" : "+ Courses", false);
        shopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.toggleShopping(recipe);
                openRecipe(recipe, false);
            }
        });
        buttons.add(shopping);

        // Mode mains libres : une etape a la fois, a la voix (comme le site).
        if (!selectedRecipeSteps(recipe).isEmpty()) {
            // Mains libres en bouton principal (dore), comme sur le site.
            Button cook = host.actionButton("Mains libres", true);
            cook.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    openCookMode(recipe, 0, true);
                }
            });
            buttons.add(cook);
        }

        final boolean favorite = host.isFavorite(recipe.id);
        Button favoriteButton = host.actionButton(favorite ? "En favori" : "Favori", false);
        setButtonIcon(favoriteButton, favorite ? R.drawable.ic_heart_filled : R.drawable.ic_heart);
        if (favorite) favoriteButton.setTextColor(COLOR_GOLD);
        favoriteButton.setContentDescription(favorite ? "Retirer des favoris" : "Ajouter aux favoris");
        favoriteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.toggleFavorite(recipe);
                openRecipe(recipe, false);
            }
        });
        buttons.add(favoriteButton);

        Button copy = host.actionButton("Copier", false);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyRecipe(recipe);
            }
        });
        buttons.add(copy);

        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(14);
        content.addView(row, rowParams);
        for (int index = 0; index < buttons.size(); index += 1) {
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(38), 1);
            if (index < buttons.size() - 1) params.rightMargin = dp(8);
            row.addView(buttons.get(index), params);
        }
    }

    // Icone 18dp a gauche du libelle, l'ensemble centre dans le bouton.
    void setButtonIcon(final Button button, int icon) {
        final android.graphics.drawable.Drawable drawable = host.getResources().getDrawable(icon);
        if (drawable == null) return;
        drawable.setBounds(0, 0, dp(18), dp(18));
        button.setCompoundDrawables(drawable, null, null, null);
        button.setCompoundDrawablePadding(dp(6));
        button.addOnLayoutChangeListener(new View.OnLayoutChangeListener() {
            @Override
            public void onLayoutChange(View view, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
                int textWidth = (int) button.getPaint().measureText(button.getText().toString());
                int side = Math.max(dp(8), (right - left - textWidth - dp(24)) / 2);
                if (button.getPaddingLeft() != side) button.setPadding(side, button.getPaddingTop(), side, button.getPaddingBottom());
            }
        });
    }

    // ---------- Favoris ----------
    void openFavorites(boolean pushCurrent) {
        if (pushCurrent) host.pushNavigationState();
        host.releaseScreenImages();
        host.currentScreen = MainActivity.SCREEN_FAVORITES;
        host.currentRecipeId = "";
        host.showingDetail = true;
        host.releaseListSurface();
        host.applyKeepScreenOn();

        LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);
        host.addTopBar(root, true, "Favoris");

        ScrollView scroll = new ScrollView(host);
        scroll.setOverScrollMode(View.OVER_SCROLL_NEVER);
        scroll.setVerticalScrollBarEnabled(false);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(12), dp(12), dp(12), dp(24));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        List<VariantChoice> choices = new ArrayList<VariantChoice>();
        for (String id : host.favorites) {
            Recipe recipe = host.repository.find(id);
            if (recipe != null) choices.add(new VariantChoice(recipe.title, recipe));
        }
        LinearLayout section = host.addSection(content, "Mes favoris", countLabel(choices.size(), "fiche", "fiches"));
        if (choices.isEmpty()) {
            host.body(section, "Aucun favori pour l’instant. Sur une fiche, touche « Favori » pour la retrouver ici.");
        } else {
            int columns = collectionGridColumns();
            int cardHeight = collectionCardHeight(columns);
            int cardImageWidth = collectionCardImageWidth(columns);
            prewarmCollectionImages(choices, cardImageWidth, cardHeight);
            LinearLayout row = null;
            for (int index = 0; index < choices.size(); index += 1) {
                if (index % columns == 0) {
                    row = new LinearLayout(host);
                    row.setOrientation(LinearLayout.HORIZONTAL);
                    LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                    rowParams.topMargin = dp(10);
                    section.addView(row, rowParams);
                }
                addCollectionCard(row, null, choices.get(index), cardHeight, cardImageWidth, index % columns < columns - 1);
            }
            int missing = choices.size() % columns;
            if (row != null && missing > 0) {
                for (int index = missing; index < columns; index += 1) addCollectionSpacer(row, cardHeight, index < columns - 1);
            }
        }
        host.showScreen(root);
    }

    // ---------- Mode mains libres ----------
    // Une etape a la fois en grand, precedente / suivante, ecran garde allume ;
    // le retour ramene a la fiche. Pilotable a la voix des l'ouverture (micro
    // allume d'office, reconnaissance 100 % locale : CookVoice). Le site ne
    // parle jamais : chaque reponse s'affiche. Jamais de defilement : le texte
    // se reduit jusqu'a tenir (FitTextView).
    static final String PREF_VOICE_PRIVACY_SEEN = "voice_privacy_seen";
    static final int REQUEST_RECORD_AUDIO = 4107;
    int cookStepIndex;
    // Fiches d'ouverture avant l'etape 1, meme liste que le site
    // (HANDS_FREE_INTRO_PAGES dans app-kitchen.js). Pour en ajouter une : une
    // ligne {id, titre} ici et son texte dans introText().
    static final String[][] INTRO_PAGES = {{"prep", "Mise en place"}};
    int cookIntroIndex;
    // Derniere etape faite : ecran « Recette terminée » avant de fermer.
    boolean cookFinished;
    Recipe cookRecipe;
    String cookPanel;
    boolean cookPaused;
    boolean cookVoiceEnabled = true;
    String cookVoiceStatus = CookVoice.STATUS_OFF;
    String cookVoiceMessage = "";
    String cookNote = "";
    TextView cookStatusView;
    final Runnable clearCookNote = new Runnable() {
        @Override
        public void run() {
            cookNote = "";
            renderCookStatus();
        }
    };

    void openCookMode(final Recipe recipe, int index, boolean pushCurrent) {
        final List<String> steps = selectedRecipeSteps(recipe);
        if (steps.isEmpty()) return;
        if (pushCurrent) {
            host.pushNavigationState();
            cookPanel = null;
            cookIntroIndex = 0;
            cookFinished = false;
            cookPaused = false;
            cookVoiceEnabled = true;
            cookNote = "";
            if (needsVoicePrivacy()) cookPanel = "privacy";
        }
        host.releaseScreenImages();
        host.currentScreen = MainActivity.SCREEN_COOK;
        host.currentRecipeId = recipe.id;
        host.showingDetail = true;
        cookRecipe = recipe;
        cookStepIndex = Math.max(0, Math.min(index, steps.size() - 1));
        host.getWindow().addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);
        host.addTopBar(root, true, "Mode mains libres");

        LinearLayout body = new LinearLayout(host);
        body.setOrientation(LinearLayout.VERTICAL);
        int side = host.getResources().getDisplayMetrics().widthPixels >= dp(720) ? dp(56) : dp(18);
        body.setPadding(side, dp(14), side, dp(14));
        root.addView(body, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        TextView title = host.text(recipe.title, 14, COLOR_MUTED, false);
        title.setSingleLine(true);
        title.setEllipsize(TextUtils.TruncateAt.END);
        body.addView(title);

        final String[] intro = introPage();
        TextView counter = host.text(cookFinished ? "Terminé" : intro != null ? intro[1] : "Étape " + (cookStepIndex + 1) + " / " + steps.size(), 13, COLOR_GOLD, true);
        counter.setLetterSpacing(0.08f);
        counter.setPadding(0, dp(8), 0, dp(8));
        body.addView(counter);

        // Barre de progression : une portion doree par etape faite.
        LinearLayout progress = new LinearLayout(host);
        progress.setOrientation(LinearLayout.HORIZONTAL);
        for (int step = 0; step < steps.size(); step += 1) {
            View segment = new View(host);
            segment.setBackgroundColor(cookFinished || step <= cookStepIndex ? COLOR_GOLD : Color.argb(50, 255, 255, 255));
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(3), 1);
            if (step < steps.size() - 1) params.rightMargin = dp(4);
            progress.addView(segment, params);
        }
        body.addView(progress, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(3)));

        // Etat du micro et bouton pour le couper / le rallumer.
        LinearLayout voiceRow = new LinearLayout(host);
        voiceRow.setOrientation(LinearLayout.HORIZONTAL);
        voiceRow.setGravity(Gravity.CENTER_VERTICAL);
        voiceRow.setPadding(0, dp(10), 0, 0);
        cookStatusView = host.text("", 13, COLOR_MUTED, false);
        cookStatusView.setMaxLines(2);
        cookStatusView.setEllipsize(TextUtils.TruncateAt.END);
        voiceRow.addView(cookStatusView, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        Button mic = host.actionButton(cookVoiceEnabled ? "Couper le micro" : "Rallumer le micro", false);
        mic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                cookVoiceEnabled = !cookVoiceEnabled;
                if (!cookVoiceEnabled) host.cookVoice.stop();
                openCookMode(recipe, cookStepIndex, false);
            }
        });
        LinearLayout.LayoutParams micParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(38));
        micParams.leftMargin = dp(10);
        voiceRow.addView(mic, micParams);
        body.addView(voiceRow);

        // Contenu : l'etape, ou un panneau a sa place (« ok » le referme).
        LinearLayout stage = new LinearLayout(host);
        stage.setOrientation(LinearLayout.VERTICAL);
        stage.setPadding(0, dp(16), 0, dp(8));
        body.addView(stage, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));
        if (cookPanel != null) {
            LinearLayout head = new LinearLayout(host);
            head.setOrientation(LinearLayout.HORIZONTAL);
            head.setGravity(Gravity.CENTER_VERTICAL);
            TextView panelTitle = host.text("privacy".equals(cookPanel) ? "Pilotez la recette à la voix" : "Tous les ingrédients", 22, COLOR_TEXT, true);
            panelTitle.setTypeface(Ui.READING);
            head.addView(panelTitle, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
            Button ok = host.actionButton("OK", true);
            ok.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    closeCookPanel();
                }
            });
            head.addView(ok, new LinearLayout.LayoutParams(dp(72), dp(42)));
            stage.addView(head);
        } else if (intro != null) {
            TextView introTitle = host.text(intro[1], 22, COLOR_TEXT, true);
            introTitle.setTypeface(Ui.READING);
            stage.addView(introTitle);
        }
        if (cookFinished && cookPanel == null) {
            // Fin : coche doree qui apparait en douceur, sobre.
            LinearLayout end = new LinearLayout(host);
            end.setOrientation(LinearLayout.VERTICAL);
            end.setGravity(Gravity.CENTER);
            TextView mark = host.text("✓", 64, COLOR_GOLD, true);
            mark.setGravity(Gravity.CENTER);
            end.addView(mark);
            TextView done = host.text("Recette terminée", 28, COLOR_TEXT, true);
            done.setTypeface(Ui.READING);
            done.setGravity(Gravity.CENTER);
            end.addView(done);
            TextView bon = host.text(steps.size() + " étapes faites. Bon appétit !", 16, COLOR_MUTED, false);
            bon.setGravity(Gravity.CENTER);
            bon.setPadding(0, dp(8), 0, 0);
            end.addView(bon);
            stage.addView(end, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));
            mark.setAlpha(0f);
            mark.setScaleX(0.6f);
            mark.setScaleY(0.6f);
            mark.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(700).start();
        }
        final boolean showStep = cookPanel == null && intro == null && !cookFinished;
        String text = cookPanel != null ? ("privacy".equals(cookPanel) ? privacyText() : ingredientsText(recipe)) : intro != null ? introText(intro[0], recipe) : frenchSpacing(steps.get(cookStepIndex));
        // Listes longues (ingredients, mise en place) sur ecran large : deux
        // colonnes, chacune reduite jusqu'a tenir ; jamais de defilement.
        boolean columns = !showStep && !"privacy".equals(cookPanel) && host.getResources().getDisplayMetrics().widthPixels >= dp(720);
        String[] parts = columns ? splitColumns(text) : new String[]{text};
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        for (int column = 0; column < parts.length; column += 1) {
            FitTextView content = new FitTextView(host, showStep ? 26 : 18, 9);
            content.setTextColor(COLOR_TEXT);
            content.setLineSpacing(dp(showStep ? 3 : 1), showStep ? 1.15f : 1.05f);
            if (showStep) content.setTypeface(Ui.READING);
            content.setText(parts[column]);
            content.setPadding(column > 0 ? dp(28) : 0, dp(showStep ? 8 : 14), 0, 0);
            row.addView(content, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
        }
        if (!cookFinished || cookPanel != null) stage.addView(row, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        // Aide integree : les commandes utiles a cet instant, sans fenetre.
        TextView say = host.text(sayText(cookStepIndex, steps.size()), 13, COLOR_MUTED, false);
        say.setPadding(0, 0, 0, dp(10));
        say.setMaxLines(2);
        say.setVisibility(cookVoiceEnabled ? View.VISIBLE : View.GONE);
        body.addView(say);

        LinearLayout actions = new LinearLayout(host);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        body.addView(actions, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52)));

        Button previous = host.actionButton("← Précédente", false);
        final boolean atStart = intro != null && cookIntroIndex == 0;
        previous.setEnabled(!atStart);
        previous.setAlpha(atStart ? 0.4f : 1f);
        previous.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                cookPanel = null;
                cookBack();
            }
        });
        LinearLayout.LayoutParams previousParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
        previousParams.rightMargin = dp(10);
        actions.addView(previous, previousParams);

        final boolean last = cookStepIndex >= steps.size() - 1;
        Button next = host.actionButton(cookFinished ? "Fermer" : intro != null ? (cookIntroIndex == INTRO_PAGES.length - 1 ? "Commencer →" : "Suivante →") : last ? "Terminer" : "Étape suivante →", true);
        next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                cookPanel = null;
                if (cookIntroIndex < INTRO_PAGES.length) {
                    leaveIntroPage(recipe);
                    cookIntroIndex += 1;
                    openCookMode(recipe, cookStepIndex, false);
                } else if (cookFinished) host.goBack();
                else if (last) {
                    cookFinished = true;
                    openCookMode(recipe, cookStepIndex, false);
                } else openCookMode(recipe, cookStepIndex + 1, false);
            }
        });
        actions.addView(next, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));

        host.showScreen(root);
        renderCookStatus();
        if (cookVoiceEnabled) startCookVoice();
    }

    // Message de confidentialite : chaque fois que le micro n'est pas autorise
    // (Android 6 et plus, « Uniquement cette fois » le fait revenir) ; sous
    // Android 5 le micro est accorde a l'installation : une seule fois.
    boolean needsVoicePrivacy() {
        if (android.os.Build.VERSION.SDK_INT >= 23) return !micGranted();
        return !host.getSharedPreferences(MainActivity.PREFS_NAME, Context.MODE_PRIVATE).getBoolean(PREF_VOICE_PRIVACY_SEEN, false);
    }

    boolean micGranted() {
        return android.os.Build.VERSION.SDK_INT < 23
                || host.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) == android.content.pm.PackageManager.PERMISSION_GRANTED;
    }

    void startCookVoice() {
        if (!micGranted()) {
            cookVoiceStatus = CookVoice.STATUS_LOADING;
            cookVoiceMessage = "En attente de l’autorisation du micro…";
            renderCookStatus();
            host.requestPermissions(new String[]{android.Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO);
            return;
        }
        host.cookVoice.start(new CookVoice.Listener() {
            @Override
            public void onVoiceState(String status, String message) {
                boolean nowListening = CookVoice.STATUS_LISTENING.equals(status) && !status.equals(cookVoiceStatus);
                cookVoiceStatus = status;
                cookVoiceMessage = message;
                // Message de confidentialite : « micro autorise, dites ok ».
                if (nowListening && "privacy".equals(cookPanel) && cookRecipe != null) openCookMode(cookRecipe, cookStepIndex, false);
                else renderCookStatus();
            }

            @Override
            public void onVoiceCommand(VoiceCommands.Command command, String heard) {
                handleCookCommand(command, heard);
            }
        });
    }

    void onMicPermissionResult(boolean granted) {
        if (host.currentScreen != MainActivity.SCREEN_COOK || cookRecipe == null) return;
        if (granted) {
            openCookMode(cookRecipe, cookStepIndex, false);
        } else {
            cookVoiceStatus = CookVoice.STATUS_ERROR;
            cookVoiceMessage = "Micro refusé : Paramètres › Applications › Cook Note › Autorisations › Micro.";
            renderCookStatus();
        }
    }

    void renderCookStatus() {
        if (cookStatusView == null) return;
        String value;
        int color = COLOR_MUTED;
        if (!cookVoiceEnabled) value = "Micro coupé";
        else if (CookVoice.STATUS_ERROR.equals(cookVoiceStatus)) {
            value = cookVoiceMessage;
            color = Color.rgb(232, 163, 59);
        } else if (cookPaused) {
            value = "❚❚  En pause : dites « reprends »";
            color = COLOR_GOLD;
        } else if (cookNote.length() > 0) {
            value = cookNote;
            color = Color.rgb(169, 211, 163);
        } else if (CookVoice.STATUS_LISTENING.equals(cookVoiceStatus)) value = "●  À l’écoute";
        else if (CookVoice.STATUS_LOADING.equals(cookVoiceStatus)) value = cookVoiceMessage;
        else value = "Activation du micro…";
        cookStatusView.setText(value);
        cookStatusView.setTextColor(color);
    }

    void cookNote(String value) {
        cookNote = "✓  " + value;
        host.uiHandler.removeCallbacks(clearCookNote);
        host.uiHandler.postDelayed(clearCookNote, 2500);
        renderCookStatus();
    }

    void closeCookPanel() {
        if ("privacy".equals(cookPanel)) {
            host.getSharedPreferences(MainActivity.PREFS_NAME, Context.MODE_PRIVATE).edit().putBoolean(PREF_VOICE_PRIVACY_SEEN, true).apply();
        }
        cookPanel = null;
        if (cookRecipe != null) openCookMode(cookRecipe, cookStepIndex, false);
    }

    void handleCookCommand(VoiceCommands.Command command, String heard) {
        if (cookRecipe == null || host.currentScreen != MainActivity.SCREEN_COOK) return;
        if (command == null) {
            if (!cookPaused) {
                cookNote = "Entendu : « " + heard + " »";
                host.uiHandler.removeCallbacks(clearCookNote);
                host.uiHandler.postDelayed(clearCookNote, 2500);
                renderCookStatus();
            }
            return;
        }
        // En pause, seul « reprends » est entendu.
        if (cookPaused && !VoiceCommands.RESUME.equals(command.type)) return;
        List<String> steps = selectedRecipeSteps(cookRecipe);
        int total = steps.size();
        String type = command.type;
        if (VoiceCommands.NEXT.equals(type)) {
            cookPanel = null;
            if (introPage() != null) {
                leaveIntroPage(cookRecipe);
                cookIntroIndex += 1;
                openCookMode(cookRecipe, cookStepIndex, false);
            } else if (cookFinished) host.goBack();
            else if (cookStepIndex >= total - 1) {
                cookFinished = true;
                openCookMode(cookRecipe, cookStepIndex, false);
            }
            else go(cookStepIndex + 1, "Étape suivante");
        } else if (VoiceCommands.PREVIOUS.equals(type)) {
            cookPanel = null;
            if (introPage() != null && cookIntroIndex == 0) cookNote("Déjà au début");
            else {
                cookBack();
                cookNote("Retour");
            }
        } else if (VoiceCommands.FIRST.equals(type)) {
            cookPanel = null;
            cookIntroIndex = INTRO_PAGES.length;
            go(0, "Première étape");
        } else if (VoiceCommands.LAST.equals(type)) {
            cookPanel = null;
            cookIntroIndex = INTRO_PAGES.length;
            go(total - 1, "Dernière étape");
        } else if (VoiceCommands.GOTO.equals(type)) {
            cookPanel = null;
            cookIntroIndex = INTRO_PAGES.length;
            if (command.step >= 1 && command.step <= total) go(command.step - 1, "Étape " + command.step);
            else cookNote("Cette recette a " + total + " étapes");
        } else if (VoiceCommands.DISMISS.equals(type)) {
            if (cookPanel != null) closeCookPanel();
            else if (cookFinished) host.goBack();
        } else if (VoiceCommands.PAUSE.equals(type)) {
            cookPaused = true;
            openCookMode(cookRecipe, cookStepIndex, false);
        } else if (VoiceCommands.RESUME.equals(type)) {
            cookPaused = false;
            openCookMode(cookRecipe, cookStepIndex, false);
            cookNote("Écoute reprise");
        } else if (VoiceCommands.INGREDIENTS.equals(type)) {
            cookPanel = "ingredients";
            openCookMode(cookRecipe, cookStepIndex, false);
        } else if (VoiceCommands.TEMPERATURE.equals(type)) {
            cookNote(temperatureText(steps));
        } else if (VoiceCommands.MUTE.equals(type)) {
            cookVoiceEnabled = false;
            host.cookVoice.stop();
            openCookMode(cookRecipe, cookStepIndex, false);
        } else if (VoiceCommands.SERVINGS.equals(type) || VoiceCommands.DOUBLE.equals(type) || VoiceCommands.HALF.equals(type)) {
            int base = baseServings(cookRecipe);
            if (base <= 0) {
                cookNote("Cette recette n’a pas de nombre de parts réglable");
                return;
            }
            float factor = VoiceCommands.SERVINGS.equals(type) ? (float) command.step / (float) base
                    : VoiceCommands.DOUBLE.equals(type) ? host.quantityFactor * 2f : host.quantityFactor / 2f;
            host.quantityFactor = host.clampQuantityFactor(factor);
            host.saveUserState();
            openCookMode(cookRecipe, cookStepIndex, false);
            cookNote("Quantités pour " + Math.round(base * host.quantityFactor));
        } else if (VoiceCommands.CLOSE.equals(type)) {
            host.goBack();
        }
    }

    void go(int index, String note) {
        openCookMode(cookRecipe, index, false);
        cookNote(note);
    }

    String temperatureText(List<String> steps) {
        java.util.regex.Pattern celsius = java.util.regex.Pattern.compile("(\\d{2,3})\\s*°\\s*C");
        Matcher here = celsius.matcher(steps.get(cookStepIndex));
        if (here.find()) return "Four : " + here.group(1) + " °C";
        for (int offset = 1; offset < steps.size(); offset += 1) {
            for (int position : new int[]{cookStepIndex + offset, cookStepIndex - offset}) {
                if (position < 0 || position >= steps.size()) continue;
                Matcher other = celsius.matcher(steps.get(position));
                if (other.find()) return "Four : " + other.group(1) + " °C (étape " + (position + 1) + ")";
            }
        }
        return "Pas de température indiquée dans cette recette";
    }

    // Coupe un texte en deux colonnes de longueur proche, entre deux blocs
    // (paragraphe ou groupe d'ingredients), jamais au milieu d'un bloc.
    static String[] splitColumns(String text) {
        String[] blocks = text.split("\n\n");
        if (blocks.length < 2) return new String[]{text};
        int total = 0;
        for (String block : blocks) total += block.split("\n").length + 1;
        StringBuilder left = new StringBuilder();
        StringBuilder right = new StringBuilder();
        int lines = 0;
        for (String block : blocks) {
            StringBuilder target = lines < total / 2 ? left : right;
            if (target.length() > 0) target.append("\n\n");
            target.append(block);
            lines += block.split("\n").length + 1;
        }
        return right.length() == 0 ? new String[]{left.toString()} : new String[]{left.toString(), right.toString()};
    }

    // En quittant une fiche d'ouverture (comme onLeave sur le site) : la mise
    // en place faite, tous les ingredients sont coches « prets ».
    void leaveIntroPage(Recipe recipe) {
        String[] intro = introPage();
        if (intro == null || !"prep".equals(intro[0])) return;
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            for (String item : group.items) {
                host.ingredientDoneKeys.add("ing|" + recipe.id + "|" + CookNoteRepository.normalize(group.title) + "|" + CookNoteRepository.normalize(item));
            }
        }
        host.saveUserState();
    }

    String[] introPage() {
        return cookIntroIndex < INTRO_PAGES.length ? INTRO_PAGES[cookIntroIndex] : null;
    }

    // Precedente : fiche d'ouverture precedente, ou depuis l'etape 1 la derniere fiche.
    void cookBack() {
        if (cookFinished) cookFinished = false;
        else if (introPage() != null) cookIntroIndex = Math.max(0, cookIntroIndex - 1);
        else if (cookStepIndex == 0) cookIntroIndex = INTRO_PAGES.length - 1;
        else cookStepIndex -= 1;
        openCookMode(cookRecipe, cookStepIndex, false);
    }

    // Texte des fiches d'ouverture (une entree par id de INTRO_PAGES).
    String introText(String id, Recipe recipe) {
        if ("prep".equals(id)) {
            StringBuilder builder = new StringBuilder("Pesez et préparez tous les ingrédients avant de commencer : pendant la recette, les gestes s’enchaînent sans attendre, rien ne brûle pendant qu’on cherche un ingrédient, et on voit tout de suite s’il manque quelque chose.\n\n");
            int base = baseServings(recipe);
            if (base > 0) {
                int target = Math.round(base * host.quantityFactor);
                builder.append("Recette prévue pour ").append(recipe.yield);
                if (target != base) builder.append(", quantités ci-dessous pour ").append(target);
                builder.append(". Pour changer, dites « pour ").append(base == 6 ? 4 : 6).append(" personnes », « double » ou « moitié » : toutes les quantités suivent.\n\n");
            }
            return builder.append(ingredientsText(recipe)).toString();
        }
        return "";
    }

    String sayText(int index, int total) {
        if (cookPaused) return "DITES  « reprends »";
        if (cookPanel != null || cookFinished) return "DITES  « ok »  « d’accord »";
        if (introPage() != null) return "DITES  « suivant »  « double »  « moitié »  « pause »";
        StringBuilder builder = new StringBuilder("DITES  ");
        builder.append(index < total - 1 ? "« suivant »" : "« terminer »");
        if (index > 0) builder.append("  « précédent »");
        builder.append("  « voir les ingrédients »  « pause »");
        return builder.toString();
    }

    String privacyText() {
        String status = micGranted() && CookVoice.STATUS_LISTENING.equals(cookVoiceStatus)
                ? "✓ Micro autorisé : dites « ok » pour commencer."
                : "Quand Android le demande, choisissez « Autoriser ».";
        return "Dites « suivant », « étape trois » ou « voir les ingrédients » : Cook Note suit la recette sans que vous touchiez l’écran.\n\n"
                + "Tout reste sur votre appareil. Ce que vous dites est analysé directement sur cette tablette ou ce téléphone : rien n’est enregistré, rien n’est envoyé sur Internet.\n\n"
                + "Aucun usage commercial. Cook Note ne conserve, ne partage et ne revend aucune donnée vocale.\n\n"
                + "Autoriser le micro. Avec « Uniquement cette fois », ce message reviendra à la prochaine ouverture.\n\n"
                + status;
    }

    String ingredientsText(Recipe recipe) {
        StringBuilder builder = new StringBuilder();
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            if (group.items.isEmpty()) continue;
            if (builder.length() > 0) builder.append("\n\n");
            if (group.title.length() > 0) builder.append(group.title.toUpperCase(Locale.FRENCH)).append('\n');
            for (int index = 0; index < group.items.size(); index += 1) {
                if (index > 0) builder.append('\n');
                builder.append("• ").append(frenchSpacing(host.scaleIngredient(group.items.get(index))));
            }
        }
        return builder.length() > 0 ? builder.toString() : "Pas d’ingrédient détaillé pour cette fiche.";
    }

    void addQuickFacts(LinearLayout content, Recipe recipe) {
        ArrayList<String[]> facts = new ArrayList<String[]>();

        if (recipe.isCollection()) {
            facts.add(new String[]{"Collection", countLabel(host.repository.collectionCount(recipe), "fiche", "fiches")});
        } else {
            if (recipe.activeTime > 0) facts.add(new String[]{"Actif", formatMinutes(recipe.activeTime)});
            if (recipe.cookTime > 0) facts.add(new String[]{"Cuisson", formatMinutes(recipe.cookTime)});
            int totalTime = recipe.activeTime + recipe.cookTime;
            if (totalTime > 0) facts.add(new String[]{"Temps", formatMinutes(totalTime)});
        }

        if (facts.isEmpty()) return;

        LinearLayout block = new LinearLayout(host);
        block.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams blockParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        blockParams.topMargin = dp(12);
        content.addView(block, blockParams);

        int columns = Math.min(facts.size(), quickFactColumns());
        LinearLayout row = null;
        for (int index = 0; index < facts.size(); index += 1) {
            if (index % columns == 0) {
                row = new LinearLayout(host);
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

    int quickFactColumns() {
        int width = host.getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(940)) return 4;
        if (width >= dp(620)) return 3;
        return 2;
    }

    void addQuickFactCard(LinearLayout row, String label, String value, boolean rightMargin) {
        LinearLayout card = new LinearLayout(host);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(9), dp(7), dp(9), dp(8));
        card.setMinimumHeight(dp(54));
        card.setBackground(panelGradient(COLOR_CARD, COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 8));

        TextView labelView = host.text(label, 9, COLOR_GOLD, true);
        labelView.setSingleLine(true);
        labelView.setEllipsize(TextUtils.TruncateAt.END);
        labelView.setLetterSpacing(0.05f);
        card.addView(labelView);

        View line = new View(host);
        line.setBackground(gradientPanel(Color.argb(126, 251, 191, 36), Color.argb(8, 251, 191, 36), Color.TRANSPARENT, 0, 0));
        LinearLayout.LayoutParams lineParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(1)
        );
        lineParams.topMargin = dp(5);
        lineParams.bottomMargin = dp(1);
        card.addView(line, lineParams);

        TextView valueView = host.text(value, 12, COLOR_TEXT, true);
        valueView.setMaxLines(2);
        valueView.setEllipsize(TextUtils.TruncateAt.END);
        valueView.setPadding(0, dp(3), 0, 0);
        card.addView(valueView);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        if (rightMargin) params.rightMargin = dp(8);
        row.addView(card, params);
    }

    void addQuickFactSpacer(LinearLayout row, boolean rightMargin) {
        View spacer = new View(host);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(1), 1);
        if (rightMargin) params.rightMargin = dp(8);
        row.addView(spacer, params);
    }

    void addQuantityControls(LinearLayout content, final Recipe recipe) {
        final int baseServings = baseServings(recipe);
        if (baseServings > 0) {
            final int selectedServings = selectedServings(recipe);
            LinearLayout section = host.addSection(content, servingSectionTitle(recipe), servingLabel(recipe, selectedServings));
            TextView help = host.text("Choisis la quantit\u00E9 servie. Les ingr\u00E9dients, la copie et les courses suivent.", 12, COLOR_MUTED, false);
            help.setPadding(0, dp(6), 0, dp(2));
            section.addView(help);

            final ArrayList<Integer> servings = servingOptions(baseServings);
            ArrayList<String> labels = new ArrayList<String>();
            for (Integer serving : servings) {
                labels.add(servingLabel(recipe, serving.intValue()));
            }
            final int selectedIndex = Math.max(0, servings.indexOf(Integer.valueOf(selectedServings)));
            final int[] currentIndex = new int[]{selectedIndex};
            Spinner spinner = host.createSpinner(labels);
            spinner.setSelection(selectedIndex);
            section.addView(spinner, host.fullWidthParams(dp(10), dp(46)));

            TextView base = host.text("Base de la fiche : " + servingLabel(recipe, baseServings) + ".", 11, COLOR_DIM, false);
            base.setPadding(0, dp(7), 0, 0);
            section.addView(base);

            spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                    if (position == currentIndex[0]) return;
                    currentIndex[0] = position;
                    int selected = servings.get(position).intValue();
                    host.quantityFactor = host.clampQuantityFactor((float) selected / (float) baseServings);
                    host.saveUserState();
                    openRecipe(recipe, false);
                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {
                }
            });
            return;
        }

        LinearLayout section = host.addSection(content, "Quantit\u00E9s", "x" + factorLabel(host.quantityFactor));
        TextView help = host.text("Ajuste les ingr\u00E9dients affich\u00E9s, la copie et les courses fusionn\u00E9es.", 12, COLOR_MUTED, false);
        help.setPadding(0, dp(6), 0, dp(2));
        section.addView(help);

        int perRow = host.getResources().getDisplayMetrics().widthPixels >= dp(700) ? 6 : 3;
        LinearLayout row = null;
        for (int index = 0; index < MainActivity.QUANTITY_FACTORS.length; index += 1) {
            if (index % perRow == 0) {
                row = new LinearLayout(host);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        dp(36)
                );
                rowParams.topMargin = dp(index == 0 ? 9 : 7);
                section.addView(row, rowParams);
            }
            final float factor = MainActivity.QUANTITY_FACTORS[index];
            Button button = host.actionButton("x" + factorLabel(factor), sameFactor(host.quantityFactor, factor));
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    host.quantityFactor = factor;
                    host.saveUserState();
                    openRecipe(recipe, false);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            if (index % perRow < perRow - 1) params.rightMargin = dp(7);
            row.addView(button, params);
        }
    }

    int baseServings(Recipe recipe) {
        if (recipe == null || recipe.yield.length() == 0) return 0;
        Matcher matcher = MainActivity.SERVING_COUNT_PATTERN.matcher(CookNoteRepository.normalize(recipe.yield));
        if (!matcher.find()) return 0;
        try {
            return Math.max(MainActivity.MIN_SERVINGS, Integer.parseInt(matcher.group(1)));
        } catch (Exception ignored) {
            return 0;
        }
    }

    int selectedServings(Recipe recipe) {
        int base = baseServings(recipe);
        if (base <= 0) return 0;
        int selected = Math.round(base * host.quantityFactor);
        return clampServingChoice(selected, base);
    }

    int clampServingChoice(int selected, int base) {
        int max = maxServingChoice(base);
        if (selected < MainActivity.MIN_SERVINGS) return MainActivity.MIN_SERVINGS;
        return Math.min(selected, max);
    }

    int maxServingChoice(int base) {
        return Math.max(MainActivity.DEFAULT_MAX_SERVING_CHOICES, Math.min(MainActivity.HARD_MAX_SERVING_CHOICES, base * 2));
    }

    ArrayList<Integer> servingOptions(int base) {
        ArrayList<Integer> options = new ArrayList<Integer>();
        int max = maxServingChoice(base);
        for (int value = MainActivity.MIN_SERVINGS; value <= max; value += 1) {
            options.add(Integer.valueOf(value));
        }
        return options;
    }

    String servingSummary(Recipe recipe) {
        int servings = selectedServings(recipe);
        if (servings > 0) return servingLabel(recipe, servings);
        return recipe == null ? "" : recipe.yield;
    }

    String servingUnit(Recipe recipe) {
        if (recipe != null) {
            Matcher matcher = MainActivity.SERVING_COUNT_PATTERN.matcher(CookNoteRepository.normalize(recipe.yield));
            if (matcher.find()) {
                String unit = matcher.group(3).toLowerCase(Locale.FRANCE);
                if (unit.startsWith("portion")) return "portion";
                if (unit.startsWith("part")) return "part";
            }
        }
        return "personne";
    }

    String servingSectionTitle(Recipe recipe) {
        String unit = servingUnit(recipe);
        if ("portion".equals(unit)) return "Portions";
        if ("part".equals(unit)) return "Parts";
        return "Personnes";
    }

    String servingLabel(Recipe recipe, int count) {
        String unit = servingUnit(recipe);
        return count + " " + unit + (count > 1 ? "s" : "");
    }

    String factorLabel(float factor) {
        if (sameFactor(factor, Math.round(factor))) return String.valueOf((int) Math.round(factor));
        String raw = String.valueOf(Math.round(factor * 10f) / 10f);
        if (raw.endsWith(".0")) raw = raw.substring(0, raw.length() - 2);
        return raw.replace('.', ',');
    }

    void addRecipeContentGrid(LinearLayout content, Recipe recipe) {
        int columns = detailColumnCount();
        if (columns <= 1) {
            addIngredients(content, recipe);
            addSteps(content, recipe);
            addBeforePanel(content, recipe);
            return;
        }

        LinearLayout grid = new LinearLayout(host);
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

    int detailColumnCount() {
        int width = host.getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(1120)) return 3;
        if (width >= dp(760)) return 2;
        return 1;
    }

    LinearLayout detailColumn() {
        LinearLayout column = new LinearLayout(host);
        column.setOrientation(LinearLayout.VERTICAL);
        return column;
    }

    void addBeforePanel(LinearLayout content, Recipe recipe) {
        if (recipe.practical.isEmpty()) return;

        int beforeCount = 0;
        for (Recipe.PracticalSection practicalSection : recipe.practical) {
            beforeCount += Math.max(1, practicalSection.items.size());
        }
        LinearLayout section = host.addSection(content, "Avant de commencer", countLabel(beforeCount, "info", "infos"));

        // Comme sur le site : l essentiel reste ouvert, le reste est range en
        // trois familles repliables (Servir, Conserver, Maitriser) avec un apercu.
        List<List<Recipe.PracticalSection>> families = new ArrayList<List<Recipe.PracticalSection>>();
        for (int index = 0; index < PRACTICAL_FAMILY_TITLES.length; index += 1) {
            families.add(new ArrayList<Recipe.PracticalSection>());
        }
        for (Recipe.PracticalSection practicalSection : recipe.practical) {
            int family = practicalFamily(practicalSection.title);
            if (family < 0) {
                addPracticalSection(section, practicalSection);
            } else {
                families.get(family).add(practicalSection);
            }
        }
        for (int index = 0; index < families.size(); index += 1) {
            if (!families.get(index).isEmpty()) {
                addPracticalFamily(section, PRACTICAL_FAMILY_TITLES[index], families.get(index));
            }
        }
    }

    static final String[] PRACTICAL_FAMILY_TITLES = {"Servir", "Conserver", "Maîtriser"};

    /** Famille d une section pratique d apres son titre ; -1 pour l essentiel, toujours visible. */
    static int practicalFamily(String title) {
        String key = Normalizer.normalize(title == null ? "" : title, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .trim();
        if (key.startsWith("carte des accords") || key.equals("dressage") || key.equals("service")) return 0;
        if (key.startsWith("conservation") || key.startsWith("rechauff")) return 1;
        if (key.startsWith("repere") || key.startsWith("a savoir") || key.startsWith("fiches ingredients")
                || key.startsWith("erreurs") || key.startsWith("resultat") || key.equals("notes")
                || key.equals("technique")) return 2;
        return -1;
    }

    void addPracticalSection(LinearLayout content, Recipe.PracticalSection practicalSection) {
        host.subTitle(content, practicalSection.title);
        for (String item : practicalSection.items) {
            host.bulletRow(content, item);
        }
    }

    void addPracticalFamily(LinearLayout content, String title, List<Recipe.PracticalSection> sections) {
        final LinearLayout body = new LinearLayout(host);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(0, 0, 0, dp(6));
        body.setVisibility(View.GONE);
        for (Recipe.PracticalSection practicalSection : sections) {
            addPracticalSection(body, practicalSection);
        }

        List<String> sectionTitles = new ArrayList<String>();
        for (Recipe.PracticalSection practicalSection : sections) {
            sectionTitles.add(practicalSection.title);
        }

        LinearLayout header = new LinearLayout(host);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(0, dp(12), 0, dp(10));
        header.setBackground(selectablePanel(Color.TRANSPARENT, COLOR_CARD_SOFT, Color.TRANSPARENT, 0, 6));

        LinearLayout labels = new LinearLayout(host);
        labels.setOrientation(LinearLayout.VERTICAL);
        TextView name = host.text(title, 16, COLOR_TEXT, false);
        name.setTypeface(Ui.DISPLAY);
        labels.addView(name);
        TextView preview = host.text(joinMetaParts(sectionTitles, ""), 12, COLOR_DIM, false);
        preview.setSingleLine(true);
        preview.setEllipsize(TextUtils.TruncateAt.END);
        labels.addView(preview);
        header.addView(labels, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        final TextView toggle = host.text("+", 20, COLOR_GOLD, false);
        toggle.setGravity(Gravity.CENTER);
        header.addView(toggle, new LinearLayout.LayoutParams(dp(32), dp(32)));
        header.setContentDescription(title + " : afficher ou masquer");
        header.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                boolean open = body.getVisibility() != View.VISIBLE;
                body.setVisibility(open ? View.VISIBLE : View.GONE);
                toggle.setText(open ? "−" : "+");
            }
        });

        View divider = new View(host);
        divider.setBackgroundColor(Color.argb(60, 214, 158, 64));
        LinearLayout.LayoutParams dividerParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 1);
        dividerParams.topMargin = dp(8);
        content.addView(divider, dividerParams);
        content.addView(header);
        content.addView(body);
    }

    int countSelectedIngredients(Recipe recipe) {
        int count = 0;
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            count += group.items.size();
        }
        return count;
    }

    // Filtre de saison de la categorie ouverte (vide : toutes les recettes).
    static final String[] SEASONS = {"Printemps", "Été", "Automne", "Hiver"};
    String collectionSeason = "";
    String collectionSeasonOwner = "";

    static boolean hasSeason(Recipe recipe, String season) {
        if (season == null || season.length() == 0) return true;
        // Comme le site : seules les recettes rangees dans cette saison.
        for (String value : recipe.seasons) {
            if (value.equals(season)) return true;
        }
        return false;
    }

    void addCollectionCards(LinearLayout content, final Recipe recipe) {
        if (!recipe.id.equals(collectionSeasonOwner)) {
            collectionSeasonOwner = recipe.id;
            collectionSeason = "";
        }
        List<VariantChoice> allChoices = collectionVariantChoices(recipe);
        addSeasonFilter(content, recipe, allChoices);
        final List<VariantChoice> choices = new ArrayList<VariantChoice>();
        for (VariantChoice choice : allChoices) {
            if (hasSeason(choice.recipe, collectionSeason)) choices.add(choice);
        }
        LinearLayout section = host.addSection(content, "Recettes", countLabel(choices.size(), "fiche", "fiches"));
        if (choices.isEmpty()) {
            host.body(section, "Aucune fiche disponible.");
            return;
        }
        int columns = collectionGridColumns();
        int cardHeight = collectionCardHeight(columns);
        int cardImageWidth = collectionCardImageWidth(columns);
        prewarmCollectionImages(choices, cardImageWidth, cardHeight);
        LinearLayout row = null;
        for (int index = 0; index < choices.size(); index += 1) {
            if (index % columns == 0) {
                row = new LinearLayout(host);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
                rowParams.topMargin = dp(10);
                section.addView(row, rowParams);
            }
            addCollectionCard(row, recipe, choices.get(index), cardHeight, cardImageWidth, index % columns < columns - 1);
        }
        int missing = choices.size() % columns;
        if (row != null && missing > 0) {
            for (int index = missing; index < columns; index += 1) {
                addCollectionSpacer(row, cardHeight, index < columns - 1);
            }
        }
    }

    // Quatre saisons comme le site : un toucher filtre, un second remet tout.
    void addSeasonFilter(LinearLayout content, final Recipe recipe, List<VariantChoice> choices) {
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44));
        rowParams.topMargin = dp(14);
        content.addView(row, rowParams);
        for (int index = 0; index < SEASONS.length; index += 1) {
            final String season = SEASONS[index];
            int count = 0;
            for (VariantChoice choice : choices) {
                if (hasSeason(choice.recipe, season)) count += 1;
            }
            final boolean active = season.equals(collectionSeason);
            Button button = host.actionButton(season + "  " + count, false);
            button.setTextSize(host.adjustedTextSize(13));
            button.setTextColor(active ? COLOR_GOLD : COLOR_TEXT);
            button.setBackground(selectablePanel(
                    active ? Color.argb(46, 214, 158, 64) : COLOR_PANEL_DEEP,
                    COLOR_CARD_ACTIVE,
                    active ? COLOR_GOLD_SOFT : COLOR_BORDER_SOFT,
                    1,
                    22
            ));
            button.setEnabled(count > 0);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    collectionSeason = active ? "" : season;
                    openRecipe(recipe, false);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            if (index < SEASONS.length - 1) params.rightMargin = dp(7);
            row.addView(button, params);
        }
    }

    int collectionGridColumns() {
        int width = host.getResources().getDisplayMetrics().widthPixels;
        if (width >= dp(1000)) return 3;
        if (width >= dp(620)) return 2;
        return 1;
    }

    int collectionCardHeight(int columns) {
        int cardWidth = collectionCardWidth(columns);
        return Math.max(dp(132), (cardWidth * 9) / 16);
    }

    int collectionCardImageWidth(int columns) {
        return Math.min(dp(480), Math.max(dp(340), collectionCardWidth(columns)));
    }

    int collectionCardWidth(int columns) {
        int width = host.getResources().getDisplayMetrics().widthPixels;
        int available = Math.max(dp(260), width - dp(56) - (dp(10) * (columns - 1)));
        return Math.max(dp(260), available / Math.max(1, columns));
    }

    void addCollectionCard(LinearLayout row, final Recipe parentRecipe, final VariantChoice choice, int cardHeight, int cardImageWidth, boolean rightMargin) {
        LinearLayout card = new LinearLayout(host);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(1), dp(1), dp(1), dp(1));
        card.setBackground(selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, Color.argb(110, 214, 158, 64), 1, 12));
        // Coins recadres comme les cartes du site : l'image ne mord jamais le bord.
        card.setClipToOutline(true);
        card.setClickable(true);

        FrameLayout frame = new FrameLayout(host);
        frame.setBackgroundColor(COLOR_CARD);
        card.addView(frame, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView image = new ImageView(host);
        image.setScaleType(ImageView.ScaleType.CENTER_CROP);
        image.setBackgroundColor(COLOR_CARD);
        image.setContentDescription("Image de " + choice.label);
        frame.addView(image, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        host.imageLoader.load(choice.recipe.image, image, cardImageWidth, cardHeight);

        View veil = new View(host);
        veil.setBackgroundColor(Color.argb(38, 0, 0, 0));
        frame.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        LinearLayout overlay = new LinearLayout(host);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(14), dp(16), dp(14), dp(14));
        overlay.setBackground(cardTitleOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        TextView title = host.text(choice.label, 17, COLOR_TEXT, false);
        title.setTypeface(Ui.DISPLAY);
        title.setMaxLines(2);
        title.setEllipsize(TextUtils.TruncateAt.END);
        title.setLineSpacing(dp(1), 1.04f);
        title.setShadowLayer(2.2f, 0, dp(1), Color.BLACK);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        overlay.addView(title, titleParams);

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
                openRecipe(choice.recipe, true);
            }
        });
    }

    void prewarmCollectionImages(List<VariantChoice> choices, int cardImageWidth, int cardHeight) {
        if (choices == null || host.imageLoader == null) return;
        int limit = Math.min(choices.size(), MainActivity.COLLECTION_PREWARM_LIMIT);
        for (int index = 0; index < limit; index += 1) {
            Recipe recipe = choices.get(index).recipe;
            host.imageLoader.prefetch(recipe.image, cardImageWidth, cardHeight);
            if (index == 0) host.imageLoader.prefetchDetail(recipe.detailImage, detailImageRequestWidth(), detailHeroHeight());
        }
    }

    void addCollectionSpacer(LinearLayout row, int cardHeight, boolean rightMargin) {
        View spacer = new View(host);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, cardHeight, 1);
        if (rightMargin) params.rightMargin = dp(10);
        row.addView(spacer, params);
    }

    void addInlineVariantPicker(LinearLayout content, final Recipe recipe) {
        final List<InlineVariantChoice> choices = inlineVariantChoices(recipe);
        if (choices.size() <= 1) return;

        LinearLayout section = host.addSection(content, "Choisir une variante", countLabel(choices.size(), "choix", "choix"));
        TextView guidance = host.text(
                "Chaque choix affiche sa recette compl\u00E8te : ingr\u00E9dients, \u00E9tapes et conseils.",
                13,
                COLOR_MUTED,
                false
        );
        guidance.setPadding(0, dp(4), 0, 0);
        section.addView(guidance);
        final int selectedIndex = selectedInlineVariantIndex(recipe, choices);
        final int[] currentIndex = new int[]{selectedIndex};
        Spinner spinner = host.createSpinner(labelsForInlineChoices(choices));
        spinner.setContentDescription("Choisir une variante");
        spinner.setSelection(selectedIndex);
        section.addView(spinner, host.fullWidthParams(dp(10), dp(46)));

        final TextView meta = host.text("", 13, COLOR_MUTED, false);
        meta.setPadding(0, dp(8), 0, 0);
        section.addView(meta);
        updateInlineVariantMeta(meta, recipe, choices.get(selectedIndex));

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position == currentIndex[0]) return;
                currentIndex[0] = position;
                host.inlineVariantSelections.put(recipe.id, position);
                openRecipe(recipe, false);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    List<VariantChoice> collectionVariantChoices(Recipe recipe) {
        List<VariantChoice> choices = new ArrayList<VariantChoice>();
        Map<String, String> directLabels = new HashMap<String, String>();
        Set<String> added = new HashSet<String>();
        for (Recipe.Variant variant : recipe.variants) {
            directLabels.put(variant.id, variant.label);
        }
        for (Recipe target : host.repository.childrenForParent(recipe)) {
            String directLabel = directLabels.get(target.id);
            String label = directLabel != null && directLabel.length() > 0 ? directLabel : target.title;
            choices.add(new VariantChoice(label, target));
            added.add(target.id);
        }
        for (Recipe.Variant variant : recipe.variants) {
            Recipe target = host.repository.find(variant.id);
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

    List<InlineVariantChoice> inlineVariantChoices(Recipe recipe) {
        List<InlineVariantChoice> choices = new ArrayList<InlineVariantChoice>();
        Map<String, InlineVariantChoice> grouped = new LinkedHashMap<String, InlineVariantChoice>();
        for (int index = 0; index < recipe.ingredients.size(); index += 1) {
            Recipe.Group group = recipe.ingredients.get(index);
            if (!isVariantIngredientGroup(group, recipe)) continue;
            if (group.variantKey.length() > 0) {
                InlineVariantChoice choice = grouped.get(group.variantKey);
                if (choice == null) {
                    choice = new InlineVariantChoice(cleanVariantGroupLabel(group.title));
                    grouped.put(group.variantKey, choice);
                    choices.add(choice);
                }
                choice.groups.add(group);
            } else {
                choices.add(new InlineVariantChoice(cleanVariantGroupLabel(group.title), group));
            }
        }
        if (choices.isEmpty() && recipe.variantGroups) {
            for (Recipe.Group group : recipe.ingredients) {
                choices.add(new InlineVariantChoice(cleanVariantGroupLabel(group.title), group));
            }
        }
        return choices;
    }

    int selectedInlineVariantIndex(Recipe recipe, List<InlineVariantChoice> choices) {
        Integer saved = host.inlineVariantSelections.get(recipe.id);
        int index = saved == null ? 0 : saved.intValue();
        if (index < 0 || index >= choices.size()) return 0;
        return index;
    }

    InlineVariantChoice selectedInlineVariantChoice(Recipe recipe) {
        List<InlineVariantChoice> choices = inlineVariantChoices(recipe);
        if (choices.isEmpty()) return null;
        return choices.get(selectedInlineVariantIndex(recipe, choices));
    }

    List<Recipe.Group> selectedIngredientGroups(Recipe recipe) {
        if (!recipe.variantGroups) return recipe.ingredients;

        List<Recipe.Group> groups = new ArrayList<Recipe.Group>();
        for (Recipe.Group group : recipe.ingredients) {
            if ("__hidden__".equals(group.variantKey)) continue;
            if (!isVariantIngredientGroup(group, recipe)) groups.add(group);
        }

        InlineVariantChoice selected = selectedInlineVariantChoice(recipe);
        if (selected != null) {
            for (Recipe.Group group : selected.groups) {
                if (!groups.contains(group)) groups.add(group);
            }
        }
        return groups;
    }

    List<String> selectedRecipeSteps(Recipe recipe) {
        if (!recipe.variantGroups) return recipe.steps;
        InlineVariantChoice selected = selectedInlineVariantChoice(recipe);
        if (selected != null) {
            List<String> steps = new ArrayList<String>();
            for (Recipe.Group group : selected.groups) steps.addAll(group.steps);
            if (!steps.isEmpty()) return steps;
        }
        return recipe.steps;
    }

    boolean isVariantIngredientGroup(Recipe.Group group, Recipe recipe) {
        if ("__shared__".equals(group.variantKey) || "__hidden__".equals(group.variantKey)) return false;
        String label = CookNoteRepository.normalize(group.title);
        if (label.indexOf("base commune") >= 0 || "base".equals(label) || label.indexOf("commun") >= 0) return false;
        if (label.matches("^\\d+.*")) return true;
        if (label.startsWith("variante") || label.startsWith("version") || label.startsWith("option")) return true;
        return recipe.variantGroups;
    }

    String cleanVariantGroupLabel(String value) {
        String label = value == null ? "" : value.trim();
        label = label.replaceFirst("(?i)^\\s*(variante|version|option)\\s*[:\\-]?\\s*", "");
        return label.length() == 0 ? "Pr\u00E9paration" : label;
    }

    List<String> labelsForInlineChoices(List<InlineVariantChoice> choices) {
        List<String> labels = new ArrayList<String>();
        for (InlineVariantChoice choice : choices) {
            labels.add(choice.label);
        }
        return labels;
    }

    void updateInlineVariantMeta(TextView meta, Recipe recipe, InlineVariantChoice choice) {
        int ingredientCount = 0;
        for (Recipe.Group selectedGroup : choice.groups) ingredientCount += selectedGroup.items.size();
        for (Recipe.Group group : recipe.ingredients) {
            if ("__hidden__".equals(group.variantKey)) continue;
            if (!isVariantIngredientGroup(group, recipe)) ingredientCount += group.items.size();
        }
        int stepCount = 0;
        for (Recipe.Group selectedGroup : choice.groups) stepCount += selectedGroup.steps.size();
        if (stepCount == 0) stepCount = recipe.steps.size();
        StringBuilder builder = new StringBuilder();
        builder.append("Variante selectionnee : ").append(choice.label);
        builder.append(" - ").append(ingredientCount).append(ingredientCount > 1 ? " ingr\u00E9dients" : " ingr\u00E9dient");
        builder.append(" - ").append(stepCount).append(stepCount > 1 ? " \u00E9tapes" : " \u00E9tape");
        meta.setText(builder.toString());
    }

    void addIngredients(LinearLayout content, Recipe recipe) {
        List<Recipe.Group> groups = selectedIngredientGroups(recipe);
        int ingredientCount = countSelectedIngredients(recipe);
        LinearLayout section = host.addSection(content, "Ingr\u00E9dients", ingredientCount > 0 ? countLabel(ingredientCount, "\u00E9l\u00E9ment", "\u00E9l\u00E9ments") : null);
        if (groups.isEmpty()) {
            host.body(section, "Aucun ingredient detaille pour cette fiche.");
            return;
        }
        Button copy = host.sectionButton("Copier les ingr\u00E9dients", false);
        section.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyIngredients(recipe);
            }
        });
        Button reset = host.sectionButton("R\u00E9initialiser la pr\u00E9paration", false);
        reset.setEnabled(hasIngredientChecks(recipe));
        section.addView(reset);
        reset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearIngredientChecks(recipe);
                openRecipe(recipe, false);
            }
        });
        for (Recipe.Group group : groups) {
            addIngredientGroup(section, recipe, group, !recipe.variantGroups);
        }
    }

    boolean hasIngredientChecks(Recipe recipe) {
        if (recipe == null) return false;
        String prefix = "ing|" + recipe.id + "|";
        for (String key : host.ingredientDoneKeys) {
            if (key.startsWith(prefix)) return true;
        }
        return false;
    }

    void clearIngredientChecks(Recipe recipe) {
        if (recipe == null) return;
        String prefix = "ing|" + recipe.id + "|";
        ArrayList<String> remove = new ArrayList<String>();
        for (String key : host.ingredientDoneKeys) {
            if (key.startsWith(prefix)) remove.add(key);
        }
        host.ingredientDoneKeys.removeAll(remove);
        host.saveUserState();
    }

    void addSteps(LinearLayout content, Recipe recipe) {
        List<String> steps = selectedRecipeSteps(recipe);
        LinearLayout section = host.addSection(content, "\u00C9tapes");
        if (steps.isEmpty()) {
            host.body(section, "Aucune \u00E9tape d\u00E9taill\u00E9e pour cette fiche.");
            return;
        }
        for (int index = 0; index < steps.size(); index += 1) {
            host.stepRow(section, index + 1, steps.get(index));
        }
    }

    void addIngredientGroup(LinearLayout section, Recipe recipe, Recipe.Group group, boolean includeGroupSteps) {
        host.subTitle(section, group.title);
        for (String item : group.items) {
            addIngredientCheckRow(section, recipe, group, item);
        }
        if (group.note.length() > 0) host.body(section, group.note, COLOR_MUTED);
        if (includeGroupSteps) {
            for (String step : group.steps) {
                host.bulletRow(section, step);
            }
        }
    }

    void addIngredientCheckRow(LinearLayout section, Recipe recipe, Recipe.Group group, final String item) {
        final String key = "ing|" + recipe.id + "|" + CookNoteRepository.normalize(group.title) + "|" + CookNoteRepository.normalize(item);
        CheckBox checkBox = new CheckBox(host);
        checkBox.setText(frenchSpacing(host.scaleIngredient(item)));
        checkBox.setTextColor(COLOR_TEXT);
        checkBox.setTextSize(host.adjustedTextSize(13));
        checkBox.setTypeface(Typeface.DEFAULT);
        checkBox.setButtonTintList(null);
        checkBox.setFocusable(false);
        checkBox.setClickable(true);
        checkBox.setPadding(dp(7), dp(5), dp(7), dp(6));
        checkBox.setBackground(panelGradient(COLOR_CARD, COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 7));
        checkBox.setChecked(host.ingredientDoneKeys.contains(key));
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) host.ingredientDoneKeys.add(key);
                else host.ingredientDoneKeys.remove(key);
                host.saveUserState();
            }
        });
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(5);
        section.addView(checkBox, params);
    }

    void addParentPath(LinearLayout content, Recipe recipe) {
        List<Recipe> trail = host.repository.parentTrail(recipe);
        if (trail.isEmpty()) return;
        StringBuilder builder = new StringBuilder();
        for (Recipe parent : trail) {
            if (builder.length() > 0) builder.append("  /  ");
            builder.append(parent.title);
        }
        TextView path = host.text(builder.toString(), 12, COLOR_MUTED, true);
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

    void copyIngredients(Recipe recipe) {
        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText(recipe.title + " - ingredients", buildIngredientsText(recipe)));
        Toast.makeText(host, "Ingr\u00E9dients copi\u00E9s", Toast.LENGTH_SHORT).show();
    }

    void copyRecipe(Recipe recipe) {
        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText(recipe.title, buildRecipeText(recipe)));
        Toast.makeText(host, "Fiche copi\u00E9e", Toast.LENGTH_SHORT).show();
    }

    String buildIngredientsText(Recipe recipe) {
        StringBuilder builder = new StringBuilder();
        builder.append(recipe.title).append('\n');
        builder.append("Ingredients").append('\n');
        appendIngredients(builder, recipe);
        return builder.toString().trim();
    }

    String buildRecipeText(Recipe recipe) {
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

    void appendIngredients(StringBuilder builder, Recipe recipe) {
        for (Recipe.Group group : selectedIngredientGroups(recipe)) {
            builder.append('\n').append(group.title).append('\n');
            for (String item : group.items) {
                builder.append("- ").append(host.scaleIngredient(item)).append('\n');
            }
            if (group.note.length() > 0) builder.append("Note: ").append(group.note).append('\n');
        }
    }

    static final class VariantChoice {
        final String label;
        final Recipe recipe;

        VariantChoice(String label, Recipe recipe) {
            this.label = label;
            this.recipe = recipe;
        }
    }

    static final class InlineVariantChoice {
        final String label;
        final List<Recipe.Group> groups = new ArrayList<Recipe.Group>();

        InlineVariantChoice(String label, Recipe.Group group) {
            this.label = label;
            this.groups.add(group);
        }

        InlineVariantChoice(String label) {
            this.label = label;
        }
    }
}
