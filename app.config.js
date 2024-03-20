export default {
  expo: {
    name: "스쿨버스 기사님",
    slug: "busdriver",
    version: "1.2.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "kr.codest.busdriver",
      buildNumber: "1.2.1",
      infoPlist: {
        NSLocationAlwaysUsageDescription:
          "버스 위치 정보 공유를 위해 사용자의 위치 정보에 접근합니다.",
        NSLocationWhenInUseUsageDescription:
          "버스 위치 정보 공유를 위해 사용자의 위치 정보에 접근합니다.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "버스 위치 정보 공유를 위해 사용자의 위치 정보에 접근합니다.",
        CFBundleDevelopmentRegion: "ko",
        UIBackgroundModes: ["location", "fetch"],
      },
      config: {
        usesNonExemptEncryption: false,
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "kr.codest.busdriver",
      versionCode: 8,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "com.google.android.providers.gsf.permission.READ_GSERVICES",
        "android.permission.INTERNET",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
      ],
      useNextNotificationsApi: true,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    notification: {
      icon: "./assets/icon.png",
      color: "#000000",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "위치 정보 공유를 위해 사용자의 위치 정보에 접근합니다.",
          isAndroidBackgroundLocationEnabled: true,
          isIosBackgroundLocationEnabled: true,
        },
      ],
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffffff",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "4340dc9f-81c2-41b0-93d2-e3f98d5b887f",
      },
    },
  },
};
