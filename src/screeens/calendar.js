import {
  Image,
  Keyboard,
  Linking,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { Agenda } from "react-native-calendars";
import { Colors } from "../utills/colors";
import res from "../components/responsive";
import { api, storage } from "../services";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import Loaders from "../components/Loader";
import DocumentPicker, { types } from 'react-native-document-picker'
import { BASE_URL, URL } from "../services/constants";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const Calendar = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [itemsTemp, setItemsTemp] = useState([]);
  const [getLoginDate, setLoginData] = useState({});
  const [modal, setModal] = useState(false);
  const [showModalData, setShowModal] = useState(false);
  const [showModalDatas, setShowModalData] = useState({});
  const [remarks, setRemarks] = useState("");
  const [storeOldDate, setStoreOldDate] = useState({});
  const [updateStatus, setUpdateStatus] = useState("");
  const isFocus = useIsFocused()
  const [remarksView, setRemarksView] = useState(false)
  const [remarksViewData, setRemarksViewData] = useState([])

  const fetchLocalData = async () => {
    let res = await storage.getSaveUserDate();
    setLoginData(res);
  };

  useEffect(() => {
    fetchLocalData();
  }, []);

  useEffect(() => {
    if (getLoginDate?.staff_id !== undefined && isFocus === true) {
      getAllTheCalendarEvents();
    }
  }, [getLoginDate, isFocus]);

  const getAllTheCalendarEvents = async (value) => {
    if (value === 'passing') {
      setItems([])
    }
    try {
      let loginResponse = await api.getAllUserEvents(
        getLoginDate?.designation,
        getLoginDate?.staff_id?.toString()
      );
      if (loginResponse === "No Record Found") {
        let earliestDate = new Date()
        const formattedEarliestDate = {
          dateString: earliestDate.toISOString().split('T')[0],
          day: earliestDate.getDate(),
          month: earliestDate.getMonth() + 1,
          timestamp: earliestDate.getTime(),
          year: earliestDate.getFullYear(),
        };
        loadItems(formattedEarliestDate);
        Toast.show(loginResponse, 4000);
      } else {
        setItems(loginResponse);
        setItemsTemp(loginResponse)
        setUpdateStatus(true);

      }
    } catch (error) {
      Toast.show(error, 4000);
    }
  };

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

  const calendarUpdateStatus = async (work_status) => {
    setModal(true);
    try {
      let formData = new FormData();
      formData.append("work_title", showModalDatas?.worktitle);
      formData.append("work_id", showModalDatas?.workid?.toString());
      formData.append("work_status", work_status?.toString());
      formData.append("work_status_description", remarks?.toString());
      formData.append("tableidentifier", showModalDatas?.tableidentifier);


      if (work_status === 3) {

        formData.append('file', {
          uri: documentValue[0]?.uri,
          type: documentValue[0]?.type,
          name: documentValue[0]?.name
        });
      } else {
        formData.append("file", "");
      }

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

          });
          setModal(false);
          setShowModal(false);
          setRemarks("");
          getAllTheCalendarEvents();
          setShowModalData({});
        }
      )
        .catch(function (err) {
          setModal(false);
          setShowModal(false)
          setRemarks("");
          setShowModalData({});
        });
    } catch (error) {
      Toast.show(error, 4000);
      setShowModal(false);
      setRemarks("");
      setShowModalData({});
    }
  };

  const getRemarkView = async (work_id, tableidentifier) => {
    try {
      let loginResponse = await api.viewRemarks(work_id, tableidentifier);
      if (loginResponse) {
        setModal(true);
        setRemarksViewData(loginResponse);
        setTimeout(() => {
          setRemarksView(true);
          setShowModal(true);
        }, 1000);
      }
      setShowModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setShowModal(false)
    }
  };

  useEffect(() => {
    if (updateStatus === true) {
      loadItems(storeOldDate);
      setUpdateStatus(false);
    }
  }, [updateStatus]);

  const loadItems = (day) => {
    let events = itemsTemp;
    setStoreOldDate(day);
    const currentMonth = moment().format("MM");
    const currentYear = moment().format("YYYY");

    // Clear newItems at the beginning
    const newItems = {};

    events !== undefined && events.forEach((originalItem, index) => {
      const startDate = moment(originalItem?.fromdate);
      const endDate = moment(originalItem?.todate);

      let currentDate = startDate.clone();

      while (currentDate.isSameOrBefore(endDate, 'day')) {
        const strTime = currentDate.format("YYYY-MM-DD");

        if (currentDate.format("MM") === currentMonth && currentDate.format("YYYY") === currentYear) {
          if (!newItems[strTime]) {
            newItems[strTime] = [];
          }

          const event = {
            name: `${originalItem?.worktitle} - #${index}`,
            start: startDate.format("YYYY-MM-DD hh:mm a"),
            end: endDate.format("YYYY-MM-DD hh:mm a"),
            workid: originalItem?.workid,
            worktitle: originalItem?.worktitle,
            tableidentifier: originalItem?.tableidentifier,
            workstatus:
              originalItem?.workstatus === 0
                ? "Assigned"
                : originalItem?.workstatus === 1
                  ? "In Progress"
                  : originalItem?.workstatus === 3
                    ? "Completed"
                    : "Pending",
            type: "Follow Up",
            date: strTime,
            key: index,
            id: strTime + "#" + index,
            showitem: true,
            height: Math.max(50, Math.floor(Math.random() * 150)),
          };

          newItems[strTime].push(event);
        } else if (currentDate.format("MM") !== currentMonth && currentDate.format("YYYY") === currentYear) {
          if (!newItems[strTime]) {
            newItems[strTime] = [];
          }

          const event = {
            name: `${originalItem?.worktitle} - #${index}`,
            start: startDate.format("YYYY-MM-DD hh:mm a"),
            end: endDate.format("YYYY-MM-DD hh:mm a"),
            workid: originalItem?.workid,
            worktitle: originalItem?.worktitle,
            tableidentifier: originalItem?.tableidentifier,
            workstatus:
              originalItem?.workstatus === 0
                ? "Assigned"
                : originalItem?.workstatus === 1
                  ? "In Progress"
                  : originalItem?.workstatus === 3
                    ? "Completed"
                    : "Pending",
            type: "Follow Up",
            date: strTime,
            key: index,
            id: strTime + "#" + index,
            showitem: true,
            height: Math.max(50, Math.floor(Math.random() * 150)),
          };

          newItems[strTime].push(event);
        }

        currentDate.add(1, "days");
      }
    });

    // Fill the empty dates
    const currentDate = moment(day.timestamp);
    const lastDate = moment(day.timestamp + 28 * 24 * 60 * 60 * 1000);
    while (currentDate.isBefore(lastDate)) {
      const strTime = currentDate.format("YYYY-MM-DD");
      if (!newItems[strTime]) {
        newItems[strTime] = [];
      }
      currentDate.add(1, "days");
    }

    setItems((prevItems) => ({ ...prevItems, ...newItems }));
    setModal(false);
  };

  const renderItem = (item) => {
    const displayitem = item.showitem;
    return (
      <View>
        {displayitem ? (
          <TouchableOpacity
            style={[styles.item]}
            onPress={() => {
              Keyboard.dismiss()
              setShowModalData(item);
              setShowModal(true)
            }
            }
          >
            <View>
              <Text style={styles.name}>{item?.worktitle}</Text>
              <Text
                style={[
                  styles.type,
                  {
                    color:
                      item.workstatus === "Assigned"
                        ? Colors.themeColor
                        : item.workstatus === "In Progress"
                          ? Colors.orenge
                          : item.workstatus === "Completed"
                            ? Colors.liteGreen
                            : "red",
                  },
                ]}
              >
                {" "}
                {item.workstatus}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.item, { backgroundColor: "red" }]} />
        )}
      </View>
    );
  };

  const renderEmptyDate = () => (
    <View style={{
      backgroundColor: "white",
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
    }}>
      <Text style={{ fontSize: res(12), color: Colors.darkBlack, textAlign: 'auto' }}>No events for this date</Text>
    </View>
  );

  function showModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModalData}
        onRequestClose={() => {
          setShowModal(!showModalData);
        }}>

        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          {remarksView === true ?
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: Colors.white, padding: 20, borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.name, { alignSelf: 'center' }]}>{"Status"}</Text>
                <TouchableOpacity onPress={() => {
                  Keyboard.dismiss();
                  setRemarksView(false);
                  setShowModal(false);
                  setTimeout(() => {
                    setShowModal(true);
                  }, 1000);
                }}>
                  <Image
                    source={{
                      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s'
                    }}
                    style={{ height: res(20), width: res(20) }}
                  />
                </TouchableOpacity>
              </View>
              {remarksViewData?.filter((item, index) => item?.work_status === "1")?.length !== 0 ?
                (remarksViewData?.filter((item, index) => item?.work_status === "1")?.map((item, index) => {
                  return (
                    <View>
                      {index === 0 ?
                        <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                          {
                            item?.work_status === "1" ? "In Progress Remark" :
                              item?.work_status === "2" ? "Pending Remark" :
                                item?.work_status === "3" ? "Completed Remark" : ""
                          }
                        </Text> : null}
                      <View
                        style={{
                          borderRadius: res(8),
                          backgroundColor: '#DEDEDE',
                          paddingHorizontal: res(10),
                          paddingVertical: res(12),
                          marginVertical: res(4),
                        }}>
                        <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(item?.updated_date).format("YYYY-MM-DD") + "\n" + item?.remarks}</Text>
                      </View>
                    </View>
                  )
                })) :
                <View>

                  <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                    {
                      "In Progress Remark"
                    }
                  </Text>
                  <View
                    style={{
                      borderRadius: res(8),
                      backgroundColor: '#DEDEDE',
                      paddingHorizontal: res(10),
                      paddingVertical: res(12),
                      marginVertical: res(4),
                    }}>
                    <Text style={{ color: Colors.pinkTextCancel, fontSize: res(12) }}>{"No Completed Remark Uploaded"}</Text>
                  </View>
                </View>
              }

              {remarksViewData?.filter((item, index) => item?.work_status === "2")?.length !== 0 ?
                (remarksViewData?.filter((item, index) => item?.work_status === "2")?.map((item, index) => {
                  return (
                    <View>
                      {index === 0 ?
                        <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                          {
                            item?.work_status === "1" ? "In Progress Remark" :
                              item?.work_status === "2" ? "Pending Remark" :
                                item?.work_status === "3" ? "Completed Remark" : ""
                          }
                        </Text> : null}
                      <View
                        style={{
                          borderRadius: res(8),
                          backgroundColor: '#DEDEDE',
                          paddingHorizontal: res(10),
                          paddingVertical: res(12),
                          marginVertical: res(4),
                        }}>
                        <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(item?.updated_date).format("YYYY-MM-DD") + "\n" + item?.remarks}</Text>
                      </View>
                    </View>
                  )
                })) :
                <View>

                  <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                    {
                      "Pending Remark"
                    }
                  </Text>
                  <View
                    style={{
                      borderRadius: res(8),
                      backgroundColor: '#DEDEDE',
                      paddingHorizontal: res(10),
                      paddingVertical: res(12),
                      marginVertical: res(4),
                    }}>
                    <Text style={{ color: Colors.pinkTextCancel, fontSize: res(12) }}>{"No Pending Remark Uploaded"}</Text>
                  </View>
                </View>
              }

              {remarksViewData?.filter((item, index) => item?.work_status === "3")?.length !== 0 ?
                (remarksViewData?.filter((item, index) => item?.work_status === "3")?.map((item, index) => {
                  return (
                    <View>
                      {index === 0 ?
                        <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                          {
                            item?.work_status === "1" ? "In Progress Remark" :
                              item?.work_status === "2" ? "Pending Remark" :
                                item?.work_status === "3" ? "Completed Remark" : ""
                          }
                        </Text> : null}
                      <View
                        style={{
                          borderRadius: res(8),
                          backgroundColor: '#DEDEDE',
                          paddingHorizontal: res(10),
                          paddingVertical: res(12),
                          marginVertical: res(4),
                        }}>
                        <Text style={{ color: Colors.darkBlack, fontSize: res(12) }}>{moment(item?.updated_date).format("YYYY-MM-DD") + "\n" + item?.remarks}</Text>
                      </View>
                    </View>
                  )
                })) :
                <View>
                  <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>
                    {
                      "Completed Remark"
                    }
                  </Text>
                  <View
                    style={{
                      borderRadius: res(8),
                      backgroundColor: '#DEDEDE',
                      paddingHorizontal: res(10),
                      paddingVertical: res(12),
                      marginVertical: res(4),
                    }}>
                    <Text style={{ color: Colors.pinkTextCancel, fontSize: res(12) }}>{"No Completed Remark Uploaded"}</Text>
                  </View>
                </View>
              }

            </ScrollView> :
            <View style={{ backgroundColor: Colors.white, padding: 20, borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.name, { alignSelf: 'center' }]}>{showModalDatas?.worktitle}</Text>
                <TouchableOpacity onPress={() => {
                  Keyboard.dismiss()
                  setModal(false);
                  setShowModal(false);
                  setRemarksView(false);
                  setShowModalData([]);
                }}>
                  <Image
                    source={{
                      uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s'
                    }}
                    style={{ height: res(20), width: res(20) }}
                  />
                </TouchableOpacity>
              </View>
              {showModalDatas?.workstatus !== "Completed" ? <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>Upload your document </Text> : null}
              {showModalDatas?.workstatus !== "Completed" ? <Text style={[styles.name, { alignSelf: 'flex-start', fontSize: res(8), color: Colors.pinkTextCancel }]}>*Completed status only </Text> : null}
              {showModalDatas?.workstatus !== "Completed" ?
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
                    Upload
                  </Text>
                </TouchableOpacity> : null}
              {showModalDatas?.workstatus !== "Completed" ? <Text style={[styles.name, { alignSelf: 'flex-end', fontSize: res(8), color: Colors.themeColor }]}>{documentValue !== undefined ? documentValue[0]?.name : ""} </Text> : null}

              {showModalDatas?.workstatus !== "Completed" ? <Text style={[styles.name, { alignSelf: 'flex-start', marginVertical: res(5) }]}>Remarks</Text> : null}
              {showModalDatas?.workstatus !== "Completed" ?
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
                    placeholder={"Update your work status!"}
                    value={remarks}
                    editable={showModalDatas?.workstatus !== "Completed" ? true : false}
                    onChangeText={(value) => setRemarks(value)}
                    autoFocus={true}
                    cursorColor={"black"}
                    multiline={true}
                    style={{
                      borderRadius: res(8),
                      color: Colors.darkBlack,
                      backgroundColor: Colors.white,
                      fontSize: res(12),
                      paddingHorizontal: res(20)
                    }}
                  />
                </View> : null}
              {showModalDatas?.workstatus !== "Completed" ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    disabled={showModalDatas?.workstatus !== "Completed" && remarks !== "" ? false : true}
                    style={{ backgroundColor: showModalDatas?.workstatus !== "Completed" && remarks !== "" ? Colors.themeColor : Colors.liteGreyShade, borderRadius: res(100), marginVertical: res(10) }}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => {
                        calendarUpdateStatus(1);
                      }, 1000);
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(12),
                        alignSelf: "center",
                        fontWeight: "700",
                        textAlign: "center",
                        paddingVertical: res(8),
                        paddingHorizontal: res(12)
                      }}
                    >
                      In Progress
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={showModalDatas?.workstatus !== "Completed" && remarks !== "" ? false : true}
                    style={{ backgroundColor: showModalDatas?.workstatus !== "Completed" && remarks !== "" ? 'red' : Colors.liteGreyShade, borderRadius: res(100), marginVertical: res(10) }}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => {
                        calendarUpdateStatus(2);
                      }, 1000);
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(12),
                        alignSelf: "center",
                        fontWeight: "700",
                        textAlign: "center",
                        paddingVertical: res(8),
                        paddingHorizontal: res(12)
                      }}
                    >
                      Pending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={documentValue !== undefined && remarks !== "" && showModalDatas?.workstatus !== "Completed" ? false : true}
                    style={{ backgroundColor: documentValue !== undefined && remarks !== "" ? Colors.liteGreen : Colors.liteGreyShade, borderRadius: res(100), marginVertical: res(10) }}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => {
                        calendarUpdateStatus(3);
                      }, 1000);
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: res(12),
                        alignSelf: "center",
                        fontWeight: "700",
                        textAlign: "center",
                        paddingVertical: res(8),
                        paddingHorizontal: res(12)
                      }}
                    >
                      Completed
                    </Text>
                  </TouchableOpacity>
                </View> : null}
              <TouchableOpacity
                style={{ backgroundColor: Colors.liteGreyShade, borderRadius: res(100), marginVertical: res(10) }}
                onPress={() => {
                  Keyboard.dismiss();
                  setRemarksView(false);
                  getRemarkView(showModalDatas?.workid, showModalDatas?.tableidentifier);
                }}>
                <Text
                  style={{
                    color: Colors.liteBlack,
                    fontSize: res(12),
                    alignSelf: "center",
                    fontWeight: "700",
                    textAlign: "center",
                    paddingVertical: res(8),
                    paddingHorizontal: res(12)
                  }}
                >
                  View Remarks
                </Text>
              </TouchableOpacity>

            </View>
          }
        </View>
      </Modal>
    );
  }

  const rowHasChanged = (r1, r2) => {
    return r1 === r2;
  }

  return (
    <View style={{ flex: 1 }}>
      <Header name={"Calendar"} routeData={itemsTemp}/>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        theme={{
          agendaTodayColor: Colors.themeColor,
          agendaKnobColor: Colors.themeColor,
        }}
      />
      {showModal()}
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  addbutton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  name: {
    fontSize: 18,
    color: Colors.darkBlack,
    fontWeight: "600",
  },
  timing: {
    color: "red",
  },
  type: {
    color: "#03A9F4",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  modalContent: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
  },
});