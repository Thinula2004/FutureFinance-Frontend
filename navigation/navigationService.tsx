import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./navigator";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateFromStack(
  screen: keyof RootStackParamList,
  params?: any,
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen, params);
  }
}

export function navigateAndReset(
  screen: keyof RootStackParamList,
  params?: any,
  delay: number = 0,
) {
  if (navigationRef.isReady()) {
    setTimeout(() => {
      navigationRef.reset({
        index: 0,
        routes: [
          {
            name: screen,
            params,
          },
        ],
      });
    }, delay * 1000);
  }
}
