import React, { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.post(
          `${BACKEND_URL}/auth/refresh?refreshToken=${token}`,
        );

        await AsyncStorage.setItem("refreshToken", response.data.data.refreshToken);
        
        dispatch(
          setUser({
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            user: response.data.data.user_data,
          })
        );
      } catch (error) {
        console.error("Refresh token error:", error);
        await AsyncStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    refreshToken();
  }, [dispatch]);

  return <View style={{ flex: 1 }}>{children}</View>;
}