import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGINDATE } from "./constants";
let user_data = {};

export const setSaveUserDate = async (data = user_data) => {
  try {
    const res = await AsyncStorage.setItem(LOGINDATE, JSON.stringify(data));
    return JSON.parse(res);
  } catch (err) {}
};

export const getSaveUserDate = async () => {
  try {
    const res = await AsyncStorage.getItem(LOGINDATE);
    return JSON.parse(res);
  } catch (err) {}
};

export const clearAsyncStorageFromLocal = async () => {
  try {
    await AsyncStorage?.clear();
  } catch (error) {
  }
};
