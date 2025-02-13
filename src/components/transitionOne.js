import {
    CardStyleInterpolators,
    createStackNavigator,
  } from "@react-navigation/stack";
  
  export const horizontalAnimation = {
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 1],
              }),
            },
          ],
        },
      };
    },
  };
  
  export const verticalAnimation = {
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      };
    },
  };
  