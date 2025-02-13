import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import StackNav from './src/navigations/stackNav';
import { Colors } from './src/utills/colors';
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import NoInternetFound from './src/components/NoInterNet';
import axios from 'axios';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

function App() {
  const [network, setNetWork] = useState(false);


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }


  // useEffect(() => {
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       console.log('TOKEN:', token);
  //     },
  //     onNotification: function (notification) {
  //       console.log('NOTIFICATION:', notification);
  //     },
  //     onAction: function (notification) {
  //       console.log('ACTION:', notification.action);
  //       console.log('NOTIFICATION:', notification);
  //     },
  //     onRegistrationError: function (err) {
  //       console.error(err.message, err);
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //   });
  // }, []);

  useEffect(() => {
    analytics().setAnalyticsCollectionEnabled(true);
    crashlytics().setCrashlyticsCollectionEnabled(true);
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("remoteMessage", remoteMessage);

      try {
        PushNotification.localNotification({
          message: remoteMessage.notification.body,
          title: remoteMessage.notification.title,
          channelId: 1,
        });
      } catch (error) {
        console.error('Error displaying local notification:', error);
      }
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      const screenName = "Chat";
      if (screenName) {
        navigationRef.current.navigate(screenName);
      }
    });
    return unsubscribe;

  }, []);



  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        setNetWork(false);
        return config;
      },
      function (error) {
        setNetWork(false);
        if (error?.message == "Network Error") {
          setNetWork(true);
        }
        return Promise.reject(error);
      }
    );

    axios.interceptors?.response.use(
      function (response) {
        setNetWork(false);
        return response;
      },
      function (error) {
        if (error?.message == "Network Error") {
          setNetWork(true);
        }
        return Promise.reject(error);
      }
    );
  }, [network]);


  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();


  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar barStyle="light-content" />
      {network == false ?
        <StackNav /> :
        <NoInternetFound setNetWork={setNetWork} network={network} />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
