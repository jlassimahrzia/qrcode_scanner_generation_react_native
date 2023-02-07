import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import QrcodeGenerator from "./qrcode-generator";
import QrcodeScanner from "./qrcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Home() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#409BFF",
        unmountOnBlur: true
      }}
    >
      <Tab.Screen
        name="Qr Code Generator"
        component={QrcodeGenerator}
        options={{
          tabBarLabel: "Qr Code Generator",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="qrcode-edit"
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Qr Code Scanner"
        component={QrcodeScanner}
        options={{
          tabBarLabel: "Qr Code Scanner",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default Home;
