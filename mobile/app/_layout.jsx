import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If checkAuth is async, handle it like this:
    Promise.resolve(checkAuth()).finally(() => setLoading(false));
  }, []);

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