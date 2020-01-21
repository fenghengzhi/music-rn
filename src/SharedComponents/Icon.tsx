import React, { useRef } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureResponderEvent, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default function Icon(
  {
    size = 24, name, onPress,
  }: { size?: number, name: string, onPress?: (event: GestureResponderEvent) => void },
) {
  const iconRef = useRef<any>();
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressOut={() => iconRef.current.setNativeProps({ style: { textShadowRadius: 0 } })}
      onPressIn={() => iconRef.current.setNativeProps({ style: { textShadowRadius: 50 } })}
    >
      <MaterialIcon
        ref={iconRef}
        size={size || 24}
        name={name}
        color="#fff"
        style={styles.iconShadowColor}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  iconShadowColor: {
    textShadowColor: '#fff',
  },
  iconShadow: {
    textShadowRadius: 200,
  },
});
