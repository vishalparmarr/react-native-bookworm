import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

import SafeScreen from "./components/SafeScreen";
import { useAuthStore } from "../store/authStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  useEffect(() => {
    // If checkAuth is async, handle it like this:
    Promise.resolve(checkAuth()).finally(() => setLoading(false));
  });

  useEffect(() => {
    if (!loading) {
      const isAuthScreen = segments[0] === "(auth)";
      const isSignedIn = user && token;
      if (!isAuthScreen && !isSignedIn) router.replace("/(auth)");
      if (isAuthScreen && isSignedIn) router.replace("/(tabs)");
    }
  }, [user, token, segments, router, loading]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}