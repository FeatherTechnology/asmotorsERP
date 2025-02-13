import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { Colors } from "../utills/colors";
import res from "../components/responsive";
import { api } from "../services";
import Toast from "react-native-simple-toast";
import moment from "moment";
import DocumentPicker, { types } from 'react-native-document-picker'
import { BASE_URL, URL } from "../services/constants";

const EditDailyTaskEntry = ({ route, navigation }) => {
  const [routeData, setRouteData] = useState(route?.params.routeData);
  const [getLoginDate, setLoginData] = useState(route?.params.getLoginDate);
  const [updateAcheiveValue, setUpdateAcheiveValue] = useState(
    route?.params.routeData?.actual_achieve !== null
      ? route?.params.routeData?.actual_achieve
      : ""
  );
  const [updateAcheiveStatus, setUpdateAcheiveStatus] =
    useState(
      route?.params.routeData?.workstatus === 1 ? "In Progress" :
        route?.params.routeData?.workstatus === 2 ? "Pending" :
          route?.params.routeData?.workstatus === 3 ? "Completed" : "Select Work Status");
  const [showType, setShowType] = useState(false);
  const [modal, setModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  // useEffect(() => {
  //   if (updateAcheiveValue !== "") {
  //     if (routeData?.target > parseInt(updateAcheiveValue)) {
  //       setUpdateAcheiveStatus("Not Done");
  //     } else if (routeData?.target <= parseInt(updateAcheiveValue)) {
  //       setUpdateAcheiveStatus("Satisfied");
  //     }
  //   }
  // }, [updateAcheiveValue]);


  const calendarUpdateStatus = async () => {
    setModal(true);
    try {
      let formData = new FormData();
      formData.append("work_title", routeData?.worktitle);
      formData.append("work_id", routeData?.workid?.toString());
      formData.append("work_status",
        updateAcheiveStatus === "In Progress" ? 1 :
          updateAcheiveStatus === "Pending" ? 2 :
            updateAcheiveStatus === "Completed" ? 3 : ""
      );
      formData.append("work_status_description", remarks?.toString());
      formData.append("tableidentifier", routeData?.tableidentifier);
      formData.append('file', documentValue);

      if (documentValue!==undefined) {
        formData.append('file', {
          uri: documentValue[0]?.uri,
          type: documentValue[0]?.type,
          name: documentValue[0]?.name
        });
      } else {
        formData.append("file", "");
      }

      console.log("formData",formData);

      var URL_REGISTER = BASE_URL + URL.CALENDAR_UPDATE;
      fetch(URL_REGISTER, {
        method: 'POST',
        headers: {
          "content-type": "multipart/form-data",
          "accept": "application/json"
        },
        body: formData
      }).then(
        function (response) {
          if (response.status !== 200) {
            return;
          }
          response.json().then(function (data) {
            Toast.show("Updated success!", 4000);
            navigation.goBack();
          });
          setModal(false);
          setRemarks("");
        }
      )
        .catch(function (err) {
          setModal(false);
          setRemarks("");
        });
    } catch (error) {
      Toast.show(error, 4000);
      setRemarks("");
    }
  };

  function workStatus() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showType}
        onRequestClose={() => {
          setShowType(!showType);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowType(false)}>
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setUpdateAcheiveStatus("Select Work Status");
                  setShowType(false);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "Select Work Status"
                          ? Colors.themeColor
                          : "#BDBDBD",
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.white,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          updateAcheiveStatus === "Select Work Status"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "Select Work Status"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.darkBlack }}>
                      Select Work Status
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setUpdateAcheiveStatus("In Progress");
                  setShowType(false);
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "In Progress"
                          ? Colors.themeColor
                          : "#BDBDBD",
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.white,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          updateAcheiveStatus === "In Progress"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "In Progress"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        color: Colors.darkBlack,
                      }}
                    >
                      In Progress
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setUpdateAcheiveStatus("Pending");
                  setShowType(false);
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "Pending"
                          ? Colors.themeColor
                          : "#BDBDBD",
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.white,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          updateAcheiveStatus === "Pending"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "Pending"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        color: Colors.darkBlack,
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setUpdateAcheiveStatus("Completed");
                  setShowType(false);
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "Completed"
                          ? Colors.themeColor
                          : "#BDBDBD",
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.white,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          updateAcheiveStatus === "Completed"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "Completed"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: "center",
                        color: Colors.darkBlack,
                      }}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // const dailyPerformanceUpdate = async () => {
  //   try {
  //     let theParams = [
  //       {
  //         performanceid: routeData?.daily_performance_ref_id?.toString(),
  //         achieved: updateAcheiveValue?.toString(),
  //         workstatus: updateAcheiveStatus === "Satisfied" ? "1" : "2",
  //         goalsettingid: routeData?.goal_setting_id?.toString(),
  //         goalsetting_refid: routeData?.goal_setting_ref_id?.toString(),
  //         staffid: getLoginDate?.staff_id?.toString(),
  //         goaldate: routeData?.system_date
  //       }
  //     ];

  //     let response = await api.postAllDailyPerformance(theParams);
  //     if (response === "Updated Successfully") {
  //       navigation.goBack();
  //     } else {
  //       setModal(false);
  //     }
  //     setModal(false);
  //   } catch (error) {
  //     Toast.show(error, 4000);
  //     setModal(false);
  //   }
  // };

  const [documentValue, setDocumentValue] = useState()

  const picker = async () => {
    DocumentPicker.pick({
      allowMultiSelection: true,
      type: [types.allFiles],
    })
      .then(async (e) => {
        setDocumentValue(e)
      }).catch((err) => {
        if (DocumentPicker.isCancel(err)) {
          // ignore
        } else {
          console.error(err)
        }
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <Header name={"Daily task update"} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: res(10), marginTop: 15 }}>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Task
          </Text>
          <View
            style={{
              borderRadius: res(8),
              backgroundColor: "#DEDEDE",
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}
          >
            <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
              {routeData?.worktitle}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: res(10) }}>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Task Status
          </Text>
          <TouchableOpacity
            disabled={route?.params?.status === "View" ? true : false}
            onPress={() => setShowType(true)}
            style={{
              borderRadius: res(8),
              borderWidth: 0.4,
              backgroundColor: Colors.white,
              borderColor: "#DEDEDE",
              paddingHorizontal: res(10),
              flex: 1,
              paddingVertical: res(12),
              marginVertical: res(4),
            }}
          >
            <Text
              style={{
                color:
                  updateAcheiveStatus === "Select Work Status"
                    ? Colors.borderColor
                    : Colors.darkBlack,
                fontSize: res(12),
              }}
            >
              {updateAcheiveStatus}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: res(10) }}>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            Remark
          </Text>
          <View
            style={{
              borderRadius: res(8),
              borderWidth: res(1),
              borderColor: Colors.border,
              marginVertical: res(5),
              height: res(100),
              backgroundColor: Colors.white,
            }}
          >
            <TextInput
              placeholderTextColor={Colors.liteBlack}
              placeholder={"Update your work status!"}
              value={remarks}
              onChangeText={(value) => setRemarks(value)}
              autoFocus={true}
              cursorColor={"black"}
              multiline={true}
              style={{
                borderRadius: res(8),
                color: Colors.darkBlack,
                backgroundColor: Colors.white,
                fontSize: res(12),
                paddingHorizontal: res(10)
              }}
            />
          </View>
        </View>



        <View style={{ paddingHorizontal: res(10) }}>
          <Text
            style={{
              color: Colors.liteBlack,
              fontSize: res(14),
              alignSelf: "flex-start",
              fontWeight: "500",
            }}
          >
            File Upload
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.white, borderRadius: res(12), marginVertical: res(10), borderColor: Colors.liteGreyShade, borderWidth: 0.7 }}
            onPress={() => {
              Keyboard.dismiss();
              picker();
            }}>
            <Text
              style={{
                color: Colors.themeColor,
                fontSize: res(12),
                alignSelf: "center",
                fontWeight: "700",
                textAlign: "center",
                paddingVertical: res(8),
                paddingHorizontal: res(12)
              }}
            >
              Choose file
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { alignSelf: 'flex-start', fontSize: res(8), color: Colors.themeColor, paddingHorizontal: 20 }]}>{documentValue !== undefined ? documentValue[0]?.name : ""} </Text>

      </ScrollView>
      {workStatus()}
      <TouchableOpacity
        disabled={remarks !== "" && updateAcheiveStatus !== "Select Work Status" ? false : true}
        onPress={() => calendarUpdateStatus()}
        style={{
          bottom: 0,
          borderRadius: res(100),
          borderWidth: 0.4,
          backgroundColor: remarks !== "" && updateAcheiveStatus !== "Select Work Status" ? Colors.themeColor : Colors.GREY,
          borderColor: "#DEDEDE",
          paddingHorizontal: res(10),
          paddingVertical: res(8),
          marginVertical: res(4),
          marginHorizontal: res(30),
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontWeight: "bold",
            fontSize: res(14),
            alignSelf: "center",
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditDailyTaskEntry;

const styles = StyleSheet.create({});
