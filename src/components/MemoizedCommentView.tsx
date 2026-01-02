import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import SvgIcon from "../assets/icons";
import { Colors, useThemeColors } from "../constants/Colors";
import { hp } from "../helpers/comman";
import { UserInfo } from "../redux/reducers/AuthReducer";
import { RootState } from "../redux/Store";
import { CommentsData } from "../utility/types";
import Avatar from "./Avatar";
import Button from "./Button";
import GlobalCenterModal from "./GlobalCenterModal";
import PostActionModal from "./PostActionModal";
import Spacer from "./Spacer";
import { NormalText, TitleText } from "./Text";
import { useToggleCommentVoteMutation } from "../services/PostReqest/postApi";

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
    ) as UserInfo;
    const themeColors = useThemeColors();
    const [toggleCommentVote] = useToggleCommentVoteMutation();

    const [userVote, setUserVote] = useState<"upvote" | "downvote" | "none">(
      "none"
    );

    const [showCommentActionModal, setShowCommentActionModal] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [feedBuzzCoins, setFeedBuzzCoins] = useState(item?.buzzCoins);
    const [voteCount, setVoteCount] = useState(0);

    useEffect(() => {
      const upvotes = item?.upvotes ?? [];
      const downvotes = item?.downvotes ?? [];
      const currentUserId = UserInfo?._id;

      setVoteCount(upvotes.length - downvotes.length);
      setFeedBuzzCoins(item?.buzzCoins ?? 0);

      if (upvotes.includes(currentUserId)) {
        setUserVote("upvote");
      } else if (downvotes.includes(currentUserId)) {
        setUserVote("downvote");
      } else {
        setUserVote("none");
      }
    }, [item]);

    const onPressUpvote = async () => {
      try {
        let voteType: "none" | "upvote" | "downvote" = "none";

        if (userVote === "upvote") {
          setVoteCount((prev) => prev - 1);
          setUserVote("none");
          voteType = "none";
        } else if (userVote === "downvote") {
          setVoteCount((prev) => prev + 2);
          setUserVote("upvote");
          voteType = "upvote";
        } else {
          setVoteCount((prev) => prev + 1);
          setUserVote("upvote");
          voteType = "upvote";
        }

        await updateVotesInBE(voteType);
      } catch (error) {
        console.log(error);
      }
    };

    /* Downvote function */
    const onPressDownVote = async () => {
      try {
        let voteType: "none" | "upvote" | "downvote" = "none";

        if (userVote === "downvote") {
          setVoteCount((prev) => prev + 1);
          setUserVote("none");
          voteType = "none";
        } else if (userVote === "upvote") {
          setVoteCount((prev) => prev - 2);
          setUserVote("downvote");
          voteType = "downvote";
        } else {
          setVoteCount((prev) => prev - 1);
          setUserVote("downvote");
          voteType = "downvote";
        }

        await updateVotesInBE(voteType);
      } catch (error) {
        console.log(error);
      }
    };

    const updateVotesInBE = async (
      voteType: "upvote" | "downvote" | "none"
    ) => {
      const votePayload = {
        type: voteType,
        userId: UserInfo._id,
        commentId: item?._id,
      };
      await toggleCommentVote(votePayload).unwrap();
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
            uri={item?.user?.profilePic}
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
                {item?.user?.username}
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
                {moment(item?.createdAt).fromNow()}
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
