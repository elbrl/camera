import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Photos from "../photos";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import { Kamera } from "./Camer";

const Stack = createNativeStackNavigator();

export function Stackshit() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Photos" component={Photos} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Camer"
          component={Kamera}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
