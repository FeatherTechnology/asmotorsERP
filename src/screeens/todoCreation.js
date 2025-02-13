import {
  Button,
  FlatList,
  Image,
  Keyboard,
  Modal,
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
import { ScrollView } from "react-native-gesture-handler";
import res from "../components/responsive";
import Loaders from "../components/Loader";
import DateTimePicker from "react-native-date-picker";
import moment from "moment";
import { api } from "../services";
import Toast from "react-native-simple-toast";
import { EditIcon, EmptyBox, TickBox } from "../assets";

const TodoCreation = ({ navigation, route }) => {
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priority, setPriority] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.priority === "1"
        ? "High"
        : route?.params?.routeData?.priority === "2"
        ? "Medium"
        : route?.params?.routeData?.priority === "3"
        ? "Low"
        : ""
      : ""
  );
  const [modal, setModal] = useState(false);
  const [LeaveDate, setLeaveDate] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.from_date !== ""
        ? new Date(route?.params?.routeData?.from_date)
        : ""
      : new Date()
  );
  const [LeaveDateTo, setLeaveDateTo] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.to_date !== ""
        ? new Date(route?.params?.routeData?.to_date)
        : ""
      : new Date()
  );
  const [dateShoe, setDateShow] = useState(false);
  const [dateShoeTo, setDateShowTo] = useState(false);
  const [reason, setReason] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.work_des
      : ""
  );

  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const [criteria, setCriteria] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.criteria
      : ""
  );

  const [projectOpen, setProjectOpen] = useState(false);
  const [project, setProject] = useState("");
  const [projectID, setProjectID] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.project_id
      : ""
  );

  const [assignToOpen, setAssignToOpen] = useState(false);
  const [assignTo, setAssignTo] = useState("");

  const [getLoginDate, setLoginData] = useState(route?.params?.getLoginDate);

  const [toDoListProjects, setToDoListProjects] = useState([]);
  const [getAllTheUsersDup, setGetAllTheUsersDup] = useState([]);
  const [getAllMultipleUser, setGetAllMultipleUser] = useState(
    route?.params?.routeData !== undefined
      ? route?.params?.routeData?.assign_to
      : ""
  );

  console.log("route?.params?.routeData", route?.params?.routeData);

  const [projectName, setProjectName] = useState("");
  const [createNewProject, setCreateProject] = useState(false);
  const [UpdateOldProject, setUpdateOldProject] = useState(false);
  const [UpdateOldProjectValue, setUpdateOldProjectValue] = useState();

  useEffect(() => {
    if (getLoginDate?.staff_id !== undefined) {
      setModal(true);
      getAllTheUser();
      getTODOProjects();
    }
  }, [getLoginDate]);

  const getTODOProjects = async () => {
    try {
      let response = await api.getTodoProject();
      if (response) {
        setToDoListProjects(response);
        setProject(
          route?.params?.routeData !== undefined
            ? route?.params?.routeData?.project_id
                ?.split(",")
                ?.map((id) => {
                  const project = response?.find(
                    (project) =>
                      project?.project_id?.toString() === id?.trim()?.toString()
                  );
                  return project ? project?.project_name : "";
                })
                ?.filter(Boolean)
                ?.join(", ")
            : ""
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

  const getAllTheUser = async () => {
    try {
      let loginResponse = await api.getAllUser();
      if (loginResponse) {
        // Assuming 'staff_id' is the unique identifier for each item
        const uniqueLoginResponse = loginResponse.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.staff_id === item.staff_id)
        );

        let assignToIds = [];
        if (
          route?.params?.routeData?.assign_to &&
          route.params.routeData.assign_to !== ""
        ) {
          assignToIds = Array.from(
            new Set(route.params.routeData.assign_to.split(","))
          ).map((id) => parseInt(id));
        }

        let theUpdatedValue = uniqueLoginResponse.map((itemA) => {
          return {
            ...itemA,
            isChecked: assignToIds.includes(parseInt(itemA.staff_id)),
            selected: assignToIds.includes(parseInt(itemA.staff_id)),
          };
        });

        let MultipleUserId = theUpdatedValue
          ?.filter((item) => item.isChecked === true)
          ?.map((item) => item.staff_id)
          ?.join(",");

        let MultipleUserName = theUpdatedValue
          ?.filter((item) => item.isChecked === true)
          ?.map((item) => item.fullname)
          ?.join(", ");

        setGetAllTheUsersDup(theUpdatedValue);
        setAssignTo(MultipleUserName);
        setGetAllMultipleUser(MultipleUserId);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  };

  async function createTODOProject() {
    try {
      let loginResponse = await api.createTodoProject(projectName);
      if (loginResponse) {
        setCreateProject(false);
        getTODOProjects();
        setTimeout(() => {
          setProjectOpen(true);
        }, 100);
        setProjectName("");
        Toast.show("Project Created Successfully!", 4000);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  }

  async function updateTODOProject() {
    try {
      let loginResponse = await api.UpdateTodoProject(
        UpdateOldProjectValue?.project_name,
        projectName
      );
      if (loginResponse) {
        setCreateProject(false);
        getTODOProjects();
        setTimeout(() => {
          setProjectOpen(true);
        }, 100);
        setProjectName("");
        Toast.show("Project Update Successfully!", 4000);
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  }

  async function createTODOItem() {
    try {
      let loginResponse = await api.createTodoItem(
        reason,
        priority === "High"
          ? "1"
          : priority === "Medium"
          ? "2"
          : priority === "Low"
          ? "3"
          : "",
        getAllMultipleUser?.toString(),
        moment(LeaveDate).format("YYYY-MM-DD")?.toString(),
        moment(LeaveDateTo).format("YYYY-MM-DD")?.toString(),
        criteria?.toString(),
        criteria === "Event" ? "" : projectID?.toString(),
        getLoginDate?.user_id?.toString()
      );
      //   2024-02-10

      if (loginResponse) {
        setCreateProject(false);
        getTODOProjects();
        // setTimeout(() => {
        //   setProjectOpen(true);
        // }, 100);
        setProjectName("");
        Toast.show("Project Created Successfully!", 4000);
        navigation.goBack();
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  }

  async function updateTODOItem(toDoId) {
    try {
      let loginResponse = await api.UpdateTodoItem(
        reason,
        priority === "High"
          ? "1"
          : priority === "Medium"
          ? "2"
          : priority === "Low"
          ? "3"
          : "",
        getAllMultipleUser?.toString(),
        moment(LeaveDate).format("YYYY-MM-DD")?.toString(),
        moment(LeaveDateTo).format("YYYY-MM-DD")?.toString(),
        criteria?.toString(),
        criteria === "Event" ? "" : projectID?.toString(),
        getLoginDate?.user_id?.toString(),
        toDoId
      );
      //   2024-02-10

      if (loginResponse) {
        setCreateProject(false);
        getTODOProjects();
        // setTimeout(() => {
        //   setProjectOpen(true);
        // }, 100);
        setProjectName("");
        Toast.show("Project Updated Successfully!", 4000);
        navigation.goBack();
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false);
    }
  }

  function responsibleStaffModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={priorityOpen}
        onRequestClose={() => {
          setPriorityOpen(!priorityOpen);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setPriority("");
            setPriorityOpen(false);
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: "center",
              paddingTop: 80,
              paddingRight: 10,
              backgroundColor: Colors.BLACK_DIM_TRANSPARENT,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.WHITE,
                padding: 20,
                borderRadius: 12,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPriority("High");
                  setPriorityOpen(false);
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
                        priority === "High"
                          ? Colors.PRIMARY_VARIANT
                          : Colors.GREY,
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.WHITE,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          priority === "High"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        backgroundColor:
                          priority === "High"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                      High
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPriority("Medium");
                  setPriorityOpen(false);
                }}
                style={{ marginVertical: res(10) }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      borderColor:
                        priority === "Medium"
                          ? Colors.PRIMARY_VARIANT
                          : Colors.GREY,
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.WHITE,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          priority === "Medium"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        backgroundColor:
                          priority === "Medium"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                      Medium
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPriority("Low");
                  setPriorityOpen(false);
                }}
                // style={{ marginVertical: res(10) }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      borderColor:
                        priority === "Low"
                          ? Colors.PRIMARY_VARIANT
                          : Colors.GREY,
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.WHITE,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          priority === "Low"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        backgroundColor:
                          priority === "Low"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                      Low
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

  function criteriaModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={criteriaOpen}
        onRequestClose={() => {
          setCriteriaOpen(!criteriaOpen);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setCriteria("");
            setCriteriaOpen(false);
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: "center",
              paddingTop: 80,
              paddingRight: 10,
              backgroundColor: Colors.BLACK_DIM_TRANSPARENT,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.WHITE,
                padding: 20,
                borderRadius: 12,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCriteria("Event");
                  setCriteriaOpen(false);
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
                        criteria === "Event"
                          ? Colors.PRIMARY_VARIANT
                          : Colors.GREY,
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.WHITE,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          criteria === "Event"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        backgroundColor:
                          criteria === "Event"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                      Event
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCriteria("Project");
                  setCriteriaOpen(false);
                }}
                style={{ marginTop: res(10) }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      borderColor:
                        criteria === "Project"
                          ? Colors.PRIMARY_VARIANT
                          : Colors.GREY,
                      borderWidth: 1,
                      borderRadius: 100,
                      backgroundColor: Colors.WHITE,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        borderColor:
                          criteria === "Project"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        backgroundColor:
                          criteria === "Project"
                            ? Colors.PRIMARY_VARIANT
                            : Colors.GREY,
                        // borderWidth:res(1),
                        borderRadius: 100,
                        height: 10,
                        width: 10,

                        margin: 6,
                      }}
                    />
                  </View>
                  <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                    <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                      Project
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

  const [resultOfTemp, setResultOfTemp] = useState([]);

  useEffect(() => {
    if (resultOfTemp?.length !== 0) {
      setGetAllTheUsersDup(resultOfTemp);
      setResultOfTemp([]);
    }
  }, [resultOfTemp]);

  const userListRender = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        // disabled={item?.selected === true ? true : false}
        onPress={() => {
          let tempArray = getAllTheUsersDup;
          if (item?.isChecked == false) {
            tempArray[index] = {
              ...item,
              isChecked: true,
            };
            setResultOfTemp(tempArray);
          } else {
            tempArray[index] = {
              ...item,
              isChecked: false,
            };
            setResultOfTemp(tempArray);
          }
        }}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
          borderRadius: res(12),
          paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}
      >
        <View
          style={{
            paddingHorizontal: res(10),
            paddingVertical: res(5),
            flex: 1,
            flexDirection: "row",
          }}
        >
          {item?.isChecked === false ? (
            <Image
              source={EmptyBox}
              style={{
                height: res(15),
                width: res(15),
                marginRight: res(5),
                alignSelf: "center",
              }}
            />
          ) : (
            <Image
              source={TickBox}
              style={{
                height: res(15),
                width: res(15),
                marginRight: res(5),
                alignSelf: "center",
              }}
            />
          )}
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color:
                item?.selected === true ? Colors.DARK_GREY : Colors.darkBlack,
              fontSize: res(12),
              alignSelf: "center",
              fontWeight: item?.selected === true ? "300" : "700",
            }}
          >
            {item?.fullname}
          </Text>
          {/* {item?.selected === true ? (
            <TouchableOpacity onPress={() => removeMember(item)}>
              <Image
                source={{
                  uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-512.png",
                }}
                style={{ height: res(20), width: res(20) }}
              />
            </TouchableOpacity>
          ) : null} */}
        </View>
      </TouchableOpacity>
    );
  };

  function AssignTo() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={assignToOpen}
        onRequestClose={() => {
          setAssignToOpen(!assignToOpen);
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
              borderRadius: res(8),
              padding: res(6),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: res(10),
                paddingVertical: res(8),
              }}
            >
              <Text
                style={[
                  {
                    alignSelf: "center",
                    fontSize: res(18),
                    color: Colors.darkBlack,
                    fontWeight: "600",
                  },
                ]}
              >
                Add Assigned To
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => {
                  Keyboard.dismiss();
                  setAssignToOpen(false);
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
                height: res(300),
                backgroundColor: Colors.WHITE_TRANSPARENT,
              }}
            >
              <FlatList
                bounces={false}
                data={getAllTheUsersDup}
                renderItem={userListRender}
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
                      No user Found!
                    </Text>
                  )
                }
              />
              <TouchableOpacity
                onPress={() => {
                  let MultipleUserId = getAllTheUsersDup
                    ?.filter((item) => item?.isChecked === true)
                    ?.map((item) => item?.staff_id)
                    ?.join(",");
                  let MultipleUserName = getAllTheUsersDup
                    ?.filter((item) => item?.isChecked === true)
                    ?.map((item) => item?.fullname)
                    ?.join(", ");
                  setAssignTo(MultipleUserName);
                  setGetAllMultipleUser(MultipleUserId);
                  setAssignToOpen(false);
                }}
                style={{
                  // bottom: 0,
                  borderRadius: res(100),
                  borderWidth: 0.4,
                  backgroundColor: Colors.themeColor,
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
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  async function removeMember(item) {
    try {
      let loginResponse = await api.deleteTodoProject(item?.project_name);
      if (loginResponse) {
        Toast.show("Member removed!", 4000);
        getTODOProjects();
      }
      setModal(false);
    } catch (error) {
      Toast.show(error, 4000);
    }
    setAddMember(false);
  }

  const userListRenderProject = ({ item, index }) => {
    console.log("item", item);
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        disabled={item?.selected === true ? true : false}
        onPress={() => {
          setProject(item);
        }}
        style={{
          flexDirection: "row",
          backgroundColor: Colors.white,
          borderRadius: res(12),
          //   paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}
      >
        <View
          style={{
            paddingHorizontal: res(10),
            paddingVertical: res(5),
            flex: 1,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setProject(item?.project_name);
              setProjectID(item?.project_id);
              setProjectOpen(false);
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
                    project === item?.project_name
                      ? Colors.PRIMARY_VARIANT
                      : Colors.GREY,
                  borderWidth: 1,
                  borderRadius: 100,
                  backgroundColor: Colors.WHITE,
                  marginRight: 10,
                }}
              >
                <View
                  style={{
                    borderColor:
                      project === item?.project_name
                        ? Colors.PRIMARY_VARIANT
                        : Colors.GREY,
                    backgroundColor:
                      project === item?.project_name
                        ? Colors.PRIMARY_VARIANT
                        : Colors.GREY,
                    // borderWidth:res(1),
                    borderRadius: 100,
                    height: 10,
                    width: 10,

                    margin: 6,
                  }}
                />
              </View>
              <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                <Text style={{ fontSize: 16, color: Colors.BLACK }}>
                  {item?.project_name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setProjectOpen(false);
            setUpdateOldProject(true);
            setProjectName(item?.project_name);
            setUpdateOldProjectValue(item);
            setTimeout(() => {
              setCreateProject(true);
            }, 100);
          }}
        >
          <Image
            source={EditIcon}
            style={{ height: res(25), width: res(25), alignSelf: "center" }}
            // tintColor={Colors.themeColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeMember(item)}>
          <Image
            source={{
              uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-512.png",
            }}
            style={{ height: res(20), width: res(20), alignSelf: "center" }}
            tintColor={Colors.themeColor}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  function showModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={createNewProject}
        onRequestClose={() => {
          setCreateProject(!createNewProject);
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
              borderRadius: res(8),
              padding: res(6),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: res(10),
                paddingVertical: res(8),
              }}
            >
              <Text
                style={[
                  {
                    alignSelf: "center",
                    fontSize: res(18),
                    color: Colors.darkBlack,
                    fontWeight: "600",
                  },
                ]}
              >
                {UpdateOldProject === true ? "Update" : "Create"} Project
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => {
                  Keyboard.dismiss();
                  setCreateProject(false);
                  setTimeout(() => {
                    setProjectOpen(true);
                  }, 100);
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
                borderRadius: res(6),
                borderWidth: res(1),
                borderColor: Colors.border,
                marginBottom: res(5),
                marginHorizontal: res(10),
                marginVertical: res(10),
              }}
            >
              <TextInput
                placeholderTextColor={Colors.liteBlack}
                placeholder={"Project Name"}
                value={projectName}
                onChangeText={(value) => setProjectName(value)}
                autoFocus={false}
                cursorColor={"black"}
                style={{
                  borderRadius: res(8),
                  color: Colors.darkBlack,
                  backgroundColor: Colors.white,
                  fontSize: res(12),
                  borderRadius: res(100),
                }}
              />
            </View>
            <TouchableOpacity
              disabled={projectName !== "" ? false : true}
              style={{
                backgroundColor:
                  projectName !== "" ? Colors.themeColor : Colors.liteGreyShade,
                borderRadius: res(100),
                marginVertical: res(10),
                marginHorizontal: res(20),
              }}
              onPress={() => {
                Keyboard.dismiss();
                if (UpdateOldProject === true) {
                  updateTODOProject();
                } else {
                  createTODOProject();
                }
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: res(12),
                  alignSelf: "center",
                  fontWeight: "700",
                  textAlign: "center",
                  paddingVertical: res(8),
                  paddingHorizontal: res(12),
                }}
              >
                {UpdateOldProject === true ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function Project() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={projectOpen}
        onRequestClose={() => {
          setProjectOpen(!projectOpen);
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
              borderRadius: res(8),
              padding: res(6),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: res(10),
                paddingVertical: res(8),
              }}
            >
              <Text
                style={[
                  {
                    alignSelf: "center",
                    fontSize: res(18),
                    color: Colors.darkBlack,
                    fontWeight: "600",
                  },
                ]}
              >
                Select the Project
              </Text>
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={() => {
                  Keyboard.dismiss();
                  setProjectOpen(false);
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
                height: res(300),
                backgroundColor: Colors.WHITE_TRANSPARENT,
              }}
            >
              <FlatList
                bounces={false}
                data={toDoListProjects}
                renderItem={userListRenderProject}
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
                      No user Found!
                    </Text>
                  )
                }
              />
              <TouchableOpacity
                disabled={criteria === "Project" ? false : true}
                onPress={() => {
                  setProjectOpen(false);
                  setTimeout(() => {
                    setCreateProject(true);
                  }, 100);
                }}
                style={{
                  // bottom: 0,
                  borderRadius: res(100),
                  borderWidth: 0.4,
                  backgroundColor:
                    criteria === "Project"
                      ? Colors.themeColor
                      : Colors.liteGreyShade,
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
                  Create New Project
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header name={"Todo Creations"} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: res(10) }}
      >
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "600",
            marginTop: res(10),
          }}
        >
          Priority
        </Text>
        <TouchableOpacity
          onPress={() => setPriorityOpen(true)}
          style={{
            borderRadius: res(8),
            borderColor: "#DEDEDE",
            borderWidth: 0.8,
            backgroundColor: Colors.white,
            paddingHorizontal: res(10),
            flex: 1,
            paddingVertical: res(12),
            marginVertical: res(4),
          }}
        >
          <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
            {priority}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "600",
          }}
        >
          Assign To
        </Text>
        <TouchableOpacity
          onPress={() => setAssignToOpen(true)}
          style={{
            borderRadius: res(8),
            borderColor: "#DEDEDE",
            borderWidth: 0.8,
            backgroundColor: Colors.white,
            paddingHorizontal: res(10),
            flex: 1,
            paddingVertical: res(12),
            marginVertical: res(4),
          }}
        >
          <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
            {assignTo}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "500",
          }}
        >
          {"From Date"}
        </Text>
        <View
          style={{
            borderRadius: res(8),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginVertical: res(5),
          }}
        >
          {dateShoe === true ? (
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
            />
          ) : (
            <TouchableOpacity
              onPress={() => setDateShow(true)}
              style={{
                borderRadius: res(8),
                backgroundColor: Colors.white,
                paddingHorizontal: res(10),
                flex: 1,
                marginVertical: res(10),
              }}
            >
              <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
                {moment(LeaveDate)?.format("DD-MM-YYYY")}
              </Text>
            </TouchableOpacity>
          )}
          {dateShoe === true ? (
            <Button title="OK" onPress={() => setDateShow(false)} />
          ) : null}
        </View>
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
          {dateShoeTo === true ? (
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
            />
          ) : (
            <TouchableOpacity
              onPress={() => setDateShowTo(true)}
              style={{
                borderRadius: res(8),
                backgroundColor: Colors.white,
                paddingHorizontal: res(10),
                flex: 1,
                marginVertical: res(10),
              }}
            >
              <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
                {moment(LeaveDateTo)?.format("DD-MM-YYYY")}
              </Text>
            </TouchableOpacity>
          )}
          {dateShoeTo === true ? (
            <Button title="OK" onPress={() => setDateShowTo(false)} />
          ) : null}
        </View>
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "600",
          }}
        >
          Criteria
        </Text>
        <TouchableOpacity
          onPress={() => setCriteriaOpen(true)}
          style={{
            borderRadius: res(8),
            borderColor: "#DEDEDE",
            borderWidth: 0.8,
            backgroundColor: Colors.white,
            paddingHorizontal: res(10),
            flex: 1,
            paddingVertical: res(12),
            marginVertical: res(4),
          }}
        >
          <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
            {criteria}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "600",
          }}
        >
          Project
        </Text>
        <TouchableOpacity
          onPress={() => setProjectOpen(true)}
          style={{
            borderRadius: res(8),
            borderColor: "#DEDEDE",
            borderWidth: 0.8,
            backgroundColor: Colors.white,
            paddingHorizontal: res(10),
            flex: 1,
            paddingVertical: res(12),
            marginVertical: res(4),
          }}
        >
          <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>
            {project}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.liteBlack,
            fontSize: res(14),
            alignSelf: "flex-start",
            fontWeight: "500",
          }}
        >
          Work Description
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
            placeholder={"Enter Work Description"}
            value={reason}
            onChangeText={(value) => setReason(value)}
            cursorColor={Colors.liteBlack}
            maxLength={160}
            style={{
              alignContent: "flex-start",
              borderRadius: res(8),
              color: Colors.darkBlack,
              backgroundColor: Colors.white,
              fontSize: res(12),
              paddingHorizontal: res(10),
              width: "100%",
              // flex: 1,
            }}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        disabled={
          reason !== "" &&
          priority !== "" &&
          getAllMultipleUser !== "" &&
          criteria !== "" &&
          (criteria === "Event"
            ? projectID === "" || projectID !== ""
            : projectID !== "")
            ? false
            : true
        }
        onPress={() => {
          if (route?.params?.routeData !== undefined) {
            updateTODOItem(route?.params?.routeData?.todo_id);
          } else {
            createTODOItem();
          }
        }}
        activeOpacity={0.5}
        style={{
          bottom: 0,
          marginVertical: res(15),
          marginHorizontal: res(10),
          backgroundColor:
            reason !== "" &&
            priority !== "" &&
            getAllMultipleUser !== "" &&
            criteria !== "" &&
            (criteria === "Event"
              ? projectID === "" || projectID !== ""
              : projectID !== "")
              ? Colors.themeColor
              : Colors.liteGreyShade,
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
          {route?.params?.routeData !== undefined ? "Update" : "Create"}
        </Text>
      </TouchableOpacity>
      {modal === true ? (
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal>
      ) : null}
      {responsibleStaffModal()}
      {AssignTo()}
      {criteriaModal()}
      {Project()}
      {showModal()}
    </View>
  );
};

export default TodoCreation;

const styles = StyleSheet.create({});
