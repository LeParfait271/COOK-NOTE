package fr.cooknote.legacy;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

import static fr.cooknote.legacy.Palette.*;
import static fr.cooknote.legacy.Ui.*;

/**
 * Carte des saisons et constellation des saveurs, version Android 5 (comme le
 * site, donnees precalculees dans extras-lite.json). La constellation est
 * volontairement legere : positions calculees au build, points et noms
 * dessines une fois par geste (pas d'animation, pas de halo).
 */
final class Explore {
    static final String[] MONTHS = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};

    // ---------- Carte des saisons ----------
    static void showSeasons(final MainActivity host) {
        final Dialog dialog = new Dialog(host, android.R.style.Theme_Black_NoTitleBar);
        final LinearLayout root = new LinearLayout(host);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BG);
        dialog.setContentView(root);
        renderSeasons(host, dialog, root, Calendar.getInstance().get(Calendar.MONTH) + 1, "legumes");
        dialog.show();
    }

    private static void renderSeasons(final MainActivity host, final Dialog dialog, final LinearLayout root, final int month, final String kind) {
        root.removeAllViews();
        root.addView(header(host, dialog, "CARTE DES SAISONS", MONTHS[month - 1]));
        LinearLayout tools = new LinearLayout(host);
        tools.setOrientation(LinearLayout.HORIZONTAL);
        tools.setPadding(dp(16), 0, dp(16), dp(8));
        tools.addView(chip(host, "‹", false, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                renderSeasons(host, dialog, root, month == 1 ? 12 : month - 1, kind);
            }
        }));
        tools.addView(chip(host, "Légumes", "legumes".equals(kind), new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                renderSeasons(host, dialog, root, month, "legumes");
            }
        }));
        tools.addView(chip(host, "Fruits", "fruits".equals(kind), new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                renderSeasons(host, dialog, root, month, "fruits");
            }
        }));
        tools.addView(chip(host, "›", false, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                renderSeasons(host, dialog, root, month == 12 ? 1 : month + 1, kind);
            }
        }));
        root.addView(tools);

        ScrollView scroll = new ScrollView(host);
        LinearLayout content = new LinearLayout(host);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(dp(16), 0, dp(16), dp(24));
        scroll.addView(content);
        root.addView(scroll, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        JSONObject seasons = Extras.get(host).seasons;
        JSONArray items = seasons == null ? null : seasons.optJSONArray(kind);
        String[][] sections = {{"now", "EN SAISON"}, {"soon", "LE MOIS PROCHAIN"}, {"off", "HORS SAISON"}};
        int next = month == 12 ? 1 : month + 1;
        for (String[] section : sections) {
            boolean first = true;
            for (int index = 0; items != null && index < items.length(); index += 1) {
                final JSONObject item = items.optJSONObject(index);
                if (item == null) continue;
                boolean now = has(item.optJSONArray("months"), month);
                boolean soon = !now && has(item.optJSONArray("months"), next);
                String state = now ? "now" : soon ? "soon" : "off";
                if (!section[0].equals(state)) continue;
                if (first) {
                    content.addView(ChefUi.section(host, section[1]));
                    first = false;
                }
                final JSONArray recipes = item.optJSONArray("recipes");
                int count = recipes == null ? 0 : recipes.length();
                View row = ChefUi.listRow(host, item.optString("name"), count == 0 ? "" : count + (count > 1 ? " recettes" : " recette"), now ? COLOR_GOLD : COLOR_DIM);
                if (!now) row.setAlpha(0.6f);
                row.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        openFirst(host, dialog, recipes);
                    }
                });
                content.addView(row);
            }
        }
    }

    private static void openFirst(MainActivity host, Dialog dialog, JSONArray ids) {
        for (int index = 0; ids != null && index < ids.length(); index += 1) {
            Recipe recipe = host.repository.find(ids.optString(index));
            if (recipe != null) {
                dialog.dismiss();
                host.recipeScreen.openRecipe(recipe, true);
                return;
            }
        }
    }

    private static boolean has(JSONArray months, int month) {
        for (int index = 0; months != null && index < months.length(); index += 1) if (months.optInt(index) == month) return true;
        return false;
    }

    // ---------- Constellation des saveurs (legere) ----------
    static void showConstellation(final MainActivity host) {
        JSONObject data = Extras.get(host).constellation;
        if (data == null) return;
        final Dialog dialog = new Dialog(host, android.R.style.Theme_Black_NoTitleBar);
        FrameLayout frame = new FrameLayout(host);
        frame.setBackgroundColor(0xff0b0a12);
        final TextView card = host.text("", 13, COLOR_TEXT, false);
        card.setPadding(dp(16), dp(14), dp(16), dp(16));
        card.setBackground(panel(0xf2141220, COLOR_BORDER, 1, 16));
        card.setVisibility(View.GONE);
        final SkyView sky = new SkyView(host, data, new SkyView.Pick() {
            @Override
            public void onPick(JSONObject star) {
                if (star == null) {
                    card.setVisibility(View.GONE);
                    return;
                }
                StringBuilder text = new StringBuilder();
                text.append(star.optString("label")).append("\n\n").append(star.optString("portrait"));
                appendFact(text, "Saveur", star.optString("saveur"));
                appendFact(text, "Saison", star.optString("saison"));
                appendFact(text, "Astuce", star.optString("astuce"));
                appendFact(text, "Accords", star.optString("accords"));
                text.append("\n\nDans ").append(star.optInt("count")).append(star.optInt("count") > 1 ? " recettes" : " recette").append(" Cook Note.");
                card.setText(text.toString());
                card.setVisibility(View.VISIBLE);
            }
        });
        frame.addView(sky, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        LinearLayout top = header(host, dialog, "COOK NOTE", "Constellation des saveurs");
        frame.addView(top, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.TOP));
        FrameLayout.LayoutParams cardParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM);
        cardParams.setMargins(dp(12), 0, dp(12), dp(12));
        frame.addView(card, cardParams);
        card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                card.setVisibility(View.GONE);
            }
        });
        dialog.setContentView(frame);
        dialog.show();
    }

    private static void appendFact(StringBuilder text, String label, String value) {
        if (value != null && value.length() > 0) text.append("\n\n").append(label.toUpperCase()).append(" · ").append(value);
    }

    /** Ciel : points et noms dans une matrice (glisser, pincer), redessine seulement pendant un geste. */
    static final class SkyView extends View {
        interface Pick {
            void onPick(JSONObject star);
        }

        private final JSONArray stars;
        private final JSONArray links;
        private final float[] xs;
        private final float[] ys;
        private final float[] sizes;
        private final int[] colors;
        private final boolean[] named;
        private final float worldWidth;
        private final float worldHeight;
        private final Matrix matrix = new Matrix();
        private final Matrix inverse = new Matrix();
        private final Paint dot = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint line = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint label = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final ScaleGestureDetector scaler;
        private final Pick pick;
        private float lastX;
        private float lastY;
        private float downX;
        private float downY;
        private boolean moved;
        private boolean fitted;
        private int selected = -1;

        SkyView(Context context, JSONObject data, Pick pick) {
            super(context);
            this.pick = pick;
            stars = data.optJSONArray("stars");
            links = data.optJSONArray("links");
            worldWidth = data.optInt("width", 1000);
            worldHeight = data.optInt("height", 1600);
            int count = stars == null ? 0 : stars.length();
            xs = new float[count];
            ys = new float[count];
            sizes = new float[count];
            colors = new int[count];
            named = new boolean[count];
            JSONArray families = data.optJSONArray("families");
            for (int index = 0; index < count; index += 1) {
                JSONObject star = stars.optJSONObject(index);
                xs[index] = (float) star.optDouble("x");
                ys[index] = (float) star.optDouble("y");
                sizes[index] = (float) Math.max(2.5, star.optDouble("size", 3));
                named[index] = star.optBoolean("named");
                colors[index] = familyColor(families, star.optString("family"));
            }
            line.setColor(0x33d7be8c);
            line.setStrokeWidth(1.5f);
            label.setColor(0xaaefe6d4);
            label.setTextAlign(Paint.Align.CENTER);
            scaler = new ScaleGestureDetector(context, new ScaleGestureDetector.SimpleOnScaleGestureListener() {
                @Override
                public boolean onScale(ScaleGestureDetector detector) {
                    float[] values = new float[9];
                    matrix.getValues(values);
                    float scale = values[Matrix.MSCALE_X];
                    float factor = Math.max(0.5f / scale, Math.min(6f / scale, detector.getScaleFactor()));
                    matrix.postScale(factor, factor, detector.getFocusX(), detector.getFocusY());
                    moved = true;
                    invalidate();
                    return true;
                }
            });
            // Calque materiel : le systeme garde le dessin entre deux images.
            setLayerType(View.LAYER_TYPE_HARDWARE, null);
        }

        private static int familyColor(JSONArray families, String id) {
            for (int index = 0; families != null && index < families.length(); index += 1) {
                JSONObject family = families.optJSONObject(index);
                if (family != null && id.equals(family.optString("id"))) {
                    try {
                        return 0xff000000 | Integer.parseInt(family.optString("color").replace("#", ""), 16);
                    } catch (Exception ignored) {
                        return 0xfff3cf86;
                    }
                }
            }
            return 0xfff3cf86;
        }

        @Override
        protected void onSizeChanged(int width, int height, int oldWidth, int oldHeight) {
            if (fitted || width == 0) return;
            float scale = Math.min(width / worldWidth, height / worldHeight);
            matrix.setScale(scale, scale);
            matrix.postTranslate((width - worldWidth * scale) / 2f, (height - worldHeight * scale) / 2f);
            fitted = true;
        }

        @Override
        protected void onDraw(Canvas canvas) {
            canvas.save();
            canvas.concat(matrix);
            float[] values = new float[9];
            matrix.getValues(values);
            float scale = values[Matrix.MSCALE_X];
            line.setStrokeWidth(1.2f / scale);
            for (int index = 0; links != null && index < links.length(); index += 1) {
                JSONArray link = links.optJSONArray(index);
                int a = link.optInt(0);
                int b = link.optInt(1);
                canvas.drawLine(xs[a], ys[a], xs[b], ys[b], line);
            }
            boolean showAll = scale * Math.min(getWidth() / worldWidth, 1f) > 0.9f;
            label.setTextSize(13f * getResources().getDisplayMetrics().density / scale);
            for (int index = 0; index < xs.length; index += 1) {
                dot.setColor(colors[index]);
                canvas.drawCircle(xs[index], ys[index], index == selected ? sizes[index] * 2.2f : sizes[index], dot);
                if (named[index] || showAll || index == selected) {
                    canvas.drawText(stars.optJSONObject(index).optString("label"), xs[index], ys[index] + sizes[index] * 3.5f + label.getTextSize(), label);
                }
            }
            canvas.restore();
        }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            scaler.onTouchEvent(event);
            switch (event.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    lastX = downX = event.getX();
                    lastY = downY = event.getY();
                    moved = false;
                    return true;
                case MotionEvent.ACTION_MOVE:
                    if (event.getPointerCount() == 1 && !scaler.isInProgress()) {
                        float dx = event.getX() - lastX;
                        float dy = event.getY() - lastY;
                        if (moved || Math.hypot(event.getX() - downX, event.getY() - downY) > 12) {
                            matrix.postTranslate(dx, dy);
                            moved = true;
                            invalidate();
                        }
                    }
                    lastX = event.getX();
                    lastY = event.getY();
                    return true;
                case MotionEvent.ACTION_POINTER_UP:
                    // Le doigt restant reprend sans saut.
                    int remaining = event.getActionIndex() == 0 ? 1 : 0;
                    lastX = event.getX(remaining);
                    lastY = event.getY(remaining);
                    return true;
                case MotionEvent.ACTION_UP:
                    if (!moved) select(event.getX(), event.getY());
                    return true;
                default:
                    return true;
            }
        }

        private void select(float x, float y) {
            matrix.invert(inverse);
            float[] point = {x, y};
            inverse.mapPoints(point);
            float[] values = new float[9];
            matrix.getValues(values);
            float reach = 28f * getResources().getDisplayMetrics().density / values[Matrix.MSCALE_X];
            int best = -1;
            double bestDistance = reach;
            for (int index = 0; index < xs.length; index += 1) {
                double distance = Math.hypot(xs[index] - point[0], ys[index] - point[1]);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    best = index;
                }
            }
            selected = best;
            invalidate();
            pick.onPick(best >= 0 ? stars.optJSONObject(best) : null);
        }
    }

    // ---------- Petits elements partages ----------
    private static LinearLayout header(MainActivity host, final Dialog dialog, String eyebrow, String title) {
        LinearLayout head = new LinearLayout(host);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(dp(18), dp(16), dp(10), dp(8));
        LinearLayout titles = new LinearLayout(host);
        titles.setOrientation(LinearLayout.VERTICAL);
        titles.addView(host.text(eyebrow, 10, COLOR_GOLD, true));
        TextView name = host.text(title, 24, COLOR_TEXT, true);
        name.setTypeface(Ui.DISPLAY);
        titles.addView(name);
        head.addView(titles, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        TextView close = host.text("×", 26, COLOR_TEXT, false);
        close.setGravity(Gravity.CENTER);
        close.setContentDescription("Fermer");
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });
        head.addView(close, new LinearLayout.LayoutParams(dp(48), dp(48)));
        return head;
    }

    private static TextView chip(MainActivity host, String text, boolean active, View.OnClickListener listener) {
        TextView chip = host.text(text, 13, active ? COLOR_TEXT : COLOR_MUTED, true);
        chip.setGravity(Gravity.CENTER);
        chip.setPadding(dp(14), dp(8), dp(14), dp(8));
        chip.setBackground(panel(active ? COLOR_CARD_ACTIVE : COLOR_BG, active ? COLOR_GOLD_SOFT : COLOR_BORDER_SOFT, 1, 18));
        chip.setOnClickListener(listener);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.rightMargin = dp(6);
        chip.setLayoutParams(params);
        return chip;
    }

    private Explore() {
    }
}
