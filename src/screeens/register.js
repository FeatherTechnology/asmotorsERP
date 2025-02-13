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
import React, { useState } from "react";
import { LoginScreen } from "../assets";
import res from "../components/responsive";
import { Colors } from "../utills/colors";
import { api, storage } from "../services";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
import Loaders from "../components/Loader";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState(false);

  const createNewUser = async () => {
    setModal(true)
    try {
      let params = {
        fullname: name,
        emailid: email,
        user_name: email?.split("@")[0],
        user_password: password,
      };

      let loginResponse = await api.createAccount(params);
      if (loginResponse==="User account created.") {
        Toast.show("Acount created!", 4000);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }else{
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
          height: res(100),
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
        Create an account
      </Text>
      <Text
        style={{
          color: "black",
          fontSize: res(12),
          alignSelf: "center",
          fontWeight: "normal",
          marginVertical: res(4),
        }}
      >
        Connect with your friends today!
      </Text>
      <View style={{ padding: res(20) }}>
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
            placeholder={"Enter Your Full Name"}
            value={name}
            onChangeText={(value) => setName(value)}
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
            placeholder={"Enter Your Email ID"}
            value={email}
            onChangeText={(value) => setEmail(value)}
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
        {/* <View
          style={{
            borderRadius: res(8),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginVertical: res(5),
          }}
        >
          <TextInput
            placeholderTextColor={Colors.liteBlack}
            placeholder={"Enter Your User name"}
            value={mobileNumber}
            onChangeText={(value) => setMobileNumber(value)}
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
        </View> */}
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
        onPress={() => createNewUser()}
        style={{
          backgroundColor: Colors.themeColor,
          marginHorizontal: res(30),
          borderRadius: res(8),
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
          Create
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          paddingVertical: res(20),
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
          Already have an account?{"\t"}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.goBack();
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
            Login
          </Text>
        </TouchableOpacity>
      </View>
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({});
