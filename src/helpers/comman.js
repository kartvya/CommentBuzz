import { Dimensions } from "react-native";

const { width: devicesWidth, height: devicesHeight } = Dimensions.get("window")

export const hp = percentageValue => {
    return (percentageValue*devicesHeight)/100
}

export const wp = percentageValue => {
    return (percentageValue*devicesWidth)/100
}