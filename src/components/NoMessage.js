import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import res from './responsive';
import { NoInterNet, NoMessageAvail } from '../assets';
import LottieView from 'lottie-react-native';
import { Colors } from '../utills/colors';

const NoMessage = (props) => {
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
                source={NoMessageAvail}
                autoPlay
                loop
                style={{
                    width: "100%",
                    height: "70%",
                }}
            />

            <Text
                style={{
                    color: "#000",
                    fontFamily: "Poppins-Bold",
                    fontSize: res(20),
                }}
            >
                Start Messaging!
            </Text>
        </View>
    );
};

export default NoMessage


const styles = StyleSheet.create({})
