import { RootState } from "../redux/Store";
import { useSelector } from "react-redux"; // Don't forget to import this
import { useMemo } from "react";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// Selector to get the theme state from Redux
const useIsDarkMode = () => {
  return useSelector((state: RootState) => state.root?.authReducer?.isDarkMode);
};

export const Colors = {
  text: "#11181C",
  white: "#fff",
  black: "#000",
  tint: tintColorLight,
  icon: "#687076",
  tabIconDefault: "#687076",
  tabIconSelected: tintColorLight,
  primeColor: "#106CC8",
  red: "rgba(255,0,0,0.8)",
  upVoteRed: "#D1221E",
  upvoteBg: "#262C2F",
  downvote: "#5F56F7",
};
export const LightColors = {
  text: "#000",
  backGround: "#EDEDED",
  lightBg: "#E4E3E8",
  borderColor: "#DADADA",
  primaryColor: "#0BB2C5",
  votesBg: "#D9D3D0",
  icon: "#3D3A37",
  white: "black",
  invertedWhite: "white",
  chartColor: "#808080",
};

export const DarkColors = {
  text: "#fff",
  backGround: "#121212",
  lightBg: "#1B1A1E",
  borderColor: "#252528",
  primaryColor: "#F44D3A",
  votesBg: "#262C2F",
  icon: "#C2C5C8",
  white: "white",
  invertedWhite: "black",
  chartColor: "#d3d3d3",
};

// Create a function to handle dark mode
export const useThemeColors = () => {
  const isDarkMode = useIsDarkMode();
  const themeColors = useMemo(() => {
    //@ts-ignore
    return isDarkMode?.isDarkMode ? DarkColors : LightColors;
  }, [isDarkMode]);

  return themeColors;
};
