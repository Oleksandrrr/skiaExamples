import React, { useEffect, useState } from "react";

import { Canvas, Circle } from "@shopify/react-native-skia";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export const Dot = ({
  index,
  xPosition,
  yPosition,
}: {
  index: number;
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
}) => {
  const currentRow = Math.floor(index / 12) * 30;
  const currentColumn = Math.floor(index % 12) * 30 + 35;
  const radius = useDerivedValue(() => {
    const hypoteneuse = Math.hypot(
      xPosition.value - currentColumn,
      yPosition.value - 30 - currentRow
    );

    if (hypoteneuse <= 55 && xPosition.value !== -1) {
      return withSpring(11, {
        overshootClamping: true,
      });
    } else {
      return withSpring(3, {
        overshootClamping: true,
      });
    }
  }, [xPosition, yPosition]);

  return <Circle cx={currentColumn} cy={currentRow} color="blue" r={radius} />;
};

export default function HomeScreen() {
  const [nums, setNums] = useState<number[]>([]);
  const xPosition = useSharedValue(-1);
  const yPosition = useSharedValue(-1);
  const gesture = Gesture.Pan()
    .onEnd(() => {
      xPosition.value = -1;
      yPosition.value = -1;
    })
    .onFinalize(() => {
      xPosition.value = -1;
      yPosition.value = -1;
    })
    .onBegin(({ x, y }) => {
      xPosition.value = x;
      yPosition.value = y;
    })
    .onChange(({ x, y }) => {
      xPosition.value = x;
      yPosition.value = y;
    });

  useEffect(() => {
    const dotsForHeight = Math.round(height / 35);
    const numsArray = Array.from(Array(12 * dotsForHeight).keys());
    setNums(numsArray);
    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Canvas style={{ height: "100%", width: "100%" }}>
            {nums.map((dotIndex) => {
              return (
                <Dot
                  key={dotIndex}
                  index={dotIndex}
                  xPosition={xPosition}
                  yPosition={yPosition}
                />
              );
            })}
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 400,
  },
});
