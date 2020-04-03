import React, {
  forwardRef, ReactNodeArray, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  block,
  event,
  set,
  add,
  cond,
  eq,
  sub,
  max,
  min,
  debug,
  startClock,
  clockRunning,
  lessOrEq,
  stopClock, divide, Value, Clock, spring, decay, or, greaterOrEq,
} from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal } from './Modal';

interface DraggableModal {
  close: () => void,
  open: () => void
}

interface DraggableModalProps {
  backgroundColor: string,
  children: ReactNodeArray,
  borderRadius?: number
}

const DraggableModal = forwardRef<DraggableModal, DraggableModalProps>(({
  children, borderRadius = 0, backgroundColor,
}: DraggableModalProps, ref) => {
  const modal = useRef<Modal>();

  function close() {
    modal.current.close();
  }

  function open() {
    modal.current.open();
  }

  useImperativeHandle(ref, () => ({ open, close }));

  const [offsetY] = useState(new Value(0));
  const [pervOffsetY] = useState(new Value(0));
  const [contentHeight] = useState(new Value<number>(0));
  const [containerHeight] = useState(new Value<number>(0));
  const [momentumClock] = useState(new Clock());
  const [momentumV] = useState(new Value(0));
  const maxOffset = useMemo(() => max(sub(contentHeight, containerHeight), 0), [contentHeight, containerHeight]);
  const contentTransY = useMemo(() => {
    const state = {
      finished: new Value(0),
      time: new Value(0),
      position: new Value(0),
      velocity: new Value(0),
    };
    return block([
      // cond(eq(contentEventState, State.END), ,
      cond(
        clockRunning(momentumClock),
        [set(pervOffsetY, state.position)],
        [
          set(state.position, offsetY),
          set(state.velocity, momentumV),
          set(state.finished, 0),
          set(state.time, 0),
        ],
      ),
      decay(momentumClock, state, { deceleration: 0.997 }),
      cond(state.finished, stopClock(momentumClock)),
      cond(greaterOrEq(state.position, maxOffset), stopClock(momentumClock)),
      sub(0, state.position),
    ]);
  }, [offsetY, momentumClock, pervOffsetY, momentumV, maxOffset]);
  const contentEvent = useMemo(() => event([
    {
      nativeEvent: ({ translationY, state, velocityY }) => block([
        set(offsetY, min(add(sub(0, translationY), pervOffsetY), maxOffset)),
        set(momentumV, velocityY),
        cond(eq(state, State.END), [
          set(pervOffsetY, min(add(sub(0, translationY), pervOffsetY), maxOffset)),
          startClock(momentumClock),
        ]),
      ]),
    },
  ]), [offsetY, pervOffsetY]);
  return (
    <Modal ref={modal}>
      <Animated.View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => modal.current.close()}
          style={{ flex: 1 }}
          activeOpacity={1}
        />
        <PanGestureHandler enabled={false}>
          <Animated.View
            style={[styles.container, {
              borderRadius,
              backgroundColor,
              // transform: [{ translateY }],
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
                // onHandlerStateChange={e=>e.nativeEvent.velocityY}
                // enabled={scrollableContentHeight > scrollableContainerHeight}
                shouldCancelWhenOutside={false}
              >
                <Animated.View
                  // onLayout={contentHeightEvent}
                  onLayout={(e) => contentHeight.setValue(e.nativeEvent.layout.height)}
                  style={{ transform: [{ translateY: contentTransY }] } as any}
                >
                  {children.slice(1)}
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </Modal>
  );
});

export default DraggableModal;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    overflow: 'hidden',
    height: 400,
  },
  scrollableContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
