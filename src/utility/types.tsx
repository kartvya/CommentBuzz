import { RefObject } from "react";
import type { FlatList, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

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

export interface RouteData {
  key: string;
  title: string;
  type: string;
  name: string;
  path: any;
}

interface PostUser {
  id: string;
  image: string | null;
  name: string;
}

export interface PostData {
  body: string;
  created_at: string;
  files: string;
  id: number;
  user: PostUser;
  userId: string;
  postVotes: PostVotes[];
  upVoteCount: number;
}

export interface PostVotes {
  created_at: string;
  id: number;
  postId: number;
  userId: string;
  voteType: string;
}

export type Connection = {
  photo: string;
  name: string;
};

export type ScrollPair = {
  list: RefObject<FlatList>;
  position: Animated.SharedValue<number>;
};

export type HeaderConfig = {
  heightExpanded: number;
  heightCollapsed: number;
};
