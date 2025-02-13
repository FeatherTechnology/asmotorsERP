import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import {splashImage} from '../assets/index';
import { Colors } from "../utills/colors";
import { SplashScreen } from "../assets";
import LottieView from "lottie-react-native";
import { CommonActions } from "@react-navigation/native";
import { api, storage } from "../services";
import { ASMotorsContext } from "../navigations/context";

const Splash = ({ navigation }) => {
  const { setNotificaitonCount, setNotificaitonCountPersonal, setNotificaitonCountTeam } = useContext(ASMotorsContext);

  useEffect(() => {
    setTimeout(() => {
      fetchLocalData();
    }, 2000);
  }, []);

  async function fetchLocalData() {
    let res = await storage.getSaveUserDate();
    if (res) {
      let loginResponse = await api.getCounts(res?.user_id);
      let loginResponse1 = await api.getTeamMessagesCount(res?.user_id);
      setNotificaitonCountPersonal(loginResponse?.length);
      setNotificaitonCountTeam(loginResponse1?.length);
      setNotificaitonCount(loginResponse?.length + loginResponse1?.length)
      fetchLocalDataRoute(res);
    } else {
      fetchLocalDataRoute(res);
    }
  }

  const fetchLocalDataRoute = async (res) => {
    try {
      if (res) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: "BottomStackNavigator"
            }],
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
    } catch (error) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    }
  }

  return (
    <View style={styles.splashBg}>
      <LottieView
        source={SplashScreen}
        autoPlay
        loop
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splashBg: {
    flex: 1,
    backgroundColor: Colors.white,
    resizeMode: "contain",
  },
  splashImg: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
});
