import { Href, useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import SvgIcon from "../../assets/icons";
import { DarkColors, useThemeColors } from "@/src/shared/constants/colors";
import { hp } from "../utils/comman";
import { RootState } from "../../redux/Store";
import { logout, setIsDarkMode } from "../../modules/auth/ui/auth.slice";
import { UserInfo } from "../../modules/auth";
import { tokenStorage } from "../../infrastructure/storage/tokenStorage";
import Button from "./Button";
import MyStatusBar from "./CustomeStatusBar";
import GlobalCenterModal from "./GlobalCenterModal";
import Spacer from "./Spacer";
import Switch from "./Switch";
import { NormalText, TitleText } from "./Text";

interface CustomDrawerProps {
  // Props from expo-router DrawerContentComponent
  // Currently unused but kept for type safety
}

const CustomDrawer: React.FC<CustomDrawerProps> = (_props) => {
  const dispatch = useDispatch();
  const navigation = useRouter();
  const themeColors = useThemeColors();
  const authState = useSelector((state: RootState) => state.auth);
  const isDarkMode = authState?.isDarkMode;
  const UserInfo = useSelector(
    (state: RootState) => state.auth?.userInfo
  ) as UserInfo;

  const [logoutModal, setLogoutModal] = useState(false);

  const toggleSwitch = () => {
    dispatch(setIsDarkMode(!isDarkMode));
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
      // Clear tokens first
      await tokenStorage.clearAllTokens();
      // Clear Redux state
      dispatch(logout());
      // Navigate to welcome screen
      navigation.navigate("/welcome" as Href);
      setLogoutModal(false);
    } catch (error) {
      console.log("Logout error:", error);
      // Even if there's an error, try to navigate away
      dispatch(logout());
      navigation.navigate("/welcome" as Href);
      setLogoutModal(false);
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
          underlayColor={themeColors.votesBg}
        >
          <View style={styles.listConatiner}>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Edit profile
            </TitleText>
            <SvgIcon name={"edit"} size={18} color={themeColors?.text} />
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => alert("Comming soon")}
          underlayColor={themeColors.votesBg}
        >
          <View style={styles.listConatiner}>
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
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={toggleSwitch}
          underlayColor={themeColors.votesBg}
        >
          <View style={styles.listConatiner}>
            <TitleText
              style={{ color: themeColors.text, fontSize: RFValue(13) }}
            >
              Dark mode
            </TitleText>
            <Switch
              barHeight={20}
              switchWidth={20}
              switchHeight={20}
              value={isDarkMode}
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
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => navigation.navigate("/(main)/timeManagement")}
          underlayColor={themeColors.votesBg}
        >
          <View style={styles.listConatiner}>
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
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={() => setLogoutModal(true)}
          underlayColor={themeColors.votesBg}
        >
          <View style={styles.listConatiner}>
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
          </View>
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
