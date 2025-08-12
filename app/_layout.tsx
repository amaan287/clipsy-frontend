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


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ReduxProvider>
      <AppLayout>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                headerLeft: () => <></>,
              }}
            />
            <Stack.Screen
              name="app"
              options={{
                headerShown: false,
                headerLeft: () => <></>,
              }}
            />
              <Stack.Screen
              name="recipe/[id]/index"
              options={{
                headerShown: false,
                headerLeft: () => <></>,
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