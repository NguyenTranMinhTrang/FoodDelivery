import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native"
import { Home, Restaurant, OrderDilivery } from "./screens/index";
import Tabs from "./navigation/tabs";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={Home}
      >
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="OrderDilivery" component={OrderDilivery} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
