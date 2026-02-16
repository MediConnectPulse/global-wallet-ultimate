# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native: Keep Native Modules
-keepclassmembers class * { @com.facebook.react.module.annotations.ReactModule public *; }

# React Native: Keep methods annotated with @ReactMethod
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod public *; }

# React Native: Keep UI Manager methods
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager { *; }

# React Native: Keep Turbo Modules
-keep class com.facebook.react.turbomodule.** { *; }

# Expo
-keep class expo.modules.** { *; }
-keep class expo.modules.kotlin.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.reanimated.** { <methods>; }
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Navigation
-keep class com.reactnavigation.** { *; }

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Supabase
-keep class io.supabase.** { *; }
-keep class com.supabase.** { *; }

# OkHttp (used by Supabase)
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Okio (used by OkHttp)
-dontwarn okio.**
-keep class okio.** { *; }

# Retrofit (if used)
-dontwarn retrofit2.**
-keep class retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# AndroidX
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep setters in Views so that animations can still work
-keepclassmembers public class * extends android.view.View {
    void set*(***);
    *** get*();
}

# Keep activities
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# KeepParcelable
-keep @androidx.annotation.Keep class * extends java.lang.reflect.Type {
  *;
}

-keepclassmembers,allowobfuscation class * {
  @androidx.annotation.Keep *;
}

# Worklets (Reanimated)
-keep class com.swmansion.worklets.** { *; }
-keepclassmembers class * { @com.swmansion.worklets.WorkletModule public *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Maps (if used)
-keep class com.airbnb.android.react.maps.** { *; }

# React Native Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep WebView interfaces
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}

# Keep all *Response* classes
-keep class * extends com.facebook.react.bridge.NativeModule {
  public *;
}

# Keep all *Bridge* classes
-keep class * extends com.facebook.react.bridge.JavaScriptModule {
  public *;
}

# Keep view constructors
-keepclassmembers class * {
  public <init>(android.content.Context, android.util.AttributeSet);
  public <init>(android.content.Context, android.util.AttributeSet, int);
}

# Prevent obfuscation of JSI interfaces
-keep class com.facebook.react.bridge.JSIModulePackage { *; }

# Optimization
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-dontpreverify
-verbose

# Keep annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# Remove logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep exception messages for crashes
-keepattributes Exceptions

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable
