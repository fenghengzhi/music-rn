import React, { useState } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

export default function Fav() {
  const [fav, setFav] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Toast.show('仅供演示',{ containerStyle: { backgroundColor: '#ccc' }, textColor: '#000' });
        setFav(!fav);
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.75, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialCommunityIcons
          size={24}
          name={fav ? 'heart' : 'heart-outline'}
          color={fav ? 'red' : '#fff'}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
