import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { GoodMorningImage, Plus, backIcon, shapeBack } from "../assets";
import Icon from "react-native-vector-icons/FontAwesome";
import res from "./responsive";
import { Colors } from "../utills/colors";
import { useNavigation } from "@react-navigation/native";

const Header = (props) => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: "row", backgroundColor: Colors.themeColor, width: '100%', justifyContent: 'space-between' }}>
      <View style={{ height: res(50), width: "70%" }}>
        <Image source={GoodMorningImage} style={styles.plashImg} />
        <View style={{ position: "absolute", flexDirection: "row", width: "100%" }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              if (props?.onPressLeft !== undefined) {
                props?.onPressLeft()
              } else {
                navigation.goBack();
              }
            }}
            style={{
              padding: res(10),
              marginVertical: res(6),
              marginLeft: res(10),
              borderRadius: res(100),
            }}
          >
            <Image
              source={shapeBack}
              style={{ height: res(14), width: res(14) }}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            {props?.imageName !== undefined ?
              <View
                style={{ height: res(40), width: res(40), borderRadius: res(100), alignSelf: 'center', backgroundColor: "red" }}>
                <Image
                  source={{
                    uri: props?.imageName
                  }}
                  style={{ alignSelf: 'center', height: res(40), width: res(40), borderRadius: res(100) }}
                />
              </View> : null}
            <Text
              style={{
                color: Colors.white,
                fontSize: res(16),
                alignSelf: "center",
                fontWeight: "bold",
                width: "80%",
                marginHorizontal: 10
              }}
              numberOfLines={1}
            >
              {props?.name}
            </Text>
          </View>


        </View>
      </View>
      {props?.onAddMembers !== undefined ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            // backgroundColor: Colors.white,
            borderRadius: 100,
            alignSelf: 'center',
            marginRight: res(10),
            // marginBottom: res(20),
            padding: res(6),
            // flex:1
          }}
          onPress={() => {
            props?.onAddMembers();
          }}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Image
              source={Plus}
              tintColor={Colors.white}
              style={{ height: res(15), width: res(15), padding: res(10) }}
            />
          </View>

        </TouchableOpacity> : null}
      {/* {props?.name === "Calendar" &&(props?.getLoginDate?.role==="1"||props?.getLoginDate?.role==="3")  ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            // backgroundColor: Colors.white,
            borderRadius: 100,
            alignSelf: 'center',
            marginRight: res(10),
            // marginBottom: res(20),
            padding: res(6),
            // flex:1
          }}
          onPress={() => {
            navigation.navigate("ToDoPage")
          }}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: res(14),
                alignSelf: "center",
                fontWeight: "bold",
                width: "80%",
                marginHorizontal: 10
              }}
              numberOfLines={1}
            >
              {"TODO"}
            </Text>
          </View>

        </TouchableOpacity> : null} */}
      {props?.name === "Todo List" ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            borderRadius: 100,
            alignSelf: 'center',
            marginRight: res(10),
            padding: res(6),
          }}
          onPress={() => {
            navigation.navigate("TodoCreation",{getLoginDate:props?.getLoginDate})
          }}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: res(14),
                alignSelf: "center",
                fontWeight: "bold",
                width: "80%",
                marginHorizontal: 10
              }}
              numberOfLines={1}
            >
              {"Create new"}
            </Text>
          </View>

        </TouchableOpacity> : null}

        {props?.identity === "assertHistory" ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            borderRadius: 100,
            alignSelf: 'center',
            marginRight: res(10),
            padding: res(6),
          }}
          onPress={() => {
            navigation.navigate("TargetHistory",{routeData:props?.routeData})
          }}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: res(14),
                alignSelf: "center",
                fontWeight: "bold",
                width: "80%",
                marginHorizontal: 10
              }}
              numberOfLines={1}
            >
              {"History"}
            </Text>
          </View>

        </TouchableOpacity>:null}

        {/* {props?.name === "Calendar" ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            borderRadius: 100,
            alignSelf: 'center',
            marginRight: res(10),
            padding: res(6),
          }}
          onPress={() => {
            navigation.navigate("CalendarHistroy",{routeData:props?.routeData})
          }}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: res(14),
                alignSelf: "center",
                fontWeight: "bold",
                // width: "80%",
                marginHorizontal: 10
              }}
              numberOfLines={1}
            >
              {"History"}
            </Text>
          </View>

        </TouchableOpacity>:null} */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  plashImg: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
});
