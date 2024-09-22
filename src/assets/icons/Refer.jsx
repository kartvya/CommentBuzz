import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Refer(props) {
  return (
    <Svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
        d="M12 9a3 3 0 110-6 3 3 0 010 6zM5.5 21a3 3 0 110-6 3 3 0 010 6zM18.5 21a3 3 0 110-6 3 3 0 010 6z"
      />
      <Path
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
        opacity={0.5}
        d="M20 13a7.98 7.98 0 00-2.708-6M4 13a7.98 7.98 0 012.708-6M10 20.748c.64.165 1.31.252 2 .252s1.36-.087 2-.252"
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default Refer
