
// Updated Index.tsx
import ProfileDropdown from "@/components/ProfileDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserState } from "@/types/userstate";
import { Recipe } from "@/types/recipe";
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import AppLoading from "expo-app-loading";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator,Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { navigate } from "expo-router/build/global-state/routing";
import ShareHandler from "@/utils/ShareHandler";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
console.warn("Backend URL:", BACKEND_URL);
export default function Index() {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const user = useSelector((state: { user: UserState }) => state.user);
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });
useEffect(() => {
      ShareHandler; // This initializes the singleton

})
  useEffect(() => {
     const fetchRecipes = async () => {
    if (!user.user?.id) {
      console.warn("User ID not found, skipping recipe fetch");
      return
    };
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/recipes/user/${user.user.id}`,{
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setRecipes(response.data.recipe_data.recipes);
      } else {
        setError(response.data.error || "Failed to fetch recipes");
      }
    } catch (err) {
      setError("Error fetching recipes");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };
    if (user.isAuthenticated) {
      fetchRecipes();
    }
  }, [user]);

 

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const filters = ["All", "Recipes", "Educational", "others"];

  // Filter recipes based on search and active filter
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(search.toLowerCase());
    
    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Recipes") return matchesSearch && recipe.isRecipe;
    if (activeFilter === "Educational") return matchesSearch && !recipe.isRecipe;
    // Add more filter logic as needed
    return matchesSearch;
  });

  // Split recipes into two columns for masonry layout
  const getColumnData = (columnIndex: number) => {
    return filteredRecipes.filter((_, index) => index % 2 === columnIndex);
  };


  const renderRecipeCard = (recipe: Recipe, index: number) => (
    <Pressable
      onPress={() => navigate(`/recipe/${recipe._id}`)}
      key={recipe._id}
      style={[
        styles.cardMini,
        theme.dark ? { backgroundColor: "#212529" } : "",
      ]}
    >
      <Text
        style={[
          styles.cardMiniTitle,
          theme.dark ? { color: "#fff" } : "",
        ]}
      >
        {recipe.title}
      </Text>
      <Text style={styles.cardMiniCategory}>
        {recipe.isRecipe ? "Recipe" : "Educational"}
      </Text>
      
      {/* Show first 3 ingredients */}
      {recipe.ingredients.slice(0, 3).map((ingredient, reqIndex) => (
        <Text
          key={reqIndex}
          style={[
            styles.cardMiniRequirement,
            theme.dark ? { color: "#fff" } : "",
          ]}
        >
          • {ingredient.name} {ingredient.quantity && `(${ingredient.quantity})`}
        </Text>
      ))}
      
      {/* Show metadata if available */}
      {recipe.metadata?.difficulty && (
        <Text
          style={[
            styles.cardMiniMeta,
            theme.dark ? { color: "#aaa" } : "",
          ]}
        >
          Difficulty: {recipe.metadata.difficulty}
        </Text>
      )}
      
      <View
        style={[
          styles.cardMiniFooter,
          theme.dark ? { backgroundColor: "#495057" } : "",
        ]}
      />
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? "#151718" : "#fff" },
      ]}
    >
      <ThemedView style={styles.content}>
        {/* Updated top bar with conditional styling */}
        <ThemedView
          style={[
            styles.topbar,
            { backgroundColor: theme.dark ? "#151718" : "transparent" },
          ]}
        >
          {user.isAuthenticated ? (
            <ThemedText type="subtitle">
              {user.user?.name.split(" ")[0] + "'s collections"}
            </ThemedText>
          ) : (
            <ThemedText type="subtitle">collections</ThemedText>
          )}
          <ProfileDropdown />
        </ThemedView>

        <View
          style={[
            styles.searchbar,
            { borderColor: theme.dark ? "#6c757d" : "#ccc" },
          ]}
        >
          <FontAwesome
            name="search"
            size={20}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            style={theme.dark ? styles.inputDark : styles.inputLight}
            placeholder="Type Here..."
            onChangeText={setSearch}
            value={search}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.filterWrapper}>
          {filters.map((filter, index) => {
            const isActive = filter === activeFilter;
            return (
              <View
                key={index}
                style={[
                  styles.filterButton,
                  isActive
                    ? styles.activeFilter
                    : theme.dark
                    ? { backgroundColor: "#212529" }
                    : styles.inactiveFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive
                      ? styles.activeFilterText
                      : theme.dark
                      ? { color: "#fff" }
                      : styles.inactiveFilterText,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  {filter}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Loading and Error States */}
        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.dark ? "#fff" : "#000"} />
            <Text style={[styles.loadingText, theme.dark ? { color: "#fff" } : {}]}>
              Loading recipes...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Recipe Grid */}
        {!loading && !error && (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {filteredRecipes.length === 0 ? (
              <View style={styles.centerContainer}>
                <Text style={[styles.noDataText, theme.dark ? { color: "#fff" } : {}]}>
                  {user.isAuthenticated 
                    ? search 
                      ? "No recipes found matching your search"
                      : "No recipes found. Start saving some recipes!"
                    : "Please log in to view your recipes"
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.parentgrid}>
                {/* Column 1 */}
                <View style={styles.cardGrid}>
                  {getColumnData(0).map((recipe, index) => renderRecipeCard(recipe, index * 2))}
                </View>
                {/* Column 2 */}
                <View style={styles.cardGrid}>
                  {getColumnData(1).map((recipe, index) => renderRecipeCard(recipe, index * 2 + 1))}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  heading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#000",
  },
  profile: {
    backgroundColor: "#888",
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  inputDark: {
    flex: 1,
    color: "#fff",
  },
  inputLight: {
    flex: 1,
    color: "#000",
  },
  filterWrapper: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 13,
  },
  activeFilter: {
    backgroundColor: "#e66895",
  },
  inactiveFilter: {
    backgroundColor: "#f1f1f1",
  },
  filterText: {
    fontSize: 14,
  },
  activeFilterText: {
    color: "#fff",
  },
  inactiveFilterText: {
    color: "#444",
  },
  scrollView: {
    marginTop: 20,
    marginBottom: 10,
  },
  parentgrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  cardGrid: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
    marginVertical: 10,
  },
  cardMini: {
    backgroundColor: "#f9f9f9",
    width: "100%",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardMiniTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardMiniRequirement: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  cardMiniCategory: {
    fontSize: 12,
    color: "#888",
  },
  cardMiniMeta: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  cardMiniFooter: {
    marginTop: 12,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});