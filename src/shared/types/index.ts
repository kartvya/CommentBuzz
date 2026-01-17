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

/**
 * NOTE: Domain-specific types (PostData, CommentsData, CommentsPostData) 
 * have been moved to their respective domain modules.
 * Import them from:
 * - PostData: @/src/modules/post
 * - CommentsData, CommentsPostData: @/src/modules/comment
 * 
 * This file now only contains truly shared/generic types.
 */

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

