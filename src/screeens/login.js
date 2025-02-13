import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView, 
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import { LoginScreen } from "../assets";
import res from "../components/responsive";
import { Colors } from "../utills/colors";
import { api, storage } from "../services";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import messaging from "@react-native-firebase/messaging";
import Loaders from "../components/Loader";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fcmID, setFCMID] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    get_Token();
  }, []);

  const get_Token = async () => {
    var fcm_token = await messaging().getToken();
    setFCMID(fcm_token);
  };

  const checkCred = async () => {
    setModal(true)
    try {
      let params = {
        user_name: email,
        user_password: password,
        fcmToken: fcmID
      };
      let loginResponse = await api.loginAPI(params);
      if (loginResponse?.user_id) {
        let storingValue = loginResponse
        storage.setSaveUserDate(storingValue);
        Toast.show("Access Permitted!", 4000)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "BottomStackNavigator" }],
          })
        );
      } else {
        Toast.show(loginResponse, 4000);
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: Colors.white }}
    >
      <View
        style={{
          height: res(200),
          width: "90%",
          marginVertical: res(30),
          alignSelf: "center",
          // paddingHorizontal: res(30),
        }}
      >
        <Image
          source={LoginScreen}
          style={{ height: "100%", width: "100%", resizeMode: "contain" }}
        />
      </View>
      <Text
        style={{
          color: "black",
          fontSize: res(20),
          alignSelf: "center",
          fontWeight: "bold",
        }}
      >
        Hi! Welcome Back
      </Text>
      <View style={{ paddingHorizontal: res(20), paddingTop: res(10) }}>
        <Text
          style={{
            color: "black",
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "300",
            fontWeight: "bold",
          }}
        >
          Email
        </Text>
        <View
          style={{
            borderRadius: res(8),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginVertical: res(5),
          }}
        >
          <TextInput
            placeholderTextColor={Colors.liteBlack}
            placeholder={"Enter Your Email"}
            value={email}
            onChangeText={(value) => setEmail(value)}
            autoFocus={true}
            cursorColor={"black"}
            style={{
              borderRadius: res(8),
              color: Colors.darkBlack,
              backgroundColor: Colors.white,
              fontSize: res(12),
              paddingHorizontal: res(20),
              // paddingVertical: res(20),
              flex: 1,
              // backgroundColor:"red"
            }}
          />
        </View>
        <Text
          style={{
            color: "black",
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "300",
            fontWeight: "bold",
          }}
        >
          Password
        </Text>
        <View
          style={{
            borderRadius: res(8),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginVertical: res(5),
          }}
        >
          <TextInput
            placeholderTextColor={Colors.liteBlack}
            placeholder={"Enter Your Password"}
            value={password}
            onChangeText={(value) => setPassword(value)}
            // autoFocus={true}
            cursorColor={"black"}
            style={{
              borderRadius: res(8),
              color: Colors.darkBlack,
              backgroundColor: Colors.white,
              fontSize: res(12),
              paddingHorizontal: res(20),
              // paddingVertical: res(20),
              flex: 1,
              // backgroundColor:"red"
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => checkCred()}
        style={{
          backgroundColor: Colors.themeColor,
          marginHorizontal: res(30),
          borderRadius: res(8),
          marginVertical: res(20),
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: res(14),
            alignSelf: "center",
            fontWeight: "bold",
            padding: res(10),
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
      {/* <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: Colors.darkBlack,
            fontSize: res(12),
            alignSelf: "center",
            fontWeight: "normal",
            // padding: res(10),
          }}
        >
          Don't have an account?{"\t"}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text
            style={{
              color: Colors.textHeadColor,
              fontSize: res(14),
              alignSelf: "center",
              fontWeight: "500",
              // padding: res(10),
            }}
          >
            {" "}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View> */}
      {modal === true ?
        <Modal >
          <Loaders />
        </Modal> : null}

    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({});
