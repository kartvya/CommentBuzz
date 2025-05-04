import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import SvgIcon from "../assets/icons";
import { DarkColors, useThemeColors } from "../constants/Colors";
import { hp } from "../helpers/comman";
import { RootState } from "../redux/Store";
import { ISDARKMODE, LOGOUT } from "../redux/actions/ActionType";
import { UserInfo } from "../redux/reducers/AuthReducer";
import Button from "./Button";
import MyStatusBar from "./CustomeStatusBar";
import GlobalCenterModal from "./GlobalCenterModal";
import Spacer from "./Spacer";
import Switch from "./Switch";
import { NormalText, TitleText } from "./Text";

const CustomDrawer = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useRouter();
  const themeColors = useThemeColors();
  //@ts-ignore
  const { isDarkMode } = useSelector(
    (state: RootState) => state.root?.authReducer
  );
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as UserInfo;

  const [logoutModal, setLogoutModal] = useState(false);

  const toggleSwitch = () => {
    dispatch({
      type: ISDARKMODE,
      payload: {
        isDarkMode: !isDarkMode?.isDarkMode,
      },
    });
  };

  const formatedDate = (time: string) => {
    const givenDate = moment(time);
    const currentDate = moment();
    let years = currentDate.diff(givenDate, "years");
    givenDate.add(years, "years");
    let months = currentDate.diff(givenDate, "months");
    givenDate.add(months, "months");
    let days = currentDate.diff(givenDate, "days");
    let formattedDuration = "";
    if (days === 0) {
      formattedDuration = `Newbie`;
    } else if (months === 0 && years === 0) {
      formattedDuration = `${days}d`;
    } else if (years === 0) {
      formattedDuration = `${months}m ${days}d`;
    } else {
      formattedDuration = `${years}y ${months}m`;
    }
    return formattedDuration;
  };

  const onLogoutYesBTN = async () => {
    try {
      await AsyncStorage.removeItem("UserToken");
      await AsyncStorage.removeItem("RefreshToken");
      dispatch({
        type: LOGOUT,
      });
      navigation.navigate("/welcome" as Href);
      setLogoutModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MyStatusBar
        backgroundColor={themeColors.lightBg}
        barStyle="light-content"
      />
      <View style={styles.conatiner}>
        <View style={styles.coinesContainer}>
          <View style={styles.coinFlex}>
            <SvgIcon name={"buzzCoin"} color={themeColors.text} size={30} />
            <Spacer gap={RFPercentage(0.5)} />
            <View>
              <TitleText style={styles.coinsValueStyle}>
                {UserInfo?.buzzCoins}
              </TitleText>
              <NormalText style={styles.coinsTitleText}>Buzzcoins</NormalText>
            </View>
          </View>
          <Spacer gap={RFPercentage(1)} />
          <View style={styles.coinFlex}>
            <SvgIcon name={"cake"} color={themeColors.text} size={30} />
            <Spacer gap={RFPercentage(0.5)} />
            <View>
              <TitleText style={styles.coinsValueStyle}>
                {formatedDate(UserInfo?.createdAt)}
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
            backgroundColor: themeColors?.borderColor,
            marginVertical: RFPercentage(1),
          }}
        />

        <TouchableHighlight
          onPress={() => navigation.navigate("/(main)/editProfile")}
          style={styles.listConatiner}
          underlayColor={themeColors.votesBg}
        >
          <React.Fragment>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Edit profile
            </TitleText>
            <SvgIcon name={"edit"} size={18} color={themeColors?.text} />
          </React.Fragment>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => alert("Comming soon")}
          style={styles.listConatiner}
          underlayColor={themeColors.votesBg}
        >
          <React.Fragment>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Refer & Earn
            </TitleText>
            <SvgIcon
              name={"refer"}
              size={18}
              color={themeColors?.text}
              strokeWidth={3}
            />
          </React.Fragment>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={toggleSwitch}
          style={styles.listConatiner}
          underlayColor={themeColors.votesBg}
        >
          <React.Fragment>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Dark mode
            </TitleText>
            <Switch
              barHeight={20}
              switchWidth={20}
              switchHeight={20}
              value={isDarkMode?.isDarkMode}
              //@ts-ignore
              onValueChange={toggleSwitch}
              disabled={false}
              backgroundActive={"#0095ff"}
              backgroundInactive={"#d1d1d1"}
              circleActiveColor={"white"}
              circleInActiveColor={"white"}
              changeValueImmediately={true}
              innerCircleStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              outerCircleStyle={{}}
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2}
              switchRightPx={2}
              switchWidthMultiplier={2}
              switchBorderRadius={30}
            />
          </React.Fragment>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => navigation.navigate("/(main)/timeManagement")}
          style={styles.listConatiner}
          underlayColor={themeColors.votesBg}
        >
          <React.Fragment>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Time management
            </TitleText>
            <SvgIcon
              name={"clock"}
              size={18}
              color={themeColors?.text}
              strokeWidth={2}
            />
          </React.Fragment>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => setLogoutModal(true)}
          style={styles.listConatiner}
          underlayColor={themeColors.votesBg}
        >
          <React.Fragment>
            <TitleText
              style={[styles.listTextStyle, { color: DarkColors.primaryColor }]}
            >
              Logout
            </TitleText>
            <SvgIcon
              name={"logout"}
              size={18}
              color={DarkColors?.primaryColor}
            />
          </React.Fragment>
        </TouchableHighlight>
      </View>

      {/* <GlobalCenterModal
        isVisible={true}
        childern={
          <View
            style={{
              backgroundColor: themeColors.text,
              borderRadius: 10,
              padding: RFPercentage(1),
              paddingHorizontal: RFPercentage(2),
            }}
          >
            <NormalText style={{ color: Colors.text }}>
              What is buzz coins
            </NormalText>
          </View>
        }
      /> */}

      <GlobalCenterModal
        isVisible={logoutModal}
        childern={
          <View
            style={{
              backgroundColor: themeColors.lightBg,
              borderRadius: 10,
              padding: RFPercentage(1),
              paddingHorizontal: RFPercentage(2),
            }}
          >
            <TitleText>Wait!</TitleText>
            <Spacer gap={RFPercentage(0.4)} />
            <NormalText>Are you sure want to log out?</NormalText>
            <Spacer gap={RFPercentage(1)} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                title="No"
                onPress={() => setLogoutModal(false)}
                btnStyle={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderRadius: 100,
                  height: hp(5),
                }}
                textStyle={{
                  color: themeColors.white,
                }}
              />
              <Spacer gap={RFPercentage(0.5)} />
              <Button
                title="Yes"
                onPress={onLogoutYesBTN}
                btnStyle={{
                  flex: 1,
                  backgroundColor: "red",
                  borderRadius: 100,
                  height: hp(5),
                }}
                textStyle={{
                  color: DarkColors.white,
                }}
              />
            </View>
          </View>
        }
      />
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
    fontSize: RFValue(13),
  },
  listConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 8,
  },
});
