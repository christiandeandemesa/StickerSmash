// Basic button

import { StyleSheet, View, Pressable, Text } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

function Button({ label, theme, onPress }) {
  if (theme === "primary") {
    return (
      <View
        style={[
          // Takes the default style from buttonContainer, then adds or overrides with the inline styles.
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 },
        ]}
      >
        <Pressable
          onPress={onPress}
          style={[styles.button, { backgroundColor: "#fff" }]}
        >
          {/* Image icon */}
          <FontAwesome
            name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: "#25292e" }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      {/* The Pressable component that detects various types of interaction (e.g. single-tap or long press events). */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Button;
