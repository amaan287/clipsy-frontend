import AppLayout from "@/providers/appLayout";
import { ReduxProvider } from "@/providers/providers";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import ShareHandler from "@/utils/ShareHandler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // Initialize ShareHandler at app level
    console.log("🚀 App: Initializing ShareHandler");
    ShareHandler.initialize();
    
    return () => {
      // Cleanup when app is closed
      ShareHandler.cleanup();
    };
  }, []);
  
  return (
    <ReduxProvider>
      <AppLayout>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="app"
              options={{
                headerShown: false,
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="recipe/[id]/index"
              options={{
                headerShown: false,
                headerLeft: () => null,
              }}
            />
            <Stack.Screen name="+not-found" options={{}} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppLayout>
    </ReduxProvider>
  );
}