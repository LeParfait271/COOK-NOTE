# Cook Note Legacy is native Java and does not use reflection-heavy frameworks.
# Keep the Activity name stable for the manifest while R8 shrinks unused code.
-keep public class fr.cooknote.legacy.MainActivity

# Vosk (mode mains libres) appelle sa bibliotheque native par JNA, qui
# retrouve les classes et methodes par reflexion : ne rien renommer.
-keep class com.sun.jna.** { *; }
-keepclassmembers class * extends com.sun.jna.** { public *; }
-keep class org.vosk.** { *; }
-dontwarn java.awt.**
-dontwarn com.sun.jna.**
