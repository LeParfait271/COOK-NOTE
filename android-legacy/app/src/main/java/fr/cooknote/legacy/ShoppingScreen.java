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
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
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

                Button remove = host.sectionButton("Retirer cette recette", false);
                section.addView(remove);
                remove.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        host.removeShopping(id);
                        showShoppingList();
                    }
                });

                for (Recipe.Group group : host.recipeScreen.selectedIngredientGroups(recipe)) {
                    host.subTitle(section, group.title);
                    for (String item : group.items) {
                        addShoppingCheckRow(section, recipe, group, item);
                    }
                    if (group.note.length() > 0) host.body(section, group.note, COLOR_MUTED);
                }
            }
        }

        host.setContentView(root);
        if (MainActivity.PERF_LOG_ENABLED) host.perfLog("showShoppingList", startedAt);
    }

    void addMergedShoppingSection(LinearLayout content) {
        List<ShoppingList.ShoppingLine> lines = host.shopping.mergedLines(host.ingredientSource, host.quantityFactor);
        LinearLayout section = host.addSection(content, "Courses fusionnees", countLabel(lines.size(), "ligne", "lignes"));
        if (lines.isEmpty()) {
            host.body(section, "Aucun ingredient disponible.");
            return;
        }
        host.body(section, "Les quantites identiques sont additionnees automatiquement.", COLOR_MUTED);
        for (ShoppingList.ShoppingLine line : lines) {
            addMergedShoppingCheckRow(section, line);
        }
    }

    void addMergedShoppingCheckRow(LinearLayout section, final ShoppingList.ShoppingLine line) {
        CheckBox checkBox = new CheckBox(host);
        checkBox.setText(line.display());
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
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.topMargin = dp(5);
        section.addView(checkBox, params);
    }

    void addShoppingCheckRow(LinearLayout section, final Recipe recipe, Recipe.Group group, final String item) {
        final String key = ShoppingList.itemKey(recipe, group, item);
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
