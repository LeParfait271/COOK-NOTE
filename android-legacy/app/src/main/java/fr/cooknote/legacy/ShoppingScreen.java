package fr.cooknote.legacy;

import android.app.AlertDialog;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.text.style.RelativeSizeSpan;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;


import static fr.cooknote.legacy.Ingredients.*;
import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Texts.*;
import static fr.cooknote.legacy.Ui.*;

/** Ecran Courses : liste fusionnee cochable, copie et envoi par QR code. */
final class ShoppingScreen {
    private final MainActivity host;

    ShoppingScreen(MainActivity host) {
        this.host = host;
    }

    void showShoppingList() {
        showShoppingList(false);
    }

    void showShoppingList(boolean pushCurrent) {
        long startedAt = host.perfStart();
        if (pushCurrent) host.pushNavigationState();
        host.releaseScreenImages();
        host.currentScreen = MainActivity.SCREEN_SHOPPING;
        host.currentRecipeId = "";
        host.showingDetail = true;
        host.releaseListSurface();
        host.applyKeepScreenOn();

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

        TextView title = host.text("Liste de courses", 17, COLOR_TEXT, true);
        title.setGravity(Gravity.CENTER_VERTICAL);
        title.setPadding(dp(12), 0, 0, 0);
        top.addView(title, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        ScrollView scroll = new ScrollView(host);
        scroll.setSmoothScrollingEnabled(true);
        scroll.setOverScrollMode(View.OVER_SCROLL_NEVER);
        scroll.setVerticalScrollBarEnabled(false);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(12), dp(12), dp(12), dp(24));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1
        ));

        LinearLayout actions = host.addSection(content, "Courses", countLabel(host.shopping.recipeIds.size(), "fiche", "fiches"));
        host.body(actions, countLabel(host.shopping.recipeIds.size(), "recette dans la liste", "recettes dans la liste"), COLOR_MUTED);

        Button copy = host.sectionButton("Copier la liste", true);
        copy.setEnabled(!host.shopping.recipeIds.isEmpty());
        actions.addView(copy);
        copy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyShoppingList();
            }
        });

        Button copyTodo = host.sectionButton("Copier a faire", false);
        copyTodo.setEnabled(!host.shopping.recipeIds.isEmpty());
        actions.addView(copyTodo);
        copyTodo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                copyShoppingTodo();
            }
        });

        Button phone = host.sectionButton("Sur mon telephone (QR code)", false);
        phone.setEnabled(!host.shopping.recipeIds.isEmpty());
        actions.addView(phone);
        phone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showShoppingTransferQr();
            }
        });

        Button resetDone = host.sectionButton("Tout decocher", false);
        resetDone.setEnabled(!host.shopping.doneKeys.isEmpty());
        actions.addView(resetDone);
        resetDone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clearShoppingDone();
            }
        });

        Button clear = host.sectionButton("Vider la liste", false);
        clear.setEnabled(!host.shopping.recipeIds.isEmpty());
        actions.addView(clear);
        clear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.clearShoppingList();
            }
        });

        if (host.shopping.recipeIds.isEmpty()) {
            host.body(actions, "Ajoute une recette depuis une fiche pour preparer les courses.");
        } else {
            addMergedShoppingSection(content);
            ArrayList<String> ids = new ArrayList<String>(host.shopping.recipeIds);
            for (final String id : ids) {
                final Recipe recipe = host.repository.find(id);
                if (recipe == null) continue;
                LinearLayout section = host.addSection(content, recipe.title);
                TextView meta = host.text(recipe.metaLine(), 12, COLOR_DIM, false);
                meta.setPadding(0, dp(5), 0, dp(3));
                section.addView(meta);
                addRecipePortions(section, recipe);

                Button remove = host.sectionButton("Retirer cette recette", false);
                section.addView(remove);
                remove.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        host.removeShopping(id);
                        showShoppingList();
                    }
                });

                float factor = host.shopping.factorFor(id, host.quantityFactor);
                for (Recipe.Group group : host.recipeScreen.selectedIngredientGroups(recipe)) {
                    host.subTitle(section, group.title);
                    for (String item : group.items) {
                        if (ShoppingItems.isNonIngredient(item)) continue;
                        addShoppingCheckRow(section, recipe, group, item, factor);
                    }
                    if (group.note.length() > 0) host.body(section, group.note, COLOR_MUTED);
                }
            }
        }

        host.showScreen(root);
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog("showShoppingList", startedAt);
    }

    void addMergedShoppingSection(LinearLayout content) {
        List<ShoppingList.ShoppingLine> lines = host.shopping.mergedLines(host.ingredientSource, host.quantityFactor);
        ArrayList<ShoppingList.ShoppingLine> toBuy = new ArrayList<ShoppingList.ShoppingLine>();
        ArrayList<ShoppingList.ShoppingLine> owned = new ArrayList<ShoppingList.ShoppingLine>();
        for (ShoppingList.ShoppingLine line : lines) {
            if (line.owned) owned.add(line);
            else toBuy.add(line);
        }
        LinearLayout section = host.addSection(content, "Courses fusionnees", countLabel(toBuy.size(), "article", "articles"));
        if (lines.isEmpty()) {
            host.body(section, "Aucun ingredient disponible.");
            return;
        }
        host.body(section, "Les quantites sont additionnees ; le format a acheter est indique sous l'article.", COLOR_MUTED);
        for (ShoppingList.ShoppingLine line : toBuy) {
            addMergedShoppingCheckRow(section, line);
        }
        if (!owned.isEmpty()) addOwnedSection(content, owned);
    }

    // Deja a la maison : « Toujours » garde l'article au placard pour les
    // prochaines listes ; toucher l'article le remet a acheter (et le sort du
    // placard).
    void addOwnedSection(LinearLayout content, List<ShoppingList.ShoppingLine> owned) {
        LinearLayout section = host.addSection(content, "Deja a la maison", countLabel(owned.size(), "article", "articles"));
        host.body(section, "« Toujours » garde l'article au placard : il sera range d'office dans tes prochaines listes.", COLOR_MUTED);
        for (final ShoppingList.ShoppingLine line : owned) {
            LinearLayout row = new LinearLayout(host);
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.setGravity(Gravity.CENTER_VERTICAL);
            LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
            );
            rowParams.topMargin = dp(6);
            section.addView(row, rowParams);

            Button putBack = host.actionButton(line.display(), false);
            putBack.setContentDescription("Remettre " + line.item.displayName() + " dans la liste a acheter");
            putBack.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    host.shopping.ownedKeys.remove(line.item.key);
                    host.shopping.stapleKeys.remove(line.item.stapleKey());
                    host.saveUserState();
                    showShoppingList();
                }
            });
            LinearLayout.LayoutParams putBackParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
            putBackParams.rightMargin = dp(7);
            row.addView(putBack, putBackParams);

            Button staple = host.actionButton(line.staple ? "Placard ✓" : "Toujours", line.staple);
            staple.setContentDescription(line.staple
                    ? "Ne plus garder " + line.item.displayName() + " au placard"
                    : "Garder " + line.item.displayName() + " au placard pour les prochaines listes");
            staple.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (line.staple) {
                        host.shopping.stapleKeys.remove(line.item.stapleKey());
                        // Sorti du placard : reste deja a la maison pour cette liste.
                        host.shopping.ownedKeys.add(line.item.key);
                    } else {
                        host.shopping.stapleKeys.add(line.item.stapleKey());
                    }
                    host.saveUserState();
                    showShoppingList();
                }
            });
            row.addView(staple, new LinearLayout.LayoutParams(dp(110), dp(40)));
        }
    }

    // Portions d'une recette de la liste, modifiables ici sans rouvrir la fiche.
    void addRecipePortions(LinearLayout section, final Recipe recipe) {
        final int base = host.recipeScreen.baseServings(recipe);
        final float factor = host.shopping.factorFor(recipe.id, host.quantityFactor);
        if (base > 0) {
            final ArrayList<Integer> servings = host.recipeScreen.servingOptions(base);
            ArrayList<String> labels = new ArrayList<String>();
            for (Integer serving : servings) labels.add(host.recipeScreen.servingLabel(recipe, serving.intValue()));
            int selected = host.recipeScreen.clampServingChoice(Math.round(base * factor), base);
            final int selectedIndex = Math.max(0, servings.indexOf(Integer.valueOf(selected)));
            Spinner spinner = host.createSpinner(labels);
            spinner.setSelection(selectedIndex);
            section.addView(spinner, host.fullWidthParams(dp(6), dp(44)));
            spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                    if (position == selectedIndex) return;
                    setRecipeFactor(recipe, (float) servings.get(position).intValue() / (float) base);
                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {
                }
            });
            return;
        }
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        section.addView(row, host.fullWidthParams(dp(6), dp(36)));
        for (int index = 0; index < MainActivity.QUANTITY_FACTORS.length; index += 1) {
            final float choice = MainActivity.QUANTITY_FACTORS[index];
            Button button = host.actionButton("x" + host.recipeScreen.factorLabel(choice), sameFactor(factor, choice));
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    setRecipeFactor(recipe, choice);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            if (index < MainActivity.QUANTITY_FACTORS.length - 1) params.rightMargin = dp(5);
            row.addView(button, params);
        }
    }

    void setRecipeFactor(Recipe recipe, float factor) {
        host.shopping.factors.put(recipe.id, host.clampQuantityFactor(factor));
        host.saveUserState();
        showShoppingList();
    }

    void addMergedShoppingCheckRow(LinearLayout section, final ShoppingList.ShoppingLine line) {
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.topMargin = dp(5);
        section.addView(row, rowParams);

        CheckBox checkBox = new CheckBox(host);
        String hint = line.item.purchaseHint();
        if (hint.length() > 0) {
            SpannableString label = new SpannableString(line.display() + "\nAchat : " + hint);
            int start = line.display().length() + 1;
            label.setSpan(new RelativeSizeSpan(0.82f), start, label.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            label.setSpan(new ForegroundColorSpan(COLOR_GOLD), start, label.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            checkBox.setText(label);
        } else {
            checkBox.setText(line.display());
        }
        checkBox.setTextColor(COLOR_TEXT);
        checkBox.setTextSize(host.adjustedTextSize(13));
        checkBox.setTypeface(Typeface.DEFAULT);
        checkBox.setButtonTintList(null);
        checkBox.setFocusable(false);
        checkBox.setClickable(true);
        checkBox.setPadding(dp(7), dp(5), dp(7), dp(6));
        checkBox.setBackground(panelGradient(COLOR_CARD, COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 7));
        checkBox.setChecked(host.shopping.doneKeys.contains(line.doneKey));
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    host.shopping.doneKeys.add(line.doneKey);
                } else {
                    host.shopping.doneKeys.remove(line.doneKey);
                }
                host.saveUserState();
            }
        });
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        params.rightMargin = dp(7);
        row.addView(checkBox, params);

        Button owned = host.actionButton("J'ai deja", false);
        owned.setContentDescription("Marquer " + line.item.displayName() + " comme deja a la maison");
        owned.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                host.shopping.ownedKeys.add(line.item.key);
                host.saveUserState();
                showShoppingList();
            }
        });
        row.addView(owned, new LinearLayout.LayoutParams(dp(96), dp(40)));
    }

    void addShoppingCheckRow(LinearLayout section, final Recipe recipe, Recipe.Group group, final String item, float factor) {
        final String key = ShoppingList.itemKey(recipe, group, item);
        CheckBox checkBox = new CheckBox(host);
        checkBox.setText(scale(item, factor));
        checkBox.setTextColor(COLOR_TEXT);
        checkBox.setTextSize(host.adjustedTextSize(13));
        checkBox.setTypeface(Typeface.DEFAULT);
        checkBox.setButtonTintList(null);
        checkBox.setFocusable(false);
        checkBox.setClickable(true);
        checkBox.setPadding(dp(7), dp(5), dp(7), dp(6));
        checkBox.setBackground(panelGradient(COLOR_CARD, COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 7));
        checkBox.setChecked(host.shopping.doneKeys.contains(key));
        checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    host.shopping.doneKeys.add(key);
                } else {
                    host.shopping.doneKeys.remove(key);
                }
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

    void copyShoppingTodo() {
        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note - courses a faire", host.shoppingText(true, false)));
        Toast.makeText(host, "Courses restantes copiees", Toast.LENGTH_SHORT).show();
    }

    // Meme format que le site (#courses=id*facteur,...) : le telephone scanne le
    // code et ouvre la liste dans Cook Note web, sans serveur ni compte.
    private void showShoppingTransferQr() {
        QrCode qr;
        try {
            qr = QrCode.encodeText(host.shopping.transferUrl(host.quantityFactor));
        } catch (IllegalArgumentException exception) {
            Toast.makeText(host, "Liste trop longue pour un QR code", Toast.LENGTH_SHORT).show();
            return;
        }
        int border = 4;
        int modules = qr.size + border * 2;
        int scale = Math.max(2, dp(260) / modules);
        int pixelsSize = modules * scale;
        int[] pixels = new int[pixelsSize * pixelsSize];
        for (int y = 0; y < pixelsSize; y += 1) {
            int moduleY = y / scale - border;
            for (int x = 0; x < pixelsSize; x += 1) {
                pixels[y * pixelsSize + x] = qr.isDark(x / scale - border, moduleY) ? Color.BLACK : Color.WHITE;
            }
        }
        ImageView image = new ImageView(host);
        image.setImageBitmap(Bitmap.createBitmap(pixels, pixelsSize, pixelsSize, Bitmap.Config.RGB_565));
        image.setContentDescription("QR code de la liste de courses");

        LinearLayout box = new LinearLayout(host);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER_HORIZONTAL);
        box.setPadding(dp(18), dp(16), dp(18), dp(8));
        box.addView(image, new LinearLayout.LayoutParams(pixelsSize, pixelsSize));
        TextView hint = host.text("Scanne ce code avec l appareil photo du telephone : la liste s ouvre dans Cook Note, prete pour le magasin.", 14, COLOR_MUTED, false);
        hint.setGravity(Gravity.CENTER);
        hint.setPadding(0, dp(12), 0, 0);
        box.addView(hint);

        new AlertDialog.Builder(host)
                .setTitle("Liste sur le telephone")
                .setView(box)
                .setPositiveButton("Fermer", null)
                .show();
    }

    void clearShoppingDone() {
        host.shopping.doneKeys.clear();
        host.saveUserState();
        showShoppingList();
    }

    void copyShoppingList() {
        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
        if (clipboard == null) return;
        clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note - liste de courses", host.shoppingText(false, true)));
        Toast.makeText(host, "Liste de courses copiee", Toast.LENGTH_SHORT).show();
    }
}
