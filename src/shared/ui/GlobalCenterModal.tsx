import { ReactNode } from "react";
import { ModalProps, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ReactNativeModal from "react-native-modal";
import { RFPercentage } from "react-native-responsive-fontsize";

type Iprops = ModalProps & {
  isVisible: boolean;
  childern: ReactNode;
  onDismiss?: () => void;
};
const GlobalCenterModal = ({
  isVisible,
  childern,
  onDismiss,
  ...rest
}: Iprops) => {
  return (
    <ReactNativeModal
      testID={"modal"}
      isVisible={isVisible}
      onBackdropPress={onDismiss}
      style={styles.view}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
    >
      {childern}
    </ReactNativeModal>
  );
};

export default GlobalCenterModal;

const styles = StyleSheet.create({
  view: {
    justifyContent: "center",
    margin: 0,
    paddingHorizontal: RFPercentage(1),
  },
});
