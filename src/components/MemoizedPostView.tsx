import { Colors, DarkColors } from "@/src/constants/Colors";
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
import { useDispatch, useSelector } from "react-redux";
import SvgIcon from "../assets/icons";
import { hp } from "../helpers/comman";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { getSupaBaseFileUrl } from "../services/imageServices";
import {
  createPostUpvote,
  deletePost,
  deletePostUpvote,
} from "../services/postServices";
import { PostData } from "../utility/types";
import Avatar from "./Avatar";
import Spacer from "./Spacer";
import { NormalText } from "./Text";
import PostActionModal from "./PostActionModal";
import moment from "moment";

const MemoizedPostView: React.FC<{
  item: PostData;
  isVisible: boolean;
  fetchAllPost: () => void;
}> = React.memo(({ item, isVisible, fetchAllPost }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isPause, setIsPause] = useState<boolean>(isVisible);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | "none">(
    "none"
  );
  const [voteCount, setVoteCount] = useState(item?.voteCount || 0);
  const [feedBuzzCoins, setFeedBuzzCoins] = useState(item?.postBuzz);
  const [postActionModal, setShowPostActionModal] = useState<boolean>(false);

  useEffect(() => {
    const sortedData = item?.postVotes?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const currentUserVote = sortedData?.find(
      (vote) => vote?.userId === UserInfo?.id
    );
    if (currentUserVote?.voteType === "upVote") {
      setUserVote("upvote");
    } else if (currentUserVote?.voteType === "downVote") {
      setUserVote("downvote");
    } else {
      setUserVote("none");
    }
    setVoteCount(item?.voteCount || 0);
    setFeedBuzzCoins(item?.postBuzz);
  }, [item?.postVotes, item?.voteCount]);

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

  /* Math function that calculates buzzcoins based on post upvotes and downvotes */
  function buzzCoinMathFunction(
    type: "decreaseone" | "decreasetwo" | "increasetwo" | "increaseone"
  ) {
    let coin = feedBuzzCoins ?? 0;
    if (UserInfo?.id !== item?.userId) {
      if (type === "decreaseone") {
        coin -= 0.01;
        coin = parseFloat(coin.toFixed(2));
        setFeedBuzzCoins(coin);
        return coin;
      } else if (type === "increasetwo") {
        coin += 0.02;
        coin = parseFloat(coin.toFixed(2));
        setFeedBuzzCoins(coin);
        return coin;
      } else if (type === "decreasetwo") {
        coin -= 0.02;
        coin = parseFloat(coin.toFixed(2));
        setFeedBuzzCoins(coin);
        return coin;
      } else {
        coin += 0.01;
        coin = parseFloat(coin.toFixed(2));
        setFeedBuzzCoins(coin);
        return coin;
      }
    } else {
      return item?.postBuzz;
    }
  }

  /* Upvote function */
  const onPressUpvote = async () => {
    try {
      if (userVote === "upvote") {
        setVoteCount(voteCount - 1);
        setUserVote("none");
        const delObj = {
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount - 1,
          feedBuzzCoins: buzzCoinMathFunction("decreaseone"),
        };
        await deletePostUpvote(delObj);
      } else if (userVote === "downvote") {
        setVoteCount(voteCount + 2);
        setUserVote("upvote");
        await createPostUpvote({
          voteType: "upVote",
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount + 2,
          feedBuzzCoins: buzzCoinMathFunction("increasetwo"),
        });
      } else {
        setVoteCount(voteCount + 1);
        setUserVote("upvote");
        await createPostUpvote({
          voteType: "upVote",
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount + 1,
          feedBuzzCoins: buzzCoinMathFunction("increaseone"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Downvote function */
  const onPressDownVote = async () => {
    try {
      if (userVote === "downvote") {
        setVoteCount(voteCount + 1);
        setUserVote("none");
        const delObj = {
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount + 1,
          feedBuzzCoins: buzzCoinMathFunction("increaseone"),
        };
        await deletePostUpvote(delObj);
      } else if (userVote === "upvote") {
        setVoteCount(voteCount - 2);
        setUserVote("downvote");
        await createPostUpvote({
          voteType: "downVote",
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount - 2,
          feedBuzzCoins: buzzCoinMathFunction("decreasetwo"),
        });
      } else {
        setVoteCount(voteCount - 1);
        setUserVote("downvote");
        await createPostUpvote({
          voteType: "downVote",
          userId: UserInfo?.id,
          postId: item?.id,
          voteCount: voteCount - 1,
          feedBuzzCoins: buzzCoinMathFunction("decreaseone"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeletePost = async () => {
    try {
      const delObj = {
        userId: UserInfo?.id,
        postId: item?.id,
      };
      let res = await deletePost(delObj);
      if (res?.success) {
        setShowPostActionModal(false);
        fetchAllPost();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.userContainer}>
        <View style={styles.avtarTitleConatiner}>
          <View style={styles.avtarTitleConatiner}>
            <Avatar uri={item?.user?.image} size={hp(5)} borderRadius={50} />
            <View style={styles.userNameContainer}>
              <NormalText>{item?.user?.name}</NormalText>
              <NormalText style={styles.subText}>
                {moment(item.created_at).fromNow()}
              </NormalText>
            </View>
          </View>
          {UserInfo?.id === item?.userId && (
            <Pressable onPress={() => setShowPostActionModal(true)}>
              <SvgIcon name={"postMore"} color={DarkColors?.text} />
            </Pressable>
          )}
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
              style={{ aspectRatio: 4 / 5, borderRadius: 12 }}
            />
          )}
          {item?.files && item?.files?.includes("postVideos") && (
            <View>
              <Pressable onPress={() => setIsSoundOn(!isSoundOn)}>
                <Video
                  style={{ aspectRatio: 4 / 5, borderRadius: 12 }}
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
                  color={userVote === "upvote" ? Colors.red : DarkColors.text}
                />
                <NormalText
                  style={{
                    marginRight: RFPercentage(1),
                    color: userVote === "upvote" ? Colors.red : DarkColors.text,
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
                    userVote === "downvote" ? Colors.downvote : DarkColors.text
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
            <SvgIcon name={"share"} size={15} color={DarkColors?.text} />
          </Pressable>
        </View>
      </View>

      {/* Post action modal */}
      <PostActionModal
        isVisible={postActionModal}
        onClose={() => setShowPostActionModal(false)}
        onPressDelete={() => onDeletePost()}
      />
    </>
  );
});

export default MemoizedPostView;

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: DarkColors?.lightBg,
    marginHorizontal: RFPercentage(1),
    marginVertical: RFPercentage(1),
    borderRadius: 12,
    padding: RFPercentage(2),
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
    color: DarkColors?.text,
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
    height: RFPercentage(3.3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: DarkColors?.votesBg,
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
  avtarTitleConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subText: {
    fontSize: RFValue(9),
  },
});
