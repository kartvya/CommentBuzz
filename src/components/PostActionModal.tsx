import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NormalText, TitleText } from "./Text";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DarkColors } from "../constants/Colors";
import SvgIcon from "../assets/icons";
import Spacer from "./Spacer";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Iprops {
  isVisible: boolean;
  onClose: () => void;
  onPressDelete: () => void;
}

export default function PostActionModal(props: Iprops) {
  const insets = useSafeAreaInsets();
  const paddingBottom =
    Platform?.OS === "ios" ? insets.bottom - 20 : insets.bottom;
  return (
    <Modal
      testID={"modal"}
      isVisible={props.isVisible}
      onSwipeComplete={props.onClose}
      onBackdropPress={props.onClose}
      swipeDirection={["down"]}
      style={styles.view}
    >
      <View style={[styles.modalContent, { paddingBottom: paddingBottom }]}>
        <View style={styles.modalConatiner}>
          <Pressable style={styles.itemConatiner}>
            <SvgIcon name={"edit"} color={DarkColors.text} />
            <Spacer gap={RFPercentage(0.5)} />
            <NormalText style={{ color: DarkColors.text }}>Edit</NormalText>
          </Pressable>
          <Pressable style={styles.itemConatiner} onPress={props.onPressDelete}>
            <SvgIcon name={"delete"} color={DarkColors.primaryColor} />
            <Spacer gap={RFPercentage(0.5)} />
            <NormalText style={{ color: DarkColors.primaryColor }}>
              Delete
            </NormalText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: DarkColors?.backGround,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  titleContainer: {
    height: "18%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: RFPercentage(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {},
  modalConatiner: {
    paddingVertical: RFPercentage(1),
  },
  itemConatiner: {
    marginHorizontal: RFPercentage(1.6),
    flexDirection: "row",
    alignItems: "center",
    padding: RFPercentage(1),
  },
});
