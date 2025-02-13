import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import { LoginScreen } from "../assets";
import res from "../components/responsive";
import { Colors } from "../utills/colors";

const ForgotPassword = ({ route, navigation }) => {
  const [email, setEmail] = useState("");
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
        Change your password
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
            placeholder={"Enter Your Email"}
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
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate("BottomStackNavigator");
        }}
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
    </ScrollView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
