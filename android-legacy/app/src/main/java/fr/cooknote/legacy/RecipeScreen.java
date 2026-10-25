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
        host.imageLoader.prefetchDetail(recipe.detailImage, detailImageRequestWidth(), detailHeroHeight());

        LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);

        LinearLayout top = new LinearLayout(host);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        top.setPadding(dp(10), dp(6), dp(10), dp(6));
        top.setBackground(panelGradient(COLOR_PANEL_DEEP, COLOR_PANEL, COLOR_BORDER, 1, 0));
        root.addView(top, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        Button back = new Button(host);
        back.setText("Retour");
        back.setTextColor(COLOR_TEXT_DARK);
        back.setTextSize(12);
        back.setTypeface(Typeface.DEFAULT_BOLD);
        back.setAllCaps(false);
        back.setBackground(buttonPanel(true));
        top.addView(back, new LinearLayout.LayoutParams(dp(86), dp(36)));
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.goBack();
            }
        });

        TextView topTitle = host.text(recipe.isCollection() ? "Collection" : "Fiche recette", 12, COLOR_MUTED, true);
        topTitle.setGravity(Gravity.CENTER_VERTICAL);
        topTitle.setPadding(dp(12), 0, 0, 0);
        topTitle.setSingleLine(true);
        topTitle.setEllipsize(TextUtils.TruncateAt.END);
        top.addView(topTitle, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        ScrollView scroll = new ScrollView(host);
        scroll.setFillViewport(false);
        scroll.setSmoothScrollingEnabled(true);
        scroll.setOverScrollMode(View.OVER_SCROLL_NEVER);
        scroll.setVerticalScrollBarEnabled(false);
        scroll.setFadingEdgeLength(0);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(12), dp(12), dp(12), dp(24));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        addDetailHero(content, recipe);
        if (!recipe.isCollection()) addHeroActions(content, recipe);
        addQuickFacts(content, recipe);
        if (!recipe.isCollection()) addQuantityControls(content, recipe);

        if (recipe.isCollection()) {
            addCollectionCards(content, recipe);
        } else {
            if (recipe.variantGroups) addInlineVariantPicker(content, recipe);
            addRecipeContentGrid(content, recipe);
        }

        host.setContentView(root);
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog("openRecipe:" + recipe.id, startedAt);
    }

    void addDetailHero(LinearLayout content, final Recipe recipe) {
        FrameLayout heroCard = new FrameLayout(host);
        heroCard.setBackground(panel(COLOR_CARD, COLOR_BORDER_BRIGHT, 1, 16));
        int heroHeight = detailHeroHeight();
        content.addView(heroCard, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                heroHeight
        ));

        ImageView hero = new ImageView(host);
        hero.setScaleType(ImageView.ScaleType.CENTER_CROP);
        hero.setBackgroundColor(COLOR_CARD);
        hero.setContentDescription("Image de " + recipe.title);
        heroCard.addView(hero, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        host.imageLoader.loadDetail(recipe.detailImage, hero, detailImageRequestWidth(), heroHeight);

        View veil = new View(host);
        veil.setBackgroundColor(Color.argb(recipe.isCollection() ? 96 : 66, 0, 0, 0));
        heroCard.addView(veil, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        host.addFrameAccent(heroCard);

        LinearLayout overlay = new LinearLayout(host);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(15), dp(7), dp(15), dp(8));
        overlay.setBackground(bottomOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        heroCard.addView(overlay, overlayParams);

        host.animateIn(heroCard, 0);

        TextView breadcrumb = host.text(detailBreadcrumb(recipe), 10, COLOR_MUTED, true);
        breadcrumb.setSingleLine(true);
        breadcrumb.setEllipsize(TextUtils.TruncateAt.END);
        overlay.addView(breadcrumb);

        TextView title = host.text(recipe.title, recipe.isCollection() ? 25 : 24, COLOR_TEXT, false);
        title.setTypeface(Ui.DISPLAY);
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
        if (builder.length() == "Cook Note".length()) builder.append(recipe.isCollection() ? " / Collection" : " / Fiche");
        return builder.toString();
    }

    String detailMetaLine(Recipe recipe) {
        if (recipe.isCollection()) return countLabel(host.repository.collectionCount(recipe), "fiche rangee", "fiches rangees");

        ArrayList<String> parts = new ArrayList<String>();
        String serving = servingSummary(recipe);
        if (serving.length() > 0) parts.add(serving);
        int totalTime = recipe.activeTime + recipe.cookTime;
        if (totalTime > 0) parts.add(formatMinutes(totalTime));
        int ingredientCount = countSelectedIngredients(recipe);
        if (ingredientCount > 0) parts.add(countLabel(ingredientCount, "ingredient", "ingredients"));
        return joinMetaParts(parts, "Fiche Cook Note");
    }

    int detailHeroHeight() {
        int width = host.getResources().getDisplayMetrics().widthPixels - dp(28);
        int height = Math.max(dp(124), (width * 9) / 32);
        return Math.min(dp(215), height);
    }

    int detailImageRequestWidth() {
        int width = host.getResources().getDisplayMetrics().widthPixels - dp(28);
        return Math.max(dp(360), Math.min(width, MainActivity.DETAIL_IMAGE_MAX_WIDTH));
    }

    void addHeroActions(LinearLayout content, final Recipe recipe) {
        LinearLayout panel = new LinearLayout(host);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setPadding(dp(10), dp(9), dp(10), dp(10));
        panel.setBackground(panelGradient(COLOR_PANEL, COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 8));
        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        panelParams.topMargin = dp(10);
        content.addView(panel, panelParams);

        host.addAccentLine(panel, 0, 8);

        TextView label = host.text("Actions rapides", 10, COLOR_GOLD, true);
        label.setSingleLine(true);
        label.setLetterSpacing(0.06f);
        label.setIncludeFontPadding(false);
        panel.addView(label);

        ArrayList<Button> buttons = new ArrayList<Button>();

        Button shopping = host.actionButton(host.isInShopping(recipe.id) ? "Dans courses" : "+ Courses", true);
        shopping.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.toggleShopping(recipe);
                openRecipe(recipe, false);
            }
        });
        buttons.add(shopping);

        Button copy = host.actionButton("Copier", false);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyRecipe(recipe);
            }
        });
        buttons.add(copy);

        Button screen = host.actionButton(host.keepScreenOn ? "Ecran actif" : "Veille auto", host.keepScreenOn);
        screen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.setKeepScreenOn(!host.keepScreenOn);
                openRecipe(recipe, false);
            }
        });
        buttons.add(screen);

        int perRow = host.getResources().getDisplayMetrics().widthPixels >= dp(720) ? 4 : 2;
        LinearLayout row = null;
        for (int index = 0; index < buttons.size(); index += 1) {
            if (index % perRow == 0) {
                row = new LinearLayout(host);
                row.setOrientation(LinearLayout.HORIZONTAL);
                LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
                rowParams.topMargin = dp(index == 0 ? 9 : 7);
                panel.addView(row, rowParams);
            }
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(34), 1);
            if (index % perRow < perRow - 1) params.rightMargin = dp(7);
            row.addView(buttons.get(index), params);
        }
    }

    void addQuickFacts(LinearLayout content, Recipe recipe) {
        ArrayList<String[]> facts = new ArrayList<String[]>();

        if (recipe.isCollection()) {
            facts.add(new String[]{"Collection", countLabel(host.repository.collectionCount(recipe), "fiche", "fiches")});
        } else {
            String serving = servingSummary(recipe);
            if (serving.length() > 0) {
                facts.add(new String[]{baseServings(recipe) > 0 ? servingSectionTitle(recipe) : "Quantite", serving});
            }
            if (recipe.activeTime > 0) facts.add(new String[]{"Actif", formatMinutes(recipe.activeTime)});
            if (recipe.cookTime > 0) facts.add(new String[]{"Cuisson", formatMinutes(recipe.cookTime)});
            int totalTime = recipe.activeTime + recipe.cookTime;
            if (totalTime > 0) facts.add(new String[]{"Temps", formatMinutes(totalTime)});
            int ingredientCount = countSelectedIngredients(recipe);
            if (ingredientCount > 0) facts.add(new String[]{"Ingredients", String.valueOf(ingredientCount)});
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

        int columns = quickFactColumns();
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
            TextView help = host.text("Choisis la quantite servie. Les ingredients, la copie et les courses suivent.", 12, COLOR_MUTED, false);
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

        LinearLayout section = host.addSection(content, "Quantites", "x" + factorLabel(host.quantityFactor));
        TextView help = host.text("Ajuste les ingredients affiches, la copie et les courses fusionnees.", 12, COLOR_MUTED, false);
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

    void addCollectionCards(LinearLayout content, final Recipe recipe) {
        final List<VariantChoice> choices = collectionVariantChoices(recipe);
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
        card.setBackground(selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, COLOR_BORDER, 1, 8));
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

        host.addFrameAccent(frame);

        LinearLayout overlay = new LinearLayout(host);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setPadding(dp(12), dp(10), dp(12), dp(12));
        overlay.setBackground(cardTitleOverlayGradient());
        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        frame.addView(overlay, overlayParams);

        TextView title = host.text(choice.label, 15, COLOR_TEXT, true);
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
                "Chaque choix affiche sa recette complete : ingredients, etapes et conseils.",
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
        return label.length() == 0 ? "Preparation" : label;
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
        builder.append(" - ").append(ingredientCount).append(ingredientCount > 1 ? " ingredients" : " ingredient");
        builder.append(" - ").append(stepCount).append(stepCount > 1 ? " etapes" : " etape");
        meta.setText(builder.toString());
    }

    void addIngredients(LinearLayout content, Recipe recipe) {
        List<Recipe.Group> groups = selectedIngredientGroups(recipe);
        int ingredientCount = countSelectedIngredients(recipe);
        LinearLayout section = host.addSection(content, "Ingredients", ingredientCount > 0 ? countLabel(ingredientCount, "element", "elements") : null);
        if (groups.isEmpty()) {
            host.body(section, "Aucun ingredient detaille pour cette fiche.");
            return;
        }
        Button copy = host.sectionButton("Copier ingredients", false);
        section.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyIngredients(recipe);
            }
        });
        Button reset = host.sectionButton("Reinitialiser la preparation", false);
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
        LinearLayout section = host.addSection(content, "Etapes");
        if (steps.isEmpty()) {
            host.body(section, "Aucune etape detaillee pour cette fiche.");
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
        checkBox.setText(host.scaleIngredient(item));
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
        Toast.makeText(host, "Ingredients copies", Toast.LENGTH_SHORT).show();
    }

    void copyRecipe(Recipe recipe) {
        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText(recipe.title, buildRecipeText(recipe)));
        Toast.makeText(host, "Fiche copiee", Toast.LENGTH_SHORT).show();
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
