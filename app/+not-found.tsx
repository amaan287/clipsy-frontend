import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Oops! Page Not found",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Page not found</Text>
        <Link style={styles.link} href={"/"}>
          GO to Home Page
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
  },
  link: {
    textDecorationLine: "underline",
    color: "#000",
    fontSize: 20,
  },
});
