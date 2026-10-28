package fr.cooknote.legacy;

import android.content.Context;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.util.TypedValue;
import android.widget.TextView;

// Texte qui se reduit jusqu'a tenir dans sa hauteur : le mode mains libres ne
// defile jamais (etape longue, liste d'ingredients, confidentialite).
final class FitTextView extends TextView {
    private float maxSizePx;
    private float minSizePx;
    private int fittedWidth = -1;
    private int fittedHeight = -1;
    private CharSequence fittedText;

    FitTextView(Context context, float maxSp, float minSp) {
        super(context);
        float scale = context.getResources().getDisplayMetrics().scaledDensity;
        maxSizePx = maxSp * scale;
        minSizePx = minSp * scale;
        setTextSize(TypedValue.COMPLEX_UNIT_PX, maxSizePx);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        int width = right - left - getPaddingLeft() - getPaddingRight();
        int height = bottom - top - getPaddingTop() - getPaddingBottom();
        if (width <= 0 || height <= 0) return;
        if (width == fittedWidth && height == fittedHeight && getText() == fittedText) return;
        fittedWidth = width;
        fittedHeight = height;
        fittedText = getText();
        final float size = fittingSize(width, height);
        if (Math.abs(size - getTextSize()) > 0.5f) {
            post(new Runnable() {
                @Override
                public void run() {
                    setTextSize(TypedValue.COMPLEX_UNIT_PX, size);
                }
            });
        }
    }

    private float fittingSize(int width, int height) {
        TextPaint paint = new TextPaint(getPaint());
        float size = maxSizePx;
        while (size > minSizePx) {
            paint.setTextSize(size);
            StaticLayout layout = new StaticLayout(getText(), paint, width, Layout.Alignment.ALIGN_NORMAL,
                    getLineSpacingMultiplier(), getLineSpacingExtra(), getIncludeFontPadding());
            if (layout.getHeight() <= height) break;
            size -= Math.max(1f, size * 0.06f);
        }
        return Math.max(size, minSizePx);
    }
}
