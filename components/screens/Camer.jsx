import { Camera, CameraType } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export function Kamera({ navigation }) {
  const [permissionResponse1, requestPermission1] =
    MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState();

  async function loadInitialPhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 1,
    });
    setPhotos(media.assets[0].uri);
  }

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [check, setCheck] = useState(false);
  const cameraRef = useRef();

  const takePicture = async () => {
    const res = await cameraRef.current.takePictureAsync();
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(res.uri);
    } else {
      console.log("err");
    }

    setCheck(true);

    setTimeout(() => {
      setCheck(false);
    }, 100);
  };
  useEffect(() => {
    if (permissionResponse1 && permissionResponse1.granted) {
      loadInitialPhotos();
    }
  }, [permissionResponse1, check]);

  useEffect(() => {}, [check]);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1, opacity: check ? 0.7 : 1 }}
        type={type}
      >
        <View style={styles.buttonContainer}>
          <View
            style={{
              backgroundColor: "pink",
              backgroundColor: "black",
              opacity: 0.7,
              flex: 1,
            }}
          ></View>
          <View style={{ flex: 8 }}></View>
          <View style={{ backgroundColor: "black", opacity: 0.7, flex: 1.8 }}>
            <View style={{ height: 20 }}></View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                margin: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Photos");
                }}
              >
                <Image
                  width={60}
                  height={60}
                  style={{ flex: 1 }}
                  borderRadius={50}
                  source={{ uri: photos }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePicture}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    width: 65,
                    height: 65,
                    borderRadius: 100,
                  }}
                ></View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <MaterialCommunityIcons
                  name="camera-flip"
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
  },

  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
