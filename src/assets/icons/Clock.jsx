import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Clock(props) {
  return (
    <Svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M12 7v5l-1.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
}

export default Clock;
