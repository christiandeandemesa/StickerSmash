// Emoji sticker on the displayed image

import { View, Image } from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";

function EmojiSticker({ imageSize, stickerSource }) {
  // The createAnimatedComponent() can wrap any component.
  const AnimatedView = Animated.createAnimatedComponent(View);
  const AnimatedImage = Animated.createAnimatedComponent(Image);

  // Translation values are separated since the axes need to be tracked separately.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Allows the user to drag the emoji sticker across the viewport.
  const onDrag = useAnimatedGestureHandler({
    // onStart's context holds initial values of translateX and translateY.
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    // onActive's event is the current position of the pan gesture, and context is the previous values of translateX and translateY.
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });

  // The useSharedValue() hook helps mutate a piece of data and allows running animations by making it a shared value (i.e. scaleImage).
  const scaleImage = useSharedValue(imageSize);

  // Double-tapping on the emoji sticker will cause it to double in size.
  //The useAnimatedGestureHandler() hook animates the emoji sticker's size transition.
  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      // A shared value can be accessed and modified using the .value property.
      if (scaleImage.value) {
        scaleImage.value = scaleImage.value * 2;
      }
    },
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  // Styles that use spring to animate it.
  // The useAnimatedStyle() hook creates a style object for animation.
  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView style={[containerStyle, { top: -350 }]}>
        {/* numberofTaps indicates how many are needed to activate the onGestureEvent. */}
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  );
}

export default EmojiSticker;
