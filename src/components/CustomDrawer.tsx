import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SvgIcon from "../assets/icons";
import { Colors, DarkColors } from "../constants/Colors";
import MyStatusBar from "./CustomeStatusBar";
import Spacer from "./Spacer";
import { NormalText, TitleText } from "./Text";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import moment from "moment";
import { supabase } from "@/lib/supabase";
import React from "react";

const CustomDrawer = (props: any) => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const formatedDate = (time: string) => {
    const givenDate = moment(time);
    const currentDate = moment();
    let years = currentDate.diff(givenDate, "years");
    givenDate.add(years, "years");
    let months = currentDate.diff(givenDate, "months");
    givenDate.add(months, "months");
    let days = currentDate.diff(givenDate, "days");
    let formattedDuration = "";
    if (months === 0 && years === 0) {
      formattedDuration = `${days}d`;
    } else if (years === 0) {
      formattedDuration = `${months}m ${days}d`;
    } else if (days === 0) {
      formattedDuration = `Newbie`;
    } else {
      formattedDuration = `${years}y ${months}m`;
    }
    return formattedDuration;
  };

  const onPressLogout = () => {
    try {
      Alert.alert(
        "Confirm",
        "Are you sure want to log out?",
        [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
          { text: "OK", onPress: onLogoutYesBTN },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onLogoutYesBTN = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert(
          "Sign out",
          "Something went wrong. Please try again. leater"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MyStatusBar
        backgroundColor={DarkColors.lightBg}
        barStyle="light-content"
      />
      <View style={styles.conatiner}>
        <View style={styles.coinesContainer}>
          <View style={styles.coinFlex}>
            <SvgIcon name={"buzzCoin"} color={DarkColors.text} size={30} />
            <Spacer gap={RFPercentage(0.5)} />
            <View>
              <TitleText style={styles.coinsValueStyle}>
                {UserInfo?.buzzCoins ? UserInfo?.buzzCoins : 0}
              </TitleText>
              <NormalText style={styles.coinsTitleText}>Buzzcoins</NormalText>
            </View>
          </View>
          <Spacer gap={RFPercentage(1)} />
          <View style={styles.coinFlex}>
            <SvgIcon name={"cake"} color={DarkColors.text} size={30} />
            <Spacer gap={RFPercentage(0.5)} />
            <View>
              <TitleText style={styles.coinsValueStyle}>
                {formatedDate(UserInfo?.created_at)}
              </TitleText>
              <NormalText style={styles.coinsTitleText}>Buzz age</NormalText>
            </View>
          </View>
        </View>
        <Spacer gap={RFPercentage(0.5)} />
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: DarkColors?.borderColor,
            marginVertical: RFPercentage(1),
          }}
        />
        <TouchableHighlight
          onPress={onPressLogout}
          style={styles.listConatiner}
          underlayColor={DarkColors.votesBg}
        >
          <React.Fragment>
            <TitleText style={styles.listTextStyle}>Logout</TitleText>
            <SvgIcon
              name={"logout"}
              size={18}
              color={DarkColors?.primaryColor}
            />
          </React.Fragment>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    marginHorizontal: RFPercentage(1.5),
  },
  coinesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinFlex: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinsTitleText: {
    fontSize: RFValue(10),
    top: -2,
  },
  coinsValueStyle: {
    fontSize: RFValue(13),
    fontFamily: "SpaceMono-Bold",
  },
  listTextStyle: {
    color: DarkColors.primaryColor,
  },
  listConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 8,
  },
});
