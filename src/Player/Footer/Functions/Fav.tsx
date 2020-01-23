import React, {useState} from 'react';
import {Animated, TouchableWithoutFeedback} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Fav() {
  const [fav, setFav] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setFav(!fav);
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.75, duration: 200, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialIcon
          // ref={iconRef}

          size={24}
          name={fav ? 'heart' : 'heart-outline'}
          color={fav ? 'red' : '#fff'}
        />
      </Animated.View>
    </TouchableWithoutFeedback>);
}
