package fr.cooknote.legacy;

import static fr.cooknote.legacy.Palette.*;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.StateListDrawable;

/** Fabriques de fonds Cook Note et conversion dp, initialisees une fois par l activite. */
final class Ui {
    /** Titres editoriaux : serif systeme (Noto Serif sur Android 5), pendant de Fraunces sur le site. */
    static final Typeface DISPLAY = Typeface.create(Typeface.SERIF, Typeface.BOLD);
    /** Texte de lecture long (etapes, conseils) : serif regulier, plus confortable que le gras. */
    static final Typeface READING = Typeface.create(Typeface.SERIF, Typeface.NORMAL);

    private static float density = 1f;

    static void init(Context context) {
        density = context.getResources().getDisplayMetrics().density;
    }

    static int dp(int value) {
        return (int) (value * density + 0.5f);
    }

    static GradientDrawable panel(int color, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    static GradientDrawable bottomOverlayGradient() {
        return new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(8, 0, 0, 0),
                Color.argb(112, 0, 0, 0),
                Color.argb(226, 5, 4, 3)
        });
    }

    static GradientDrawable cardTitleOverlayGradient() {
        return new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{
                Color.argb(0, 0, 0, 0),
                Color.argb(82, 0, 0, 0),
                Color.argb(206, 5, 4, 3)
        });
    }

    static StateListDrawable buttonPanel(boolean primary) {
        if (primary) {
            return selectableGradientPanel(
                    COLOR_ORANGE,
                    COLOR_GOLD,
                    COLOR_ORANGE,
                    COLOR_GOLD,
                    COLOR_ORANGE,
                    1,
                    8
            );
        }
        return selectableGradientPanel(
                COLOR_CARD,
                COLOR_CARD_SOFT,
                COLOR_CARD_ACTIVE,
                COLOR_CARD_SOFT,
                COLOR_BORDER_SOFT,
                1,
                8
        );
    }

    static StateListDrawable selectablePanel(int normalColor, int pressedColor, int strokeColor, int strokeWidth, int radiusDp) {
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{-android.R.attr.state_enabled}, panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_pressed}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_focused}, panel(pressedColor, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{}, panel(normalColor, strokeColor, strokeWidth, radiusDp));
        return drawable;
    }

    static StateListDrawable selectableGradientPanel(int normalStart, int normalEnd, int pressedStart, int pressedEnd, int strokeColor, int strokeWidth, int radiusDp) {
        StateListDrawable drawable = new StateListDrawable();
        drawable.addState(new int[]{-android.R.attr.state_enabled}, panel(COLOR_CARD_SOFT, COLOR_BORDER_SOFT, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_pressed}, gradientPanel(pressedStart, pressedEnd, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{android.R.attr.state_focused}, gradientPanel(pressedStart, pressedEnd, strokeColor, strokeWidth, radiusDp));
        drawable.addState(new int[]{}, gradientPanel(normalStart, normalEnd, strokeColor, strokeWidth, radiusDp));
        return drawable;
    }

    static GradientDrawable panelGradient(int startColor, int endColor, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable(GradientDrawable.Orientation.TL_BR, new int[]{startColor, endColor});
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    static GradientDrawable gradientPanel(int startColor, int endColor, int strokeColor, int strokeWidth, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, new int[]{startColor, endColor});
        drawable.setCornerRadius(dp(radiusDp));
        if (strokeWidth > 0) drawable.setStroke(dp(strokeWidth), strokeColor);
        return drawable;
    }

    private Ui() {
    }
}
