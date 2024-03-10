import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/reduxHook";
import socket from "../../../utils/socket";
import Toast from "react-native-toast-message";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import styles from "./styles";
import DropDownPicker from "react-native-dropdown-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";

const HomeScreen = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { token, user } = useAppSelector(state => state.auth);
  const [openSelectRoute, setOpenSelectRoute] = useState<boolean>(false);
  const [tryReconnect, setTryReconnect] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [route, setRoute] = useState<string>();
  const [locationWatcher, setLocationWatcher] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const { granted: foregroundGranted } =
          await Location.requestForegroundPermissionsAsync();

        if (!foregroundGranted) {
          Toast.show({
            type: "error",
            text1: "위치 권한",
            text2: "셔틀버스 위치 제공을 위해 위치 권한이 필요합니다.",
          });
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  useEffect(() => {
    socket.on("authenticate", data => {
      const { data: response } = JSON.parse(data);
      if (typeof response == "boolean" && !response) {
        Toast.show({
          type: "error",
          text1: "인증 실패",
          text2: "유저 정보를 불러오지 못했습니다. 다시 로그인 해주세요.",
        });
        setIsConnected(true);
      } else {
        Toast.show({
          type: "success",
          text1: "연결성공",
          text2: "서버 연결에 성공했습니다.",
        });
      }
    });

    socket.emit("authenticate", {
      provider: user.provider,
      token: token.access,
    });

    socket.on("disconnect", () => {
      Toast.show({
        type: "error",
        text1: "서버 연결 끊김",
        text2: "서버와 연결이 끊겼습니다. 다시 연결합니다.",
      });
      setIsConnected(false);
      setTryReconnect(true);
    });

    socket.on("connect", () => {
      socket.emit("authenticate", {
        provider: user.provider,
        token: token.access,
      });
    });
  }, []);

  useEffect(() => {
    if (tryReconnect) {
      socket.connect();
    }
  }, [tryReconnect, socket.connected]);

  useEffect(() => {
    if (!isConnected) {
      socket.connect();
    }
  }, [isConnected]);

  const startBusrun = async () => {
    if (!route) {
      Toast.show({
        type: "error",
        text1: "운행 시작",
        text2: "운행할 노선을 선택해주세요.",
      });
      return;
    }
    setIsStart(true);
    activateKeepAwakeAsync();

    const watcher = setInterval(async () => {
      if (!isConnected || !socket.connected) {
        socket.connect();
      }

      const nowLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const {
        coords: { latitude, longitude },
      } = nowLocation;

      setLocation(nowLocation.coords);
      socket.emit("locationupdate", {
        busId: route,
        location: {
          latitude,
          longitude,
        },
      });
    }, 4000);

    setLocationWatcher(watcher);

    Toast.show({
      type: "success",
      text1: "운행 시작",
      text2: "운행을 시작합니다.",
    });
  };

  const stopBusrun = () => {
    if (locationWatcher) {
      clearInterval(locationWatcher);
    }
    setIsStart(false);
    deactivateKeepAwake();

    Toast.show({
      type: "success",
      text1: "운행 종료",
      text2: "운행이 종료되었습니다.",
    });
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 15,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            zIndex: 10,
            marginTop: "auto",
          }}
        >
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openSelectRoute}
            disabled={isStart}
            multiple={false}
            style={
              isStart
                ? {
                    ...styles.selectBox,
                    backgroundColor: "#f5f5f5",
                  }
                : styles.selectBox
            }
            value={route as string}
            items={user.routes.map(item => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            dropDownContainerStyle={styles.selctBoxStyle}
            setOpen={setOpenSelectRoute}
            setValue={setRoute}
            placeholder={"운행할 노선을 선택해주세요."}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={isStart ? stopBusrun : startBusrun}
        >
          {isStart ? <Text>운행 종료</Text> : <Text>운행 시작</Text>}
        </TouchableOpacity>

        <MapView
          provider="google"
          style={{
            width: "100%",
            height: "70%",
            marginTop: "auto",
          }}
          showsUserLocation
          followsUserLocation
          minZoomLevel={5}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          }}
          region={{
            latitude: location?.latitude || 37.5665,
            longitude: location?.longitude || 126.978,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          }}
        />
      </View>
    </>
  );
};

export default HomeScreen;
