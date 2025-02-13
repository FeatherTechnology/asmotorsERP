import { PixelRatio, Dimensions } from "react-native";

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get("screen").height;
const deviceWidth = Dimensions.get("screen").width;

import { Platform } from "react-native";


const dimen = Dimensions.get("window");
export const isIphoneX = () => {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};

const res = (size) => {
  if (Platform.isPad) {
    return size * 1.7;
  }
  if (pixelRatio <= 2) {
    if (deviceWidth < 360) {
      return size * 0.75;
    }
    if (deviceHeight < 667) {
      return size;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    return size * 1.23;
  }
  if (pixelRatio >= 2 && pixelRatio < 3) {
    if (deviceWidth < 360) {
      return size * 0.95;
    }
    if (deviceHeight < 667) {
      return size;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    return size * 1.25;
  }
  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    if (deviceWidth <= 360) {
      return size;
    }
    if (deviceHeight < 667) {
      return size * 1.15;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }
    return size * 1.27;
  }
  if (pixelRatio >= 3.5) {
    if (deviceWidth <= 360) {
      return size;
    }
    if (deviceHeight < 667) {
      return size * 1.2;
    }
    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }
    return size * 1.4;
  }
  return size;
};

export default res;
