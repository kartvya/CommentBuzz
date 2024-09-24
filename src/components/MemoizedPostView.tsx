import { Colors, DarkColors } from "@/src/constants/Colors";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Share,
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
import {
  downloadImage,
  getSupaBaseFileUrl,
  getUserImage,
} from "../services/imageServices";
import {
  createPostUpvote,
  deletePost,
  deletePostUpvote,
} from "../services/postServices";
import { PostData } from "../utility/types";
import Avatar from "./Avatar";
import Spacer from "./Spacer";
import { NormalText, TitleText } from "./Text";
import PostActionModal from "./PostActionModal";
import moment from "moment";
import GlobalCenterModal from "./GlobalCenterModal";
import Button from "./Button";

interface Iprops {
  item: PostData;
  isVisible: boolean;
  fetchAllPost?: () => void;
  isCommentScreen?: boolean;
}

const MemoizedPostView: React.FC<Iprops> = React.memo(
  ({ item, isVisible, fetchAllPost, isCommentScreen }) => {
    const navigation = useNavigation();
    const router = useRouter();
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
    const [deleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showProfilePitcture, setShowProfilePitcture] =
      useState<boolean>(false);
    const [selectedProfilePitcture, setSelectedProfilePitcture] =
      useState<string>("");
    const [shareLoad, setShareLoad] = useState(false);

    useEffect(() => {
      const sortedData = item?.postVotes?.sort(
        (a, b) =>
          new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
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

    const onPressShareImage = async () => {
      try {
        let content = { message: item.body, url: "" };
        if (item?.files) {
          setShareLoad(true);
          let url = await downloadImage(getSupaBaseFileUrl(item?.files).uri);
          setShareLoad(false);
          content.url = url ?? "";
        }
        Share.share(content);
      } catch (error) {
        console.log(error);
      }
    };

    const onPressComment = () => {
      try {
        router.push({
          pathname: "/(main)/comments",
          params: { postId: item.id },
        });
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
          setShowDeleteModal(false);
          if (fetchAllPost) {
            fetchAllPost();
          }
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
              <Avatar
                uri={item?.user?.image}
                size={hp(5)}
                borderRadius={50}
                onLongPress={() => {
                  setShowProfilePitcture(true);
                }}
              />
              <View style={styles.userNameContainer}>
                <NormalText>{item?.user?.name}</NormalText>
                <NormalText style={styles.subText}>
                  {moment(item?.created_at).fromNow()}
                </NormalText>
              </View>
            </View>
            {UserInfo?.id === item?.userId && (
              <Pressable onPress={() => setShowPostActionModal(true)}>
                <SvgIcon name={"postMore"} color={DarkColors?.text} />
              </Pressable>
            )}
          </View>
          {item?.body ? (
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
          ) : (
            <Spacer gap={RFPercentage(0.8)} />
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
                <TouchableOpacity style={styles.flex} onPress={onPressUpvote}>
                  <SvgIcon
                    name={"upArrow"}
                    size={25}
                    color={userVote === "upvote" ? Colors.red : DarkColors.text}
                  />
                  <NormalText
                    style={{
                      marginRight: RFPercentage(1),
                      color:
                        userVote === "upvote" ? Colors.red : DarkColors.text,
                    }}
                  >
                    {voteCount}
                  </NormalText>
                </TouchableOpacity>

                <View style={styles.smallVerticalLine} />
                <Pressable
                  onPress={onPressDownVote}
                  style={{ marginLeft: RFPercentage(0.4) }}
                >
                  <SvgIcon
                    name={"downArrow"}
                    size={25}
                    color={
                      userVote === "downvote"
                        ? Colors.downvote
                        : DarkColors.text
                    }
                  />
                </Pressable>
              </View>
              <Spacer gap={RFPercentage(0.5)} />
              {!isCommentScreen && (
                <Pressable
                  onPress={onPressComment}
                  style={[
                    styles.upvoteConatiner,
                    { paddingHorizontal: RFPercentage(1) },
                  ]}
                >
                  <SvgIcon name={"comment"} size={16} color={DarkColors.text} />
                  <NormalText style={{ marginLeft: RFPercentage(1) }}>
                    {item?.comments[0]?.count}
                  </NormalText>
                </Pressable>
              )}
            </View>
            {shareLoad ? (
              <ActivityIndicator
                size={"small"}
                color={DarkColors.primaryColor}
              />
            ) : (
              <Pressable
                onPress={onPressShareImage}
                style={[
                  styles.upvoteConatiner,
                  { paddingHorizontal: RFPercentage(1) },
                ]}
              >
                <SvgIcon name={"share"} size={15} color={DarkColors?.text} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Post action modal */}
        {!deleteModal && (
          <PostActionModal
            isVisible={postActionModal}
            onClose={() => setShowPostActionModal(false)}
            onPressDelete={() => {
              setShowPostActionModal(false);
              setShowDeleteModal(true);
            }}
          />
        )}

        <GlobalCenterModal
          isVisible={deleteModal}
          childern={
            <View
              style={{
                backgroundColor: DarkColors.lightBg,
                borderRadius: 10,
                padding: RFPercentage(1),
                paddingHorizontal: RFPercentage(2),
              }}
            >
              <TitleText>Are you sure?</TitleText>
              <Spacer gap={RFPercentage(0.4)} />
              <NormalText>
                You cannot restore post that have been deleted.
              </NormalText>
              <Spacer gap={RFPercentage(0.7)} />
              <View style={styles.avtarTitleConatiner}>
                <Button
                  title="Cancel"
                  onPress={() => setShowDeleteModal(false)}
                  btnStyle={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderRadius: 100,
                    height: hp(5),
                  }}
                  textStyle={{ color: DarkColors.icon, fontSize: RFValue(13) }}
                />
                <Spacer gap={RFPercentage(0.5)} />
                <Button
                  title="Delete"
                  onPress={() => onDeletePost()}
                  btnStyle={{
                    flex: 1,
                    backgroundColor: "red",
                    borderRadius: 100,
                    height: hp(5),
                  }}
                  textStyle={{ fontSize: RFValue(13) }}
                />
              </View>
            </View>
          }
        />

        <GlobalCenterModal
          isVisible={showProfilePitcture}
          onDismiss={() => setShowProfilePitcture(false)}
          childern={
            <Image
              source={getUserImage(item?.user?.image)}
              contentFit="contain"
              style={{
                height: RFPercentage(25),
                width: RFPercentage(25),
                borderRadius: 100,
                alignSelf: "center",
                backgroundColor: DarkColors.text,
              }}
            />
          }
        />
      </>
    );
  }
);

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
    height: RFPercentage(3.6),
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
