import { Dimensions } from "react-native";
const { width: devicesWidth, height: devicesHeight } = Dimensions.get("window");

export const hp = (percentageValue: number) => {
  return (percentageValue * devicesHeight) / 100;
};

export const wp = (percentageValue: number) => {
  return (percentageValue * devicesWidth) / 100;
};
