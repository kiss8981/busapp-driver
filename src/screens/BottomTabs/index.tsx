import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabNavigator } from "../../types/Navigator";
import MyScreen from "./My/MyScreen";
import HomeScreen from "./Home/HomeScreen";
import { Feather } from "@expo/vector-icons";

const BottomTab = createBottomTabNavigator<BottomTabNavigator>();

const BottomTabsNavigator = () => {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color, focused, size }) => (
            <Feather
              name="home"
              size={size}
              color={focused ? color : "#b6b6b6"}
            />
          ),
          tabBarActiveTintColor: "#000",
        }}
      />
      <BottomTab.Screen
        name="My"
        component={MyScreen}
        options={{
          title: "내 정보",
          tabBarIcon: ({ color, focused, size }) => (
            <Feather
              name="user"
              size={size}
              color={focused ? color : "#b6b6b6"}
            />
          ),
          tabBarActiveTintColor: "#000",
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabsNavigator;
