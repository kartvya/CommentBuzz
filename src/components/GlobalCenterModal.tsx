import { ReactNode } from "react";
import { Modal, ModalProps, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFPercentage } from "react-native-responsive-fontsize";

type Iprops = ModalProps & {
  isVisible: boolean;
  childern: ReactNode;
};
const GlobalCenterModal = ({ isVisible, childern, ...rest }: Iprops) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
      {...rest}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: RFPercentage(1),
        }}
      >
        {childern}
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default GlobalCenterModal;
