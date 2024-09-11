import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import DoubleTouchableOpacity from "./DoubleTouchableOpacity";
import Carousel from "react-native-reanimated-carousel";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/src/constants/Colors";
import { replaceMentionValues } from "react-native-controlled-mentions";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/src/redux/Store";
import { MXicon } from "./Icons";
import Paginator from "./Paginator";
import { NormalText } from "./Text";
import { PostData } from "../utility/types";
import { Video } from "expo-av";
import { Image } from "expo-image";
import { getSupaBaseFileUrl } from "../services/imageServices";
import Avatar from "./Avatar";
import { hp } from "../helpers/comman";
import SvgIcon from "../assets/icons";
import Spacer from "./Spacer";

const width = Dimensions.get("window").width;

const MemoizedPostView: React.FC<any> = React.memo(
  ({ item }: { item: PostData }, { isVisible }: { isVisible: boolean }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
    const videoRef = useRef(null);
    const AnimatedImage = Animated.createAnimatedComponent(Image);
    const userPost = useAppSelector(
      (state) => state.root?.CommunityReducer.Post
    );
    const scrollX = useSharedValue(0);
    const scale = useSharedValue(0);
    const rStyle = useAnimatedStyle(() => ({
      transform: [{ scale: Math.max(scale.value, 0) }],
    }));

    const onDoubleTap = useCallback(() => {
      if (false) {
        runOnJS(handleLikeToggle)(item.id);
      }
      scale.value = withSpring(1, undefined, (isFinished) => {
        if (isFinished) {
          scale.value = withDelay(500, withSpring(0));
        }
      });
    }, [item]);

    const handleLikeToggle = (itemId: number) => {
      console.log("like post");
      // dispatch(toggleLike(itemId));
    };

    const renderText = (matchingString: string, matches: string[]) => {
      return replaceMentionValues(matchingString, ({ name }) => `${name}`);
    };

    const onSingleTap = () => {
      console.log("Singke post");
    };

    const handleNamePress = (name: string, matchIndex: number) => {
      const input = "@ ";
      const match = name.match(/@\[(.*?)\]/);

      if (match && match.length > 1) {
        const extractedText = match[1];
        ToastAndroid.show(
          `${extractedText} has been tagged to this post!`,
          ToastAndroid.SHORT
        );
      } else {
        console.log("No match found or invalid input format.");
      }
    };

    const onPressShareImage = () => {
      try {
      } catch (error) {
        console.log(error);
      }
    };

    const onPressComment = () => {
      try {
      } catch (error) {
        console.log(error);
      }
    };

    const onPressUpvote = () => {
      try {
      } catch (error) {
        console.log(error);
      }
    };

    const onPressDownVote = () => {
      try {
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <View style={styles.userContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar uri={item?.user?.image} size={hp(5)} borderRadius={10} />
          <View style={styles.userNameContainer}>
            <NormalText>{item?.user?.name}</NormalText>
          </View>
        </View>
        {item.body && (
          <View>
            <ParsedText
              style={styles.descriptionText}
              parse={[
                {
                  style: styles.username,
                  onPress: handleNamePress,
                  renderText: renderText,
                  pattern: /[@#]\S*/g,
                },
              ]}
              childrenProps={{ allowFontScaling: false }}
            >
              {item?.body}
            </ParsedText>
          </View>
        )}
        <View>
          <Image
            source={getSupaBaseFileUrl(item?.files)}
            transition={100}
            contentFit="cover"
            style={{ aspectRatio: 4 / 5 }}
          />
        </View>
        <View style={styles.footerConatiner}>
          <View style={styles.flex}>
            <View style={styles.upvoteConatiner}>
              <Pressable style={styles.flex} onPress={onPressUpvote}>
                <SvgIcon name={"upArrow"} size={25} color={Colors.black} />
                <NormalText style={{ marginRight: RFPercentage(1) }}>
                  0
                </NormalText>
              </Pressable>
              <View style={styles.smallVerticalLine} />
              <Pressable onPress={onPressDownVote}>
                <SvgIcon name={"downArrow"} size={25} color={Colors.black} />
              </Pressable>
            </View>
            <Spacer gap={RFPercentage(0.5)} />
            <Pressable
              onPress={onPressComment}
              style={[
                styles.upvoteConatiner,
                { paddingHorizontal: RFPercentage(1) },
              ]}
            >
              <SvgIcon name={"comment"} size={16} color={Colors.black} />
              <NormalText style={{ marginLeft: RFPercentage(1) }}>0</NormalText>
            </Pressable>
          </View>
          <Pressable
            onPress={onPressShareImage}
            style={[
              styles.upvoteConatiner,
              { paddingHorizontal: RFPercentage(1) },
            ]}
          >
            <SvgIcon name={"share"} size={15} color={Colors.black} />
          </Pressable>
        </View>
      </View>
    );
  }
);

export default MemoizedPostView;
const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "white",
    paddingHorizontal: RFPercentage(2),
    paddingVertical: RFPercentage(1),
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 80,
  },
  userNameContainer: {
    marginHorizontal: RFPercentage(1),
  },
  descriptionText: {
    color: Colors.black,
    marginVertical: RFPercentage(0.5),
    marginTop: RFPercentage(1),
    fontFamily: "SpaceMono-Regular",
  },
  username: {
    color: "#E90019",
    fontSize: RFValue(12),
  },
  soundBtnConatiner: {
    position: "absolute",
    backgroundColor: Colors.white,
    padding: RFPercentage(1.3),
    borderRadius: 100,
    bottom: 10,
    right: 10,
  },
  pressebleIconConatiner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  footerConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: RFPercentage(1),
  },
  upvoteConatiner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Colors.icon,
    paddingHorizontal: RFPercentage(0.5),
    height: RFPercentage(3),
  },
  smallVerticalLine: {
    height: RFPercentage(1.4),
    width: 1,
    backgroundColor: Colors.icon,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
});
