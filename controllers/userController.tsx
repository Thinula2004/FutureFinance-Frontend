import axios from "axios";

import { User } from "../modals/User";
import { showToast } from "../services/ToastService";
import { navigateFromStack } from "../navigation/navigationService";
import {
  clearAuthData,
  getToken,
  saveToken,
  saveUser,
} from "../services/AsyncStorageService";

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/users";

export const register = async (
  name: string,
  email: string,
  password: string,
  gender: "male" | "female" | "other",
  dob: string,
): Promise<number | null> => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      gender,
      dob,
    });

    if (response.status === 201) {
      showToast("success", "Account created successfully");

      return 201;
    }

    return null;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        showToast("error", error.response.data?.message);

        return null;
      }

      if (error.response?.status === 409) {
        showToast("info", "An account with this email already exists.");

        return 409;
      }

      showToast("error", "Something went wrong");

      return null;
    }

    showToast("error", "Something went wrong");

    return null;
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    console.log("Login email:", email);
    console.log("Login password:", password);

    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      showToast("success", "Logged in successfully");
      const user = User.fromJson(response.data.user);
      const token = response.data.token;

      if (user && token) {
        saveUser(user);
        saveToken(token);
        return user;
      }

      showToast("error", "Something went wrong");
    }

    return null;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        showToast("error", error.response.data?.message);

        return null;
      }

      showToast("error", "Something went wrong");
    }

    showToast("error", "Something went wrong");

    return null;
  }
};

export const getProfile = async (): Promise<boolean> => {
  try {
    const token = await getToken();

    if (token == null) {
      return false;
    }

    console.log(`Token: ${token}`);

    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const user = User.fromJson(response.data.user);

      if (user) {
        saveUser(user);
        return true;
      }

      return false;
    }

    return false;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      }
    }
    return false;
  }
};
