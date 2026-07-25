import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  navigateAndReset,
  navigateFromStack,
  navigationRef,
} from "../navigation/navigationService";
import { RootStackParamList } from "../navigation/navigator";
import { clearAuthData } from "../services/AsyncStorageService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const MENU_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

const COLORS = {
  background: "#000000",
  panel: "#0D0D0D",
  foreground: "#F1B836",
  text: "#FFFFFF",
  subtleText: "#8A8A8A",
  border: "#232323",
  backdrop: "rgba(0,0,0,0.6)",
};

type SideMenuContextValue = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const SideMenuContext = createContext<SideMenuContextValue | undefined>(
  undefined,
);

export const useSideMenu = (): SideMenuContextValue => {
  const ctx = useContext(SideMenuContext);
  if (!ctx) {
    throw new Error("useSideMenu must be used within a SideMenuProvider");
  }
  return ctx;
};

export const SideMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const openMenu = useCallback(() => {
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, backdropOpacity]);

  const closeMenu = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -MENU_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setIsOpen(false));
  }, [translateX, backdropOpacity]);

  const value = useMemo(
    () => ({ isOpen, openMenu, closeMenu }),
    [isOpen, openMenu, closeMenu],
  );

  return (
    <SideMenuContext.Provider value={value}>
      {children}
      <SideMenuPanel
        isOpen={isOpen}
        translateX={translateX}
        backdropOpacity={backdropOpacity}
        onClose={closeMenu}
      />
    </SideMenuContext.Provider>
  );
};

type MenuItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
};

const SideMenuPanel: React.FC<{
  isOpen: boolean;
  translateX: Animated.Value;
  backdropOpacity: Animated.Value;
  onClose: () => void;
}> = ({ isOpen, translateX, backdropOpacity, onClose }) => {
  if (!isOpen) return null;

  const go = (screen: keyof RootStackParamList) => {
    onClose();
    navigateFromStack(screen);
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            onClose();
            await clearAuthData();
            navigateAndReset("Auth");
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: "home-outline",
      onPress: () => go("Dashboard"),
    },
    {
      key: "profile",
      label: "Profile",
      icon: "person-outline",
      onPress: () => {
        onClose();
        // TODO: wire up when Profile screen exists
        console.log("Navigate to Profile");
      },
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: "swap-horizontal-outline",
      onPress: () => {
        onClose();
        console.log("Navigate to Transactions");
      },
    },
    {
      key: "settings",
      label: "Settings",
      icon: "settings-outline",
      onPress: () => {
        onClose();
        console.log("Navigate to Settings");
      },
    },
    {
      key: "logout",
      label: "Log Out",
      icon: "log-out-outline",
      destructive: true,
      onPress: () => {
        handleLogout();
      },
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        <View style={styles.panelHeader}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>Future Finance</Text>
            <Text style={styles.appSubtitle}>Manage your money</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemsList}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={item.destructive ? "#FF6B6B" : COLORS.foreground}
                style={styles.menuItemIcon}
              />
              <Text
                style={[
                  styles.menuItemLabel,
                  item.destructive && styles.menuItemLabelDestructive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.panelFooter}>
          <Text style={styles.footerText}>Future Finance v1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backdrop,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: MENU_WIDTH,
    backgroundColor: COLORS.panel,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingTop: 64,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 16,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  appName: {
    color: COLORS.foreground,
    fontSize: 17,
    fontWeight: "700",
  },
  appSubtitle: {
    color: COLORS.subtleText,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  itemsList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  menuItemIcon: {
    marginRight: 16,
    width: 22,
  },
  menuItemLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  menuItemLabelDestructive: {
    color: "#FF6B6B",
  },
  panelFooter: {
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    alignItems: "center",
  },
  footerText: {
    color: COLORS.subtleText,
    fontSize: 11,
  },
});

export default SideMenuPanel;
