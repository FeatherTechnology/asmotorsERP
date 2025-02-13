/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS == 'ios',
});

PushNotification.createChannel(
{
  channelId: "1", // (required)
  channelName: "ASMotors", // (required)
  channelDescription: "Indimate the updates", // (optional) default: undefined.
  playSound: false, // (optional) default: true
  soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
},
(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

const headlessCheck = ({ isHeadless }) => {
    if (isHeadless) {
      return null
    }
    return <App/>
  }
  
  AppRegistry.registerComponent(appName, () => headlessCheck);