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
import {
  useCreateComment,
  useGetComments,
  useDeleteComment,
} from "@/src/modules/comment/hooks";
import { CommentsData, CommentsPostData } from "@/src/modules/comment";
import { PostData } from "@/src/modules/post";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Comment } from "@/src/modules/comment";

const Comments = () => {
  const { postId } = useLocalSearchParams();
  const { createComment, isLoading: isCreatingComment } = useCreateComment();
  const { getComments, isLoading: isFetchingComments } = useGetComments();
  const { deleteComment } = useDeleteComment();

  const themeColors = useThemeColors();
  const commentRef = useRef<string>("");
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 20;
  const [refreshing, setRefreshing] = useState(false);
  const [postDetails, setPostDetails] = useState<CommentsPostData>();
  const startLoading = isFetchingComments;
  const sendCommentLoad = isCreatingComment;

  const UserInfo = useSelector(
    (state: RootState) => state.auth?.userInfo
  ) as UserInfo;

  useEffect(() => {
    if (postDetails?.comments?.length) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [postDetails?.comments?.length]);

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = useCallback(async () => {
    try {
      const res = await getComments({ postId: postId as string });
      
      if (res.success && res.post && res.comments !== undefined) {
        setPostDetails({
          success: res.success,
          post: {
            ...res.post,
            comments: res.comments.map((comment) => comment._id),
          } as PostData,
          comments: res.comments,
        });
        inputRef.current?.focus();
      }
    } catch (error) {
      console.log(error);
    }
  }, [getComments, postId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPostDetails();
    setRefreshing(false);
  }, [getPostDetails]);

  const onCommentUpload = useCallback(async () => {
    try {
      if (!commentRef.current) {
        return null;
      }
      if (!postDetails?.post?._id || !UserInfo) {
        return null;
      }
      let data = {
        postId: postDetails.post._id,
        description: commentRef.current,
      };
      const res = await createComment(data);
      if (res.success && res.comment) {
        inputRef.current?.clear();
        commentRef.current = "";
        
        // Construct a properly formatted comment object with user info
        const newComment: Comment = {
          _id: res.comment._id,
          post: res.comment.post,
          user: {
            _id: UserInfo._id,
            username: UserInfo.username,
            profilePic: UserInfo.profilePic,
          },
          text: res.comment.text,
          parentComment: res.comment.parentComment,
          upvotes: res.comment.upvotes || [],
          downvotes: res.comment.downvotes || [],
          buzzCoins: res.comment.buzzCoins || 0,
          createdAt: res.comment.createdAt,
          updatedAt: res.comment.updatedAt,
          __v: res.comment.__v || 0,
        };
        
        // Optimistically add the new comment to state
        setPostDetails((prevPost) => {
          if (!prevPost) return prevPost;
          
          const newCommentCount = (prevPost.post.commentCount || 0) + 1;
          const postNeedsUpdate = prevPost.post.commentCount !== newCommentCount;
          
          return {
            ...prevPost,
            comments: [newComment, ...prevPost.comments],
            post: postNeedsUpdate ? {
              ...prevPost.post,
              commentCount: newCommentCount,
              comments: [newComment._id, ...(prevPost.post.comments || [])],
            } : prevPost.post,
          };
        });
        
        // Scroll to top to show the new comment
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  }, [createComment, postDetails?.post?._id, UserInfo]);

  const onDeleteComment = useCallback(async (commentId: string) => {
    try {
      let res = await deleteComment(commentId);
      if (res.success) {
        setPostDetails((prevPost) => {
          if (!prevPost) return prevPost;
          
          const filteredComments = prevPost.comments?.filter(
            (c) => c._id != commentId
          );
          const newCommentCount = Math.max(0, (prevPost.post.commentCount || 0) - 1);
          const postNeedsUpdate = prevPost.post.commentCount !== newCommentCount;
          
          return {
            ...prevPost,
            comments: filteredComments,
            post: postNeedsUpdate ? {
              ...prevPost.post,
              commentCount: newCommentCount,
            } : prevPost.post,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [deleteComment]);

  const handleDeleteComment = useCallback((commentId: string) => {
    onDeleteComment(commentId);
  }, [onDeleteComment]);

  const renderItem: ListRenderItem<CommentsData> = useCallback(
    ({ item }) => (
      <MemoizedCommentView
        item={item}
        isUserComment={item?.user?._id == UserInfo?._id}
        postId={postId as string}
        onDeleteComment={() => handleDeleteComment(item?._id)}
      />
    ),
    [UserInfo?._id, postId, handleDeleteComment]
  );

  // Memoize the ListHeaderComponent to prevent MemoizedPostView from re-rendering
  const listHeaderComponent = useMemo(() => {
    if (!postDetails?.post) return null;
    
    return (
      <MemoizedPostView
        //@ts-ignore
        item={postDetails.post}
        isVisible={true}
        isCommentScreen={true}
      />
    );
  }, [postDetails?.post?._id, postDetails?.post?.commentCount]);

  const listEmptyComponent = useMemo(() => (
    <View
      style={{
        backgroundColor: themeColors?.backGround,
        marginVertical: RFPercentage(2),
        alignItems: "center",
      }}
    >
      <TitleText>No comments yet...</TitleText>
    </View>
  ), [themeColors?.backGround]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={themeColors.primaryColor}
    />
  ), [refreshing, onRefresh, themeColors.primaryColor]);

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
            ListHeaderComponent={listHeaderComponent}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: paddingBottom,
            }}
            refreshControl={refreshControl}
            ListEmptyComponent={listEmptyComponent}
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
