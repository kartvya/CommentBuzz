import * as React from "react";
import Svg, { Path } from "react-native-svg";

function RightArrow(props) {
  return (
    <Svg
      fill="none"
      height={48}
      viewBox="0 0 48 48"
      width={48}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 0h48v48H0z" fill="#fff" fillOpacity={0.01} />
      <Path
        d="M19 12l12 12-12 12"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
      />
    </Svg>
  );
}

export default RightArrow;
