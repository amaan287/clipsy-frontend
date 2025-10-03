import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import { JSX, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@/store/slices/userSlice";
import { UserState } from "@/types/userstate";
import { navigate } from "expo-router/build/global-state/routing";

export default function App(): JSX.Element {
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const user = useSelector((state: {user:UserState}) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "325026496663-705d8570rupfsita3mj1or9lhn2507d9.apps.googleusercontent.com",
      webClientId:
      "325026496663-58gtgieuntvv8de8rjllvs3t8mkl5vcc.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  async function handleGoogleSignin(): Promise<void> {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();      
      if (isSuccessResponse(response)) {
        const { name, email, photo } = response.data.user;

        // Add timeout and better error handling for the axios request
        console.warn("email",email);
        console.warn("name",name);
        console.warn("photo",photo);
        const res = await axios.post(
          `${BACKEND_URL}/auth/login`,
          {
            email:email,            
            name:name,
            profile_pic:photo,
          }
        );
        
        console.warn("backend data",res.data);
        // Redux persist will automatically save this to AsyncStorage
        dispatch(
          setUser({
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token,
              user: res.data.user_data,     
          })
        );
        navigate("/");
      } else {
        console.warn("Google signin was failed");
      }
    } catch (error: unknown) {
      console.warn("error",error);
      console.error(error);
      
      // Check if it's an axios error first
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert("Error", "Request timeout. Please check your internet connection.");
        } else if (error.response) {
          Alert.alert("Error", `Server error: ${error.response.status}`);
        } else if (error.request) {
          Alert.alert("Error", "Network error. Please check your backend URL and internet connection.");
        } else {
          Alert.alert("Error", "An unexpected error occurred.");
        }
      } else if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.warn("In progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.warn("Play services not available");
            Alert.alert("Error", "Google Play Services not available");
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            console.warn("Sign in cancelled");
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            console.warn("Sign in required");
            break;
          default:
            console.warn("Unknown error occurred");
            Alert.alert("Error", "An unknown error occurred during sign in");
            break;
        }
      } else {
        console.warn("failed");
        Alert.alert("Error", "Sign in failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut(): Promise<void> {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      // Redux persist will automatically clear from AsyncStorage
      dispatch(logout());
      
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Failed to sign out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {user.isAuthenticated ? (
        <View style={styles.userContainer}>
          {/* Fixed: Use the correct photo URL from user data */}
          <Image 
            source={{ uri: user.user?.profile_pic|| "" }} 
            style={styles.avatar}
            onError={() => console.warn("Failed to load avatar image")}
          />
          <Text style={styles.welcomeText}>Welcome, {user.user?.name}!</Text>
          <Text style={styles.emailText}>{user.user?.email}</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing Out..." : "Sign Out"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.title}>Google Authentication</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleGoogleSignin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign in with Google"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  signInContainer: {
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "#4285f4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
  },
  signOutButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  userContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});