// import {
//   Avatar,
//   AVATAR_SIZE_MAP,
// } from "@/src/components/AnimatedHeader/Avatar";
// import type {
//   ScrollHeaderProps,
//   ScrollLargeHeaderProps,
// } from "@codeherence/react-native-header";
// import {
//   FadingView,
//   Header,
//   LargeHeader,
//   SectionListWithHeaders,
// } from "@codeherence/react-native-header";
// import { Feather } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { BlurView } from "expo-blur";
// import { StatusBar } from "expo-status-bar";
// import React, { useCallback, useMemo, useState } from "react";
// import {
//   Alert,
//   Linking,
//   Platform,
//   Pressable,
//   SectionListRenderItem,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
// } from "react-native-reanimated";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// // import TwitterVerifiedSvg from '../../../assets/twitter-verified.svg';
// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/Store";
// import { Users } from "@/src/redux/reducers/AuthReducer";
// import { supabase } from "@/lib/supabase";
// import { DarkColors } from "@/src/constants/Colors";
// import { getUserImage } from "@/src/services/imageServices";
// import { NormalText, TitleText } from "@/src/components/Text";
// import Spacer from "@/src/components/Spacer";
// import SvgIcon from "@/src/assets/icons";
// import { RFPercentage } from "react-native-responsive-fontsize";

// // From reading comments online, the BlurView does not work properly for Android <= 11.
// // We will have a boolean to check if we can use the BlurView.
// // Note that Android 12 begins at SDK version 31
// const canUseBlurView =
//   Platform.OS === "ios" ||
//   (Platform.OS === "android" && Number(Platform.Version) >= 31);

// const VERTICAL_SPACING = 12;
// const ROOT_HORIZONTAL_PADDING = 12;
// const TWITTER_PRIMARY_COLOR = "#1d9bf0";
// const DISABLED_COLOR = "rgba(255, 255, 255, 0.6)";
// const AVATAR_SIZE = "md";
// const AVATAR_START_SCALE = 1;
// const AVATAR_END_SCALE = 0.5;
// const AVATAR_SIZE_VALUE = AVATAR_SIZE_MAP[AVATAR_SIZE];
// const BANNER_BOTTOM_HEIGHT_ADDITION = AVATAR_SIZE_VALUE;

// const HeaderComponent: React.FC<ScrollHeaderProps> = ({
//   showNavBar,
//   scrollY,
// }) => {
//   const navigation = useNavigation();
//   const { left, right } = useSafeAreaInsets();
//   const { width, height } = useWindowDimensions();
//   const bannerHeight = useSharedValue(48 + BANNER_BOTTOM_HEIGHT_ADDITION);

//   const blurStyle = useAnimatedStyle(() => {
//     const blurOpacity = interpolate(
//       Math.abs(scrollY.value),
//       [0, 40],
//       [0, 1],
//       Extrapolate.CLAMP
//     );

//     return { opacity: blurOpacity };
//   });

//   const profileImageScale = useDerivedValue(() => {
//     return interpolate(
//       scrollY.value,
//       [0, BANNER_BOTTOM_HEIGHT_ADDITION],
//       [AVATAR_START_SCALE, AVATAR_END_SCALE],
//       Extrapolate.CLAMP
//     );
//   });

//   const bannerTranslationStyle = useAnimatedStyle(() => {
//     const bannerTranslation = interpolate(
//       scrollY.value,
//       [0, BANNER_BOTTOM_HEIGHT_ADDITION],
//       [0, -BANNER_BOTTOM_HEIGHT_ADDITION],
//       Extrapolate.CLAMP
//     );

//     return { transform: [{ translateY: bannerTranslation }] };
//   });

//   // This allows the profile container to translate as the user scrolls.
//   const profileContainerTranslationStyle = useAnimatedStyle(() => {
//     const translateY = -scrollY.value + BANNER_BOTTOM_HEIGHT_ADDITION / 2;

//     return { transform: [{ translateY }] };
//   });

//   // Once the profile image has been scaled down, we allow the profile container to be
//   // hidden behind the banner. This is done by setting the zIndex to -1.
//   const rootProfileRowZIndexStyle = useAnimatedStyle(() => {
//     return { zIndex: profileImageScale.value <= AVATAR_END_SCALE ? -1 : 1 };
//   });

//   // Slow down the avatar's translation to allow it to scale down and
//   // still stay at its position.
//   const profileImageScaleStyle = useAnimatedStyle(() => {
//     const profileImageTranslationY = interpolate(
//       profileImageScale.value,
//       [AVATAR_START_SCALE, AVATAR_END_SCALE],
//       [0, AVATAR_SIZE_VALUE / 2],
//       Extrapolate.CLAMP
//     );

//     return {
//       transform: [
//         { scale: profileImageScale.value },
//         { translateY: profileImageTranslationY },
//       ],
//     };
//   });

//   const animatedScaleStyle = useAnimatedStyle(() => {
//     const bannerHeightRatio = height / bannerHeight.value;

//     const scaleY = interpolate(
//       scrollY.value,
//       [0, -(height + bannerHeight.value)],
//       [1, bannerHeightRatio],
//       Extrapolate.CLAMP
//     );

//     return {
//       transform: [{ scaleY }, { scaleX: scaleY }],
//     };
//   }, [height]);

//   const navigationDrawer = useNavigation();

//   const UserInfo = useSelector(
//     (state: RootState) => state.root?.authReducer?.userInfo
//   ) as Users;

//   const onPressDrawer = () => {
//     try {
//       //@ts-ignore
//       navigationDrawer?.openDrawer();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <View style={styles.smallHeaderContainer}>
//       <Animated.View style={[StyleSheet.absoluteFill, bannerTranslationStyle]}>
//         <Animated.View
//           onLayout={(e) => (bannerHeight.value = e.nativeEvent.layout.height)}
//           style={animatedScaleStyle}
//         >
//           <View
//             style={{
//               marginBottom: -BANNER_BOTTOM_HEIGHT_ADDITION,
//               backgroundColor: DarkColors.lightBg,
//             }}
//           >
//             {canUseBlurView ? (
//               <Animated.View
//                 style={[StyleSheet.absoluteFill, styles.blurView, blurStyle]}
//               >
//                 <BlurView
//                   style={[StyleSheet.absoluteFill]}
//                   intensity={50}
//                   tint="dark"
//                 />
//               </Animated.View>
//             ) : (
//               <Animated.View
//                 style={[
//                   StyleSheet.absoluteFill,
//                   styles.blurView,
//                   styles.androidBlurViewBg,
//                   blurStyle,
//                 ]}
//               />
//             )}

//             <Image
//               source={{ uri: "" }}
//               contentFit="cover"
//               contentPosition="center"
//               style={[
//                 styles.imageStyle,
//                 { width },
//                 Platform.OS === "web" && { height: bannerHeight.value },
//               ]}
//             />
//           </View>
//         </Animated.View>
//       </Animated.View>

//       <Header
//         showNavBar={showNavBar}
//         headerCenterFadesIn={false}
//         headerStyle={styles.headerStyle}
//         noBottomBorder
//         headerRight={
//           <>
//             <TouchableOpacity
//               style={styles.backButtonContainer}
//               onPress={onPressDrawer}
//             >
//               <SvgIcon
//                 name={"hamburgerMenu"}
//                 color={DarkColors.text}
//                 strokeWidth={0.1}
//                 size={15}
//               />
//             </TouchableOpacity>
//           </>
//         }
//         headerRightStyle={[
//           styles.headerRightStyle,
//           { paddingLeft: Math.max(right, ROOT_HORIZONTAL_PADDING) },
//         ]}
//         headerLeft={
//           <>
//             {/* Fade the name + tweets on the left header once the navBar should be shown. */}
//             <FadingView opacity={showNavBar}>
//               <TitleText style={styles.navBarTitle}>{UserInfo?.name}</TitleText>
//             </FadingView>
//           </>
//         }
//         headerLeftStyle={[
//           styles.headerLeftStyle,
//           { paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING) },
//         ]}
//       />

//       <Animated.View
//         style={[styles.profileContainer, rootProfileRowZIndexStyle]}
//       >
//         <Animated.View
//           style={[
//             styles.profileFollowContainer,
//             {
//               left: Math.max(left, ROOT_HORIZONTAL_PADDING),
//               right: Math.max(right, ROOT_HORIZONTAL_PADDING),
//             },
//             profileContainerTranslationStyle,
//           ]}
//         >
//           <Animated.View style={profileImageScaleStyle}>
//             <TouchableOpacity>
//               <Avatar
//                 size={AVATAR_SIZE}
//                 source={getUserImage(UserInfo?.image)}
//               />
//             </TouchableOpacity>
//           </Animated.View>
//         </Animated.View>
//       </Animated.View>
//     </View>
//   );
// };

// const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = () => {
//   const UserInfo = useSelector(
//     (state: RootState) => state.root?.authReducer?.userInfo
//   ) as Users;
//   const { left, right } = useSafeAreaInsets();

//   return (
//     <LargeHeader
//       headerStyle={[
//         styles.largeHeaderStyle,
//         {
//           paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING),
//           paddingRight: Math.max(right, ROOT_HORIZONTAL_PADDING),
//         },
//       ]}
//     >
//       <TitleText style={styles.title}>{UserInfo?.name}</TitleText>
//       <NormalText style={styles.text}>{UserInfo?.bio}</NormalText>

//       {/* <View style={styles.dataRow}>
//         <Feather name="calendar" color={DISABLED_COLOR} size={12} />
//         <Text style={styles.disabledText}>Joined March 2023</Text>
//       </View> */}

//       {/* <View style={styles.locationAndWebContainer}>
//         <View style={styles.dataRow}>
//           <Feather name="map-pin" color={DISABLED_COLOR} size={12} />
//           <Text style={styles.disabledText}>Toronto, Ontario</Text>
//         </View>

//         <View style={styles.dataRow}>
//           <Feather name="link" color={DISABLED_COLOR} size={12} />
//           <Text onPress={onPressLink} style={styles.primaryText}>
//             codeherence.com
//           </Text>
//         </View>
//       </View> */}

//       <View style={styles.statsContainer}>
//         <TouchableOpacity style={styles.dataRow}>
//           <NormalText style={styles.mediumText}>0</NormalText>
//           <NormalText style={styles.disabledText}>Following</NormalText>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.dataRow}>
//           <NormalText style={styles.mediumText}>0</NormalText>
//           <NormalText style={styles.disabledText}>Followers</NormalText>
//         </TouchableOpacity>
//       </View>
//     </LargeHeader>
//   );
// };

// const SomeComponent: SectionListRenderItem<
//   number,
//   {
//     data: number[];
//   }
// > = ({ index }) => {
//   return (
//     <View style={styles.children}>
//       <Text style={styles.text}>{index}</Text>
//     </View>
//   );
// };

// const MemoizedComponent = React.memo(SomeComponent, () => true);

// const TwitterProfile: React.FC<any> = () => {
//   const navigation = useRouter();
//   const layout = useWindowDimensions();

//   const UserInfo = useSelector(
//     (state: RootState) => state.root?.authReducer?.userInfo
//   ) as Users;

//   const [index, setIndex] = useState<number>(0);
//   const [routes] = useState<any[]>([
//     { key: "first", title: "Posts" },
//     { key: "second", title: "Comments" },
//     { key: "third", title: "About" },
//   ]);

//   const onPressLogout = () => {
//     try {
//       Alert.alert(
//         "Confirm",
//         "Are you sure want to log out?",
//         [
//           { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
//           { text: "OK", onPress: onLogoutYesBTN },
//         ],
//         { cancelable: false }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onLogoutYesBTN = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         Alert.alert(
//           "Sign out",
//           "Something went wrong. Please try again. leater"
//         );
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const { bottom } = useSafeAreaInsets();
//   const [activeTab, setActiveTab] = useState(0);

//   const data: Array<{ data: number[] }> = useMemo(
//     () => [{ data: Array.from({ length: 5 }) }],
//     []
//   );

//   return (
//     <>
//       <StatusBar style="light" />
//       <SectionListWithHeaders
//         HeaderComponent={HeaderComponent}
//         LargeHeaderComponent={LargeHeaderComponent}
//         sections={data}
//         // Disabling auto fix scroll since the header is quite large and we want to
//         // allow the user to scroll it partially to view content.
//         disableAutoFixScroll
//         // We ignore safe areas since we want the banner to apply the safe area more granularly
//         // to each header. This will allow the banner to maintain a full width, while adjusting
//         // other relevant components to respect the safe area.
//         ignoreLeftSafeArea
//         ignoreRightSafeArea
//         headerFadeInThreshold={0.2}
//         disableLargeHeaderFadeAnim
//         style={styles.container}
//         contentContainerStyle={[
//           styles.contentContainer,
//           { paddingBottom: bottom },
//         ]}
//         containerStyle={styles.rootContainer}
//         renderItem={(props) => <MemoizedComponent {...props} />}
//         stickySectionHeadersEnabled
//         renderSectionHeader={() => (
//           <View style={styles.tabBarContainer}>
//             {["Posts", "Comments", "About"].map((tab, index) => (
//               <TouchableOpacity
//                 key={`option-${index}`}
//                 style={styles.tabButton}
//                 onPress={() => setActiveTab(index)}
//               >
//                 <Text style={styles.tabText}>{tab}</Text>
//                 {activeTab === index && <View style={styles.blueUnderline} />}
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       />
//     </>
//   );
// };

// export default TwitterProfile;

// const styles = StyleSheet.create({
//   children: { marginTop: 16, paddingHorizontal: 16 },
//   title: { fontSize: 24, color: "white" },
//   navBarTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
//   largeHeaderStyle: {
//     flexDirection: "column",
//     gap: 10,
//     marginTop:
//       AVATAR_SIZE_VALUE / 2 + VERTICAL_SPACING + BANNER_BOTTOM_HEIGHT_ADDITION,
//   },
//   backButtonContainer: {
//     backgroundColor: "rgba(0, 0, 0, 1)",
//     borderRadius: 100,
//     padding: 9,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerStyle: {
//     backgroundColor: "transparent",
//     paddingVertical: RFPercentage(1),
//   },
//   smallHeaderContainer: { position: "relative", zIndex: 1 },
//   headerRightStyle: { gap: 6, paddingLeft: 12 },
//   headerLeftStyle: { gap: 12, paddingLeft: 12 },
//   blurView: { zIndex: 1 },
//   imageStyle: { height: "100%" },
//   container: { flex: 1, backgroundColor: DarkColors.backGround },
//   contentContainer: { backgroundColor: DarkColors.backGround, flexGrow: 1 },
//   text: { color: "#fff" },
//   primaryText: { color: TWITTER_PRIMARY_COLOR },
//   mediumText: { color: "#fff", fontSize: 14, fontWeight: "600" },
//   rootContainer: { backgroundColor: "#000" },
//   profileFollowContainer: {
//     position: "absolute",
//     left: 12,
//     right: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   followText: { fontSize: 12, fontWeight: "600" },
//   pillButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 32,
//     backgroundColor: "#fff",
//     borderRadius: 200,
//   },
//   disabledSmallText: { color: DISABLED_COLOR, fontSize: 12 },
//   disabledText: { color: DISABLED_COLOR, fontSize: 14 },
//   profileHeaderRow: { flexDirection: "row", gap: 6, alignItems: "center" },
//   profileContainer: { paddingHorizontal: 12 },
//   profileHandleContainer: { gap: 4 },
//   statsContainer: {
//     flexDirection: "row",
//     gap: 12,
//     alignItems: "center",
//     marginBottom: RFPercentage(1.2),
//   },
//   whoFollowsThemContainer: {
//     flexDirection: "row",
//     gap: 12,
//     alignItems: "center",
//   },
//   followerPreviewContainer: {
//     position: "relative",
//     width: AVATAR_SIZE_MAP.sm * (7 / 3),
//   },
//   followerText: { flex: 1 },
//   tabBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: DarkColors.lightBg,
//   },
//   tabButton: { flex: 1, justifyContent: "center", alignItems: "center" },
//   tabText: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "600",
//     paddingVertical: 12,
//   },
//   blueUnderline: {
//     height: 2,
//     width: "100%",
//     backgroundColor: DarkColors.primaryColor,
//     borderRadius: 4,
//   },
//   locationAndWebContainer: {
//     flexDirection: "row",
//     gap: 12,
//     alignItems: "center",
//   },
//   dataRow: { flexDirection: "row", gap: 4, alignItems: "center" },
//   androidBlurViewBg: { backgroundColor: "rgba(0,0,0,0.5)" },
//   twitterVerifiedIcon: { height: 18, width: 18 },
// });

import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons";
import Avatar from "@/src/components/Avatar";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { NormalText, TitleText } from "@/src/components/Text";
import { Colors, DarkColors } from "@/src/constants/Colors";
import { wp } from "@/src/helpers/comman";
import { Users } from "@/src/redux/reducers/AuthReducer";
import { RootState } from "@/src/redux/Store";
import UserAbout from "@/src/tabsScreens/UserAbout";
import UserComments from "@/src/tabsScreens/UserComments";
import UserPost from "@/src/tabsScreens/UserPost";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";

interface Routes {
  key: string;
  title: string;
}

const renderScene = SceneMap({
  first: () => <UserPost />,
  second: () => <UserComments />,
  third: () => <UserAbout />,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    renderLabel={() => null}
    renderIcon={({ route }: { route: any }) => (
      <View style={{}}>
        <NormalText
          style={{
            marginVertical: RFPercentage(1),
            fontSize: RFValue(10),
          }}
          numberOfLines={1}
        >
          {route.title}
        </NormalText>
      </View>
    )}
    style={{ backgroundColor: DarkColors.lightBg }}
    labelStyle={{ fontSize: 12 }}
    inactiveColor="gray"
    indicatorStyle={{
      backgroundColor: DarkColors?.primaryColor,
    }}
  />
);

const Profile = () => {
  const navigationDrawer = useNavigation();
  const navigation = useRouter();
  const layout = useWindowDimensions();

  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<Routes[]>([
    { key: "first", title: "Posts" },
    { key: "second", title: "Comments" },
    { key: "third", title: "About" },
  ]);

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

  const onPressDrawer = () => {
    try {
      //@ts-ignore
      navigationDrawer?.openDrawer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ScreenWrapper bg={Colors.white}>
        <View style={styles.headerConatiner}>
          <TitleText style={{ color: DarkColors.text }}>Profile</TitleText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Spacer gap={RFPercentage(0.5)} />
            <Pressable
              style={[styles.backIconConatiner, {}]}
              onPress={onPressDrawer}
            >
              <SvgIcon
                name={"hamburgerMenu"}
                color={DarkColors.text}
                strokeWidth={0.1}
                size={20}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.avtarWithTextContainer}>
          <Pressable
            style={styles.avtarConatiner}
            onPress={() => navigation.navigate("/(main)/editProfile")}
          >
            <Avatar
              uri={UserInfo?.image}
              size={RFPercentage(10)}
              borderRadius={20}
            />
            <View style={styles.editConatiner}>
              <SvgIcon name={"edit"} size={18} color={DarkColors?.text} />
            </View>
          </Pressable>
          <Spacer gap={RFPercentage(1)} />
          <View style={{ flex: 1 }}>
            <TitleText style={styles.userNameText}>{UserInfo?.name}</TitleText>
            {UserInfo?.bio && (
              <NormalText ellipsizeMode="tail" numberOfLines={2}>
                {UserInfo?.bio}
              </NormalText>
            )}
          </View>
          <Spacer gap={RFPercentage(1)} />
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </ScreenWrapper>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    backgroundColor: DarkColors?.lightBg,
    paddingBottom: wp(3),
  },
  backIconConatiner: {
    backgroundColor: "rgba(0,0,0,0.1)",
    alignSelf: "flex-start",
    borderRadius: 10,
    height: wp(8),
    width: wp(8),
    alignItems: "center",
    justifyContent: "center",
  },
  avtarConatiner: {
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: Colors.white,
    borderRadius: 30,
    marginLeft: RFPercentage(1.3),
  },
  editConatiner: {
    backgroundColor: DarkColors?.votesBg,
    borderRadius: 90,
    position: "absolute",
    bottom: -3,
    right: -12,
    padding: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  userNameText: {
    elevation: 5,
  },
  profileListItemConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avtarWithTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: RFPercentage(2),
  },
});
