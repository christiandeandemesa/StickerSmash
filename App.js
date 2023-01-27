// Main part of the app.

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";
import { useState, useRef } from "react";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import domtoimage from "dom-to-image";

import ImageViewer from "./components/ImageViewer";
import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import IconButton from "./components/IconButton";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";

import PlaceholderImage from "./assets/images/background-image.png";

function App() {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  // The requestPermission() method asks for access to the user's device's media library when permission is not granted (i.e. status === null).
  if (status === null) {
    requestPermission();
  }

  // Selects an image from your device's media library sets it in a state.
  const pickImageAsync = async () => {
    // The launchImageLibrayAsync method displays the UI for choosing an image or a video from the device's media library.
    // The object within this method is the ImagePickerOptions object.
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Allows the user to crop an image during the selection process only on Android and iOS.
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Sets the image with the result object's asset array's first index (i.e. another object) uri string (i.e. the selected image).
      setShowAppOptions(true);
    } else {
      alert("You did not select any image"); // Sends an alert if you canceled selecting an image.
    }
  };

  // Resets the initial buttons shown (i.e. Choose a photo and Use this photo).
  const onReset = () => {
    setShowAppOptions(false);
  };

  // Opens the emoji modal.
  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  // Closes the emoji modal.
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // Saves the screenshot (i.e. the displayed image and emoji sticker) to the device's media library, or downloads it as a JPEG while on the web.
  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        // The captureRef() method accepts an optional argument where we can pass the height and width of the area to screenshot.
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        // localUri is the promise returned from captureRef() with the URI of the captured screenshot.
        // MediaLibrary.saveToLibraryAsync() saves the screenshot to the device's media library.
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      domtoimage
        .toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })
        .then((dataUrl) => {
          let link = document.createElement("a");
          link.download = "sticker-smash.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    // GestureHandlerRootView handles gestures (e.g. pan, tap, rotation, etc.).
    // All core components in React Native have a style prop.
    <GestureHandlerRootView style={styles.container}>
      {/* Chosen image and any emoji stickers added to it */}
      <View style={styles.imageContainer}>
        {/* the collapsable prop because we only want a screenshot of everything within this View component. */}
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>

      {/* Buttons */}
      {showAppOptions ? (
        // Reset, add emoji, and save buttons
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        // Choose and use photo buttons
        <View style={styles.footerContainer}>
          <Button
            label="Choose a photo"
            theme="primary"
            onPress={pickImageAsync}
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}

      {/* Emoji modal */}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
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
  optionsContainer: {
    position: "absolute",
    bottom: 50,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});

export default App;

