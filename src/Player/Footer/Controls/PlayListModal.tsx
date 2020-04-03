import React, {forwardRef, ReactNode, useImperativeHandle, useRef} from 'react';
import DraggableModal from '../../../SharedComponents/DraggableModal';
import {View, Text} from 'react-native';

interface PlayListModal {
  close: () => void,
  open: () => void
}

const PlayListModal = forwardRef<PlayListModal>(({ children }:
                                                   { children: ReactNode }, ref) => {
  const draggableModal = useRef<DraggableModal>();
  useImperativeHandle(ref, () => ({
    open: draggableModal.current && draggableModal.current.open,
    close: draggableModal.current && draggableModal.current.close,
  }));
  return (
    <DraggableModal backgroundColor="#fff" ref={draggableModal}>
      <View style={{ backgroundColor: '#fff' }}>
        <Text>header</Text>
      </View>
      <View style={{ backgroundColor: '#fff' }}>
        <Text>content start</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content</Text>
        <Text>content end</Text>
      </View>
    </DraggableModal>
  );
});
export default PlayListModal;
