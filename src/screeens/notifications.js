import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import res from "../components/responsive";
import { Colors } from "../utills/colors";
import Header from "../components/header";
import Toast from "react-native-simple-toast";
import { api, storage } from "../services";
import { NoNotification } from "../assets";
import LottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";
import Loaders from "../components/Loader";
import moment from "moment";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const Notifications = ({ navigation }) => {
  const [theNotificaitonList, setTheNotificationList] = useState([]);
  const [modal, setModal] = useState(false);
  const [getLoginDate, setLoginData] = useState({});
  const isFocused = useIsFocused();
  const [isManager, setIsManager] = useState("");

  useEffect(() => {
    fetchLocalData()
  }, []);

  useEffect(() => {
    if (getLoginDate !== null && isFocused === true) {
      getNotificiationList();
    }
  }, [getLoginDate, isFocused])


  const fetchLocalData = async () => {
    let res = await storage.getSaveUserDate();
    setLoginData(res);
  };

  const getNotificiationList = async () => {
    setModal(true)
    try {
      let loginResponse = await api.getAllMessaegList1(
        getLoginDate?.staff_id?.toString()
      );
      if (loginResponse) {
        if (loginResponse?.approvalLeaves?.length !== 0) {
          setIsManager("manager");
          // setTheNotificationList(loginResponse?.approvalLeaves?.filter((item) => item?.leave_status === 1||item?.leave_status === 2));
          setTheNotificationList([
            ...loginResponse?.requestedLeaves?.filter((item) => item?.leave_status === 1 || item?.leave_status === 0),
            ...loginResponse?.approvalLeaves,
          ]);
          setModal(false)
        } else {
          setIsManager("user")
          setTheNotificationList(loginResponse?.requestedLeaves?.filter((item) => item?.leave_status !== 0));
          setModal(false)
        }
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const renderDesigns = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate("DetailingList", { data: item, getLoginDate: getLoginDate, isManager: isManager })
        }}
        style={{
          flexDirection: "row",
          width: "100%",
          backgroundColor: item?.leave_status === 1 || item?.leave_status === 2 ? Colors.white : Colors.TAG_BG_COLOR,
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
              {item?.staff_name !== undefined
                ? item?.staff_name
                : "User"}
            </Text>

            <Text
              style={{
                color: Colors.themeColor,
                fontSize: res(12),
                alignSelf: "center",
                fontWeight: "700",
                paddingVertical: res(4),
              }}
            >
              {
                item?.reason === "Leave" ?
                  (item?.leave_date !== "" && item?.leave_date !== null
                    ? moment(item?.leave_date).format("DD-MM-YYYY")
                    : "") :
                  item?.reason === "Permission" ?
                    (item?.permission_date !== "" && item?.permission_date !== null
                      ? moment(item?.permission_date).format("DD-MM-YYYY")
                      : "") : (
                      item?.created_date !== "" && item?.created_date !== null
                        ? moment(item?.created_date).format("DD-MM-YYYY")
                        : ""
                    )}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(10),
                alignSelf: "center",
                // width: '50%'
              }}
              numberOfLines={1}
            >
              {item?.reason} {
                item?.leave_status === 0 ? (isManager === "manager" ? "applied!" : "applied by you!") :
                  item?.leave_status === 1 ? (isManager === "manager" ? " applied!" : "approved by " + getLoginDate?.managername) :
                    item?.leave_status === 2 ? (isManager === "manager" ? " applied!" : "rejected by " + getLoginDate?.managername) : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setModal(true);
    getNotificiationList();
    setTimeout(() => {
      setRefreshing(false);
      setModal(false);
    }, 1000); // Simulating a delay
  };

  return (
    <View style={{ flex: 1 }}>
      <Header name={"Nofications"} />
      <View style={{ marginHorizontal: res(10), flex: 1, marginVertical: res(10) }}>
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={theNotificaitonList}
          renderItem={renderDesigns}
          ListEmptyComponent={() =>
            modal === false &&
            <LottieView
              source={NoNotification}
              autoPlay
              loop
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height / 2,
                alignSelf: "center",
              }}
            />}

        />
      </View>
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
    </View>
  );
}

export default Notifications;

const styles = StyleSheet.create({
  plashImg: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  permission: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    borderRadius: res(12),
    borderColor: Colors.borderColor,
  },
});

