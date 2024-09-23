import SvgIcon from "@/src/assets/icons";
import Header from "@/src/components/Header";
import Input from "@/src/components/Input";
import MemoizedCommentView from "@/src/components/MemoizedCommentView";
import MemoizedPostView from "@/src/components/MemoizedPostView";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Spacer from "@/src/components/Spacer";
import { TitleText } from "@/src/components/Text";
import { DarkColors } from "@/src/constants/Colors";
import { hp } from "@/src/helpers/comman";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Comments = () => {
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const paddingBottom = insets.bottom + 20;
  const [comments, setComments] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const data = {
    body: "Sup bitches ⚡",
    created_at: "2024-09-20T07:00:40.62507+00:00",
    files: "postImages/1726815638669.png",
    id: 5,
    postBuzz: 0.01,
    postVotes: [
      {
        created_at: "2024-09-22T18:09:39.083829+00:00",
        id: 121,
        postId: 5,
        userId: "bc96ef85-7aba-4d94-a2ab-d75679d3a20e",
        voteCount: 1,
        voteType: "upVote",
      },
      {
        created_at: "2024-09-20T13:29:46.252381+00:00",
        id: 108,
        postId: 5,
        userId: "56a5d3a4-22e3-4264-9a75-ff4a0703db5b",
        voteCount: -1,
        voteType: "downVote",
      },
      {
        created_at: "2024-09-22T17:03:09.121439+00:00",
        id: 115,
        postId: 5,
        userId: "81aa2f51-3a86-41e9-89e4-38d1d220fd56",
        voteCount: 0,
        voteType: "upVote",
      },
    ],
    user: {
      id: "e0b08bb6-fe46-4f1d-a385-3e1fb14dadd2",
      image: "profiles/1726480861736.png",
      name: "Weekdays",
    },
    userId: "e0b08bb6-fe46-4f1d-a385-3e1fb14dadd2",
    voteCount: 1,
  };

  return (
    <ScreenWrapper>
      <Header showBackIcon={true} />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={comments}
          ListHeaderComponent={() => (
            <MemoizedPostView
              item={data}
              isVisible={true}
              isCommentScreen={true}
            />
          )}
          keyExtractor={() => Math.random().toString()}
          renderItem={() => <MemoizedCommentView />}
          contentContainerStyle={{
            paddingBottom: paddingBottom,
          }}
        />
      </View>
      <View
        style={[
          styles.textInputConatiner,
          { bottom: Platform.OS === "ios" ? insets.bottom - 5 : insets.bottom },
        ]}
      >
        <Input
          inputRef={inputRef}
          placeholder="Add comment"
          containerStyle={{
            flex: 1,
          }}
        />
        <Spacer gap={RFPercentage(0.5)} />
        <Pressable style={styles.sendBtn}>
          <SvgIcon name={"send"} size={30} color={DarkColors.primaryColor} />
        </Pressable>
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
});
