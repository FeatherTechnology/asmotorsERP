import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import res from './responsive';
import { NoInterNet } from '../assets';
import LottieView from 'lottie-react-native';
import { Colors } from '../utills/colors';

const NoInternetFound = (props) => {
    return (
        <View
            style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                zIndex: -1,
            }}
        >
            <LottieView
                source={NoInterNet}
                autoPlay
                loop
                style={{
                    width: "100%",
                    height: "80%",
                }}
            />

            <Text
                style={{
                    color: "#000",
                    fontFamily: "Poppins-Bold",
                    fontSize: res(12),
                }}
            >
                No Internet
            </Text>
            <Text
                style={{
                    color: "#949494",
                    fontFamily: "Poppins-Regular",
                    fontSize: res(10),
                }}
            >
                Couldn’t connect to internet.
            </Text>
            <Text
                style={{
                    color: "#949494",
                    fontFamily: "Poppins-Regular",
                    fontSize: res(10),
                }}
            >
                Please check your network settings
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    //   backgroundColor: "red",
                    marginTop: res(20),
                }}
            >

            </View>
            <TouchableOpacity activeOpacity={.7}
                onPress={() => props?.setNetWork(!props?.network)}
                style={{
                    alignSelf: "center",
                    backgroundColor: Colors.skyBlue,
                    borderColor: Colors.themeColor,
                    borderWidth: 1,
                    borderRadius: 25,
                    // marginRight: res(15),
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        // paddingBottom: 6,
                        fontFamily: "Roboto-Regular",
                        color: Colors.themeColor,
                        margin: res(8),
                        marginHorizontal: res(25),
                    }}
                >
                    Retry
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default NoInternetFound


const styles = StyleSheet.create({})
