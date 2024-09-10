import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

function CloseEye(props) {
  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M2 2l20 20M6.713 6.723C3.665 8.795 2 12 2 12s3.636 7 10 7c2.05 0 3.817-.727 5.271-1.712M11 5.058A8.595 8.595 0 0112 5c6.364 0 10 7 10 7s-.692 1.332-2 2.833M14 14.236a3 3 0 01-4.13-4.348" />
      </G>
    </Svg>
  )
}

export default CloseEye
