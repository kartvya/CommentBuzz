import { StyleSheet, View } from "react-native";
import { TitleText } from "../components/Text";
import { Colors } from "../constants/Colors";

const UserComments = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TitleText style={{ color: Colors.icon, textAlign: "center" }}>
        Comming soon...
      </TitleText>
    </View>
  );
};

export default UserComments;

const styles = StyleSheet.create({});
