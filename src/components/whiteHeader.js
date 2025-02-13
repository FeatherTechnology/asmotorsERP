import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { GoodMorningImage, backIcon } from "../assets";
import Icon from "react-native-vector-icons/FontAwesome";
import res from "./responsive";
import { Colors } from "../utills/colors";
import { useNavigation } from "@react-navigation/native";

const WhiteHeader = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "row", backgroundColor: Colors.white }}>
        <View
          style={{ height: res(50), width: "50%", alignSelf: "flex-start" }}
        >
          <View style={{ position: "absolute", flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                padding: res(10),
                marginVertical: res(6),
                marginHorizontal: res(10),
                borderRadius: res(100),
              }}
            >
              <Image
                source={backIcon}
                style={{ height: res(14), width: res(14) }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(16),
                alignSelf: "center",
                fontWeight: "500",
                // padding: res(10),
              }}
            >
              {props?.name}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.border,
          height: res(1),
          width: "100%",
          marginBottom:res(10)
        }}
      />
    </View>
  );
};

export default WhiteHeader;

const styles = StyleSheet.create({
  plashImg: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
});
