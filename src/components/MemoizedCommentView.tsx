import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import SvgIcon from "../assets/icons";
import { Colors, useThemeColors } from "../constants/Colors";
import { hp } from "../helpers/comman";
import { RootState } from "../redux/Store";
import { Users } from "../redux/reducers/AuthReducer";
import { createCommentVote, deleteCommentVote } from "../services/postServices";
import { CommentsData } from "../utility/types";
import Avatar from "./Avatar";
import Button from "./Button";
import GlobalCenterModal from "./GlobalCenterModal";
import PostActionModal from "./PostActionModal";
import Spacer from "./Spacer";
import { NormalText, TitleText } from "./Text";
interface Iprops {
  item: CommentsData;
  isUserComment: boolean;
  onDeleteComment: () => void;
  postId: string;
}

const MemoizedCommentView: React.FC<Iprops> = React.memo(
  ({ item, isUserComment, onDeleteComment, postId }) => {
    const UserInfo = useSelector(
      (state: RootState) => state.root?.authReducer?.userInfo
    ) as Users;
    const themeColors = useThemeColors();

    const [userVote, setUserVote] = useState<"upvote" | "downvote" | "none">(
      "none"
    );
    const [showCommentActionModal, setShowCommentActionModal] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [feedBuzzCoins, setFeedBuzzCoins] = useState(item?.commentBuzz);
    const [voteCount, setVoteCount] = useState(item?.voteCount || 0);

    useEffect(() => {
      const sortedData = item?.commentVotes?.sort(
        (
          a: { created_at: string | number | Date },
          b: { created_at: string | number | Date }
        ) =>
          new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
      );
      const currentUserVote = sortedData?.find(
        (vote: { userId: string }) => vote?.userId === UserInfo?.id
      );

      if (currentUserVote?.voteType === "upVote") {
        setUserVote("upvote");
      } else if (currentUserVote?.voteType === "downVote") {
        setUserVote("downvote");
      } else {
        setUserVote("none");
      }
      setVoteCount(item?.voteCount || 0);
      setFeedBuzzCoins(item?.commentBuzz);
    }, [item?.commentVotes, item?.voteCount]);

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
        return item?.commentBuzz;
      }
    }

    const onPressUpvote = async () => {
      try {
        if (userVote === "upvote") {
          setVoteCount(voteCount - 1);
          setUserVote("none");
          const delObj = {
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount - 1,
            feedBuzzCoins: buzzCoinMathFunction("decreaseone"),
          };
          await deleteCommentVote(delObj);
        } else if (userVote === "downvote") {
          setVoteCount(voteCount + 2);
          setUserVote("upvote");
          await createCommentVote({
            commentId: item?.id,
            voteType: "upVote",
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount + 2,
            feedBuzzCoins: buzzCoinMathFunction("increasetwo"),
          });
        } else {
          setVoteCount(voteCount + 1);
          setUserVote("upvote");
          await createCommentVote({
            commentId: item?.id,
            voteType: "upVote",
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount + 1,
            feedBuzzCoins: buzzCoinMathFunction("increaseone"),
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
          const delObj = {
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount + 1,
            feedBuzzCoins: buzzCoinMathFunction("increaseone"),
          };
          await deleteCommentVote(delObj);
        } else if (userVote === "upvote") {
          setVoteCount(voteCount - 2);
          setUserVote("downvote");
          await createCommentVote({
            commentId: item?.id,
            voteType: "downVote",
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount - 2,
            feedBuzzCoins: buzzCoinMathFunction("decreasetwo"),
          });
        } else {
          setVoteCount(voteCount - 1);
          setUserVote("downvote");
          await createCommentVote({
            commentId: item?.id,
            voteType: "downVote",
            userId: UserInfo?.id,
            postId: postId,
            voteCount: voteCount - 1,
            feedBuzzCoins: buzzCoinMathFunction("decreaseone"),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: RFPercentage(1),
            marginVertical: RFPercentage(1),
          }}
        >
          <Avatar
            uri={item?.user?.image}
            size={RFPercentage(5)}
            borderRadius={100}
          />
          <Spacer gap={RFPercentage(0.6)} />
          <View
            style={[styles.comatiner, { backgroundColor: themeColors.lightBg }]}
          >
            <View style={styles.commentsAvtarContainer}>
              <NormalText
                style={{ color: themeColors.text, fontSize: RFValue(10) }}
              >
                {item?.user?.name}
              </NormalText>
              <TitleText
                style={{
                  marginHorizontal: RFPercentage(0.4),
                  color: themeColors.icon,
                }}
              >
                •
              </TitleText>
              <NormalText
                style={{
                  color: themeColors.icon,
                  fontSize: RFValue(9),
                  top: 1,
                }}
              >
                {moment(item?.created_at).fromNow()}
              </NormalText>
            </View>
            <Spacer gap={RFPercentage(0.2)} />
            <NormalText>{item?.text}</NormalText>
            <Spacer gap={RFPercentage(0.2)} />
            <View style={styles.footerConatiner}>
              {isUserComment && (
                <Pressable onPress={() => setShowCommentActionModal(true)}>
                  <SvgIcon name={"postMore"} color={themeColors?.text} />
                </Pressable>
              )}
              <Spacer gap={RFPercentage(0.8)} />
              <View style={styles.upvoteConatiner}>
                <TouchableOpacity onPress={onPressUpvote}>
                  <SvgIcon
                    name={"upArrow"}
                    size={25}
                    color={
                      userVote === "upvote" ? Colors.red : themeColors.text
                    }
                  />
                </TouchableOpacity>
                <NormalText
                  style={{
                    marginHorizontal: RFPercentage(0.5),
                    color:
                      userVote === "upvote" ? Colors.red : themeColors.text,
                  }}
                >
                  {voteCount}
                </NormalText>
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
                        : themeColors.text
                    }
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {!deleteModal && (
          <PostActionModal
            isVisible={showCommentActionModal}
            onClose={() => setShowCommentActionModal(false)}
            onPressDelete={() => {
              setShowCommentActionModal(false);
              setShowDeleteModal(true);
            }}
          />
        )}

        <GlobalCenterModal
          isVisible={deleteModal}
          childern={
            <View
              style={{
                backgroundColor: themeColors.lightBg,
                borderRadius: 10,
                padding: RFPercentage(1),
                paddingHorizontal: RFPercentage(2),
              }}
            >
              <TitleText>Are you sure?</TitleText>
              <Spacer gap={RFPercentage(0.4)} />
              <NormalText>
                You cannot restore comment that have been deleted.
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
                  textStyle={{ color: themeColors.icon, fontSize: RFValue(13) }}
                />
                <Spacer gap={RFPercentage(0.5)} />
                <Button
                  title="Delete"
                  onPress={() => onDeleteComment()}
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
      </>
    );
  }
);

export default MemoizedCommentView;

const styles = StyleSheet.create({
  comatiner: {
    borderRadius: 12,
    paddingHorizontal: RFPercentage(1.7),
    paddingVertical: RFPercentage(1.3),
    flex: 1,
  },
  commentsAvtarStyle: {
    borderRadius: 100,
  },
  commentsAvtarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerConatiner: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  upvoteConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallVerticalLine: {
    height: RFPercentage(1.4),
    width: 1,
    backgroundColor: Colors.icon,
  },
  avtarTitleConatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
