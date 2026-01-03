import { RefObject } from "react";
import type { FlatList, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

export type IconType =
  | "Fontisto"
  | "MaterialIcons"
  | "EvilIcons"
  | "Feather"
  | "AntDesign"
  | "Zocial"
  | "SimpleLineIcon"
  | "Foundation"
  | "Ionicons"
  | "MaterialCommunityIcons"
  | "Entypo"
  | "FontAwesome"
  | "FontAwesome5"
  | "Octicons";

export type IconProps = {
  type: IconType;
  name: String;
  size?: Number;
  color?: String;
  style?: ViewStyle;
  onPress?: () => void;
};

export interface CommentsData {
  _id: string;
  post: string;
  user: {
    _id: string;
    username: string;
    profilePic: string;
  };
  text: string;
  parentComment: string | null;
  upvotes: any[];
  downvotes: any[];
  buzzCoins: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PostData {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePic: string;
  };
  description: string;
  media: string[];
  upvotes: any[];
  downvotes: any[];
  views: number;
  buzzCoinsEarned: number;
  comments: any[];
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  __v: number;
}

export interface CommentsPostData {
  success: boolean;
  post: PostData;
  comments: CommentsData[];
}

export type Connection = {
  photo: string;
  name: string;
};

export type ScrollPair = {
  list: RefObject<FlatList>;
  position: SharedValue<number>;
};

export type HeaderConfig = {
  heightExpanded: number;
  heightCollapsed: number;
};

