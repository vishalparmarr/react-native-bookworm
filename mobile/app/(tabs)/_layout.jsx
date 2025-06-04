import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

export default function HomeLayout() {

    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                headerTitleStyle: {
                    color: COLORS.textPrimary,
                    fontWeight: "600",
                }, 
                headerShadowVisible: false,

                tabBarStyle : {
                    backgroundColor: COLORS.cardBackground,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    padding: 1,
                    paddingBottom: insets.bottom,
                    height: 60 + insets.bottom,
                }
            }}
        >
            <Tabs.Screen name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen name="create"
                options={{
                    title: "Create",
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="add-circle-outline" size={size} color={color} />
                    }
                }}
            />
            <Tabs.Screen name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}