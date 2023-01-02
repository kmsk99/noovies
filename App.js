import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Image, useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styled";
import Root from "./navigation/Root";

const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));

const loadImages = (images) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.loadAsync(image);
    }
  });

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const startLoading = async () => {
    const fonts = loadFonts([Ionicons.font]);
    await Promise.all([...fonts]);
  };
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await startLoading();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <NavigationContainer>
        <View onLayout={onLayoutRootView}></View>
        <Root />
      </NavigationContainer>
    </ThemeProvider>
  );
}
