import React, {
  forwardRef,
  ReactNodeArray,
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
  cond,
  decay,
  eq,
  event,
  greaterThan,
  lessThan,
  max,
  min,
  set,
  startClock,
  stopClock,
  sub,
  Value,
} from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
  const [prevOffsetY] = useState(new Value(0));
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
        cond(greaterThan(state.position, maxOffset),
          [set(state.position, maxOffset), stopClock(momentumClock), set(prevOffsetY, maxOffset)],
          cond(lessThan(state.position, 0),
            [set(state.position, 0), stopClock(momentumClock), set(prevOffsetY, 0)],
            set(prevOffsetY, state.position))),
        [
          set(state.position, offsetY),
          set(state.velocity, momentumV),
          set(state.finished, 0),
          set(state.time, 0),
        ],
      ),
      decay(momentumClock, state, { deceleration: 0.997 }),
      cond(state.finished, stopClock(momentumClock)),
      sub(0, max(min(state.position, maxOffset), 0)),
      // sub(0, state.position),
    ]);
  }, [offsetY, momentumClock, prevOffsetY, momentumV, maxOffset]);
  const contentEvent = useMemo(() => event([
    {
      nativeEvent: ({ translationY, state, velocityY }) => block([
        set(offsetY, min(sub(prevOffsetY, translationY), maxOffset)),
        set(momentumV, sub(0, velocityY)),
        cond(eq(state, State.BEGAN), [
          stopClock(momentumClock),
        ]),
        cond(eq(state, State.ACTIVE),
          cond(greaterThan(sub(prevOffsetY, translationY), maxOffset),
            set(prevOffsetY, add(translationY, maxOffset)))), // 内容在滑动到底部后手指继续上滑一段距离，再下滑时可以直接滚动
        cond(eq(state, State.END), [
          set(prevOffsetY, min(sub(prevOffsetY, translationY), maxOffset)),
          startClock(momentumClock),
        ]),
      ]),
    },
  ]), [offsetY, prevOffsetY]);
  // @ts-ignore
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
                  // @ts-ignore
                  style={{ transform: [{ translateY: contentTransY }] }}
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
