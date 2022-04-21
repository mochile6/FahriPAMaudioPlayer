import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Music"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="play-circle" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
