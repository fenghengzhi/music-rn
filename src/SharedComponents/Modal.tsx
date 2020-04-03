import React, {
  forwardRef,
  ReactNode, useEffect, useImperativeHandle, useRef,
} from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

const styles = StyleSheet.create({
  modalWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});

export interface Modal {
  close: () => void,
  open: (onModalDidAppear?:Function) => void
}

interface ModalProps {
  children?: ReactNode
}

export const Modal = forwardRef<Modal, ModalProps>(({ children }: ModalProps, ref) => {
  const sibling = useRef<RootSiblings>();
  useImperativeHandle(ref, () => ({
    open(onModalDidAppear) {
      sibling.current = new RootSiblings(
        <ModalWrapper onModalDidAppear={onModalDidAppear}>
          {children}
        </ModalWrapper>,
      );
    },
    close() {
      if (sibling.current) {
        sibling.current.destroy();
        sibling.current = null;
      }
    },
  }));
  useEffect(() => {
    if (sibling.current) {
      sibling.current.update(
        <ModalWrapper>
          {children}
        </ModalWrapper>,
      );
    }
  }, [children]);
  return null;
});

function ModalWrapper({ onModalDidAppear, children }: {
  onModalDidAppear?: Function, children: ReactNode
}) {
  useEffect(() => {
    if (onModalDidAppear) onModalDidAppear();
  }, []);
  return (
    <View style={styles.modalWrapper}>
      {children}
    </View>
  );
}
