import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { RootSiblingPortal } from 'react-native-root-siblings';

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
    open: (onModalDidAppear?: Function) => void
}

interface ModalProps {
    children?: ReactNode,
    visible: boolean;
    onModalDidAppear?: Function;
}

export function Modal(props: ModalProps) {
  const { visible, children, onModalDidAppear } = props;
  return (
    <ModalWrapper onModalDidAppear={onModalDidAppear}>
      {visible && children}
    </ModalWrapper>
  );
}


function ModalWrapper({ onModalDidAppear, children }: {
    onModalDidAppear?: Function, children: ReactNode
}) {
  useEffect(() => {
    if (onModalDidAppear) onModalDidAppear();
  }, []);
  return (
    <RootSiblingPortal>
      <View style={styles.modalWrapper}>
        {children}
      </View>
    </RootSiblingPortal>
  );
}
