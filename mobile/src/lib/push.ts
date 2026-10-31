import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

// Show the banner even when the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Asks permission and registers this phone for "new article" notifications.
 * Quietly does nothing in Expo Go, on simulators, or before the EAS project is linked.
 */
export async function registerForNews(lang: string) {
  try {
    if (!Device.isDevice) return;
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return; // Expo Go
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("news", { name: "სიახლეები / News", importance: Notifications.AndroidImportance.HIGH });
    }
    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== "granted") status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== "granted") return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (!projectId) return;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    // Re-register only when the token or language changed.
    const key = `${token}|${lang}`;
    if ((await AsyncStorage.getItem("pushKey")) === key) return;
    const res = await api.registerPush(token, lang);
    if (res.ok) await AsyncStorage.setItem("pushKey", key);
  } catch {
    // Notifications are a nice-to-have; never break the app over them.
  }
}
