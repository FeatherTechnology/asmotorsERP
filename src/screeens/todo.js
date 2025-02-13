import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../utills/colors";
import Header from "../components/header";
import Loaders from "../components/Loader";
import { useIsFocused } from "@react-navigation/native";
import { api, storage } from "../services";
import res from "../components/responsive";
import moment from "moment";
import Toast from "react-native-simple-toast";

const ToDoPage = ({ navigation }) => {
  const [modal, setModal] = useState(false);
  const isFocused = useIsFocused();
  const [getLoginDate, setLoginData] = useState();
  const [toDoListItems, setToDoListItems] = useState([]);
  const [toDoListProjects, setToDoListProjects] = useState([]);
  const [getAllTheUsersDup, setGetAllTheUsersDup] = useState([]);

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
      getTODOList();
      getTODOProjects();
      getAllTheUser();
    }
  }, [getLoginDate, isFocused]);

  const getTODOList = async () => {
    try {
      let response = await api.getTodoItems(getLoginDate?.user_id?.toString());
      if (response) {
        setToDoListItems(response);
      } else {
        setModal(false);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  const getTODOProjects = async () => {
    try {
      let response = await api.getTodoProject();
      if (response) {
        setToDoListProjects(response);
      } else {
        setModal(false);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  const getAllTheUser = async () => {
    try {
      let loginResponse = await api.getAllUser();
      if (loginResponse) {
        setGetAllTheUsersDup(loginResponse);
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
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor:
              item?.priority === "1"
                ? Colors.RED
                : item?.priority === "2"
                ? Colors.orenge
                : item?.priority === "3"
                ? Colors.GREEN
                : Colors.GREEN,
            borderRadius: res(100),
            margin: res(5),
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: res(10),
              alignSelf: "flex-start",
              fontWeight: "700",
              paddingHorizontal: res(10),
              paddingVertical: res(3),
            }}
          >
            {item?.priority === "1"
              ? "High"
              : item?.priority === "2"
              ? "Medium"
              : item?.priority === "3"
              ? "Low"
              : ""}
          </Text>
        </View>

        <View
          style={{ paddingHorizontal: res(10), flex: 1, marginTop: res(15) }}
        >
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
              {item?.criteria}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("TodoCreation", {
                  routeData: item,
                  getLoginDate: getLoginDate,
                  edit:"edit"
                });
              }}
              activeOpacity={0.5}
              style={{
                backgroundColor: Colors.pureLiteGreen,
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
                {"Edit"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "600",
            }}
          >
            Description: {item?.work_des !== "" ? item?.work_des : " - "}
          </Text>

          <Text
            style={{
              color: Colors.themeColor,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "600",
              paddingVertical: res(4),
            }}
          >
            {item?.from_date !== "" && item?.from_date !== null
              ? moment(item?.from_date)?.format("DD-MM-YYYY")
              : ""}{" "}
            -{" "}
            {item?.to_date !== "" && item?.to_date !== null
              ? moment(item?.to_date)?.format("DD-MM-YYYY")
              : ""}
          </Text>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "600",
            }}
          >
            Project:{" "}
            {item?.project_id
              ?.split(",")
              ?.map((id) => {
                const project = toDoListProjects?.find(
                  (project) =>
                    project?.project_id?.toString() === id?.trim()?.toString()
                );
                return project ? project.project_name : " - ";
              })
              ?.filter(Boolean)
              ?.join(", ")}
          </Text>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "600",
            }}
          >
            Assigned Users:{" "}
            {item?.assign_to
              ?.split(",")
              ?.map((id) => {
                const project = getAllTheUsersDup?.find(
                  (project) =>
                    project?.staff_id?.toString() === id?.trim()?.toString()
                );
                return project ? project?.fullname : "";
              })
              ?.filter(Boolean)
              ?.join(", ")}
          </Text>
          <Text
            style={{
              color: Colors.darkBlack,
              fontSize: res(12),
              alignSelf: "flex-start",
              fontWeight: "600",
            }}
          >
            Active Status:{" "}
            {item?.status === 0
              ? "Active"
              : item?.status === 1
              ? "In Active"
              : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header name={"Todo List"} getLoginDate={getLoginDate} />
      <SafeAreaView style={{ flex: 1, marginHorizontal: res(5) }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={toDoListItems}
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
  );
};

export default ToDoPage;

const styles = StyleSheet.create({});
