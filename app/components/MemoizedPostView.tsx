import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import DoubleTouchableOpacity from "./DoubleTouchableOpacity";
import Carousel from "react-native-reanimated-carousel";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/constants/Colors";
import { replaceMentionValues } from "react-native-controlled-mentions";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { MXicon } from "./Icons";
import Paginator from "./Paginator";

const width = Dimensions.get("window").width;

const MemoizedPostView: React.FC<any> = React.memo(({ item, isVisible }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const videoRef = useRef(null);
  const AnimatedImage = Animated.createAnimatedComponent(Image);
  const userPost = useAppSelector((state) => state.root?.CommunityReducer.Post);
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
  console.log(userPost, "userPostuserPost");
  return (
    <ThemedView style={styles.userContainer}>
      <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
        <ThemedView style={styles.profileImage}>
          <Image
            source={{ uri: item.userProfileImage }}
            style={styles.profileImage}
          />
        </ThemedView>
        <ThemedView style={styles.userNameContainer}>
          <ThemedText>{item.username}</ThemedText>
        </ThemedView>
      </ThemedView>
      {item.description && (
        <ThemedView>
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
            {item?.description}
          </ParsedText>
        </ThemedView>
      )}
      {/* {item.uploadedImages.length > 0 && ( */}
      <DoubleTouchableOpacity
        onPress={() => onSingleTap()}
        onDoublePress={() => onDoubleTap()}
        doublePressDelay={250}
      >
        <ThemedView style={{ flex: 1, alignSelf: "center" }}>
          <Carousel
            width={width}
            height={100}
            autoPlay={false}
            data={item.uploadedImages}
            scrollAnimationDuration={1000}
            style={{
              marginTop: 10,
            }}
            loop={false}
            panGestureHandlerProps={{
              activeOffsetX: [-10, 0],
            }}
            onProgressChange={(_, absoluteProgress) => {
              scrollX.value = absoluteProgress * width;
            }}
            onSnapToItem={(carouselIndex) => {
              if (isVisible) {
                runOnJS(setActiveIndex)(carouselIndex);
              }
            }}
            renderItem={({ index, item: imageUrl }) => {
              // const regex = /(?:\.([^.]+))?$/;
              // const match = imageUrl.match(regex);
              // const extension = match ? match[1] : undefined;
              if (true) {
                return (
                  <ThemedView>
                    {/* <Video
                        source={{ uri: imageUrl }}
                        ref={videoRef}
                        onBuffer={() => console.log("buffring")}
                        onError={() => console.log("error")}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                        repeat={true}
                        useTextureView={false}
                        onPlaybackError={(error: any) =>
                          console.error("Video error:", error)
                        }
                        maxBitRate={700000}
                        ignoreSilentSwitch="ignore"
                        paused={
                          !isVisible ||
                          !(activeIndex === 0 || activeIndex === index) ||
                          userPost.showImageModal
                        }
                        muted={isSoundOn}
                        automaticallyWaitsToMinimizeStalling={false}
                        hideShutterView={true}
                        disableFocus={true}
                      /> */}

                    {/* <Image source={} /> */}
                    <Pressable
                      style={styles.soundBtnConatiner}
                      onPress={() => setIsSoundOn(!isSoundOn)}
                    >
                      <MXicon
                        type="Entypo"
                        name={isSoundOn ? "sound-mute" : "sound"}
                        color={"white"}
                        size={RFPercentage(2.2)}
                      />
                    </Pressable>
                  </ThemedView>
                );
              } else {
                return (
                  <ThemedView
                    style={{
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <ThemedView style={{ width: "100%", height: "100%" }} />
                    {/* <Image
                        source={{ uri: imageUrl }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      /> */}
                  </ThemedView>
                );
              }
            }}
          />
        </ThemedView>
      </DoubleTouchableOpacity>
      {/* )} */}
      {false ? (
        <ThemedView style={{ marginVertical: RFPercentage(2) }}>
          <Paginator data={item.uploadedImages} scrollX={scrollX} />
        </ThemedView>
      ) : (
        <ThemedView style={{ marginVertical: RFPercentage(1) }} />
      )}
      <ThemedView
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
      </ThemedView>
      <Pressable style={styles.pressebleIconConatiner} onPress={() => {}}>
        <MXicon
          type="FontAwesome"
          name={item.isLiked ? "heart" : "heart-o"}
          size={RFPercentage(2.5)}
          color={item.isLiked ? "pink" : "black"}
        />
        <ThemedText style={{ marginHorizontal: RFPercentage(0.8) }}>
          {item.likeCount} Likes
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
});

export default MemoizedPostView;
const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: "white",
  },
  profileImage: {
    height: 40,
    width: 40,
    backgroundColor: "gray",
    borderRadius: 80,
  },
  userNameContainer: {
    marginHorizontal: RFPercentage(1),
  },
  descriptionText: {
    color: Colors.dark.background,
    marginVertical: RFPercentage(0.5),
    marginTop: RFPercentage(1),
    fontFamily: "ComicNeue-Regular",
  },
  username: {
    color: "#E90019",
    fontFamily: "ComicNeue-Regular",
    fontSize: RFValue(12),
  },
  soundBtnConatiner: {
    position: "absolute",
    backgroundColor: Colors.dark.background,
    padding: RFPercentage(1.3),
    borderRadius: 100,
    bottom: 10,
    right: 10,
  },
  pressebleIconConatiner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: RFPercentage(1),
    marginBottom: RFPercentage(1),
  },
});
