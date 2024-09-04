import React from "react";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Zocial from "@expo/vector-icons/Zocial";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcon from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { IconProps, IconType } from "../utility/types";

const getIcon = (type: IconType) => {
  switch (type) {
    case "Fontisto":
      return Fontisto;
    case "MaterialIcons":
      return MaterialIcons;
    case "EvilIcons":
      return EvilIcons;
    case "Feather":
      return Feather;
    case "AntDesign":
      return AntDesign;
    case "Zocial":
      return Zocial;
    case "SimpleLineIcon":
      return SimpleLineIcon;
    case "Foundation":
      return Foundation;
    case "Ionicons":
      return Ionicons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    case "Entypo":
      return Entypo;
    case "FontAwesome":
      return FontAwesome;
    case "FontAwesome5":
      return FontAwesome5;
    case "Octicons":
      return Octicons;
    default:
      return FontAwesome;
  }
};

export const MXicon: React.FC<IconProps> = ({ type, ...props }) => {
  const FontIcon: React.ComponentType<any> = getIcon(type);

  return <FontIcon {...props} />;
};
