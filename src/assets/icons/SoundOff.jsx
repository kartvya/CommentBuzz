import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SoundOff(props) {
  return (
    <Svg
      width="800px"
      height="800px"
      viewBox="-0.5 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.94 17.72c2 1.78 4.45 3 5.61 2.61 2.1-.78 2.45-5 2.45-7.92 0-.81 0-1.73-.11-2.64M18.13 6.28a3 3 0 00-1.58-1.78c-1.23-.46-3.84 1-6 2.91h-1.6a4 4 0 00-4 4v2a4 4 0 002.36 3.65M22 2.42l-20 20"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SoundOff;
