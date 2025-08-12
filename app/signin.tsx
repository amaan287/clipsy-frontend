import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Signin() {
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        "325026496663-705d8570rupfsita3mj1or9lhn2507d9.apps.googleusercontent.com",
      webClientId:
        "325026496663-58gtgieuntvv8de8rjllvs3t8mkl5vcc.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  async function handleGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.warn(response);
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;
        console.warn(idToken);
        console.warn(name, email, photo);
      } else {
        console.warn("Google signin was failed");
      }
    } catch (error) {
      console.error(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.warn("In progress");
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.warn("Play services not available");
            // Android only, play services not available or outdated
            break;
          default:
            // some other error happened
        }
      } else {
        console.warn("failed");
        // an error that's not related to google sign in occurred
      }
    }
  }

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => {
            handleGoogleSignin();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Adjust based on your status bar height
    left: 20,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF', // iOS blue color
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});