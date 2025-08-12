import { UserState } from "@/types/userstate";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { navigate } from "expo-router/build/global-state/routing";
import { logout } from "@/store/slices/userSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileDropdown() {
  const user = useSelector((state: { user: UserState }) => state.user);
  console.warn("User profile:", user.user?.profile_pic);
  const [visible, setVisible] = useState(false);
const dispatch = useDispatch();
  const theme = useTheme();

  const handleOptionPress = (option: string) => {
    console.log("Selected:", option);
    setVisible(false);
    // Navigate or trigger logic here
    switch (option) {
      case "My Profile":
        navigate("/profile")
        break;
      case "Settings":
        navigate("/settings")
        break;
      case "Signin":
        navigate('/app')
        break;
      case "Logout":
        dispatch(logout());
        GoogleSignin.signOut();
        AsyncStorage.removeItem("refreshToken"); // Clear stored token
        navigate('/app');

        // Handle logout logic
        break;
      default:
        break;
    }
  };

  // Get user initials for fallback avatar
  const getUserInitials = () => {
    if (user?.user?.name) {
      return user.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  // Determine what options to show based on user state
  const getMenuOptions = () => {
    if (user?.isAuthenticated) {
      return ["My Profile", "Settings", "Logout"];
    } else {
      return ["Signin", "Settings"];
    }
  };

  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    profileTrigger: {
      ...styles.profileTrigger,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
    },
    avatarFallback: {
      ...styles.avatarFallback,
      backgroundColor: theme.colors.primary,
    },
    dropdown: {
      ...styles.dropdown,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      shadowColor: theme.dark ? "#fff" : "#000",
    },
    optionPressed: {
      ...styles.optionPressed,
      backgroundColor: theme.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    optionText: {
      ...styles.optionText,
      color: theme.colors.text,
    },
    avatarText: {
      ...styles.avatarText,
      color: "#fff", // Keep white text on colored background for better contrast
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop when dropdown is open */}
      {visible && (
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
      )}
      
      <View style={styles.container}>
        <TouchableOpacity 
          style={dynamicStyles.profileTrigger}
          onPress={() => setVisible(!visible)}
          activeOpacity={0.7}
        >
          {user?.user?.profile_pic ? (
            <Image source={{ uri: user.user.profile_pic }} style={styles.avatar} />
          ) : (
            <View style={dynamicStyles.avatarFallback}>
              <Text style={dynamicStyles.avatarText}>{getUserInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>

        {visible && (
          <View style={dynamicStyles.dropdown}>
            {getMenuOptions().map((option) => (
              <Pressable
                key={option}
                onPress={() => handleOptionPress(option)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && dynamicStyles.optionPressed
                ]}
              >
                <FontAwesome 
                  name={getOptionIcon(option)} 
                  size={16} 
                  color={theme.colors.text} 
                  style={styles.optionIcon}
                />
                <Text style={dynamicStyles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// Helper function to get icons for menu options
const getOptionIcon = (option: string) => {
  switch (option) {
    case "My Profile":
      return "user";
    case "Settings":
      return "cog";
    case "Signin":
      return "sign-in";
    case "Logout":
      return "sign-out";
    default:
      return "circle";
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    zIndex: 1001,
  },
  profileTrigger: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 160,
    borderWidth: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  optionPressed: {
    // Base style, color will be overridden by dynamic styles
  },
  optionIcon: {
    marginRight: 12,
    width: 16,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});