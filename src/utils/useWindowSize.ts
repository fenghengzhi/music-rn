// 用于适配折叠屏
import {DeviceEventEmitter, Dimensions, ScaledSize} from 'react-native';
import {useEffect, useState} from 'react';

export default function useWindowSize() {
  const [screenSize, setScreenSize] = useState<ScaledSize>({
    width: 0,
    height: 0,
    scale: 0,
    fontScale: 0,
  });
  useEffect(() => {
    const event = DeviceEventEmitter.addListener('didUpdateDimensions', () => setScreenSize(Dimensions.get('window')));
    return () => event.remove();
  }, []);
  if (!screenSize.width || !screenSize.height) {
    return Dimensions.get('window');
  }
  return screenSize;
}
