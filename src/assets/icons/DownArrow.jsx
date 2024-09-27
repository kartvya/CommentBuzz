import * as React from "react";
import Svg, { Path } from "react-native-svg";

function DownArrow(props) {
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
        d="M17.71 11.29a1 1 0 00-1.42 0L13 14.59V7a1 1 0 00-2 0v7.59l-3.29-3.3a1 1 0 00-1.42 1.42l5 5a1 1 0 00.33.21.94.94 0 00.76 0 1 1 0 00.33-.21l5-5a1 1 0 000-1.42z"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
}

export default DownArrow;
