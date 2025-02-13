import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Platform, Button, TouchableWithoutFeedback, Keyboard, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import WhiteHeader from "../components/whiteHeader";
import { Colors } from "../utills/colors";
import res from "../components/responsive";
import { api } from "../services";
import Loaders from "../components/Loader";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-date-picker";
import moment from "moment";
import messaging from "@react-native-firebase/messaging";

const LeaveRequest = ({ route, navigation }) => {
  const [regNo, setRegNo] = useState("");
  const [LeaveDate, setLeaveDate] = useState(new Date());
  const [LeaveDateTo, setLeaveDateTo] = useState(new Date());
  const [reportingTo, setReporting] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [onDutyPlace, setOnDutyPlace] = useState("");
  const [modal, setModal] = useState(false);
  const [getLoginDate, setLoginDate] = useState(route?.params?.getLoginDate);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  // const [showType, setShowType] = useState(false)
  const [dateShoe, setDateShow] = useState(false);
  const [dateShoeTo, setDateShowTo] = useState(false);

  const [startTimeShow, setStartTimeShow] = useState(false);
  const [endTimeShow, setendTimeShow] = useState(false);
  const [showTypeDefault, setShowTypeDefault] = useState(
    route?.params.name == "Leave Request" ? "Leave" :
      route?.params.name == "Permission Request" ? "Permission" :
        route?.params.name == "OD Request" ? "On Duty" : ""
  );
  const [fcmID, setFCMID] = useState("");
  const [responsibleStaff, setResponsibleStaff] = useState(false);
  const [userListRender, setUserListRender] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("")

  useEffect(() => {
    get_Token();
    getAllTheUser();
  }, []);

  const getAllTheUser = async () => {
    try {
      let loginResponse = await api.getAllUser();
      if (loginResponse) {
        setUserListRender(loginResponse);
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const get_Token = async () => {
    var fcm_token = await messaging().getToken();
    setFCMID(fcm_token);
  };

  //Apply
  const attendanceApply = async () => {
    setModal(true)
    try {
      let params = {
        company_id: getLoginDate?.company_id?.toString(),
        department_id: getLoginDate?.department_id?.toString(),
        p_staff_id: getLoginDate?.staff_id?.toString(),
        staff_code: getLoginDate?.staffcode?.toString(),
        reporting: getLoginDate?.reporting?.toString(),
        reason: showTypeDefault?.toString(),
        permission_from_time: showTypeDefault === "Permission" ? `${moment(startTime).format("HH:mm")}` : "",
        permission_to_time: showTypeDefault === "Permission" ? `${moment(endTime).format("HH:mm")}` : "",
        permission_date: showTypeDefault === "Permission" ? `${moment(LeaveDate).format("YYYY-MM-DD")}` : "",
        on_duty_place: showTypeDefault === "On Duty" ? onDutyPlace : "",
        leave_date: `${moment(LeaveDate).format("YYYY-MM-DD")}`,
        leave_reason: showTypeDefault !== "On Duty" ? reason?.toString() : "",
        deviceid: fcmID,
        leave_todate: `${moment(LeaveDateTo).format("YYYY-MM-DD")}`,
        // leave_status: showTypeDefault?.toString(),
        // reject_reason: "",
        responsible_staff: selectedStaff?.toString(),
        insert_login_id: getLoginDate?.user_id
      };
      let loginResponse = await api.insertLeave(params);
      if (loginResponse === "Updated SuccessFully" || loginResponse === "Cancelled") {
        Toast.show("Updated Successfully!", 4000);
        setTimeout(() => {
          navigation.goBack();
        }, 500);

      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };


  const userListRenderScreen = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        disabled={item?.selected === true ? true : false}
        onPress={() => {
          setSelectedStaff(item?.fullname);
          setResponsibleStaff(false);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
          borderRadius: res(12),
          paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}>

        <View style={{ paddingHorizontal: res(10), paddingVertical: res(5), flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: item?.selected === true ? Colors.DARK_GREY : Colors.darkBlack,
              fontSize: res(12),
              alignSelf: 'flex-start',
              fontWeight: item?.selected === true ? '300' : '700',
            }}>
            {item?.fullname}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  function responsibleStaffModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={responsibleStaff}
        onRequestClose={() => {
          setResponsibleStaff(!responsibleStaff);
        }}>

        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{ backgroundColor: Colors.white, borderRadius: res(8), padding: res(6) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: res(10), paddingVertical: res(8) }}>
              <Text style={[{
                alignSelf: 'center', fontSize: res(18),
                color: Colors.darkBlack,
                fontWeight: "600",
              }]}>Select Responsible Staff</Text>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  Keyboard.dismiss()
                  setResponsibleStaff(false);
                }}>
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s'
                  }}
                  style={{ height: res(20), width: res(20) }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: res(300), backgroundColor: Colors.WHITE_TRANSPARENT }}>
              <FlatList
                bounces={false}
                data={userListRender?.filter((item) => item?.department === getLoginDate?.department_id?.toString())}
                renderItem={userListRenderScreen}
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
                    No lists found!
                  </Text>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <WhiteHeader name={route?.params.name} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: res(10) }}>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Company Name
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{"ASMotors"}</Text>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Branch Name
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{getLoginDate?.branch_name}</Text>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Department Name
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{getLoginDate?.department_name}</Text>
          </View>

          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Staff Name
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{getLoginDate?.staff_name}</Text>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Staff Code
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{getLoginDate?.staffcode}</Text>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Reporting
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{getLoginDate?.managername}</Text>
          </View>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Responsible Staff
          </Text>
          <TouchableOpacity
            onPress={() => setResponsibleStaff(true)}
            style={{
              borderRadius: res(8),
              borderColor: '#DEDEDE',
              borderWidth: 0.8,
              backgroundColor: Colors.white,
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{selectedStaff}</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Leave Type
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: '#DEDEDE',
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}>
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{showTypeDefault}</Text>
          </View>

          {showTypeDefault !== "On Duty" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                {showTypeDefault === "Permission" ? "Permission Date" : "From Date"}
              </Text>
              <View
                style={{
                  borderRadius: res(8),
                  borderWidth: res(1),
                  borderColor: Colors.border,
                  marginVertical: res(5),
                }}
              >
                {dateShoe === true ?
                  <DateTimePicker
                    androidVariant={
                      Platform.OS === "ios" ? "iosClone" : "nativeAndroid"
                    }
                    date={LeaveDate}
                    mode={"date"}
                    onDateChange={(value) => {
                      setLeaveDate(value);
                      // setDateShow(false)
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: res(1000),
                      height: res(100),
                      display: "flex",
                      color: Colors.white,
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  /> :
                  <TouchableOpacity
                    onPress={() => setDateShow(true)}
                    style={{
                      borderRadius: res(8),
                      backgroundColor: Colors.white,
                      paddingHorizontal: res(10),
                      flex: 1,
                      marginVertical: res(10),
                    }}>
                    <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(LeaveDate).format("DD-MM-YYYY")}</Text>
                  </TouchableOpacity>}
                {dateShoe === true ? <Button
                  title="OK"
                  onPress={() => setDateShow(false)}
                /> : null}
              </View>
            </> : null}

          {showTypeDefault !== "On Duty" && showTypeDefault !== "Permission" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                {"To Date"}
              </Text>
              <View
                style={{
                  borderRadius: res(8),
                  borderWidth: res(1),
                  borderColor: Colors.border,
                  marginVertical: res(5),
                }}
              >
                {dateShoeTo === true ?
                  <DateTimePicker
                    androidVariant={
                      Platform.OS === "ios" ? "iosClone" : "nativeAndroid"
                    }
                    date={LeaveDateTo}
                    mode={"date"}
                    minimumDate={LeaveDate}
                    onDateChange={(value) => {
                      setLeaveDateTo(value);
                      // setDateShowTo(false)
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: res(1000),
                      height: res(100),
                      display: "flex",
                      color: Colors.white,
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  /> :
                  <TouchableOpacity
                    onPress={() => setDateShowTo(true)}
                    style={{
                      borderRadius: res(8),
                      backgroundColor: Colors.white,
                      paddingHorizontal: res(10),
                      flex: 1,
                      marginVertical: res(10),
                    }}>
                    <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(LeaveDateTo).format("DD-MM-YYYY")}</Text>
                  </TouchableOpacity>}
                {dateShoeTo === true ? <Button
                  title="OK"
                  onPress={() => setDateShowTo(false)}
                /> : null}
              </View>
            </> : null}

          {showTypeDefault === "Permission" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                Start Time
              </Text>
              <View
                style={{
                  borderRadius: res(8),
                  borderWidth: res(1),
                  borderColor: Colors.border,
                  marginVertical: res(5),
                }}
              >
                {startTimeShow === true ?
                  <DateTimePicker
                    androidVariant={
                      Platform.OS === "ios" ? "iosClone" : "nativeAndroid"
                    }
                    date={startTime}
                    is24hourSource={'locale'}
                    locale={'en_GB'}
                    mode={"time"}
                    onDateChange={(value) => {
                      setStartTime(value);
                      // setStartTimeShow(false)
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: res(1000),
                      height: res(100),
                      display: "flex",
                      color: Colors.white,
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  /> :
                  <TouchableOpacity
                    onPress={() => setStartTimeShow(true)}
                    style={{
                      borderRadius: res(8),
                      backgroundColor: Colors.white,
                      paddingHorizontal: res(10),
                      flex: 1,
                      marginVertical: res(10),
                    }}>
                    <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(startTime).format("HH:mm")}</Text>
                  </TouchableOpacity>}
                {startTimeShow === true ? <Button
                  title="OK"
                  onPress={() => setStartTimeShow(false)}
                /> : null}
              </View>
            </> : null}

          {showTypeDefault === "Permission" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                End Time
              </Text>
              <View
                style={{
                  borderRadius: res(8),
                  borderWidth: res(1),
                  borderColor: Colors.border,
                  marginVertical: res(5),
                }}
              >
                {endTimeShow === true ?
                  <DateTimePicker
                    androidVariant={
                      Platform.OS === "ios" ? "iosClone" : "nativeAndroid"
                    }
                    date={endTime}
                    locale={'en_GB'}
                    minimumDate={startTime}
                    mode={"time"}
                    is24hourSource={'locale'}
                    onDateChange={(value) => {
                      setEndTime(value);
                      // setendTimeShow(false)
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: res(1000),
                      height: res(100),
                      display: "flex",
                      color: Colors.white,
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  /> :
                  <TouchableOpacity
                    onPress={() => setendTimeShow(true)}
                    style={{
                      borderRadius: res(8),
                      backgroundColor: Colors.white,
                      paddingHorizontal: res(10),
                      flex: 1,
                      marginVertical: res(10),
                    }}>
                    <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(endTime).format("HH:mm")}</Text>
                  </TouchableOpacity>}
                {endTimeShow === true ? <Button
                  title="OK"
                  onPress={() => setendTimeShow(false)}
                /> : null}
              </View>
            </> : null}

          {showTypeDefault !== "On Duty" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                Reason
              </Text>
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
                  multiline={true}
                  placeholder={"Reason"}
                  value={reason}
                  onChangeText={(value) => setReason(value)}
                  cursorColor={Colors.liteBlack}
                  maxLength={160}
                  style={{
                    alignContent: 'flex-start',
                    borderRadius: res(8),
                    color: Colors.darkBlack,
                    backgroundColor: Colors.white,
                    fontSize: res(12),
                    paddingHorizontal: res(10),
                    width: '100%',
                    // flex: 1,
                  }}
                />
              </View>
            </> : null}
          {showTypeDefault === "On Duty" ?
            <>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                On Duty Place
              </Text>
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
                  placeholder={"On Duty Place"}
                  value={onDutyPlace}
                  multiline={true}
                  onChangeText={(value) => setOnDutyPlace(value)}
                  cursorColor={Colors.liteBlack}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: res(8),
                    color: Colors.darkBlack,
                    backgroundColor: Colors.white,
                    fontSize: res(12),
                    paddingHorizontal: res(10),
                    width: '100%',
                    flex: 1,
                  }}
                />
              </View>
            </> : null}
        </View>

      </ScrollView>
      <TouchableOpacity
        disabled={
          showTypeDefault === "On Duty" ?
            onDutyPlace !== "" ? false : true :
            reason !== "" ? false : true
        }
        onPress={() => attendanceApply()}
        activeOpacity={0.5}
        style={{
          bottom: 0,
          marginVertical: res(15),
          marginHorizontal: res(10),
          backgroundColor:
            showTypeDefault === "On Duty" ?
              onDutyPlace === "" ? Colors.liteGreyShade : Colors.themeColor :
              reason === "" ? Colors.liteGreyShade : Colors.themeColor,
          borderRadius: res(100),
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            paddingVertical: res(10),
            alignSelf: "center",
            color: Colors.white,
            fontSize: res(16),
          }}
        >
          APPLY
        </Text>
      </TouchableOpacity>
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
      {responsibleStaffModal()}
    </View>
  );
};

export default LeaveRequest;

const styles = StyleSheet.create({});
