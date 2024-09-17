import { Colors } from "@/src/constants/Colors";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { replaceMentionValues } from "react-native-controlled-mentions";
import ParsedText from "react-native-parsed-text";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import SvgIcon from "../assets/icons";
import { hp } from "../helpers/comman";
import { getSupaBaseFileUrl } from "../services/imageServices";
import { PostData, PostVotes } from "../utility/types";
import Avatar from "./Avatar";
import Spacer from "./Spacer";
import { NormalText } from "./Text";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { createPostUpvote, deletePostUpvote } from "../services/postServices";

const MemoizedPostView: React.FC<{ item: PostData; isVisible: boolean }> =
  React.memo(({ item, isVisible }) => {
    const navigation = useNavigation();

    const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
    const [isPause, setIsPause] = useState<boolean>(isVisible);
    const [userVote, setUserVote] = useState<"upvote" | "downvote" | "none">(
      "none"
    );
    const [voteCount, setVoteCount] = useState(item?.voteCount || 0);

    useEffect(() => {
      const currentUserVote = item?.postVotes?.find(
        (vote) => vote?.userId === UserInfo?.id
      );
      if (currentUserVote?.voteType === "upVote") {
        setUserVote("upvote");
      } else if (currentUserVote?.voteType === "downVote") {
        setUserVote("downvote");
      }
      setVoteCount(item?.voteCount || 0);
    }, []);

    const UserInfo = useSelector(
      (state: RootState) => state.root?.authReducer?.userInfo
    ) as Users;

    useEffect(() => {
      const unsubscribeFocus = navigation.addListener("focus", () => {
        setIsPause(false);
      });

      const unsubscribeBlur = navigation.addListener("blur", () => {
        setIsPause(true);
      });

      return () => {
        unsubscribeFocus();
        unsubscribeBlur();
      };
    }, [navigation]);

    const renderText = (matchingString: string, matches: string[]) => {
      return replaceMentionValues(matchingString, ({ name }) => `${name}`);
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

    const onPressUpvote = async () => {
      try {
        if (userVote === "upvote") {
          setVoteCount(voteCount - 1);
          setUserVote("none");
          await deletePostUpvote(UserInfo?.id, item?.id);
        } else if (userVote === "downvote") {
          setVoteCount(voteCount + 2);
          setUserVote("upvote");
          await createPostUpvote({
            voteType: "upVote",
            userId: UserInfo?.id,
            postId: item?.id,
            voteCount: voteCount + 2,
          });
        } else {
          setVoteCount(voteCount + 1);
          setUserVote("upvote");
          await createPostUpvote({
            voteType: "upVote",
            userId: UserInfo?.id,
            postId: item?.id,
            voteCount: voteCount + 1,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const onPressDownVote = async () => {
      try {
        if (userVote === "downvote") {
          setVoteCount(voteCount + 1);
          setUserVote("none");
          await deletePostUpvote(UserInfo?.id, item?.id);
        } else if (userVote === "upvote") {
          setVoteCount(voteCount - 2);
          setUserVote("downvote");
          await createPostUpvote({
            voteType: "downVote",
            userId: UserInfo?.id,
            postId: item?.id,
            voteCount: voteCount - 2,
          });
        } else {
          setVoteCount(voteCount - 1);
          setUserVote("downvote");
          await createPostUpvote({
            voteType: "downVote",
            userId: UserInfo?.id,
            postId: item?.id,
            voteCount: voteCount - 1,
          });
        }
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
          {item?.files && item?.files?.includes("postImages") && (
            <Image
              source={getSupaBaseFileUrl(item?.files)}
              transition={100}
              contentFit="cover"
              style={{ aspectRatio: 4 / 5 }}
            />
          )}
          {item?.files && item?.files?.includes("postVideos") && (
            <View>
              <Pressable onPress={() => setIsSoundOn(!isSoundOn)}>
                <Video
                  style={{ aspectRatio: 4 / 5 }}
                  resizeMode={ResizeMode.COVER}
                  source={getSupaBaseFileUrl(item?.files)}
                  isLooping={true}
                  useNativeControls={false}
                  shouldPlay={!isPause && isVisible}
                  isMuted={isSoundOn}
                />
              </Pressable>
              <Pressable
                style={styles.soundConatiner}
                onPress={() => setIsSoundOn(!isSoundOn)}
              >
                <SvgIcon
                  name={isSoundOn ? "soundOff" : "soundOn"}
                  color={"white"}
                />
              </Pressable>
            </View>
          )}
        </View>
        <View style={styles.footerConatiner}>
          <View style={[styles.flex]}>
            <View style={styles.upvoteConatiner}>
              {/* Upvote button */}
              <TouchableOpacity style={styles.flex} onPress={onPressUpvote}>
                <SvgIcon
                  name={"upArrow"}
                  size={25}
                  color={userVote === "upvote" ? Colors.red : Colors.icon}
                />
                <NormalText
                  style={{
                    marginRight: RFPercentage(1),
                    color: userVote === "upvote" ? Colors.red : Colors.icon,
                  }}
                >
                  {voteCount}
                </NormalText>
              </TouchableOpacity>

              <View style={styles.smallVerticalLine} />

              {/* Downvote button */}
              <Pressable onPress={onPressDownVote}>
                <SvgIcon
                  name={"downArrow"}
                  size={25}
                  color={
                    userVote === "downvote" ? Colors.downvote : Colors.icon
                  }
                />
              </Pressable>
            </View>
            <Spacer gap={RFPercentage(0.5)} />
            {/* <Pressable
              onPress={onPressComment}
              style={[
                styles.upvoteConatiner,
                { paddingHorizontal: RFPercentage(1) },
              ]}
            >
              <SvgIcon name={"comment"} size={16} color={Colors.icon} />
              <NormalText style={{ marginLeft: RFPercentage(1) }}>0</NormalText>
            </Pressable> */}
          </View>
          <Pressable
            onPress={onPressShareImage}
            style={[
              styles.upvoteConatiner,
              { paddingHorizontal: RFPercentage(1) },
            ]}
          >
            <SvgIcon name={"share"} size={15} color={Colors.icon} />
          </Pressable>
        </View>
      </View>
    );
  });

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
    borderRadius: 30,
    borderColor: Colors.icon,
    paddingHorizontal: RFPercentage(0.5),
    height: RFPercentage(3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: Colors.white,
    elevation: 5,
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
  soundConatiner: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 100,
  },
});
