import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../modals/User";

const USER_KEY = "@future_finance_user";
const TOKEN_KEY = "@future_finance_token";

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);

    if (!userJson) {
      return null;
    }

    return User.fromJson(JSON.parse(userJson));
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

export const saveToken = async (
  token: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      TOKEN_KEY,
      token
    );
  } catch (error) {
    console.error("Error saving token:", error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
    throw error;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      USER_KEY,
      TOKEN_KEY,
    ]);
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
};