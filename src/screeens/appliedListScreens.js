import {
  FlatList,
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/header";
import { Colors } from "../utills/colors";
import res from "../components/responsive";
import moment from "moment";
import { api } from "../services";
import Loaders from "../components/Loader";
import Toast from "react-native-simple-toast";

const AppliedListScreens = ({ route, navigation }) => {
  const [listOfAttende, setListOfAttende] = useState(
    route?.params?.page !== undefined &&
      route?.params?.page !== "Recent Approvals"
      ? route?.params?.listOfAttende?.filter(
        (item) => item?.reason === route?.params?.page
      )
      : route?.params?.listOfAttende
  );
  const [getLoginDate, setLoginData] = useState(route?.params?.getLoginDate);
  const [modal, setModal] = useState(false);

  //Approve or Reject
  const attendanceApprove = async (id, leaveStatus, reason, item) => {
    setModal(true);
    try {
      let params = {
        id: JSON.parse(id),
        leaveStatus: leaveStatus,
        rejectReason: reason,
        responsible_Staff: item?.responsible_staff_name !== undefined ? item?.responsible_staff_name : ""
      };
      let loginResponse = await api.approveLeave(params);
      if (loginResponse) {
        Toast.show("Updated Successfully!", 4000);
        setListOfAttende(
          listOfAttende?.filter((item) => item?.permission_on_duty_id !== id)
        );
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
            {item?.reason !== "On Duty" ?
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
                        : "") : " "}
              </Text> : <Text
                style={{
                  color: Colors.themeColor,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  // paddingVertical: res(4),
                }}
              >
                {item?.created_date !== "" && item?.created_date !== null
                  ? moment(item?.created_date).format("DD-MM-YYYY")
                  : ""}
              </Text>}

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
            {item?.reason !== "On Duty" ?
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
                        : "") : " "}
              </Text> : <Text
                style={{
                  color: Colors.themeColor,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  // paddingVertical: res(4),
                }}
              >
                {item?.created_date !== "" && item?.created_date !== null
                  ? moment(item?.created_date).format("DD-MM-YYYY")
                  : ""}
              </Text>}
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

  return (
    <View style={{ flex: 1 }}>
      <Header
        name={
          route?.params?.page !== undefined
            ? route?.params?.page + " Requested"
            : "Recent Requested"
        }
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: res(10),
        }}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={listOfAttende}
          renderItem={
            (route?.params?.page !== undefined &&
              route?.params?.page !== "Recent Approvals") ||
              route?.params?.page !== "Recent Approvals"
              ? renderDesigns
              : renderDesignsManager
          }
          ListEmptyComponent={() =>
            modal === false && (
              <Text
                style={{
                  alignSelf: "center",
                  marginVertical: res(100),
                  fontSize: res(14),
                  color: Colors.darkBlack,
                  fontWeight: "bold",
                }}
              >
                The {route?.params?.page} list is empty
              </Text>
            )
          }
        />
      </View>
      {showModal()}
      {modal === true ? (
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal>
      ) : null}
    </View>
  );
};

export default AppliedListScreens;

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
