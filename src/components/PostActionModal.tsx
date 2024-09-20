import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TitleText } from "./Text";
import { RFPercentage } from "react-native-responsive-fontsize";
import { DarkColors } from "../constants/Colors";
import SvgIcon from "../assets/icons";
import Spacer from "./Spacer";

interface Iprops {
  isVisible: boolean;
  onClose: () => void;
  onPressDelete: () => void;
}

export default function PostActionModal(props: Iprops) {
  return (
    <Modal animationType="slide" transparent={true} visible={props.isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <TitleText style={styles.title}>Post Action</TitleText>
          <Pressable onPress={props.onClose}>
            <MaterialIcons name="close" color="#fff" size={24} />
          </Pressable>
        </View>
        <View style={styles.modalConatiner}>
          <Pressable style={styles.itemConatiner}>
            <SvgIcon name={"edit"} color={DarkColors.text} />
            <Spacer gap={RFPercentage(0.5)} />
            <TitleText style={{ color: DarkColors.text }}>Edit</TitleText>
          </Pressable>
          <Spacer gap={RFPercentage(0.5)} />
          <Pressable style={styles.itemConatiner} onPress={props.onPressDelete}>
            <SvgIcon name={"delete"} color={DarkColors.primaryColor} />
            <Spacer gap={RFPercentage(0.5)} />
            <TitleText style={{ color: DarkColors.primaryColor }}>
              Delete
            </TitleText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "26%",
    width: "100%",
    backgroundColor: DarkColors?.backGround,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
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
    paddingVertical: RFPercentage(2),
  },
  itemConatiner: {
    backgroundColor: DarkColors?.lightBg,
    borderRadius: 10,
    marginHorizontal: RFPercentage(1.6),
    flexDirection: "row",
    alignItems: "center",
    padding: RFPercentage(1),
  },
});
