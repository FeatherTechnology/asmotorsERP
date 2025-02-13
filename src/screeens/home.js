import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  GoodMorningImage,
  IconNotifications,
  blueCalendar,
  greenLetter,
  logoutIcon,
  orengeLetter,
} from "../assets";
import res from "../components/responsive";
import { Colors } from "../utills/colors";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { api, storage } from "../services";
import Toast from "react-native-simple-toast";
import Loaders from "../components/Loader";
import moment from "moment";
import { PERMISSIONS, RESULTS, check, request, requestMultiple } from "react-native-permissions";

const Home = ({ navigation }) => {
  const [getLoginDate, setLoginData] = useState();
  const [countDate, setCountDate] = useState();
  const [listOfAttende, setListOfAttende] = useState([]);
  const [getManagerDataList, setGetManagerDataList] = useState();
  const [getManagerDataCount, setGetManagerDataCount] = useState();
  const [modal, setModal] = useState(false);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  let greetingText = "Hello"; // Default greeting

  if (currentHour >= 5 && currentHour < 12) {
    greetingText = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingText = "Good afternoon";
  } else if (currentHour >= 17) {
    greetingText = "Good evening";
  }

  const fetchLocalData = async () => {
    let res = await storage.getSaveUserDate();
    setLoginData(res);
  };

  useEffect(() => {
    requestPermissions();
    fetchLocalData();
  }, []);

  const requestPermissions = async () => {
    try {
      const notificationPermission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS
          : PERMISSIONS.IOS.NOTIFICATIONS;

      // const photoPermission =
      //   Platform.OS === 'android'
      //     ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION
      //     : PERMISSIONS.IOS.PHOTO_LIBRARY;

      // const videoPermission =
      //   Platform.OS === 'android'
      //     ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      //     : PERMISSIONS.IOS.MEDIA_LIBRARY;

      const permissionsToRequest = [notificationPermission];

      const status = await requestMultiple(permissionsToRequest);

      if (
        status[notificationPermission] !== RESULTS.GRANTED
        // status[photoPermission] !== RESULTS.GRANTED ||
        // status[videoPermission] !== RESULTS.GRANTED
      ) {
        Alert.alert(
          "Permissions Required",
          "To use all features of this app, please grant the necessary permissions in your device settings.",
          [
            {
              text: "OK",
              onPress: async () => {
                Linking.openSettings();
              },
            },
            {
              text: "Later",
            },
          ],
          { cancelable: true }
        );


      }
    } catch (err) {
      console.log('requestPermissions error: ', err);
    }
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    if (getLoginDate?.staff_id !== undefined && isFocused === true) {
      setModal(true);
      attendanceCount();
    }
  }, [getLoginDate, isFocused]);

  const attendanceCount = async () => {
    try {
      let loginResponse = await api.getAllMessaegList(
        getLoginDate?.staff_id?.toString(),
        getLoginDate?.role
      );
      if (loginResponse) {
        setCountDate(loginResponse?.requestedCount[0]);
        setListOfAttende(
          loginResponse?.requestedLeaves !== null
            ? loginResponse?.requestedLeaves
            : []
        );
        setGetManagerDataList(
          loginResponse?.approvalLeaves !== null
            ? loginResponse?.approvalLeaves
            : []
        );
        setGetManagerDataCount(
          loginResponse?.approvalCount !== null
            ? loginResponse?.approvalCount
            : []
        );
      } else {
        setModal(false);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  //Approve or Reject
  const attendanceApprove = async (id, leaveStatus, reason, item) => {
    setModal(true);
    try {
      let params = {
        id: JSON.parse(id),
        leaveStatus: leaveStatus,
        rejectReason: reason,
        responsible_Staff: item?.responsible_staff_name !== undefined ? item?.responsible_staff_name : "",
      };
      let loginResponse = await api.approveLeave(params);
      if (loginResponse) {
        Toast.show("Updated Successfully!", 4000);
        setListOfAttende(
          listOfAttende?.filter((item) => item?.permission_on_duty_id !== id)
        );
        attendanceCount();
        setShowModal(false);
        setShowModalData({});
        setRejectReason("");
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  const [showModalData, setShowModal] = useState(false);
  const [showModalDatas, setShowModalData] = useState({});
  const [rejectReason, setRejectReason] = useState("");

  function showModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModalData}
        onRequestClose={() => {
          setShowModal(!showModalData);
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 20,
              borderRadius: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[styles.name, { alignSelf: "center" }]}>
                {"Reason for rejection!"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setShowModal(false);
                  setShowModalData({});
                }}
              >
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s",
                  }}
                  style={{ height: res(20), width: res(20) }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderRadius: res(8),
                borderWidth: res(1),
                borderColor: Colors.border,
                marginVertical: res(5),
                height: res(100),
              }}
            >
              <TextInput
                placeholderTextColor={Colors.liteBlack}
                placeholder={"Reason!"}
                value={rejectReason}
                onChangeText={(value) => setRejectReason(value)}
                autoFocus={true}
                cursorColor={"black"}
                multiline={true}
                style={{
                  borderRadius: res(8),
                  color: Colors.darkBlack,
                  backgroundColor: Colors.white,
                  fontSize: res(12),
                  paddingHorizontal: res(20),
                }}
              />
            </View>

            <TouchableOpacity
              disabled={rejectReason !== "" ? false : true}
              style={{
                borderColor:
                  rejectReason !== "" ? Colors.pinkTextCancel : Colors.white,
                borderRadius: res(100),
                marginVertical: res(10),
                backgroundColor:
                  rejectReason !== "" ? Colors.white : Colors.liteGreyShade,
                borderWidth: 1,
              }}
              onPress={() => {
                Keyboard.dismiss();
                attendanceApprove(
                  showModalDatas?.permission_on_duty_id,
                  2,
                  rejectReason,
                  showModalDatas
                );
              }}
            >
              <Text
                style={{
                  color:
                    rejectReason !== ""
                      ? Colors.pinkTextCancel
                      : Colors.liteBlack,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  textAlign: "center",
                  paddingVertical: res(8),
                  paddingHorizontal: res(12),
                }}
              >
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const renderDesigns = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate("DetailingList", {
            data: item,
            getLoginDate: getLoginDate,
            isManager: "user",
          });
        }}
        style={{
          flexDirection: "row",
          width: "100%",
          backgroundColor: Colors.white,
          borderRadius: res(12),
          padding: res(10),
          marginVertical: res(5),
        }}
      >
        <View
          style={{ height: res(60), width: res(60), alignSelf: "flex-start" }}
        >
          <Image
            source={{
              uri: "https://w7.pngwing.com/pngs/24/958/png-transparent-cartoon-animation-happy-face-child-face-hand.png",
            }}
            style={styles.permission}
          />
        </View>
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
              {getLoginDate?.staff_name !== undefined
                ? getLoginDate?.staff_name
                : "User"}
            </Text>
            {item?.leave_status === 0 ? (
              <View
                style={{
                  backgroundColor: Colors.sandelColor,
                  borderRadius: res(100),
                  width: res(80),
                }}
              >
                <Text
                  style={{
                    color: Colors.orengeTextPending,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(4),
                  }}
                >
                  In-Progress
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              // marginVertical:res(1)
            }}
          >
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
                  ((item?.leave_date !== "" && item?.leave_date !== null
                    ? moment(item?.leave_date).format("DD-MM-YYYY")
                    : "") + " - ") + (item?.leave_to_date !== "" && item?.leave_to_date !== null
                      ? moment(item?.leave_to_date).format("DD-MM-YYYY")
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
            {item?.leave_status === 1 ? (
              <View
                style={{
                  backgroundColor: Colors.pureLiteGreen,
                  // borderColor:Colors.pinkTextCancel,
                  // borderWidth:res(1),
                  borderRadius: res(100),
                  width: res(80),
                  marginVertical: res(2),
                }}
              >
                <Text
                  style={{
                    color: Colors.leaveDarkGreen,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(4),
                  }}
                >
                  Approved
                </Text>
              </View>
            ) : null}
            {item?.leave_status === 2 ? (
              <View
                style={{
                  backgroundColor: Colors.pinkTextCancel,
                  // borderColor:Colors.pinkTextCancel,
                  // borderWidth:res(1),
                  borderRadius: res(100),
                  width: res(80),
                  marginVertical: res(2),
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(4),
                  }}
                >
                  Rejected
                </Text>
              </View>
            ) : null}
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
                fontSize: res(12),
                alignSelf: "center",
                width: "50%",
              }}
              numberOfLines={1}
            >
              {item?.reason}
            </Text>
            {item?.leave_status === 0 ? (
              <TouchableOpacity
                onPress={() =>
                  attendanceApprove(item?.permission_on_duty_id, 3, "", item)
                }
                activeOpacity={0.5}
                style={{
                  backgroundColor: Colors.white,
                  borderColor: Colors.pinkTextCancel,
                  borderWidth: res(1),
                  borderRadius: res(100),
                  width: res(80),
                }}
              >
                <Text
                  style={{
                    color: Colors.pinkTextCancel,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(4),
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(10),
              alignSelf: "flex-start",
              flex: 1,
              marginTop: res(2),
            }}
            numberOfLines={1}
          >
            {item?.reason === "On Duty"
              ? item?.on_duty_place
              : item?.leave_reason}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDesignsManager = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate("DetailingList", {
            data: item,
            getLoginDate: getLoginDate,
            isManager: "manager",
          });
        }}
        style={{
          flexDirection: "row",
          width: "100%",
          backgroundColor: Colors.white,
          borderRadius: res(12),
          padding: res(10),
          marginVertical: res(5),
        }}
      >
        <View
          style={{ height: res(60), width: res(60), alignSelf: "flex-start" }}
        >
          <Image
            source={{
              uri: "https://w7.pngwing.com/pngs/24/958/png-transparent-cartoon-animation-happy-face-child-face-hand.png",
            }}
            style={styles.permission}
          />
        </View>
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
              {item?.staff_name !== undefined ? item?.staff_name : "User"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                attendanceApprove(item?.permission_on_duty_id, 1, "", item)
              }
              activeOpacity={0.5}
              style={{
                backgroundColor: Colors.pureLiteGreen,
                // borderColor:Colors.pinkTextCancel,
                // borderWidth:res(1),
                borderRadius: res(100),
                width: res(80),
                marginVertical: res(2),
              }}
            >
              <Text
                style={{
                  color: Colors.leaveDarkGreen,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  textAlign: "center",
                  paddingVertical: res(4),
                }}
              >
                Approve
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              // marginVertical:res(1)
            }}
          >
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
                  ((item?.leave_date !== "" && item?.leave_date !== null
                    ? moment(item?.leave_date).format("DD-MM-YYYY")
                    : "") + " - ") + (item?.leave_to_date !== "" && item?.leave_to_date !== null
                      ? moment(item?.leave_to_date).format("DD-MM-YYYY")
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
                width: "50%",
              }}
              numberOfLines={1}
            >
              {item?.reason}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowModalData(item);
                setShowModal(true);
              }}
              activeOpacity={0.5}
              style={{
                backgroundColor: Colors.white,
                borderColor: Colors.pinkTextCancel,
                borderWidth: res(1),
                borderRadius: res(100),
                width: res(80),
              }}
            >
              <Text
                style={{
                  color: Colors.pinkTextCancel,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  textAlign: "center",
                  paddingVertical: res(4),
                }}
              >
                Reject
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(10),
              alignSelf: "flex-start",
              flex: 1,
              marginTop: res(2),
            }}
            numberOfLines={1}
          >
            {item?.reason === "On Duty"
              ? item?.on_duty_place
              : item?.leave_reason}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={{ height: res(130), width: "60%", alignSelf: "flex-start" }}>
        <Image source={GoodMorningImage} style={styles.plashImg} />
        <View style={{ position: "absolute", padding: res(12) }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: res(20),
              alignSelf: "flex-start",
              fontWeight: "bold",
              // padding: res(10),
            }}
          >
            {greetingText},{" "}
          </Text>
          <Text
            style={{
              color: Colors.white,
              fontSize: res(25),
              alignSelf: "flex-start",
              fontWeight: "bold",
              // padding: res(10),
            }}
            numberOfLines={1}
          >
            {getLoginDate?.fullname !== undefined
              ? getLoginDate?.fullname
              : "User"}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignSelf: "flex-end",
          position: "absolute",
          padding: res(20),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            Toast.show("Logged Out!", 4000);
            storage.clearAsyncStorageFromLocal();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            );
          }}
        >
          <Image
            source={logoutIcon}
            style={{
              height: res(25),
              width: res(25),
              // tintColor: Colors.themeColor,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ padding: res(15) }}>
        <Text
          style={{
            color: Colors.darkBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "700",
            marginTop: res(10),
            marginBottom:res(10)
          }}
        >
          Daily Entry
        </Text>
        <View
          style={{
            flexDirection: "row",
            
          }}
        >
          <View style={{marginRight:res(10)}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("DailyPerformance", {
                  page: "Daily Performance",
                  getLoginDate: getLoginDate,
                });
              }}
              style={{
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                // width: res(40),
              }}
            >
              <View
                style={{
                  marginHorizontal: res(15),
                  marginVertical: res(20),
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: Colors.approval_leave,
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={greenLetter}
                    tintColor={Colors.approval_leave_icon}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>

            </TouchableOpacity>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(12),
                alignSelf: "center",
                fontWeight: "700",
                marginVertical: res(10),
              }}
            >
              Performance
            </Text>
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("DailyTasksEntry", {
                  page: "Daily Tasks",
                  getLoginDate: getLoginDate,
                });
              }}
              style={{
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                // width: res(40),
              }}
            >
              <View
                style={{
                  marginHorizontal: res(15),
                  marginVertical: res(20),
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: Colors.approval_leave,
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={orengeLetter}
                    tintColor={Colors.approval_leave_icon}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>

            </TouchableOpacity>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(12),
                alignSelf: 'center',
                fontWeight: "700",
                marginVertical: res(10),
              }}
            >
              Tasks
            </Text>
          </View>
        </View>
      </View>
      {getLoginDate?.role === "1" || getLoginDate?.role === "3" ?
        <View style={{ padding: res(15) }}>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "700",
              marginVertical: res(10),
            }}
          >
            TODO Creations
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("ToDoPage")
              }}
              style={{
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                // width: res(40),
              }}
            >
              <View
                style={{
                  marginHorizontal: res(15),
                  marginVertical: res(20),
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    backgroundColor: Colors.blueCalendar,
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={blueCalendar}
                    tintColor={Colors.themeColor}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View> : null}
      {/* Choose Requests */}
      {getManagerDataCount !== undefined &&
        getManagerDataCount?.length !== 0 &&
        getManagerDataList !== undefined &&
        getManagerDataList?.length !== 0 ? (
        <View style={{ padding: res(15) }}>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "700",
              marginVertical: res(10),
            }}
          >
            Choose Approvals
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // paddingTop: res(10),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("AppliedListScreens", {
                  page: "Recent Approvals",
                  listOfAttende: getManagerDataList?.filter(
                    (item) => item?.reason === "Leave"
                  ),
                  getLoginDate: getLoginDate,
                });
              }}
              style={{
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                width: res(90),
              }}
            >
              <View
                style={{
                  marginTop: res(10),
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    // paddingHorizontal: res(8),
                    backgroundColor: Colors.approval_leave,
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={greenLetter}
                    tintColor={Colors.approval_leave_icon}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>
              <Text
                style={{
                  color: Colors.darkBlack,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingVertical: res(4),
                }}
              >
                Leave
              </Text>
              <Text
                style={{
                  color: Colors.leaveDarkGreen,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingBottom: res(10),
                  // paddingVertical: res(5),
                }}
              >
                {getManagerDataCount?.map((item, index) =>
                  item?.LeaveCount
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("AppliedListScreens", {
                  page: "Recent Approvals",
                  listOfAttende: getManagerDataList?.filter(
                    (item) => item?.reason === "Permission"
                  ),
                  getLoginDate: getLoginDate,
                });
              }}
              style={{
                marginRight:res(10),
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                width: res(90),
              }}
            >
              <View
                style={{
                  marginTop: res(10),
                  alignSelf: "center",
                  flexDirection: "column",
                  backgroundColor: Colors.permission_leave,
                  borderRadius: res(100),
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    // paddingHorizontal: res(8),
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={blueCalendar}
                    tintColor={Colors.permission_leave_icon}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>
              <Text
                style={{
                  color: Colors.darkBlack,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingVertical: res(4),
                }}
              >
                Permission
              </Text>
              <Text
                style={{
                  color: Colors.permissionDarkBlue,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingBottom: res(10),
                  // paddingVertical: res(5),
                }}
              >
                {getManagerDataCount?.map((item, index) =>
                  item?.PermissionCount
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate("AppliedListScreens", {
                  page: "Recent Approvals",
                  listOfAttende: getManagerDataList?.filter(
                    (item) => item?.reason === "On Duty"
                  ),
                  getLoginDate: getLoginDate,
                });
              }}
              style={{
                backgroundColor: Colors.white,
                borderRadius: res(12),
                elevation: 10,
                width: res(90),
              }}
            >
              <View
                style={{
                  marginTop: res(10),
                  alignSelf: "center",
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    // paddingHorizontal: res(8),
                    backgroundColor: Colors.od_leave,
                    borderRadius: res(100),
                    padding: res(10),
                  }}
                >
                  <Image
                    source={orengeLetter}
                    tintColor={Colors.od_leave_icon}
                    style={{ height: res(25), width: res(25) }}
                  />
                </View>
              </View>
              <Text
                style={{
                  color: Colors.darkBlack,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingVertical: res(4),
                }}
              >
                OD
              </Text>
              <Text
                style={{
                  color: Colors.odDarkOrenge,
                  fontSize: res(12),
                  // alignSelf: 'flex-start',
                  // padding: res(10),
                  alignSelf: "center",
                  fontWeight: "500",
                  paddingBottom: res(10),
                  // paddingVertical: res(5),
                }}
              >
                {getManagerDataCount?.map((item, index) =>
                  item?.OnDutyCount
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Recent Approvals Applications */}
      {getManagerDataList !== undefined && getManagerDataList?.length !== 0 ? (
        <View style={{ paddingHorizontal: res(15) }}>
          {getManagerDataList !== undefined &&
            getManagerDataList?.length !== 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: res(10),
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
                Recent Approvals Applications
              </Text>
              <Text
                onPress={() =>
                  navigation.navigate("AppliedListScreens", {
                    page: "Recent Approvals",
                    listOfAttende: getManagerDataList,
                    getLoginDate: getLoginDate,
                  })
                }
                style={{
                  color: Colors.themeColor,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                }}
              >
                See all
              </Text>
            </View>
          ) : null}
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              data={
                getManagerDataList?.length > 4
                  ? getManagerDataList?.slice(0, 3)
                  : getManagerDataList
              }
              renderItem={renderDesignsManager}
            />
          </SafeAreaView>
        </View>
      ) : null}
      {/* Choose Requests */}
      <View style={{ padding: res(15) }}>
        <Text
          style={{
            color: Colors.darkBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "700",
            marginVertical: res(10),
          }}
        >
          Choose Requests
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // paddingTop: res(10),
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate("LeaveRequest", {
                name: "Leave Request",
                getLoginDate: getLoginDate,
              });
            }}
            style={{
              backgroundColor: Colors.white,
              borderRadius: res(12),
              elevation: 10,
              width: res(90),
            }}
          >
            <View
              style={{
                marginTop: res(10),
                alignSelf: "center",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  // paddingHorizontal: res(8),
                  backgroundColor: Colors.leaveGreen,
                  borderRadius: res(100),
                  padding: res(10),
                }}
              >
                <Image
                  source={greenLetter}
                  style={{ height: res(25), width: res(25) }}
                />
              </View>
            </View>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingVertical: res(4),
              }}
            >
              Leave
            </Text>
            <Text
              style={{
                color: Colors.leaveDarkGreen,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingBottom: res(10),
                // paddingVertical: res(5),
              }}
            >
              {/* {countDate?.leaveCount} */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate("LeaveRequest", {
                name: "Permission Request",
                getLoginDate: getLoginDate,
              });
            }}
            style={{
              backgroundColor: Colors.white,
              borderRadius: res(12),
              elevation: 10,
              width: res(90),
            }}
          >
            <View
              style={{
                marginTop: res(10),
                alignSelf: "center",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  // paddingHorizontal: res(8),
                  backgroundColor: Colors.permission,
                  borderRadius: res(100),
                  padding: res(10),
                }}
              >
                <Image
                  source={blueCalendar}
                  style={{ height: res(25), width: res(25) }}
                />
              </View>
            </View>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingVertical: res(4),
              }}
            >
              Permission
            </Text>
            <Text
              style={{
                color: Colors.permissionDarkBlue,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingBottom: res(10),
                // paddingVertical: res(5),
              }}
            >
              {/* {countDate?.permissionCount} */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate("LeaveRequest", {
                name: "OD Request",
                getLoginDate: getLoginDate,
              });
            }}
            style={{
              backgroundColor: Colors.white,
              borderRadius: res(12),
              elevation: 10,
              width: res(90),
            }}
          >
            <View
              style={{
                marginTop: res(10),
                alignSelf: "center",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  // paddingHorizontal: res(8),
                  backgroundColor: Colors.odOrenge,
                  borderRadius: res(100),
                  padding: res(10),
                }}
              >
                <Image
                  source={orengeLetter}
                  style={{ height: res(25), width: res(25) }}
                />
              </View>
            </View>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingVertical: res(4),
              }}
            >
              OD
            </Text>
            <Text
              style={{
                color: Colors.odDarkOrenge,
                fontSize: res(12),
                // alignSelf: 'flex-start',
                // padding: res(10),
                alignSelf: "center",
                fontWeight: "500",
                paddingBottom: res(10),
                // paddingVertical: res(5),
              }}
            >
              {/* {countDate?.onDutyCount} */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recently Requested */}
      <View style={{ paddingHorizontal: res(15) }}>
        {listOfAttende !== undefined && listOfAttende?.length !== 0 ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: res(10),
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
              Recently Requested
            </Text>
            <Text
              onPress={() =>
                navigation.navigate("AppliedListScreens", {
                  listOfAttende: listOfAttende,
                  getLoginDate: getLoginDate,
                })
              }
              style={{
                color: Colors.themeColor,
                fontSize: res(12),
                alignSelf: "center",
                fontWeight: "700",
              }}
            >
              See all
            </Text>
          </View>
        ) : null}

        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          data={
            listOfAttende?.length > 4
              ? listOfAttende?.slice(0, 3)
              : listOfAttende
          }
          renderItem={renderDesigns}
        />

        {listOfAttende?.length !== 0 ? (
          <>
            <Text
              style={{
                color: Colors.darkBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(10),
              }}
            >
              Your Attendance
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: res(10),
              }}
            >
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate("AppliedListScreens", {
                    page: "Leave",
                    listOfAttende: listOfAttende,
                    getLoginDate: getLoginDate,
                  });
                }}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: res(12),
                  elevation: 10,
                  width: res(85),
                  padding: res(10),
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.orenge,
                    borderRadius: res(100),
                    alignSelf: "center",
                    height: res(40),
                    width: res(40),
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(14),
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                    >
                      {countDate?.LeaveCount}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.darkBlack,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "500",
                    paddingVertical: res(5),
                  }}
                >
                  Leave
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate("AppliedListScreens", {
                    page: "Permission",
                    listOfAttende: listOfAttende,
                    getLoginDate: getLoginDate,
                  });
                }}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: res(12),
                  elevation: 10,
                  width: res(85),
                  padding: res(10),
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.liteGreen,
                    borderRadius: res(100),
                    alignSelf: "center",
                    height: res(40),
                    width: res(40),
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(14),
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                    >
                      {countDate?.PermissionCount}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.darkBlack,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "500",
                    paddingVertical: res(5),
                  }}
                >
                  Permission
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate("AppliedListScreens", {
                    page: "On Duty",
                    listOfAttende: listOfAttende,
                    getLoginDate: getLoginDate,
                  });
                }}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: res(12),
                  elevation: 10,
                  width: res(85),
                  padding: res(10),
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.themeColor,
                    borderRadius: res(100),
                    alignSelf: "center",
                    height: res(40),
                    width: res(40),
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ alignSelf: "center" }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(14),
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                    >
                      {countDate?.OnDutyCount}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: Colors.darkBlack,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "500",
                    paddingVertical: res(5),
                  }}
                >
                  OD
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
      {modal === true ? (
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal>
      ) : null}
      {showModal()}
    </ScrollView>
  );
};

export default Home;

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
  name: {
    fontSize: 18,
    color: Colors.darkBlack,
    fontWeight: "600",
  },
});
