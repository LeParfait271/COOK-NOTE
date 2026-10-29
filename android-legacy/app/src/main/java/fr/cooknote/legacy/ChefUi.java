package fr.cooknote.legacy;

import android.app.Dialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Ui.*;

/**
 * Ecrans du parcours de chef (comme le site) : embleme de rang, panneau
 * Classement / Techniques, verdict apres un plat, QR code de transfert.
 */
final class ChefUi {
    interface Done {
        void onResult(Chef.Result result);
    }

    // ---------- Embleme : hexagone aux couleurs du rang, toque, ruban ----------
    static final class EmblemView extends View {
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private int tier;
        private String roman = "V";
        private boolean dim;

        EmblemView(Context context) {
            super(context);
        }

        void set(int tier, String roman, boolean dim) {
            this.tier = tier;
            this.roman = roman;
            this.dim = dim;
            invalidate();
        }

        @Override
        protected void onDraw(Canvas canvas) {
            float scale = Math.min(getWidth() / 100f, getHeight() / 112f);
            canvas.save();
            canvas.translate((getWidth() - 100 * scale) / 2f, (getHeight() - 112 * scale) / 2f);
            canvas.scale(scale, scale);
            int light = Chef.RANK_COLORS[tier][0];
            int dark = Chef.RANK_COLORS[tier][1];
            if (dim) {
                light = Color.rgb(90, 84, 76);
                dark = Color.rgb(48, 44, 40);
            }
            paint.setStyle(Paint.Style.FILL);
            paint.setShader(null);
            if (!dim) {
                paint.setColor(Color.argb(46, Color.red(light), Color.green(light), Color.blue(light)));
                canvas.drawCircle(50, 48, 50, paint);
            }
            paint.setShader(new LinearGradient(0, 0, 40, 100, new int[]{light, dark, light}, new float[]{0f, 0.55f, 1f}, Shader.TileMode.CLAMP));
            canvas.drawPath(hexagon(50, 48, 38, 44), paint);
            paint.setShader(null);
            paint.setColor(Color.argb(200, 12, 10, 8));
            canvas.drawPath(hexagon(50, 48, 30, 35), paint);
            paint.setColor(light);
            Path toque = new Path();
            toque.moveTo(35, 57);
            toque.cubicTo(27, 55, 26, 42, 35, 41);
            toque.cubicTo(35, 32, 46, 29, 50, 35);
            toque.cubicTo(54, 29, 65, 32, 65, 41);
            toque.cubicTo(74, 42, 73, 55, 65, 57);
            toque.close();
            canvas.drawPath(toque, paint);
            canvas.drawRoundRect(new RectF(36, 58, 64, 66), 2, 2, paint);
            paint.setColor(dark);
            paint.setStrokeWidth(1.4f);
            paint.setStrokeCap(Paint.Cap.ROUND);
            for (int fold = 0; fold < tier; fold += 1) {
                float x = 42 + fold * 4 - (tier - 1) * 2;
                canvas.drawLine(x, 46, x, 56, paint);
            }
            if (tier == Chef.RANK_IDS.length - 1 && !dim) {
                paint.setColor(Color.rgb(255, 244, 207));
                canvas.drawPath(star(50, 23, 7, 3), paint);
            }
            paint.setShader(new LinearGradient(0, 90, 30, 106, new int[]{light, dark}, null, Shader.TileMode.CLAMP));
            Path ribbon = new Path();
            ribbon.moveTo(24, 90);
            ribbon.lineTo(76, 90);
            ribbon.lineTo(72, 98);
            ribbon.lineTo(76, 106);
            ribbon.lineTo(24, 106);
            ribbon.lineTo(28, 98);
            ribbon.close();
            canvas.drawPath(ribbon, paint);
            paint.setShader(null);
            paint.setColor(Color.rgb(20, 15, 10));
            paint.setTextAlign(Paint.Align.CENTER);
            paint.setTextSize(13);
            paint.setTypeface(Typeface.create(Typeface.SERIF, Typeface.BOLD));
            canvas.drawText(roman, 50, 102.5f, paint);
            canvas.restore();
        }
    }

    // ---------- Medaille de technique : cadenas, etoile, couronne (Maitre) ----------
    static final class MedalView extends View {
        private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        private int state;

        MedalView(Context context, int state) {
            super(context);
            this.state = state;
        }

        @Override
        protected void onDraw(Canvas canvas) {
            float scale = Math.min(getWidth(), getHeight()) / 48f;
            canvas.save();
            canvas.scale(scale, scale);
            paint.setStyle(Paint.Style.FILL);
            paint.setColor(state == 2 ? COLOR_GOLD_SOFT : state == 1 ? Color.rgb(120, 92, 44) : Color.rgb(46, 42, 36));
            canvas.drawPath(hexagon(24, 24, 20, 22), paint);
            paint.setColor(state == 0 ? Color.rgb(24, 21, 16) : Color.rgb(40, 30, 14));
            canvas.drawPath(hexagon(24, 24, 15, 16), paint);
            if (state == 0) {
                paint.setColor(Color.rgb(140, 130, 116));
                canvas.drawRoundRect(new RectF(18.5f, 23, 29.5f, 32), 1.6f, 1.6f, paint);
                paint.setStyle(Paint.Style.STROKE);
                paint.setStrokeWidth(1.8f);
                canvas.drawArc(new RectF(20.5f, 16.5f, 27.5f, 29.5f), 180, 180, false, paint);
            } else if (state == 1) {
                paint.setColor(COLOR_SHEEN);
                canvas.drawPath(star(24, 24, 11, 2.6f), paint);
            } else {
                paint.setColor(COLOR_SHEEN);
                Path crown = new Path();
                crown.moveTo(15, 30);
                crown.lineTo(17, 19);
                crown.lineTo(21.5f, 24);
                crown.lineTo(24, 16);
                crown.lineTo(26.5f, 24);
                crown.lineTo(31, 19);
                crown.lineTo(33, 30);
                crown.close();
                canvas.drawPath(crown, paint);
            }
            canvas.restore();
        }
    }

    static Path hexagon(float cx, float cy, float rx, float ry) {
        Path path = new Path();
        path.moveTo(cx, cy - ry);
        path.lineTo(cx + rx, cy - ry / 2);
        path.lineTo(cx + rx, cy + ry / 2);
        path.lineTo(cx, cy + ry);
        path.lineTo(cx - rx, cy + ry / 2);
        path.lineTo(cx - rx, cy - ry / 2);
        path.close();
        return path;
    }

    static Path star(float cx, float cy, float outer, float inner) {
        Path path = new Path();
        for (int point = 0; point < 8; point += 1) {
            double angle = Math.PI / 4 * point - Math.PI / 2;
            float reach = point % 2 == 0 ? outer : inner;
            float x = (float) (cx + Math.cos(angle) * reach);
            float y = (float) (cy + Math.sin(angle) * reach);
            if (point == 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        }
        path.close();
        return path;
    }

    static EmblemView emblem(MainActivity host, Chef.Standing standing, int widthDp) {
        EmblemView view = new EmblemView(host);
        view.set(standing.tier, standing.roman(), false);
        view.setLayoutParams(new LinearLayout.LayoutParams(dp(widthDp), dp(widthDp * 112 / 100)));
        return view;
    }

    // ---------- QR code soigne : points ronds, reperes arrondis, fond ivoire ----------
    static Bitmap fineQr(String text, int sizePx) {
        QrCode qr = QrCode.encodeText(text);
        int quiet = 2;
        float cell = sizePx / (float) (qr.size + quiet * 2);
        Bitmap bitmap = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        int ink = Color.rgb(29, 24, 18);
        int paper = Color.rgb(251, 245, 234);
        paint.setColor(paper);
        canvas.drawRoundRect(new RectF(0, 0, sizePx, sizePx), cell * 2.2f, cell * 2.2f, paint);
        paint.setColor(ink);
        for (int y = 0; y < qr.size; y += 1) {
            for (int x = 0; x < qr.size; x += 1) {
                boolean eye = (y < 7 && x < 7) || (y < 7 && x >= qr.size - 7) || (y >= qr.size - 7 && x < 7);
                if (eye || !qr.isDark(x, y)) continue;
                canvas.drawCircle((x + quiet + 0.5f) * cell, (y + quiet + 0.5f) * cell, cell * 0.46f, paint);
            }
        }
        int[][] eyes = {{0, 0}, {qr.size - 7, 0}, {0, qr.size - 7}};
        for (int[] eye : eyes) {
            float left = (eye[0] + quiet) * cell;
            float top = (eye[1] + quiet) * cell;
            paint.setColor(ink);
            canvas.drawRoundRect(new RectF(left, top, left + cell * 7, top + cell * 7), cell * 1.5f, cell * 1.5f, paint);
            paint.setColor(paper);
            canvas.drawRoundRect(new RectF(left + cell, top + cell, left + cell * 6, top + cell * 6), cell, cell, paint);
            paint.setColor(ink);
            canvas.drawRoundRect(new RectF(left + cell * 2, top + cell * 2, left + cell * 5, top + cell * 5), cell * 0.9f, cell * 0.9f, paint);
        }
        return bitmap;
    }

    // ---------- Verdict apres un plat ----------
    static LinearLayout verdict(final MainActivity host, final Recipe recipe, final Done done) {
        final LinearLayout box = new LinearLayout(host);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER_HORIZONTAL);
        renderVerdictChoices(host, box, recipe, done);
        return box;
    }

    private static void renderVerdictChoices(final MainActivity host, final LinearLayout box, final Recipe recipe, final Done done) {
        box.removeAllViews();
        final Chef chef = new Chef(host);
        final Extras extras = Extras.get(host);
        final int recipeRating = extras.ratingFor(recipe);
        TextView question = host.text("Comment s’est passé ce plat ?", 14, COLOR_MUTED, false);
        question.setGravity(Gravity.CENTER);
        box.addView(question);
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(58));
        rowParams.topMargin = dp(10);
        box.addView(row, rowParams);
        for (int index = 0; index < Chef.VERDICT_IDS.length; index += 1) {
            final int verdict = index;
            int delta = chef.preview(recipe, recipeRating, Chef.VERDICT_SCORES[index]);
            LinearLayout choice = new LinearLayout(host);
            choice.setOrientation(LinearLayout.VERTICAL);
            choice.setGravity(Gravity.CENTER);
            choice.setBackground(selectablePanel(COLOR_CARD_SOFT, COLOR_CARD_ACTIVE, COLOR_BORDER_SOFT, 1, 12));
            choice.addView(host.text(Chef.VERDICT_LABELS[index], 14, COLOR_TEXT, true));
            TextView change = host.text(Chef.signed(delta), 12, index == 0 ? COLOR_GOLD : index == 2 ? Color.rgb(232, 120, 70) : COLOR_DIM, true);
            change.setPadding(0, dp(2), 0, 0);
            choice.addView(change);
            choice.setClickable(true);
            choice.setContentDescription(Chef.VERDICT_LABELS[index] + " : cote " + Chef.signed(delta));
            choice.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Chef.Result result = new Chef(host).record(recipe, recipeRating, extras.techniquesFor(recipe.id), verdict);
                    announce(host, result);
                    renderVerdictResult(host, box, recipe, result, done);
                    if (done != null) done.onResult(result);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            if (index < 2) params.rightMargin = dp(8);
            row.addView(choice, params);
        }
    }

    private static void renderVerdictResult(final MainActivity host, final LinearLayout box, final Recipe recipe, Chef.Result result, final Done done) {
        box.removeAllViews();
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(dp(10), dp(10), dp(12), dp(10));
        row.setBackground(panel(COLOR_CARD_SOFT, result.promoted() ? COLOR_GOLD_SOFT : COLOR_BORDER_SOFT, 1, 14));
        box.addView(row, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        EmblemView emblem = emblem(host, result.after, 36);
        row.addView(emblem);
        if (result.promoted()) {
            emblem.setScaleX(0.4f);
            emblem.setScaleY(0.4f);
            emblem.animate().scaleX(1f).scaleY(1f).setDuration(700).start();
        }
        LinearLayout copy = new LinearLayout(host);
        copy.setOrientation(LinearLayout.VERTICAL);
        copy.setPadding(dp(12), 0, dp(8), 0);
        copy.addView(host.text(Chef.message(result), 13, COLOR_TEXT, true));
        Extras extras = Extras.get(host);
        for (String id : result.unlocked) {
            Extras.Technique technique = extras.techniqueById.get(id);
            if (technique != null) copy.addView(host.text("Technique débloquée · " + technique.title, 12, COLOR_GOLD, true));
        }
        for (String id : result.mastered) {
            Extras.Technique technique = extras.techniqueById.get(id);
            if (technique != null) copy.addView(host.text("Badge Maître · " + technique.title, 12, COLOR_GOLD, true));
        }
        row.addView(copy, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        TextView undo = host.text("Annuler", 12, COLOR_DIM, false);
        undo.setPaintFlags(undo.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        undo.setPadding(dp(6), dp(6), dp(6), dp(6));
        undo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new Chef(host).undo(recipe);
                renderVerdictChoices(host, box, recipe, done);
                if (done != null) done.onResult(null);
            }
        });
        row.addView(undo);
    }

    static void announce(MainActivity host, Chef.Result result) {
        Toast.makeText(host, Chef.message(result), Toast.LENGTH_SHORT).show();
        Extras extras = Extras.get(host);
        for (String id : result.unlocked) {
            Extras.Technique technique = extras.techniqueById.get(id);
            if (technique != null) Toast.makeText(host, "Technique débloquée · " + technique.title, Toast.LENGTH_SHORT).show();
        }
        for (String id : result.mastered) {
            Extras.Technique technique = extras.techniqueById.get(id);
            if (technique != null) Toast.makeText(host, "Badge Maître · " + technique.title, Toast.LENGTH_LONG).show();
        }
    }

    /** Fiche : « Je l'ai cuisiné » ouvre le verdict dans une petite fenetre en bas. */
    static void showVerdictDialog(final MainActivity host, final Recipe recipe, final Runnable afterClose) {
        final Dialog dialog = new Dialog(host);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        LinearLayout sheet = new LinearLayout(host);
        sheet.setOrientation(LinearLayout.VERTICAL);
        sheet.setPadding(dp(16), dp(16), dp(16), dp(16));
        sheet.setBackground(panel(COLOR_PANEL, COLOR_BORDER_SOFT, 1, 16));
        TextView title = host.text(recipe.title, 16, COLOR_TEXT, true);
        title.setTypeface(Ui.DISPLAY);
        title.setPadding(0, 0, 0, dp(10));
        sheet.addView(title);
        sheet.addView(verdict(host, recipe, new Done() {
            @Override
            public void onResult(Chef.Result result) {
                if (result != null) {
                    host.uiHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            if (dialog.isShowing()) dialog.dismiss();
                        }
                    }, 2600);
                }
            }
        }));
        dialog.setContentView(sheet);
        dialog.setOnDismissListener(new android.content.DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(android.content.DialogInterface ignored) {
                if (afterClose != null) afterClose.run();
            }
        });
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
            dialog.getWindow().setGravity(Gravity.BOTTOM);
            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        }
        dialog.show();
    }

    // ---------- Panneau Parcours de chef ----------
    static void showPanel(final MainActivity host) {
        final Dialog dialog = new Dialog(host, android.R.style.Theme_Black_NoTitleBar);
        final LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);
        dialog.setContentView(root);
        renderPanel(host, dialog, root, "classement", "all");
        dialog.show();
    }

    private static void renderPanel(final MainActivity host, final Dialog dialog, final LinearLayout root, final String tab, final String filter) {
        root.removeAllViews();
        final Chef chef = new Chef(host);
        final Extras extras = Extras.get(host);
        Chef.Standing standing = chef.standing();

        LinearLayout head = new LinearLayout(host);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(18), dp(16), dp(10), dp(8));
        root.addView(head);
        LinearLayout titles = new LinearLayout(host);
        titles.setOrientation(LinearLayout.VERTICAL);
        titles.addView(host.text("PARCOURS DE CHEF", 10, COLOR_GOLD, true));
        TextView name = host.text(standing.name, 24, COLOR_TEXT, true);
        name.setTypeface(Ui.DISPLAY);
        titles.addView(name);
        head.addView(titles, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        Button close = host.actionButton("Fermer", false);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });
        head.addView(close, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(36)));

        LinearLayout tabs = new LinearLayout(host);
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        tabs.setPadding(dp(4), dp(4), dp(4), dp(4));
        tabs.setBackground(panel(COLOR_PANEL_DEEP, COLOR_BORDER_SOFT, 1, 12));
        LinearLayout.LayoutParams tabsParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(46));
        tabsParams.leftMargin = dp(16);
        tabsParams.rightMargin = dp(16);
        root.addView(tabs, tabsParams);
        String[][] tabItems = {{"classement", "Classement"}, {"techniques", "Techniques " + chef.unlockedCount() + "/" + extras.techniques.size()}};
        for (final String[] item : tabItems) {
            TextView button = host.text(item[1], 13, item[0].equals(tab) ? COLOR_TEXT : COLOR_DIM, true);
            button.setGravity(Gravity.CENTER);
            if (item[0].equals(tab)) button.setBackground(panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, 1, 9));
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    renderPanel(host, dialog, root, item[0], "all");
                }
            });
            tabs.addView(button, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
        }

        ScrollView scroll = new ScrollView(host);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(16), dp(14), dp(16), dp(24));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        if ("techniques".equals(tab)) renderTechniques(host, dialog, root, content, chef, extras, filter);
        else renderRanking(host, dialog, content, chef, extras, standing);
    }

    private static void renderRanking(final MainActivity host, final Dialog dialog, LinearLayout content, Chef chef, Extras extras, Chef.Standing standing) {
        LinearLayout hero = new LinearLayout(host);
        hero.setOrientation(LinearLayout.HORIZONTAL);
        hero.setGravity(Gravity.CENTER_VERTICAL);
        hero.setPadding(dp(14), dp(14), dp(14), dp(14));
        hero.setBackground(panel(COLOR_PANEL, COLOR_BORDER_SOFT, 1, 16));
        content.addView(hero);
        hero.addView(emblem(host, standing, 84));
        LinearLayout copy = new LinearLayout(host);
        copy.setOrientation(LinearLayout.VERTICAL);
        copy.setPadding(dp(14), 0, 0, 0);
        int light = Chef.RANK_COLORS[standing.tier][0];
        copy.addView(host.text("Cote " + Math.round(chef.rating()) + "  ·  meilleure " + Math.round(chef.best()), 13, light, true));
        int progress = standing.top ? 100 : standing.points;
        copy.addView(bar(host, progress / 100f, light), barParams());
        copy.addView(host.text(standing.top ? "Sommet du classement" : progress + " / 100 avant " + standing.next, 12, COLOR_DIM, false));
        hero.addView(copy, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));

        LinearLayout ladder = new LinearLayout(host);
        ladder.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams ladderParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        ladderParams.topMargin = dp(14);
        content.addView(ladder, ladderParams);
        for (int tier = 0; tier < Chef.RANK_IDS.length; tier += 1) {
            LinearLayout cell = new LinearLayout(host);
            cell.setOrientation(LinearLayout.VERTICAL);
            cell.setGravity(Gravity.CENTER_HORIZONTAL);
            EmblemView mini = new EmblemView(host);
            mini.set(tier, tier == standing.tier ? standing.roman() : "V", tier > standing.tier);
            cell.addView(mini, new LinearLayout.LayoutParams(dp(34), dp(38)));
            TextView label = host.text(Chef.RANK_LABELS[tier], 10, tier == standing.tier ? COLOR_TEXT : COLOR_DIM, tier == standing.tier);
            label.setGravity(Gravity.CENTER);
            cell.addView(label);
            ladder.addView(cell, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        }

        JSONArray history = chef.history();
        int successes = 0;
        for (int index = 0; index < history.length(); index += 1) {
            if (history.optJSONObject(index) != null && history.optJSONObject(index).optDouble("score") == 1) successes += 1;
        }
        LinearLayout stats = new LinearLayout(host);
        stats.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams statsParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        statsParams.topMargin = dp(14);
        content.addView(stats, statsParams);
        String[][] items = {
                {String.valueOf(successes), successes > 1 ? "plats réussis" : "plat réussi"},
                {history.length() > 0 ? Math.round(100f * successes / history.length()) + " %" : "—", "de réussite"},
                {String.valueOf(chef.unlockedCount()), chef.masterCount() > 0 ? "techniques · " + chef.masterCount() + " maître" : "techniques"}
        };
        for (int index = 0; index < items.length; index += 1) {
            LinearLayout box = new LinearLayout(host);
            box.setOrientation(LinearLayout.VERTICAL);
            box.setPadding(dp(10), dp(8), dp(8), dp(8));
            box.setBackground(panel(COLOR_PANEL_DEEP, COLOR_BORDER_SOFT, 1, 12));
            TextView value = host.text(items[index][0], 20, COLOR_TEXT, true);
            value.setTypeface(Ui.DISPLAY);
            box.addView(value);
            box.addView(host.text(items[index][1], 11, COLOR_DIM, false));
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            if (index < items.length - 1) params.rightMargin = dp(8);
            stats.addView(box, params);
        }

        // Pour progresser : cote juste au-dessus du niveau, pas cuisinee cette semaine.
        final List<Recipe> picks = suggestions(host, chef, extras);
        if (!picks.isEmpty()) {
            content.addView(section(host, "POUR PROGRESSER"));
            for (final Recipe recipe : picks) {
                int gain = chef.preview(recipe, extras.ratingFor(recipe), 1);
                View row = listRow(host, recipe.title, recipe.difficultyLabel() + " · " + Chef.signed(gain), COLOR_GOLD);
                row.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        dialog.dismiss();
                        host.recipeScreen.openRecipe(recipe, true);
                    }
                });
                content.addView(row);
            }
        }

        if (history.length() > 0) {
            content.addView(section(host, "DERNIERS PLATS"));
            for (int index = 0; index < Math.min(5, history.length()); index += 1) {
                JSONObject entry = history.optJSONObject(index);
                if (entry == null) continue;
                int delta = entry.optInt("delta");
                String verdict = "rate".equals(entry.optString("verdict")) ? "Raté" : "correct".equals(entry.optString("verdict")) ? "Correct" : "Réussi";
                content.addView(listRow(host, entry.optString("title") + "  ·  " + verdict, Chef.signed(delta), delta >= 0 ? COLOR_GOLD : Color.rgb(232, 120, 70)));
            }
        } else {
            TextView empty = host.text("Après un plat, donnez votre verdict (réussi, correct ou raté) en fin de mode mains libres ou avec « Je l’ai cuisiné » sur la fiche. Plus le plat est exigeant pour votre niveau, plus une réussite compte.", 13, COLOR_MUTED, false);
            empty.setPadding(0, dp(16), 0, 0);
            content.addView(empty);
        }

        // Transfert vers le site : meme lien que l'export du site (#chef=...).
        final Button transfer = host.actionButton("Transférer sur le site (QR code)", false);
        LinearLayout.LayoutParams transferParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40));
        transferParams.topMargin = dp(18);
        content.addView(transfer, transferParams);
        final LinearLayout qrBox = new LinearLayout(host);
        qrBox.setOrientation(LinearLayout.VERTICAL);
        qrBox.setGravity(Gravity.CENTER_HORIZONTAL);
        content.addView(qrBox);
        final String url = chef.transferUrl();
        transfer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (qrBox.getChildCount() > 0) {
                    qrBox.removeAllViews();
                    return;
                }
                try {
                    ImageView image = new ImageView(host);
                    image.setImageBitmap(fineQr(url, dp(200)));
                    LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(dp(200), dp(200));
                    params.topMargin = dp(14);
                    qrBox.addView(image, params);
                } catch (IllegalArgumentException exception) {
                    Toast.makeText(host, "Parcours trop long pour un QR code : utilisez « Copier le lien ».", Toast.LENGTH_SHORT).show();
                }
                TextView hint = host.text("Scannez avec le téléphone ou l’ordinateur : le parcours est fusionné sur le site, le meilleur des deux est gardé.", 12, COLOR_MUTED, false);
                hint.setGravity(Gravity.CENTER);
                hint.setPadding(0, dp(10), 0, dp(8));
                qrBox.addView(hint);
                Button copyLink = host.actionButton("Copier le lien", false);
                copyLink.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        ClipboardManager clipboard = (ClipboardManager) host.getSystemService(Context.CLIPBOARD_SERVICE);
                        if (clipboard != null) clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note", url));
                        Toast.makeText(host, "Lien de transfert copié", Toast.LENGTH_SHORT).show();
                    }
                });
                qrBox.addView(copyLink, new LinearLayout.LayoutParams(dp(160), dp(36)));
            }
        });
    }

    private static List<Recipe> suggestions(MainActivity host, final Chef chef, final Extras extras) {
        long weekAgo = System.currentTimeMillis() - 7L * 24 * 3600 * 1000;
        List<String> recent = new ArrayList<String>();
        JSONArray history = chef.history();
        for (int index = 0; index < history.length(); index += 1) {
            JSONObject entry = history.optJSONObject(index);
            if (entry != null && entry.optLong("at") > weekAgo) recent.add(entry.optString("id"));
        }
        List<Recipe> pool = new ArrayList<Recipe>();
        for (String id : extras.recipeRatings.keySet()) {
            Recipe recipe = host.repository.find(id);
            if (recipe != null && !recent.contains(id)) pool.add(recipe);
        }
        final double target = chef.rating() + 180;
        Collections.sort(pool, new Comparator<Recipe>() {
            @Override
            public int compare(Recipe left, Recipe right) {
                double a = Math.abs(extras.ratingFor(left) - target);
                double b = Math.abs(extras.ratingFor(right) - target);
                if (a != b) return a < b ? -1 : 1;
                return left.id.hashCode() - right.id.hashCode();
            }
        });
        return pool.subList(0, Math.min(3, pool.size()));
    }

    private static void renderTechniques(final MainActivity host, final Dialog dialog, final LinearLayout root, LinearLayout content, final Chef chef, final Extras extras, final String filter) {
        List<Extras.Technique> items = new ArrayList<Extras.Technique>(extras.techniques);
        Collections.sort(items, new Comparator<Extras.Technique>() {
            @Override
            public int compare(Extras.Technique left, Extras.Technique right) {
                long master = chef.masterAt(right.id) - chef.masterAt(left.id);
                if (master != 0) return master > 0 ? 1 : -1;
                int count = chef.techCount(right.id) - chef.techCount(left.id);
                if (count != 0) return count;
                return left.title.compareToIgnoreCase(right.title);
            }
        });
        int done = chef.unlockedCount();
        int total = items.size();
        TextView summary = host.text(done + " / " + total + " techniques débloquées" + (chef.masterCount() > 0 ? "  ·  " + chef.masterCount() + " maître" : ""), 16, COLOR_TEXT, true);
        summary.setTypeface(Ui.DISPLAY);
        content.addView(summary);
        content.addView(bar(host, total == 0 ? 0 : done / (float) total, COLOR_GOLD), barParams());

        LinearLayout filters = new LinearLayout(host);
        filters.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams filtersParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(34));
        filtersParams.topMargin = dp(10);
        filtersParams.bottomMargin = dp(10);
        content.addView(filters, filtersParams);
        String[][] filterItems = {{"all", "Tous"}, {"unlocked", "Débloqués"}, {"master", "Maître"}, {"locked", "À découvrir"}};
        for (final String[] item : filterItems) {
            TextView chip = host.text(item[1], 12, item[0].equals(filter) ? COLOR_TEXT : COLOR_DIM, true);
            chip.setGravity(Gravity.CENTER);
            chip.setBackground(panel(item[0].equals(filter) ? COLOR_CARD_ACTIVE : COLOR_PANEL_DEEP, item[0].equals(filter) ? COLOR_GOLD_SOFT : COLOR_BORDER_SOFT, 1, 17));
            chip.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    renderPanel(host, dialog, root, "techniques", item[0]);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1);
            params.rightMargin = dp(6);
            filters.addView(chip, params);
        }

        DateFormat format = DateFormat.getDateInstance(DateFormat.LONG, Locale.FRANCE);
        int shown = 0;
        for (final Extras.Technique technique : items) {
            long masterAt = chef.masterAt(technique.id);
            long unlockedAt = chef.unlockedAt(technique.id);
            int state = masterAt > 0 ? 2 : unlockedAt > 0 ? 1 : 0;
            if ("unlocked".equals(filter) && state == 0) continue;
            if ("master".equals(filter) && state != 2) continue;
            if ("locked".equals(filter) && state != 0) continue;
            shown += 1;
            LinearLayout row = new LinearLayout(host);
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.setGravity(Gravity.CENTER_VERTICAL);
            row.setPadding(dp(10), dp(10), dp(12), dp(10));
            row.setBackground(panel(state == 2 ? COLOR_CARD_ACTIVE : COLOR_PANEL_DEEP, state == 2 ? COLOR_GOLD_SOFT : state == 1 ? COLOR_BORDER : COLOR_BORDER_SOFT, 1, 12));
            if (state == 0) row.setAlpha(0.72f);
            row.addView(new MedalView(host, state), new LinearLayout.LayoutParams(dp(40), dp(40)));
            LinearLayout copy = new LinearLayout(host);
            copy.setOrientation(LinearLayout.VERTICAL);
            copy.setPadding(dp(12), 0, 0, 0);
            copy.addView(host.text(technique.title + (state == 2 ? "  ·  MAÎTRE" : ""), 13, state == 0 ? COLOR_MUTED : COLOR_TEXT, true));
            String detail = state == 0 ? "Exécutez cette technique dans un plat réussi pour la débloquer."
                    : state == 2 ? "Maîtrisée le " + format.format(new Date(masterAt)) + "."
                    : "Débloquée le " + format.format(new Date(unlockedAt)) + ". Badge Maître à 1000.";
            copy.addView(host.text(detail, 11, COLOR_DIM, false));
            if (state > 0) {
                int count = chef.techCount(technique.id);
                copy.addView(bar(host, count / (float) Chef.MASTER_GOAL, COLOR_GOLD), barParams());
                copy.addView(host.text(count + " / " + Chef.MASTER_GOAL, 11, state == 2 ? COLOR_GOLD : COLOR_DIM, true));
            }
            row.addView(copy, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
            row.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    showTechnique(host, technique);
                }
            });
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.bottomMargin = dp(6);
            content.addView(row, params);
        }
        if (shown == 0) {
            TextView empty = host.text("master".equals(filter) ? "Aucune technique maîtrisée : il faut 1000 exécutions réussies."
                    : "locked".equals(filter) ? "Toutes les techniques sont débloquées."
                    : "Aucune technique débloquée : réussissez un plat pour commencer.", 13, COLOR_MUTED, false);
            content.addView(empty);
        }
    }

    /** Guide d'une technique (le site a une page Techniques ; ici une fenetre). */
    static void showTechnique(MainActivity host, Extras.Technique technique) {
        StringBuilder text = new StringBuilder(technique.description);
        for (int index = 0; index < technique.steps.size(); index += 1) {
            text.append("\n\n").append(index + 1).append(". ").append(technique.steps.get(index));
        }
        if (technique.tip.length() > 0) text.append("\n\nAstuce : ").append(technique.tip);
        new android.app.AlertDialog.Builder(host)
                .setTitle(technique.title)
                .setMessage(text.toString())
                .setPositiveButton("Fermer", null)
                .show();
    }

    private static View bar(MainActivity host, float progress, int color) {
        FrameLayout track = new FrameLayout(host);
        track.setBackground(panel(Color.rgb(40, 34, 26), Color.TRANSPARENT, 0, 4));
        View fill = new View(host);
        fill.setBackground(panel(color, Color.TRANSPARENT, 0, 4));
        track.addView(fill, new FrameLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT));
        final View fillView = fill;
        final float value = Math.max(0f, Math.min(1f, progress));
        track.addOnLayoutChangeListener(new View.OnLayoutChangeListener() {
            @Override
            public void onLayoutChange(View view, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
                int width = Math.round((right - left) * value);
                if (fillView.getLayoutParams().width != width) {
                    fillView.getLayoutParams().width = width;
                    fillView.post(new Runnable() {
                        @Override
                        public void run() {
                            fillView.requestLayout();
                        }
                    });
                }
            }
        });
        return track;
    }

    private static LinearLayout.LayoutParams barParams() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(6));
        params.topMargin = dp(6);
        params.bottomMargin = dp(6);
        return params;
    }

    private static TextView section(MainActivity host, String label) {
        TextView view = host.text(label, 10, COLOR_DIM, true);
        view.setPadding(0, dp(18), 0, dp(4));
        return view;
    }

    private static View listRow(MainActivity host, String title, String value, int valueColor) {
        LinearLayout row = new LinearLayout(host);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(0, dp(9), 0, dp(9));
        TextView left = host.text(title, 13, COLOR_TEXT, false);
        left.setSingleLine(true);
        left.setEllipsize(TextUtils.TruncateAt.END);
        row.addView(left, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        TextView right = host.text(value, 12, valueColor, true);
        right.setPadding(dp(10), 0, 0, 0);
        row.addView(right);
        return row;
    }

    private ChefUi() {
    }
}
