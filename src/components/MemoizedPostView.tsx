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
      if (!item.isLiked) {
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

    return (
      <View style={styles.userContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            uri={item?.user?.image ?? ""}
            size={hp(5)}
            borderRadius={10}
          />
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
        <DoubleTouchableOpacity
          onPress={() => onSingleTap()}
          onDoublePress={() => onDoubleTap()}
          doublePressDelay={250}
        >
          <View>
            <Image
              source={getSupaBaseFileUrl(item?.files)}
              transition={100}
              contentFit="cover"
              style={{ aspectRatio: 4 / 5 }}
            />
          </View>
        </DoubleTouchableOpacity>
        {/* {true ? (
          <View style={{ marginVertical: RFPercentage(2) }}>
            <Paginator data={[...new Array(6).keys()]} scrollX={scrollX} />
          </View>
        ) : (
          <View style={{ marginVertical: RFPercentage(1) }} />
        )} */}
        {/* <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <AnimatedImage
          source={require("../../assets/images/whiteHeart.png")}
          tintColor={Colors.dark.background}
          resizeMode={"contain"}
          style={[
            {
              height: RFPercentage(10),
              width: RFPercentage(10),
              resizeMode: "contain",
            },
            rStyle,
          ]}
        />
      </View> */}
        {/* <Pressable style={styles.pressebleIconConatiner} onPress={() => {}}>
          <MXicon
            type="FontAwesome"
            name={item.isLiked ? "heart" : "heart-o"}
            size={RFPercentage(2.5)}
            color={item.isLiked ? "pink" : "black"}
          />
          <NormalText style={{ marginHorizontal: RFPercentage(0.8) }}>
            {item.likeCount} Likes
          </NormalText>
        </Pressable> */}
      </View>
    );
  }
);

export default MemoizedPostView;
const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: RFPercentage(1),
    padding: RFPercentage(2),
    borderRadius: 10,
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
});
