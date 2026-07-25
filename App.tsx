import AppNavigator from "./navigation/navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ErrorToast, InfoToast, SuccessToast } from "./components/CustomToast";

export default function App() {
  const toastConfig = {
    success: (props: any) => <SuccessToast {...props} />,

    error: (props: any) => <ErrorToast {...props} />,

    info: (props: any) => <InfoToast {...props} />,
  };

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
