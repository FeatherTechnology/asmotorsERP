import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import { useIsFocused } from '@react-navigation/native';
import { api, storage } from '../services';
import Toast from "react-native-simple-toast";
import Loaders from "../components/Loader";
import moment from 'moment';
import { Image } from 'react-native-reanimated/lib/typescript/Animated';
import { Colors } from '../utills/colors';
import res from '../components/responsive';
import STabView from '../components/ATabView';

const DailyPerformance = ({ route, navigation }) => {
    const [modal, setModal] = useState(false);
    const isFocused = useIsFocused();
    const [getLoginDate, setLoginData] = useState();
    const [storeDailyPerformance, setStoreDailyPerformance] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Today");
    const fetchLocalData = async () => {
        let res = await storage.getSaveUserDate();
        setLoginData(res);
    };

    useEffect(() => {
        fetchLocalData();
    }, []);

    useEffect(() => {
        if (getLoginDate?.staff_id !== undefined && isFocused === true) {
            setModal(true);
            dailyPerformanceGetAllList();
        }
    }, [getLoginDate, isFocused, selectedTab]);

    const dailyPerformanceGetAllList = async () => {
        // const yesterday = moment(new Date()).add(-1, 'days');

        try {
            let response = await api.getAllDailyPerformance(
                // selectedTab ==="Today"?moment(new Date()).format("YYYY-MM-DD"):yesterday.format("YYYY-MM-DD"),
                moment(new Date()).format("YYYY-MM-DD"),
                getLoginDate?.staff_id?.toString(),
            );
            if (response) {
                setStoreDailyPerformance(response);
            } else {
                setModal(false);
            }
            setModal(false);
        } catch (error) {
            Toast.show(error, 4000);
            setModal(false);
        }
    };

    const renderDailyPerformance = ({ item, index }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: Colors.white,
                    borderRadius: res(12),
                    padding: res(10),
                    marginVertical: res(5),
                }}
            >
                <View style={{ paddingHorizontal: res(10), flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>
                        <Text
                            style={{
                                color: Colors.darkBlack,
                                fontSize: res(14),
                                alignSelf: "flex-start",
                                fontWeight: "700",
                            }}>
                            {item?.assertion}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("EditDailyPerformance", {
                                    routeData: item,
                                    getLoginDate: getLoginDate,
                                    status: (item?.manager_updated_status === 0 || item?.manager_updated_status === 2) ? "Edit" : "View"
                                });
                            }}
                            activeOpacity={0.5}
                            style={{
                                backgroundColor: Colors.pureLiteGreen,
                                borderRadius: res(100),
                                width: res(80),
                                marginVertical: res(2),
                            }}>
                            <Text
                                style={{
                                    color: Colors.leaveDarkGreen,
                                    fontSize: res(12),
                                    alignSelf: "center",
                                    fontWeight: "700",
                                    textAlign: "center",
                                    paddingVertical: res(4),
                                }}>
                                {(item?.manager_updated_status === 0 || item?.manager_updated_status === 2) ? "Edit" : "View"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={{
                            color: Colors.themeColor,
                            fontSize: res(12),
                            alignSelf: 'flex-start',
                            fontWeight: "700",
                            paddingVertical: res(4),
                        }}
                    >
                        {item?.system_date !== "" && item?.system_date !== null
                            ? moment(item?.system_date).format("DD-MM-YYYY")
                            : ""}
                    </Text>

                    <Text
                        style={{
                            color: Colors.liteBlack,
                            fontSize: res(10),
                            alignSelf: 'flex-start',
                        }}
                        numberOfLines={1}
                    >
                        {"Assertion Target: " + item?.target}
                    </Text>
                    <Text
                        style={{
                            color: Colors.liteBlack,
                            fontSize: res(10),
                            alignSelf: 'flex-start',
                        }}
                        numberOfLines={1}
                    >
                        {"Actual Achieve: " + item?.actual_achieve}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Header
                name={
                    route?.params?.page !== undefined
                        ? route?.params?.page : ""
                }
            />
            {/* <View style={{ marginHorizontal: res(15), marginVertical: res(5) }}>
                <STabView
                    data={["Today", 'Previous']}
                    viewHeight={45}
                    textSize={16}
                    tabMargin={5}
                    getCurrentTab={(tab) => {
                        setSelectedTab(tab)
                    }} />
            </View> */}
            <SafeAreaView style={{ flex: 1, marginHorizontal: res(5) }}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    data={
                        storeDailyPerformance
                    }
                    renderItem={renderDailyPerformance}
                    ListEmptyComponent={() => (
                        modal === false &&
                        <Text
                            style={{
                                alignSelf: 'center',
                                marginVertical: res(100),
                                fontSize: res(14),
                                color: Colors.DARK_GREY,
                                fontWeight: '500',
                            }}>
                            No lists Found!
                        </Text>
                    )}
                />
            </SafeAreaView>
            {modal === true ? (
                <Modal transparent={true} visible={modal}>
                    <Loaders />
                </Modal>
            ) : null}
        </View>
    )
}

export default DailyPerformance

const styles = StyleSheet.create({})