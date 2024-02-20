import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import type { StackScreenProps } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHook";
import styles from "./styles";
import DropDownPicker from "react-native-dropdown-picker";
import { useRef, useState } from "react";
import { fetchAuth } from "../../../store/slices/authSlice";
import { fetcher } from "../../../utils/fetcher";
import Toast from "react-native-toast-message";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigator } from "../../../types/Navigator";

type AuthScreenProps = StackScreenProps<StackNavigator, "Auth">;

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const { providers } = useAppSelector(state => state.provider);
  const dispather = useAppDispatch();
  const [value, setValue] = useState<string>();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const Login = async () => {
    try {
      setLoading(true);
      const { data } = await fetcher.post("/auth/login", {
        provider: value,
        id,
        password,
      });

      await SecureStore.setItemAsync("accessToken", data.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", data.data.refreshToken);
      await SecureStore.setItemAsync("provider", value as string);

      await dispather(fetchAuth());

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "로그인 성공",
      });
      navigation.reset({ routes: [{ name: "Root" }] });
    } catch (e) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "로그인 실패",
        text2: "아이디 또는 비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setOpen(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View
            style={{
              paddingHorizontal: 15,
              zIndex: 10,
            }}
          >
            <Text style={styles.label}>소속</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              open={open}
              multiple={false}
              style={styles.selectBox}
              value={value as string}
              items={providers.map(item => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
              dropDownContainerStyle={styles.selctBoxStyle}
              setOpen={setOpen}
              setValue={setValue}
              placeholder={"소속을 선택해주세요."}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 15,
              width: "100%",
              marginTop: 10,
            }}
          >
            <Text style={styles.label}>아이디</Text>
            <TextInput style={styles.textInputBox} onChangeText={setId} />
            <Text
              style={{
                ...styles.label,
                marginTop: 10,
              }}
            >
              비밀번호
            </Text>
            <TextInput
              style={styles.textInputBox}
              textContentType="password"
              secureTextEntry
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.button}
              disabled={loading}
              onPress={Login}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  로그인
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default AuthScreen;
