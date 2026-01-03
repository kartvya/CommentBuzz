import React, { useEffect, useRef, useState } from "react";
import { GestureResponderEvent, Pressable, ViewStyle } from "react-native";

const DEFAULT_DOUBLE_PRESS_DELAY = 250;

interface DoubleTouchableOpacityProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onDoublePress?: (event: GestureResponderEvent) => void;
  doublePressDelay?: number;
}

const DoubleTouchableOpacity: React.FC<DoubleTouchableOpacityProps> = ({
  children,
  onPress,
  onDoublePress,
  doublePressDelay = DEFAULT_DOUBLE_PRESS_DELAY,
}) => {
  const [clickCount, setClickCount] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePress = (event: GestureResponderEvent) => {
    setClickCount((prev) => prev + 1);
    if (clickCount === 1) {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      onDoublePress?.(event);
      setClickCount(0);
    } else {
      timeoutRef.current = setTimeout(() => {
        if (onPress) onPress(event);
        setClickCount(0);
      }, doublePressDelay);
    }
  };

  return <Pressable onPress={handlePress}>{children}</Pressable>;
};

export default DoubleTouchableOpacity;
