import type { ViewStyle } from "react-native";

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
}
