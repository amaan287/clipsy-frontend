import React, { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { usePathname } from "expo-router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateTokens, logout } from "@/store/slices/userSlice";
import { UserState } from "@/types/userstate";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const refreshTokenIfNeeded = async () => {
      try {
        // Only try to refresh if we have a refresh token but are not authenticated
        // This handles the case where the app was closed and reopened
        if (user.refreshToken && !user.isAuthenticated) {
          console.log("🔄 Attempting to refresh token...");
          
          const response = await axios.post(
            `${BACKEND_URL}/auth/refresh?refreshToken=${user.refreshToken}`,
          );

          if (response.data.data) {
            // Update the tokens and user data
            dispatch(
              setUser({
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
                user: response.data.data.user_data,
              })
            );
            console.log("✅ Token refreshed successfully");
          }
        }
      } catch (error) {
        console.error("❌ Refresh token error:", error);
        // If refresh fails, clear the user state
        dispatch(logout());
      } finally {
        setIsInitialLoad(false);
      }
    };

    // Only run on initial app load
    if (isInitialLoad) {
      refreshTokenIfNeeded();
    }
  }, [user.refreshToken, user.isAuthenticated, dispatch, isInitialLoad]);

  return <View style={{ flex: 1 }}>{children}</View>;
}