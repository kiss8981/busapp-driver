import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import StackNavigator from "./src/screens/Stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { useAppDispatch, useAppSelector } from "./src/hooks/reduxHook";
import { fetchProviders } from "./src/store/slices/providerSlice";
import { fetchAuth } from "./src/store/slices/authSlice";
import Toast from "react-native-toast-message";
import type { NavigationContainerRef } from "@react-navigation/native";
import type { StackNavigator as StackNavigatorTypes } from "./src/types/Navigator";
import * as Notifications from "expo-notifications";

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppSplashScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const navigationRef =
    useRef<NavigationContainerRef<StackNavigatorTypes>>(null);
  const { authenticate, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          await dispatch(fetchProviders()),
          await dispatch(fetchAuth()),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    (async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();

        if (authenticate) {
          navigationRef.current?.reset({ routes: [{ name: "Root" }] });
        }
      }
    })();
  }, [appIsReady]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppSplashScreen />
      <Toast position="bottom" />
    </Provider>
  );
}
