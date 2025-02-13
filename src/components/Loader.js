import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import res from './responsive';
import { Loader, NoInterNet, NoMessageAvail } from '../assets';
import LottieView from 'lottie-react-native';
import { Colors } from '../utills/colors';

const Loaders = (props) => {
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
                source={Loader}
                autoPlay
                loop
                style={{
                    width: res(40),
                    height:  res(40),
                }}
            />
        </View>
    );
};

export default Loaders


const styles = StyleSheet.create({})
