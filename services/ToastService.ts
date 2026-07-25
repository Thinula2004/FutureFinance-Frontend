import Toast from "react-native-toast-message";

export const eclipseText = (text: string, length: number): string => {
  if (text.length <= length) {
    return text;
  }

  return `${text.substring(0, length)}...`;
};

type ToastType = "success" | "error" | "info";

export const showToast = (type: ToastType, message: string) => {
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
  });
};
