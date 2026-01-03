import SvgIcon from "@/src/assets/icons";
import Header from "@/src/shared/ui/Header";
import Input from "@/src/shared/ui/Input";
import Loading from "@/src/shared/ui/Loading";
import MemoizedCommentView from "@/src/shared/ui/MemoizedCommentView";
import MemoizedPostView from "@/src/shared/ui/MemoizedPostView";
import ScreenWrapper from "@/src/shared/ui/ScreenWrapper";
import Spacer from "@/src/shared/ui/Spacer";
import { TitleText } from "@/src/shared/ui/Text";
import { useThemeColors } from "@/src/shared/constants/colors";
import { hp } from "@/src/shared/utils/comman";
import { UserInfo } from "@/src/modules/auth";
import { RootState } from "@/src/redux/Store";
import usePostServices from "@/src/services/postServices";
import { CommentsData, CommentsPostData } from "@/src/shared/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Comments = () => {
  const { postId } = useLocalSearchParams();
  const { createComment, fetchPostComments, deleteComment } = usePostServices();

  const themeColors = useThemeColors();
  const commentRef = useRef<string>("");
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 20;
  const [refreshing, setRefreshing] = useState(false);
  const [postDetails, setPostDetails] = useState<CommentsPostData>();
  const [startLoading, setStartLoging] = useState<boolean>(true);
  const [sendCommentLoad, setSendCommentLoad] = useState<boolean>(false);

  const UserInfo = useSelector(
    (state: RootState) => state.auth?.userInfo
  ) as UserInfo;

  useEffect(() => {
    if (postDetails?.comments?.length) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [postDetails?.comments]);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    try {
      const res = await fetchPostComments(postId);
      if (res.success) {
        setPostDetails(res.data);
        inputRef.current?.focus();
      }
      setStartLoging(false);
    } catch (error) {
      setStartLoging(false);
      console.log(error);
    }
  };

  const onCommentUpload = async () => {
    try {
      if (!commentRef.current) {
        return null;
      }
      let data = {
        postId: postDetails?.post?._id,
        description: commentRef?.current,
      };
      setSendCommentLoad(true);
      const res = await createComment(data);
      if (res.success) {
        inputRef.current?.clear();
        commentRef.current = "";
        getPostDetails();
        setSendCommentLoad(false);
      } else {
        setSendCommentLoad(false);
      }
    } catch (error) {
      setSendCommentLoad(false);
      console.log(error);
    }
  };

  const onDeleteComment = async (commentId: string) => {
    try {
      let res = await deleteComment(commentId);
      if (res.success) {
        setPostDetails((prevPost) => {
          if (prevPost) {
            let updatedPost = { ...prevPost };
            updatedPost.comments = updatedPost.comments?.filter(
              (c) => c._id != commentId
            );
            return updatedPost;
          }
          return prevPost;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem: ListRenderItem<CommentsData> = useCallback(
    ({ item, index }) => (
      <>
        <MemoizedCommentView
          item={item}
          isUserComment={item?.user?._id == UserInfo?._id}
          postId={postId as string}
          onDeleteComment={() => onDeleteComment(item?._id)}
        />
      </>
    ),
    [postDetails]
  );

  if (startLoading) {
    return (
      <ScreenWrapper conatinerStyle={{ flex: 1, justifyContent: "center" }}>
        <Loading />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Header showBackIcon={true} />
        <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
          <FlatList
            ref={flatListRef}
            data={postDetails?.comments ?? []}
            ListHeaderComponent={() => (
              <MemoizedPostView
                //@ts-ignore
                item={postDetails?.post}
                isVisible={true}
                isCommentScreen={true}
              />
            )}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: paddingBottom,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getPostDetails()}
                tintColor={themeColors.primaryColor}
              />
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  backgroundColor: themeColors?.backGround,
                  marginVertical: RFPercentage(2),
                  alignItems: "center",
                }}
              >
                <TitleText>No comments yet...</TitleText>
              </View>
            )}
          />

          <View
            style={[
              styles.textInputConatiner,
              {
                bottom:
                  Platform.OS === "ios"
                    ? insets.bottom - 5
                    : insets.bottom + 10,
                backgroundColor: themeColors.backGround,
              },
            ]}
          >
            <Input
              inputRef={inputRef}
              placeholder="Add comment"
              containerStyle={{
                flex: 1,
              }}
              onChangeText={(txt: string) => (commentRef.current = txt)}
              autoCorrect={false}
            />
            <Spacer gap={RFPercentage(0.5)} />
            {sendCommentLoad ? (
              <View
                style={[
                  styles.sendBtn,
                  { backgroundColor: themeColors.lightBg },
                ]}
              >
                <Loading size={"small"} />
              </View>
            ) : (
              <Pressable
                style={[
                  styles.sendBtn,
                  { backgroundColor: themeColors.lightBg },
                ]}
                onPress={onCommentUpload}
              >
                <SvgIcon
                  name={"send"}
                  size={30}
                  color={themeColors.primaryColor}
                />
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default Comments;

const styles = StyleSheet.create({
  textInputConatiner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RFPercentage(2),
    paddingTop: RFPercentage(1),
  },
  sendBtn: {
    flex: 0.3,
    borderRadius: 10,
    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
  },
  keyboard: {
    flex: 1,
  },
});
