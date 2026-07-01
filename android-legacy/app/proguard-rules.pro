# Cook Note Legacy is native Java and does not use reflection-heavy frameworks.
# Keep the Activity name stable for the manifest while R8 shrinks unused code.
-keep public class fr.cooknote.legacy.MainActivity
