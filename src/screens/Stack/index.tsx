import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigator as StackNavigatorTypes } from "../../types/Navigator";
import BottomTabsNavigator from "../BottomTabs";
import AuthScreen from "./Auth/AuthScreen";

const Stack = createStackNavigator<StackNavigatorTypes>();

const StackNavigator = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            headerTitle: "로그인",
          }}
        />
        <Stack.Screen
          name="Root"
          component={BottomTabsNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigator;
