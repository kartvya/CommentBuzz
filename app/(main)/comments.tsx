import { supabase } from "@/lib/supabase";
import SvgIcon from "@/src/assets/icons";
import Header from "@/src/components/Header";
import Input from "@/src/components/Input";
import Loading from "@/src/components/Loading";
import MemoizedCommentView from "@/src/components/MemoizedCommentView";
import MemoizedPostView from "@/src/components/MemoizedPostView";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { TitleText } from "@/src/components/Text";
import { DarkColors } from "@/src/constants/Colors";
import { hp } from "@/src/helpers/comman";
import { Users } from "@/src/redux/reducers/AuthReducer";
import { RootState } from "@/src/redux/Store";
import {
  createComment,
  deleteComment,
  fetchPostDetails,
} from "@/src/services/postServices";
import { getUserData } from "@/src/services/userService";
import { CommentsData, CommentsPostData, PostData } from "@/src/utility/types";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Comments = () => {
  const { postId } = useLocalSearchParams();
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
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const handleComment = async (payload: any) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};

      setPostDetails((prevPost) => {
        if (prevPost) {
          return {
            ...prevPost,
            comments: [...prevPost.comments, newComment],
          };
        }
        return prevPost;
      });
    }
  };

  useEffect(() => {
    const commentsChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleComment
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    try {
      const res = await fetchPostDetails(postId);
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
        userId: UserInfo?.id,
        postId: postDetails?.id,
        text: commentRef?.current,
      };
      setSendCommentLoad(true);
      const res = await createComment(data);
      if (res.success) {
        inputRef.current?.clear();
        commentRef.current = "";
        setSendCommentLoad(false);
      } else {
        setSendCommentLoad(false);
        alert(res.msg);
      }
    } catch (error) {
      setSendCommentLoad(false);
      console.log(error);
    }
  };

  const onDeleteComment = async (commentId: number) => {
    try {
      let res = await deleteComment(commentId);
      if (res.success) {
        setPostDetails((prevPost) => {
          if (prevPost) {
            let updatedPost = { ...prevPost };
            updatedPost.comments = updatedPost.comments?.filter(
              (c) => c.id != commentId
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
          isUserComment={item?.userId == UserInfo?.id}
          onDeleteComment={() => onDeleteComment(item?.id)}
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
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboard}
          //   keyboardVerticalOffset={height - 1000}
        >
          <FlatList
            ref={flatListRef}
            data={postDetails?.comments ?? []}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            ListHeaderComponent={() => (
              <MemoizedPostView
                //@ts-ignore
                item={postDetails as PostData}
                isVisible={true}
                isCommentScreen={true}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: paddingBottom,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getPostDetails()}
                tintColor={DarkColors.primaryColor}
              />
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  backgroundColor: DarkColors?.backGround,
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
                  Platform.OS === "ios" ? insets.bottom - 5 : insets.bottom,
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
            />
            <Spacer gap={RFPercentage(0.5)} />
            {sendCommentLoad ? (
              <View style={styles.sendBtn}>
                <Loading size={"small"} />
              </View>
            ) : (
              <Pressable style={styles.sendBtn} onPress={onCommentUpload}>
                <SvgIcon
                  name={"send"}
                  size={30}
                  color={DarkColors.primaryColor}
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
    backgroundColor: DarkColors.backGround,
  },
  sendBtn: {
    backgroundColor: DarkColors.lightBg,
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
