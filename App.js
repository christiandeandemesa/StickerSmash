import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";

import PlaceholderImage from "./assets/images/background-image.png";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageAsync = async () => {
    // The launchImageLibrayAsync method displays the UI for choosing an image or a video from the device's media library.
    // The object within this method is the ImagePickerOptions object.
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Allows the user to crop an image during the selection process only on Android and iOS.
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Sets the image with the result object's asset array's first index (i.e. another object) uri string (i.e. the selected image).
    } else {
      alert("You did not select any image"); // Sends an alert if you canceled selecting an image.
    }
  };

  return (
    // All core components in React Native have a style prop.
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          label="Choose a photo"
          theme="primary"
          onPress={pickImageAsync}
        />
        <Button label="Use this photo" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// The style prop used above accepts a JS object as its value, so styling is done here instead of CSS.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

export default App;

