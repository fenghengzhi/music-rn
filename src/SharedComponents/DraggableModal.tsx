import React, {
  forwardRef,
  ReactNodeArray, useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  add,
  block,
  Clock,
  clockRunning,
  cond, debug,
  decay, Easing,
  eq,
  event,
  greaterThan,
  lessThan,
  max,
  min, neq,
  set,
  startClock,
  stopClock,
  sub, timing,
  proc,
  Value, call, and, not,
} from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal } from './Modal';

interface DraggableModalWrapper {
    close: () => void,
    open: () => void
}

interface DraggableModalProps {
    children: ReactNodeArray,
}

const threshold = 100;
const ModalHeight = 400;
// const isBetweenNe = proc((a, b, c) => min(max(a, b), c));
const limitBetween = proc((a, b, c) => min(max(a, b), c));

interface DraggableModalContent {
    close: () => void
}

const DraggableModal = forwardRef<DraggableModalContent, DraggableModalProps & { setVisibleFalse: Function }>(({
  children, setVisibleFalse,
}, ref) => {
  function close() {
    requestClose.setValue(1);
  }
  useImperativeHandle(ref, () => ({ close }));
  const [[
    offsetY,
    prevOffsetY,
    contentHeight,
    containerHeight,
    momentumV,
    containerOffset,
    containerOffsetToValue,
    requestClose,
    initialized,
    contentClock,
    containerClock,
  ]] = useState([
    new Value<number>(0),
    new Value<number>(0),
    new Value<number>(0),
    new Value<number>(0),
    new Value<number>(0),
    new Value<number>(-ModalHeight),
    new Value<number>(0),
    new Value<1|0>(0),
    new Value<1|0>(0),
    new Clock(),
    new Clock(),
  ] as const);
  Animated.useCode(() => block(
    [
      // debug('useCode', clockRunning(containerClock)),
      startClock(containerClock),
    ],
  ), []);// modal弹出的动画
  const maxOffset = useMemo(() => max(sub(contentHeight, containerHeight), 0),
    [contentHeight, containerHeight]);
  const contentTransY = useMemo(() => {
    const state = {
      finished: new Value(0),
      time: new Value(0),
      position: new Value(0),
      velocity: new Value(0),
    };
    return block([
      cond(
        clockRunning(contentClock),
        cond(greaterThan(state.position, maxOffset),
          [stopClock(contentClock), set(prevOffsetY, maxOffset)],
          cond(lessThan(state.position, 0),
            [set(state.position, 0), stopClock(contentClock), set(prevOffsetY, 0)],
            set(prevOffsetY, state.position))),
        [
          set(state.position, offsetY),
          set(state.velocity, momentumV),
          set(state.finished, 0),
          set(state.time, 0),
        ],
      ),
      decay(contentClock, state, { deceleration: 0.997 }),
      cond(state.finished, stopClock(contentClock)),
      sub(0, max(min(state.position, maxOffset), 0)),
    ]);
  }, [offsetY, contentClock, prevOffsetY, momentumV, maxOffset]);
  const containerTransY = useMemo(() => {
    const state = {
      finished: new Value(0),
      time: new Value(0),
      position: new Value(-ModalHeight),
      frameTime: new Value(0),
    };
    const config = {
      toValue: new Value(0),
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    };
    return block([
      // set(config.toValue, containerOffsetToValue),
      cond(
        clockRunning(containerClock),
        set(containerOffset, state.position),
        [
          set(state.position, containerOffset),
          set(state.frameTime, 0),
          set(state.finished, 0),
          set(state.time, 0),
          set(config.toValue, containerOffsetToValue),
        ],
      ),
      timing(containerClock, state, config),
      cond(requestClose, [
        set(containerOffsetToValue, -ModalHeight),
        set(config.toValue, -ModalHeight),
        startClock(containerClock),
      ]),
      cond(state.finished, [
        stopClock(containerClock),
        set(requestClose, 0),
        set(containerOffset, state.position),
        set(initialized, 1),
        cond(eq(state.position, -ModalHeight), call([], setVisibleFalse as any)),
      ]),
      sub(0, containerOffset),
    ]);
  }, [containerOffset, containerClock, requestClose, ModalHeight, containerOffsetToValue, initialized]);
  const contentEvent = useMemo(() => event([
    {
      nativeEvent: ({ translationY, state, velocityY }) => block([
        set(offsetY, min(sub(prevOffsetY, translationY), maxOffset)),
        set(momentumV, sub(0, velocityY)),
        cond(greaterThan(sub(prevOffsetY, translationY), maxOffset),
          set(prevOffsetY, add(translationY, maxOffset))), // 内容在滑动到底部后手指继续上滑一段距离，再下滑时可以直接滚动
        cond(lessThan(offsetY, 0), set(containerOffset, offsetY)),
        cond(eq(state, State.BEGAN), [
          stopClock(contentClock),
          cond(eq(containerOffsetToValue, 0), stopClock(containerClock)),
        ]),
        cond(eq(state, State.END), [
          set(prevOffsetY, limitBetween(sub(prevOffsetY, translationY), 0, maxOffset)),
          cond(
            lessThan(min(sub(prevOffsetY, translationY), maxOffset), -threshold),
            set(containerOffsetToValue, -ModalHeight),
            set(containerOffsetToValue, 0),
          ),
          // debug('prevOffsetY',min(sub(prevOffsetY, translationY), maxOffset)),
          // debug('contentClock',clockRunning(contentClock)),
          // debug('containerClock',clockRunning(containerClock)),
          cond(and(neq(momentumV, 0), not(lessThan(offsetY, 0))), startClock(contentClock)),
          cond(lessThan(offsetY, 0), startClock(containerClock)),
        ]),
      ]),
    },
  ]), [offsetY, prevOffsetY, momentumV, containerOffset, ModalHeight, maxOffset, threshold, containerOffsetToValue, contentClock, containerClock]);
  const containerEvent = useMemo(() => event([
    {
      nativeEvent: ({ translationY, state }) => block([
        cond(initialized, [
          set(containerOffset, sub(0, max(translationY, 0))),
          cond(eq(state, State.END), [
            cond(
              greaterThan(translationY, threshold),
              set(containerOffsetToValue, -ModalHeight),
              set(containerOffsetToValue, 0),
            ),
            cond(greaterThan(translationY, 0), startClock(containerClock)),
          ]),
        ])]),
    },
  ]), [containerOffset, containerOffsetToValue, containerClock, threshold, ModalHeight, initialized]);


  return (
    <PanGestureHandler
      onGestureEvent={containerEvent}
      onHandlerStateChange={containerEvent}
    >
      <Animated.View
        style={[styles.container, {
          borderRadius: 12,
          backgroundColor: '#fff',
          transform: [{ translateY: containerTransY }],
        }]}
      >
        {children[0]}
        <Animated.View
                        // onLayout={containerHeightEvent}
          onLayout={(e) => containerHeight.setValue(e.nativeEvent.layout.height)}
          style={styles.scrollableContainer}
        >
          <PanGestureHandler
            onGestureEvent={contentEvent}
            onHandlerStateChange={contentEvent}
            shouldCancelWhenOutside={false}
          >
            <Animated.View
                                // onLayout={contentHeightEvent}
              onLayout={(e) => contentHeight.setValue(e.nativeEvent.layout.height)}
              style={{ transform: [{ translateY: contentTransY }] }}
            >
              {children.slice(1)}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 0,
    overflow: 'hidden',
    height: ModalHeight,
    margin: 24,
  },
  scrollableContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});

const DraggableModalWrapper = forwardRef<DraggableModalWrapper, DraggableModalProps>((props: DraggableModalProps, ref) => {
  function close() {
    modalContent.current.close();
  }
  function setVisibleFalse() {
    setVisible(false);
  }

  const modalContent = useRef<DraggableModalContent>();

  function open() {
    setVisible(true);
  }

  useImperativeHandle(ref, () => ({ open, close }));

  const [visible, setVisible] = useState(false);
  return (
    <Modal visible={visible}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={close}
          style={{ flex: 1 }}
          activeOpacity={1}
        />
        <DraggableModal
          setVisibleFalse={setVisibleFalse}
          ref={modalContent}
        >
          {props.children}
        </DraggableModal>
      </View>
    </Modal>
  );
});
export default DraggableModalWrapper;
