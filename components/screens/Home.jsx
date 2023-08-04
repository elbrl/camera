import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function Home({ navigation }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Photos");
        }}
      >
        <FontAwesome name="home" size={60} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Camer");
        }}
      >
        <AntDesign name="camera" size={60} color="black" />
      </TouchableOpacity>
    </View>
  );
}
