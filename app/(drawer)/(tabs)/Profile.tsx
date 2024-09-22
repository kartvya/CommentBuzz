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

// import { supabase } from "@/lib/supabase";
// import SvgIcon from "@/src/assets/icons";
// import { TabViewContainer } from "@/src/components/AnimatedHeader/component/TabViewBase";
// import { useHomeConfig } from "@/src/components/AnimatedHeader/hook";
// import Loading from "@/src/components/Loading";
// import ScreenWrapper from "@/src/components/ScreenWrapper";
// import { TitleText } from "@/src/components/Text";
// import { Colors } from "@/src/constants/Colors";
// import { wp } from "@/src/helpers/comman";
// import { Users } from "@/src/redux/reducers/AuthReducer";
// import { RootState } from "@/src/redux/Store";
// import { getUserImage } from "@/src/services/imageServices";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native";
// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
// } from "react-native-reanimated";
// import { useSelector } from "react-redux";

// const G_WIN_WIDTH = Dimensions.get("window").width;
// const G_WIN_HEIGHT = Dimensions.get("window").height;
// const HEAD_HEIGHT = G_WIN_HEIGHT * 0.17;

// const IMG_WH = 100;
// const MARGIN_H = 15;
// const MARGIN_V = 0;
// const FROZE_TOP = IMG_WH;
// const LINE_HEIGHT = 8;
// const LINE_COUNT = 3;
// const moveDistance = HEAD_HEIGHT - FROZE_TOP;
// const title_h = LINE_HEIGHT;
// const detail_h = LINE_HEIGHT * LINE_COUNT;
// const marginTop = (HEAD_HEIGHT - IMG_WH - title_h - detail_h) * 0.5;

// const TIMECOUNT = 2000;

// const Profile: React.FC<any> = (props) => {
//   const UserInfo = useSelector(
//     (state: RootState) => state.root?.authReducer?.userInfo
//   ) as Users;
//   const navigation = useRouter();
//   const { tabviewType, enableSnap } = useHomeConfig(props);
//   const [scrollTrans, setScrollTrans] = useState(useSharedValue(0));
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [detail, setDetail] = useState(
//     "It's hard to stay mad when there's so much beauty in the world."
//   );

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

//   const transXValue = useDerivedValue(() => {
//     const left = (G_WIN_WIDTH - IMG_WH) / 2;
//     return interpolate(
//       scrollTrans.value,
//       [0, moveDistance],
//       [0, -left],
//       Extrapolate.CLAMP
//     );
//   });
//   const transYValue = useDerivedValue(() => {
//     const moveDistance = HEAD_HEIGHT - FROZE_TOP;
//     const Img_one_move = marginTop + title_h + detail_h + MARGIN_V * 2;
//     return interpolate(
//       scrollTrans.value,
//       [0, moveDistance],
//       [0, Img_one_move],
//       Extrapolate.CLAMP
//     );
//   });
//   const scaleValue = useDerivedValue(() => {
//     const moveDistance = HEAD_HEIGHT - FROZE_TOP;
//     return interpolate(
//       scrollTrans.value,
//       [0, moveDistance],
//       [1, 0.7],
//       Extrapolate.CLAMP
//     );
//   });

//   const headerTransStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateX: transXValue.value,
//         },
//         {
//           translateY: transYValue.value,
//         },
//         {
//           scale: scaleValue.value,
//         },
//       ],
//     };
//   });

//   const titleOpacity = useDerivedValue(() => {
//     return interpolate(
//       scrollTrans.value,
//       [0, 10, 20],
//       [1, 0.8, 0],
//       Extrapolate.CLAMP
//     );
//   });
//   const titleStyle = useAnimatedStyle(() => {
//     return { opacity: titleOpacity.value };
//   });

//   const detailTransX = useDerivedValue(() => {
//     return interpolate(
//       scrollTrans.value,
//       [0, moveDistance],
//       [0, IMG_WH - (MARGIN_H + IMG_WH) * 0.5],
//       Extrapolate.CLAMP
//     );
//   });
//   const detailTransY = useDerivedValue(() => {
//     return interpolate(
//       scrollTrans.value,
//       [0, moveDistance],
//       [0, marginTop - (IMG_WH - detail_h) * 0.5],
//       Extrapolate.CLAMP
//     );
//   });
//   const detailStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateX: detailTransX.value,
//         },
//         {
//           translateY: detailTransY.value,
//         },
//       ],
//     };
//   });

//   const renderScrollHeader = () => {
//     return (
//       <View
//         style={{
//           backgroundColor: "#fff",
//           width: "100%",
//           height: HEAD_HEIGHT,
//           alignItems: "center",
//           marginTop: 5,
//         }}
//       >
//         <Animated.View style={[exStyles.avtarConatiner, headerTransStyle]}>
//           <Animated.Image
//             style={[
//               {
//                 width: IMG_WH,
//                 flex: 1,
//                 borderRadius: 30,
//               },
//             ]}
//             source={getUserImage(UserInfo?.image)}
//           />
//           <Pressable
//             style={exStyles.editConatiner}
//             onPress={() => navigation.navigate("/(main)/editProfile")}
//           >
//             <SvgIcon name={"edit"} size={20} />
//           </Pressable>
//         </Animated.View>
//         <Animated.View
//           style={[
//             {
//               justifyContent: "center",
//               alignItems: "center",
//             },
//             detailStyle,
//           ]}
//         >
//           <TitleText
//             style={[
//               {
//                 textAlign: "center",
//               },
//             ]}
//           >
//             {UserInfo?.name}
//           </TitleText>
//         </Animated.View>
//       </View>
//     );
//   };

//   const makeScrollTrans = (scrollTrans: Animated.SharedValue<number>) => {
//     setScrollTrans(scrollTrans);
//   };

//   const onStartRefresh = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       setDetail(
//         "Nobody gets to live life backwards. Look ahead, that’s where your future lies."
//       );
//       setIsRefreshing(false);
//     }, TIMECOUNT);
//   };

//   const renderRefreshControl = () => {
//     return <Loading />;
//   };

//   const Props = {
//     renderScrollHeader,
//     makeScrollTrans,
//     frozeTop: FROZE_TOP,
//     onStartRefresh: onStartRefresh,
//     renderRefreshControl,
//     isRefreshing,
//     enableSnap,
//   };
//   return (
//     <ScreenWrapper bg={Colors.white}>
//       <View style={exStyles.headerConatiner}>
//         <TitleText>Profile</TitleText>
//         <Pressable
//           style={[
//             exStyles.backIconConatiner,
//             {
//               backgroundColor: "rgba(255,0,0,0.1)",
//             },
//           ]}
//           onPress={onPressLogout}
//         >
//           <SvgIcon name={"logout"} />
//         </Pressable>
//       </View>
//       <TabViewContainer {...Props} />
//     </ScreenWrapper>
//   );
// };

// export default Profile;
// const exStyles = StyleSheet.create({
//   headerConatiner: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: wp(3),
//     backgroundColor: "white",
//     paddingBottom: wp(3),
//   },
//   backIconConatiner: {
//     backgroundColor: "rgba(0,0,0,0.1)",
//     alignSelf: "flex-start",
//     borderRadius: 10,
//     height: wp(8),
//     width: wp(8),
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avtarConatiner: {
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//     backgroundColor: Colors.white,
//     borderRadius: 30,
//     height: IMG_WH,
//   },
//   editConatiner: {
//     backgroundColor: Colors.white,
//     borderRadius: 90,
//     position: "absolute",
//     bottom: -3,
//     right: -12,
//     padding: 7,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 999,
//   },
//   userNameText: {},
//   profileListItemConatiner: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
// });
