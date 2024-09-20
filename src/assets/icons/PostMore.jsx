import * as React from "react";
import Svg, { Circle } from "react-native-svg";

function PostMore(props) {
  return (
    <Svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Circle
        cx={12}
        cy={6}
        r={1.5}
        fill="#080341"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
      <Circle
        cx={12}
        cy={12}
        r={1.5}
        fill="#080341"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
      <Circle
        cx={12}
        cy={18}
        r={1.5}
        fill="#080341"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
}

export default PostMore;
