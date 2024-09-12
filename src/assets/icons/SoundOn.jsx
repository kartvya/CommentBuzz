import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SoundOn(props) {
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
        d="M12.55 4.5c-1.23-.46-3.84 1-6 2.91h-1.6a4 4 0 00-4 4v2a4 4 0 004 4h1.6c2.11 1.94 4.72 3.37 6 2.92 2.1-.78 2.45-5 2.45-7.92s-.35-7.13-2.45-7.91zM20.66 6.72a8 8 0 010 11.31M18.54 15.95a5 5 0 000-7.07"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
}

export default SoundOn;
