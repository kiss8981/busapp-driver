import { Alert, Text, Touchable, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHook";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabNavigator, StackNavigator } from "../../../types/Navigator";
import { StackScreenProps } from "@react-navigation/stack";

type MyScreenProps = StackScreenProps<StackNavigator, "My">;

const MyScreen = ({ navigation }: MyScreenProps) => {
  const { token, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const Logout = async () => {
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "확인",
        onPress: async () => {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("provider");
          navigation.reset({ routes: [{ name: "Auth" }] });
        },
      },
    ]);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "#fff",
          paddingTop: 15,
          width: "100%",
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            소속
          </Text>
          <Text>{user.name}</Text>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: "auto",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: "#b8b8b8",
              borderRadius: 10,
              height: 50,
              borderWidth: 1,
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginHorizontal: 15,
            }}
            onPress={Logout}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              로그아웃
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default MyScreen;
