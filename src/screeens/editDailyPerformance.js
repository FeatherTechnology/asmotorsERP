import {
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

const EditDailyPerformance = ({ route, navigation }) => {
  const [routeData, setRouteData] = useState(route?.params.routeData);
  const [getLoginDate, setLoginData] = useState(route?.params.getLoginDate);
  const [updateAcheiveValue, setUpdateAcheiveValue] = useState(
    route?.params.routeData?.actual_achieve !== null
      ? route?.params.routeData?.actual_achieve
      : ""
  );
  const [updateAcheiveStatus, setUpdateAcheiveStatus] =
    useState("Select Work Status");
  const [showType, setShowType] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (updateAcheiveValue !== "") {
      if (routeData?.target > parseInt(updateAcheiveValue)) {
        setUpdateAcheiveStatus("Not Done");
      } else if (routeData?.target <= parseInt(updateAcheiveValue)) {
        setUpdateAcheiveStatus("Satisfied");
      }
    }
  }, [updateAcheiveValue]);

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
                  setUpdateAcheiveStatus("Satisfied");
                  setShowType(false);
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "Satisfied"
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
                          updateAcheiveStatus === "Satisfied"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "Satisfied"
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
                      Satisfied
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setUpdateAcheiveStatus("Not Done");
                  setShowType(false);
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <View
                    style={{
                      borderColor:
                        updateAcheiveStatus === "Not Done"
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
                          updateAcheiveStatus === "Not Done"
                            ? Colors.themeColor
                            : "#BDBDBD",
                        backgroundColor:
                          updateAcheiveStatus === "Not Done"
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
                      {" "}
                      On Duty
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

  const dailyPerformanceUpdate = async () => {
    try {
      let theParams = [
        {
          performanceid: routeData?.daily_performance_ref_id?.toString(),
          achieved: updateAcheiveValue?.toString(),
          workstatus: updateAcheiveStatus === "Satisfied" ? "1" : "2",
          goalsettingid: routeData?.goal_setting_id?.toString(),
          goalsetting_refid:routeData?.goal_setting_ref_id?.toString(),
          staffid: getLoginDate?.staff_id?.toString(),
          goaldate:moment(routeData?.system_date).format("YYYY-MM-DD")
        }
      ];

      let response = await api.postAllDailyPerformance(theParams);
      if (response==="Updated Successfully") {
        navigation.goBack();
      } else {
        setModal(false);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header name={routeData?.assertion} identity={"assertHistory"} routeData={routeData}/>
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
            Target
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
              {routeData?.target}
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
            System Date
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
              {routeData?.system_date !== "" && routeData?.system_date !== null
                ? moment(routeData?.system_date).format("DD-MM-YYYY")
                : ""}
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
            Actual Achieve
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
              placeholder={"Actual Achieve"}
              value={updateAcheiveValue}
              multiline={true}
              editable={route?.params?.status === "View" ? false : true}
              onChangeText={(value) => setUpdateAcheiveValue(value)}
              cursorColor={Colors.liteBlack}
              keyboardType="decimal-pad"
              style={{
                alignSelf: "flex-start",
                borderRadius: res(8),
                color: Colors.darkBlack,
                backgroundColor: Colors.white,
                fontSize: res(12),
                paddingHorizontal: res(10),
                width: "100%",
                flex: 1,
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
            Work Status
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
      </ScrollView>
      {workStatus()}
      <TouchableOpacity
        disabled={route?.params?.status === "View" ? true : false}
        onPress={() => dailyPerformanceUpdate()}
        style={{
          bottom: 0,
          borderRadius: res(100),
          borderWidth: 0.4,
          backgroundColor:
            route?.params?.status === "View" ? Colors.GREY : Colors.themeColor,
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

export default EditDailyPerformance;

const styles = StyleSheet.create({});
