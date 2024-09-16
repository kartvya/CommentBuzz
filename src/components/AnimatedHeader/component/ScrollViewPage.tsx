import React, { useState, useEffect, useCallback } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { HScrollView } from "react-native-head-tab-view";
import { PostData } from "@/src/utility/types";
import { fetchOnlyUserPost } from "@/src/services/postServices";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/Store";
import { Users } from "@/src/redux/reducers/AuthReducer";
import MemoizedPostView from "../../MemoizedPostView";

interface Props {
  index: number;
  refreshEnabled?: boolean;
  timecount?: number;
  tabLabel?: string;
  onPressItem?: () => void;
}

const defaultProps = {
  refreshEnabled: false,
  timecount: 2000,
};
let limit = 10;

const ScrollViewPage: React.FC<Props> = ({
  index,
  refreshEnabled = defaultProps.refreshEnabled,
  timecount = defaultProps.timecount,
}) => {
  const UserInfo = useSelector(
    (state: RootState) => state.root?.authReducer?.userInfo
  ) as Users;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState<Array<PostData>>([]);

  useEffect(() => {
    let mTimer: NodeJS.Timeout;

    if (isRefreshing) {
      mTimer = setTimeout(() => {
        setIsRefreshing(false);
      }, timecount);
    }

    return () => {
      if (mTimer) {
        clearTimeout(mTimer);
      }
    };
  }, [isRefreshing, timecount]);

  const onStartRefresh = useCallback(() => {
    setIsRefreshing(true);
  }, []);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    limit = limit + 10;
    const res = await fetchOnlyUserPost(limit, UserInfo?.id);
    if (res.success) {
      setPosts(res.data ?? []);
    }
  };

  const props = refreshEnabled
    ? {
        isRefreshing,
        onStartRefresh,
      }
    : {};

  return (
    <HScrollView index={index} {...props}>
      {posts.map((item, index) => (
        <MemoizedPostView item={item} />
      ))}
    </HScrollView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sectionTitle: {
    color: "#4D4D4D",
    fontSize: 15,
  },
  imageStyle: {
    width: "100%",
    height: 200,
  },
});

export default ScrollViewPage;
