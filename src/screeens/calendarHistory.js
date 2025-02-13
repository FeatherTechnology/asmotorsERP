import { FlatList, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import Loaders from '../components/Loader'
import { api, storage } from '../services';
import Toast from "react-native-simple-toast";
import res from '../components/responsive';
import { Colors } from '../utills/colors';

const CalendarHistroy = ({route,navigation}) => {
  console.log("route",route?.params?.routeData);
  const [modal, setModal] = useState(false);
  const [getLoginDate, setLoginData] = useState();
  const [storeDailyPerformance, setStoreDailyPerformance] = useState([]);
  const fetchLocalData = async () => {
    let res = await storage.getSaveUserDate();
    setLoginData(res);
  };

  useEffect(() => {
    fetchLocalData();
  }, []);

  useEffect(() => {
    if (getLoginDate?.staff_id !== undefined ) {
      setModal(true);
      dailyPerformanceGetAllList();
    }
  }, [getLoginDate]);

  const dailyPerformanceGetAllList = async () => {
    console.log("route?.params?.routeData",route?.params?.routeData);
    try {
      let response = await api.getHistoryOfCalender(
        route?.params?.routeData?.refernceid,
        getLoginDate?.staff_id?.toString()
      );
      if (response) {
        setStoreDailyPerformance(response);
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
            }}
          >
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
              }}
            >
              {item?.worktitle}
            </Text>
           
          </View>

          <Text
            style={{
              color: Colors.themeColor,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "700",
              paddingVertical: res(4),
            }}
          >
            {item?.fromdate !== "" && item?.fromdate !== null
              ? moment(item?.fromdate).format("DD-MM-YYYY")
              : ""} - {""}
            {item?.todate !== "" && item?.todate !== null
              ? moment(item?.todate).format("DD-MM-YYYY")
              : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Header name={"Calendar History"} />
      <SafeAreaView style={{ flex: 1, marginHorizontal: res(5) }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={storeDailyPerformance}
          renderItem={renderDailyPerformance}
          ListEmptyComponent={() =>
            modal === false && (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: res(100),
                  fontSize: res(14),
                  color: Colors.DARK_GREY,
                  fontWeight: "500",
                }}
              >
                No lists Found!
              </Text>
            )
          }
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

export default CalendarHistroy

const styles = StyleSheet.create({})