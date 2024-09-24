import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Colors, DarkColors } from "../constants/Colors";
import { NormalText, TitleText } from "./Text";
import { CommentsData } from "../utility/types";
import Avatar from "./Avatar";
import Spacer from "./Spacer";
import SvgIcon from "../assets/icons";
import moment from "moment";
import PostActionModal from "./PostActionModal";
import GlobalCenterModal from "./GlobalCenterModal";
import Button from "./Button";
import { hp } from "../helpers/comman";
import { deleteComment } from "../services/postServices";
interface Iprops {
  item: CommentsData;
  isUserComment: boolean;
  onDeleteComment: () => void;
}

const MemoizedCommentView: React.FC<Iprops> = React.memo(
  ({ item, isUserComment, onDeleteComment }) => {
    const [userVote, setUserVote] = useState<"upvote" | "downvote" | "none">(
      "none"
    );
    const [showCommentActionModal, setShowCommentActionModal] = useState(false);
    const [deleteModal, setShowDeleteModal] = useState<boolean>(false);
    const onPressUpvote = () => {};
    const onPressDownVote = () => {};

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
          <View style={styles.comatiner}>
            <View style={styles.commentsAvtarContainer}>
              <NormalText
                style={{ color: DarkColors.text, fontSize: RFValue(10) }}
              >
                {item?.user?.name}
              </NormalText>
              <TitleText
                style={{
                  marginHorizontal: RFPercentage(0.4),
                  color: DarkColors.icon,
                }}
              >
                •
              </TitleText>
              <NormalText
                style={{
                  color: DarkColors.icon,
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
                  <SvgIcon name={"postMore"} color={DarkColors?.text} />
                </Pressable>
              )}
              <Spacer gap={RFPercentage(0.8)} />
              <View style={styles.upvoteConatiner}>
                <TouchableOpacity onPress={onPressUpvote}>
                  <SvgIcon
                    name={"upArrow"}
                    size={25}
                    color={userVote === "upvote" ? Colors.red : DarkColors.text}
                  />
                </TouchableOpacity>
                <NormalText
                  style={{
                    marginHorizontal: RFPercentage(0.5),
                    color: userVote === "upvote" ? Colors.red : DarkColors.text,
                  }}
                >
                  0
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
                        : DarkColors.text
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
                backgroundColor: DarkColors.lightBg,
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
                  textStyle={{ color: DarkColors.icon, fontSize: RFValue(13) }}
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
    backgroundColor: DarkColors.lightBg,
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
