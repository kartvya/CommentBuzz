import * as React from "react";
import Svg, { Path } from "react-native-svg";

function UpArrow(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color="#000000"
      fill="none"
      {...props}
    >
      <Path
        d="M17.71 11.29l-5-5a1 1 0 00-.33-.21 1 1 0 00-.76 0 1 1 0 00-.33.21l-5 5a1 1 0 001.42 1.42L11 9.41V17a1 1 0 002 0V9.41l3.29 3.3a1 1 0 001.42 0 1 1 0 000-1.42z"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
}

export default UpArrow;
