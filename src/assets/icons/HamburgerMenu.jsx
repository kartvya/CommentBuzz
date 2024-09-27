import * as React from "react";
import Svg, { Path } from "react-native-svg";

function HamburgerMenu(props) {
  return (
    <Svg
      fill="#000"
      width="800px"
      height="800px"
      viewBox="0 0 24.75 24.75"
      xmlSpace="preserve"
      color="#000000"
      {...props}
    >
      <Path
        stroke="currentColor"
        strokeWidth={props.strokeWidth}
        fill="currentColor"
        d="M0 3.875a2 2 0 012-2h20.75a2 2 0 010 4H2a2 2 0 01-2-2zm22.75 6.5H2a2 2 0 000 4h20.75a2 2 0 000-4zm0 8.5H2a2 2 0 000 4h20.75a2 2 0 000-4z"
      />
    </Svg>
  );
}

export default HamburgerMenu;
