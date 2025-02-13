import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import res from "../components/responsive";
import { Colors } from "../utills/colors";
import moment from "moment";
import { api } from "../services";
import Loaders from "../components/Loader";
import Toast from "react-native-simple-toast";
import { shapeBack } from "../assets";

const DetailingList = ({ navigation, route }) => {
  const [data, setDate] = useState(route?.params?.data);
  const [getLoginDate, setLoginData] = useState(route?.params?.getLoginDate);
  const [modal, setModal] = useState(false);

  const attendanceApprove = async (id, leaveStatus, reason) => {
    setModal(true);
    try {
      let params = {
        id: JSON.parse(id),
        leaveStatus: leaveStatus,
        rejectReason: reason,
        responsible_Staff: selectedStaff,
      };
      let loginResponse = await api.approveLeave(params);
      if (
        loginResponse === "Updated SuccessFully" ||
        loginResponse === "Cancelled"
      ) {
        Toast.show("Updated Successfully!", 4000);
        setTimeout(() => {
          setShowModal(false);
          setShowModalData({});
          setRejectReason("");
          navigation.goBack();
        }, 500);
        setModal(false);
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
  const [responsibleStaff, setResponsibleStaff] = useState(false);
  const [userListRender, setUserListRender] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(route?.params?.data?.responsible_staff_name !== undefined && route?.params?.data?.responsible_staff_name !== null ? route?.params?.data?.responsible_staff_name : "")

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
                  rejectReason
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

  useEffect(() => {
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
                data={userListRender?.filter((item) => item?.branch_id === getLoginDate?.branch_id?.toString())}
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
    <View style={{ flex: 1 }}>
      <Header name={"Request ID : " + data?.permission_on_duty_id} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View
          style={{
            marginHorizontal: res(10),
            paddingTop: res(20),
            marginBottom: res(30),
          }}
        >
          <View
            style={{ height: res(60), width: res(60), alignSelf: "center" }}
          >
            <Image
              source={{
                uri: "https://w7.pngwing.com/pngs/24/958/png-transparent-cartoon-animation-happy-face-child-face-hand.png",
              }}
              style={styles.permission}
            />
          </View>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(16),
              alignSelf: "center",
              fontWeight: "700",
            }}
          >
            {data?.staff_name !== undefined ? data?.staff_name : "User"}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginHorizontal: res(10), width: "40%" }}>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Company Name"}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Branch Name"}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Designations"}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Department Name"}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Responisible Staff"}
            </Text>
            {route?.params?.isManager !== "manager" ? <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Reporting"}
            </Text> : null}
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Leave Type"}
            </Text>
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {data?.reason + (data?.reason === "Leave" ? " From Date" : " Date")}
              </Text> 
            {data?.reason === "Leave" ?
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {"Leave To Date"}
              </Text> : null}
            {data?.reason === "Permission" ? (
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {"Start Time"}
              </Text>
            ) : null}
            {data?.reason === "Permission" ? (
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {"End Time"}
              </Text>
            ) : null}

            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {"Leave Status"}
            </Text>
            {data?.leave_status === 2 ? (
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {"Reject Reason"}
              </Text>
            ) : null}
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {data?.reason === "On Duty" ? "On Duty Place" : "Reason"}
            </Text>
          </View>
          <View style={{ marginHorizontal: res(10), width: "50%" }}>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": AS Motors"}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " + getLoginDate?.branch_name}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " + (route?.params?.isManager === "manager" ? data?.designation_name : getLoginDate?.designation_name)}
            </Text>
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " + data?.department_name}
            </Text>
            <TouchableOpacity
              disabled={route?.params?.isManager === "manager" ? false : true}
              onPress={() => setResponsibleStaff(true)}
              style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: res(10) }}
            >
              <Text
                style={{
                  color: selectedStaff !== "" ? Colors.liteBlack : Colors.BORDER_GREY,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " + (selectedStaff !== "" ? selectedStaff : "Select staffs")}
              </Text>
              {route?.params?.isManager === "manager" ?
                <Image
                  source={shapeBack}
                  style={{ height: res(8), width: res(8), alignSelf: 'center', transform: [{ rotate: '270deg' }], paddingRight: res(10) }}
                  tintColor={Colors.BLACK}
                /> : null}
            </TouchableOpacity>
            {route?.params?.isManager !== "manager" ? <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " + getLoginDate?.managername}
            </Text> : null}
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " + data?.reason}
            </Text>
            {data?.reason !== "On Duty" ?
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " +
                  (data?.reason === "Leave" ?
                    (data?.leave_date !== "" && data?.leave_date !== null
                      ? moment(data?.leave_date).format("DD-MM-YYYY")
                      : "") :
                    data?.reason === "Permission" ?
                      (data?.permission_date !== "" && data?.permission_date !== null
                        ? moment(data?.permission_date).format("DD-MM-YYYY")
                        : "") : "")}
              </Text> :
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " +
                  (data?.created_date !== "" && data?.created_date !== null
                    ? moment(data?.created_date).format("DD-MM-YYYY")
                    : "")}
              </Text>}
            {data?.reason === "Leave" ?
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " +
                  (data?.leave_to_date !== "" && data?.leave_to_date !== null
                    ? moment(data?.leave_to_date).format("DD-MM-YYYY")
                    : "")}
              </Text> : null
            }
            {data?.reason === "Permission" ? (
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " + data?.permission_from_time}
              </Text>
            ) : null}
            {data?.reason === "Permission" ? (
              <Text
                style={{
                  color: Colors.liteBlack,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " + data?.permission_to_time}
              </Text>
            ) : null}

            <Text
              style={{
                color:
                  data?.leave_status === 0
                    ? Colors.orengeTextPending
                    : data?.leave_status === 1
                      ? Colors.leaveDarkGreen
                      : data?.leave_status === 2
                        ? Colors.pinkTextCancel
                        : data?.leave_status === 3
                          ? Colors.pinkTextCancel
                          : Colors.liteBlack,

                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " +
                (data?.leave_status === 0
                  ? "In Progress"
                  : data?.leave_status === 1
                    ? "Approved"
                    : data?.leave_status === 2
                      ? "Rejected"
                      : data?.leave_status === 3
                        ? "Cancelled"
                        : " - ")}
            </Text>
            {data?.leave_status === 2 ? (
              <Text
                style={{
                  color: Colors.pinkTextCancel,
                  fontSize: res(14),
                  alignSelf: "flex-start",
                  fontWeight: "700",
                  marginVertical: res(4),
                }}
              >
                {": " + data?.reject_reason}
              </Text>
            ) : null}
            <Text
              style={{
                color: Colors.liteBlack,
                fontSize: res(14),
                alignSelf: "flex-start",
                fontWeight: "700",
                marginVertical: res(4),
              }}
            >
              {": " +
                (data?.reason === "On Duty"
                  ? data?.on_duty_place
                  : data?.leave_reason)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent:
            (route?.params?.isManager === "user" || (route?.params?.isManager === "manager" && data?.staff_name === getLoginDate.staff_name)) && data?.leave_status === 0
              ? "center"
              : "space-between",
          bottom: 0,
          marginHorizontal: res(20),
        }}
      >
        {(route?.params?.isManager === "user" || (route?.params?.isManager === "manager" && data?.staff_name === getLoginDate.staff_name)) && data?.leave_status === 0 ? (
          <TouchableOpacity
            style={{
              bbackgroundColor: Colors.white,
              borderColor: Colors.pinkTextCancel,
              borderRadius: res(100),
              marginVertical: res(10),
              alignSelf: "center",
              borderWidth: 1,
            }}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                attendanceApprove(data?.permission_on_duty_id, 3, "");
              }, 100);
            }}
          >
            <Text
              style={{
                color: Colors.pinkTextCancel,
                fontSize: res(12),
                alignSelf: "center",
                fontWeight: "700",
                textAlign: "center",
                paddingVertical: res(8),
                paddingHorizontal: res(12),
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        ) : (
          route?.params?.isManager === "manager" && data?.staff_name !== getLoginDate.staff_name && data?.leave_status === 0 && (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.white,
                  borderColor: Colors.pinkTextCancel,
                  borderRadius: res(100),
                  marginVertical: res(10),
                  borderWidth: 1,
                }}
                onPress={() => {
                  setShowModalData(data);
                  setShowModal(true);
                }}
              >
                <Text
                  style={{
                    color: Colors.pinkTextCancel,
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
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.pureLiteGreen,
                  borderColor: Colors.leaveDarkGreen,
                  borderRadius: res(100),
                  marginVertical: res(10),
                  borderWidth: 1,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => {
                    attendanceApprove(data?.permission_on_duty_id, 1, "");
                  }, 100);
                }}
              >
                <Text
                  style={{
                    color: Colors.leaveDarkGreen,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(8),
                    paddingHorizontal: res(12),
                  }}
                >
                  Approve
                </Text>
              </TouchableOpacity>
            </>
          )
        )}
      </View>
      {showModal()}
      {responsibleStaffModal()}
      {modal === true ? (
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal>
      ) : null}
    </View>
  );
};

export default DetailingList;

const styles = StyleSheet.create({
  permission: {
    justifyContent: "center",
    height: res(60),
    width: res(60),
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
