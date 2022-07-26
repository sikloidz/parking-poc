import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

import marker from "./assets/marker.png";
import { polygons } from "./polygons";

const cityCenter = {
  merida: {
    latitude: 20.969797,
    longitude: -89.622657,
  },
  queretaro: {
    latitude: 20.590596,
    longitude: -100.391649,
  },
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [city, setCity] = useState("select");
  const map = useRef();

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    setIsInitialized(true);
  }

  useEffect(() => {
    getLocation();
  }, []);

  if (!isInitialized) {
    return null;
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>La aplicación necesita obtener tu ubicación para funcionar</Text>
      </View>
    );
  }

  function updateMapCenter(city) {
    setCity(city);

    map.current.animateCamera({
      center: {
        ...cityCenter[city],
      },
    });
  }

  async function park() {
    const camera = await map.current.getCamera();

    alert(
      `Tu posicion de estacionamiento es (${camera.center.latitude},${camera.center.longitude})`
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={styles.map}
        initialCamera={{
          center: location,
          pitch: 1,
          heading: 1,
          zoom: 15,
          altitude: 1,
        }}
        zoomEnabled
      >
        {polygons.map((polygon, i) => (
          <Polygon key={i} strokeWidth={3} lineCap="round" {...polygon} />
        ))}
      </MapView>

      <Picker
        style={{
          position: "absolute",
          top: 50,
          left: 16,
          right: 16,
          backgroundColor: "white",
          borderRadius: 6,
        }}
        selectedValue={city}
        onValueChange={(newValue) => {
          updateMapCenter(newValue);
        }}
      >
        <Picker.Item
          label="Selecciona tu ciudad"
          value="select"
          enabled={false}
        />
        <Picker.Item label="Merida" value="merida" />
        <Picker.Item label="Queretaro" value="queretaro" />
      </Picker>

      <View
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -24,
          marginTop: -48,
        }}
      >
        <Image style={{ width: 48, height: 48 }} source={marker} />
      </View>
      <Pressable
        style={{
          backgroundColor: "#7c3aed",
          paddingVertical: 12,
          paddingHorizontal: 16,
          position: "absolute",
          bottom: 25,
          left: 16,
          right: 16,
          borderRadius: 6,
        }}
        onPress={park}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Estacionar aquí
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});
