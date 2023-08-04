import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";

const windowWidth = Dimensions.get("window").width;
const imageWidth = windowWidth * 0.33;
const imageGap = windowWidth * 0.005;

export default function Photos() {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  async function handleUpload() {
    selectedPhotos.map(async (porn) => {
      const info = await MediaLibrary.getAssetInfoAsync(porn);
      // console.log({ info });
      const data = new FormData();
      data.append("file", {
        uri: info.localUri,
        name: info.filename,
        type: "image/jpeg",
      });
      data.append("upload_preset", "ml_default");
      data.append("cloud_name", "dybbvpl3k");

      fetch("https://api.cloudinary.com/v1_1/dybbvpl3k/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  async function loadInitialPhotos() {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: ["creationTime"],
      first: 20,
    });

    setPhotos([...photos, ...media.assets]);
  }
  useEffect(() => {
    if (permissionResponse && permissionResponse.granted) {
      loadInitialPhotos();
    }
  }, [permissionResponse]);
  if (!permissionResponse) {
    return <View />;
  }

  const { granted, canAskAgain } = permissionResponse;
  if (!granted && canAskAgain) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 20,
            borderRadius: 10,
          }}
          onPress={requestPermission}
        >
          <Text style={{ color: "white" }}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!granted && !canAskAgain) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 16, lineHeight: 23 }}>
          Та зураг харах {"\n"} зөвшөөрөл өгөөгүй байна. {"\n\n"} Settings {">"}
          Permissions {">"} Storage {"\n"} сонголтыг идэвхжүүлээрэй.
        </Text>
      </View>
    );
  }

  function loadMorePhotos() {
    //gyjhgjh
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <FlatList
        onEndReached={loadMorePhotos}
        numColumns={3}
        data={photos}
        renderItem={({ item, index }) => (
          <ImageItem
            selected={
              selectedPhotos.findIndex((selected) => selected.id === item.id) +
              1
            }
            onSelect={() => setSelectedPhotos([...selectedPhotos, item])}
            onRemove={() =>
              setSelectedPhotos(
                selectedPhotos.filter((selected) => selected.id !== item.id)
              )
            }
            photo={item}
            index={index}
          />
        )}
        keyExtractor={(item) => item.uri}
      />

      {selectedPhotos.length > 0 && (
        <TouchableOpacity
          onPress={handleUpload}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: "black",
            padding: 20,
            borderRadius: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Илгээх</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ImageItem({ photo, index, onSelect, onRemove, selected }) {
  const marginHorizontal = index % 3 === 1 ? imageGap : 0;

  return (
    <TouchableOpacity onPress={() => (selected ? onRemove() : onSelect())}>
      <View
        style={{
          width: imageWidth,
          height: imageWidth,
          marginBottom: imageGap,
          marginHorizontal,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: photo.uri }}
          style={{
            backgroundColor: "#ccc",
            width: imageWidth,
            height: imageWidth,
          }}
        />
        {!!selected && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "blue",
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>{selected}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
