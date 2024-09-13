import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import React, {
  FC,
  memo,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  FlatListProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  Text,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileHeader from "@/src/components/ProfileHeader";
import TabBar from "@/src/components/TabBar";
import useScrollSync from "@/src/components/useScrollSync";
import ConnectionList from "@/src/components/ConnectionList";
import HeaderOverlay from "@/src/components/HeaderOverlay";
import { Connection, HeaderConfig, ScrollPair } from "@/src/utility/types";
import { TitleText } from "@/src/components/Text";
import SvgIcon from "@/src/assets/icons";
import { supabase } from "@/lib/supabase";
import { wp } from "@/src/helpers/comman";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/Store";
import { Users } from "@/src/redux/reducers/AuthReducer";
import UserPost from "@/src/tabsScreens/UserPost";
import ScreenWrapper from "@/src/components/ScreenWrapper";

const FRIENDS: Connection[] = [
  {
    name: "Sophie Brown",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "William Garcia",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

const SUGGESTIONS: Connection[] = [
  {
    name: "Charlotte Jones",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Oliver Brown",
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Jessica Miller",
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Samuel Johnson",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Olivia Martinez",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Joshua Miller",
    photo: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Katie Williams",
    photo: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    name: "Jack Jones",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Amy Johnson",
    photo: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "Thomas Williams",
    photo: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    name: "Abigail Hernandez",
    photo: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    name: "Matthew Taylor",
    photo: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Poppy Jackson",
    photo: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    name: "Mohammed Lopez",
    photo: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

enum Visibility {
  Hidden = 0,
  Visible = 1,
}

const TAB_BAR_HEIGHT = 58;
const HEADER_HEIGHT = 0;
const OVERLAY_VISIBILITY_OFFSET = 32;

const Tab = createMaterialTopTabNavigator();

const Profile: FC = () => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const { top, bottom } = useSafeAreaInsets();

  const { height: screenHeight } = useWindowDimensions();

  const friendsRef = useRef<FlatList>(null);
  const suggestionsRef = useRef<FlatList>(null);

  const [tabIndex, setTabIndex] = useState(0);

  const [headerHeight, setHeaderHeight] = useState(0);

  const [stikHeaderHeight, setStickyHeight] = useState(0);

  const defaultHeaderHeight = top + stikHeaderHeight - 10;

  const headerConfig = useMemo<HeaderConfig>(
    () => ({
      heightCollapsed: defaultHeaderHeight,
      heightExpanded: headerHeight,
    }),
    [defaultHeaderHeight, headerHeight]
  );

  const { heightCollapsed, heightExpanded } = headerConfig;

  const headerDiff = heightExpanded - heightCollapsed;

  const rendered = headerHeight > 0;

  const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => setHeaderHeight(event.nativeEvent.layout.height),
    []
  );

  const handleHeader = useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => setStickyHeight(event.nativeEvent.layout.height),
    []
  );

  const friendsScrollValue = useSharedValue(0);

  const friendsScrollHandler = useAnimatedScrollHandler(
    (event) => (friendsScrollValue.value = event.contentOffset.y)
  );

  const suggestionsScrollValue = useSharedValue(0);

  const suggestionsScrollHandler = useAnimatedScrollHandler(
    (event) => (suggestionsScrollValue.value = event.contentOffset.y)
  );

  const scrollPairs = useMemo<ScrollPair[]>(
    () => [
      { list: friendsRef, position: friendsScrollValue },
      { list: suggestionsRef, position: suggestionsScrollValue },
    ],
    [friendsRef, friendsScrollValue, suggestionsRef, suggestionsScrollValue]
  );

  const { sync } = useScrollSync(scrollPairs, headerConfig);

  const currentScrollValue = useDerivedValue(
    () =>
      tabIndex === 0 ? friendsScrollValue.value : suggestionsScrollValue.value,
    [tabIndex, friendsScrollValue, suggestionsScrollValue]
  );

  const translateY = useDerivedValue(
    () => -Math.min(currentScrollValue.value, headerDiff)
  );

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(
      translateY.value,
      [-headerDiff, 0],
      [Visibility.Hidden, Visibility.Visible]
    ),
  }));

  const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
      paddingBottom: bottom,
      minHeight: screenHeight + headerDiff,
    }),
    [rendered, headerHeight, bottom, screenHeight, headerDiff]
  );

  const sharedProps = useMemo<Partial<FlatListProps<Connection>>>(
    () => ({
      contentContainerStyle,
      onMomentumScrollEnd: sync,
      onScrollEndDrag: sync,
      scrollEventThrottle: 16,
      scrollIndicatorInsets: { top: heightExpanded },
    }),
    [contentContainerStyle, sync, heightExpanded]
  );

  const renderUserPost = useCallback(
    () => (
      <UserPost
        ref={friendsRef}
        onScroll={friendsScrollHandler}
        {...sharedProps}
      />
    ),
    [friendsRef, friendsScrollHandler, sharedProps]
  );

  const renderSuggestions = useCallback(
    () => (
      <ConnectionList
        ref={suggestionsRef}
        data={SUGGESTIONS}
        onScroll={suggestionsScrollHandler}
        {...sharedProps}
      />
    ),
    [suggestionsRef, suggestionsScrollHandler, sharedProps]
  );

  const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      rendered ? styles.tabBarContainer : undefined,
      { top: rendered ? headerHeight : undefined },
      tabBarAnimatedStyle,
    ],
    [rendered, headerHeight, tabBarAnimatedStyle]
  );

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <Animated.View style={tabBarStyle}>
        <TabBar onIndexChange={setTabIndex} {...props} />
      </Animated.View>
    ),
    [tabBarStyle]
  );

  const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      rendered ? styles.headerContainer : undefined,
      headerAnimatedStyle,
      { paddingTop: stikHeaderHeight },
    ],

    [rendered, top, headerAnimatedStyle]
  );

  const collapsedOverlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [-headerDiff, OVERLAY_VISIBILITY_OFFSET - headerDiff, 0],
      [Visibility.Visible, Visibility.Hidden, Visibility.Hidden]
    ),
  }));

  const collapsedOverlayStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.collapsedOvarlay,
      collapsedOverlayAnimatedStyle,
      { height: heightCollapsed, paddingTop: stikHeaderHeight },
    ],
    [collapsedOverlayAnimatedStyle, heightCollapsed, top]
  );

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
    <ScreenWrapper bg="white">
      <Animated.View style={styles.headerConatiner} onLayout={handleHeader}>
        <TitleText>Profile</TitleText>
        <Pressable
          style={[
            styles.backIconConatiner,
            {
              backgroundColor: "rgba(255,0,0,0.1)",
            },
          ]}
          onPress={onPressLogout}
        >
          <SvgIcon name={"logout"} />
        </Pressable>
      </Animated.View>
      <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
        <ProfileHeader
          name={UserInfo?.name}
          bio={UserInfo?.bio ? UserInfo?.bio : ""}
          photo={UserInfo?.image ? UserInfo?.image : ""}
        />
      </Animated.View>
      <Animated.View style={collapsedOverlayStyle}>
        <HeaderOverlay
          name={UserInfo?.name}
          photo={UserInfo?.image ? UserInfo?.image : ""}
        />
      </Animated.View>
      <Tab.Navigator tabBar={renderTabBar}>
        <Tab.Screen name="Posts">{renderUserPost}</Tab.Screen>
        <Tab.Screen name="Comments">{renderSuggestions}</Tab.Screen>
      </Tab.Navigator>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabBarContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
  overlayName: {
    fontSize: 24,
  },
  collapsedOvarlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    justifyContent: "center",
    zIndex: 2,
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
  },
  headerConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(3),
    backgroundColor: "white",
    paddingBottom: wp(3),
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 999,
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
});

export default memo(Profile);
