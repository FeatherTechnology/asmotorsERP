import axios from "axios";
import React from "react";
import { URL, BASE_URL } from "./constants";
import { Alert, BackHandler } from "react-native";
import { clearAsyncStorage } from "./storage";
import Toast from "react-native-simple-toast";

//post
export const loginAPI = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.LOGIN, data, config);

export const createAccount = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.REGISTER, data, config);

export const insertLeave = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.INSERT_LEAVE, data, config);

export const approveLeave = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.APPROVE_LEAVE, data, config);

export const calendarUpdate = async (data, header) =>
  await post(BASE_URL + URL.CALENDAR_UPDATE, data, header);


//Individual
export const insertNewMessage = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.INSERT_MESSAGE, data, config);

export const postOutTime = async (senderid, receiverid, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.CLOSED_MESSAGE_TIME + "?senderid=" + senderid + "&receiverid=" + receiverid, config);

//Team
export const postOutTimeTeam = async (userid, teamid, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.GET_ALL_TEAM_LAST_SEEN + "?userid=" + userid + "&teamid=" + teamid, config);

export const insertNewMessageTeam = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.INSERT_TEAM_MESSAGE, data, config);

export const createTeam = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.CREATE_TEAM, data, config);

export const createMultipleTeamMember = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.CREATE_MULTIPLE_TEAM_MEMBERS, data, config);

export const deleteTeamMember = async (userid, teamid, config = { timeout: 10000 }) =>
  await deleteMethod(BASE_URL + URL.DELETE_TEAM_MEMBERS + "?userid=" + userid + "&teamid=" + teamid, config);

//TODO ITEMS:-
export const deleteTodoProject = async (projectname, config = { timeout: 10000 }) =>
  await deleteMethod(BASE_URL + URL.DELETE_TODO_PROJECT + "?projectname=" + projectname, config);

export const createTodoProject = async (projectname, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.CREATE_TODO_PROJECT + "?projectname=" + projectname, config);

export const createTodoItem = async (WorkDescription, PriorityId, AssignToId, FromDate, ToDate, Criteria, ProjectId, UserId, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.CREATE_TODO_ITEM + "?WorkDescription=" + WorkDescription +
    "&PriorityId=" + PriorityId + "&AssignToId=" + AssignToId + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Criteria=" + Criteria + "&ProjectId=" + ProjectId + "&UserId=" + UserId, config);

export const UpdateTodoItem = async (WorkDescription, PriorityId, AssignToId, FromDate, ToDate, Criteria, ProjectId, UserId, ToDoId, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.UPDATE_TODO_ITEM + "?WorkDescription=" + WorkDescription +
    "&PriorityId=" + PriorityId + "&AssignToId=" + AssignToId + "&FromDate=" + FromDate + "&ToDate=" + ToDate + "&Criteria=" + Criteria + "&ProjectId=" + ProjectId + "&UserId=" + UserId + "&ToDoId=" + ToDoId, config);

export const UpdateTodoProject = async (oldprojectname, newprojectname, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.UPDATE_TODO_PROJECT + "?oldprojectname=" + oldprojectname + "&newprojectname=" + newprojectname, config);

export const getTodoItems = async (userid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_TODO_ITEMS + "?userid=" + userid, config);

export const getTodoProject = async (config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_TODO_PROJECTS, config);

//History 
export const getHistoryOfCalender = async (refernceid, tableidentifier, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_WORK_ITEMS_HISTORY + "?refernceid=" + refernceid + "&tableidentifier=" + tableidentifier, config);

//Daily Task Entry
export const getDailyTaskEntry = async (designation, staffid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_DAILY_TASKS + "?designation=" + designation + "&staffid=" + staffid, config);

//Assert History
export const getAssertHistory = async (assertid, staffid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ASSET_HISTORY + "?assertid=" + assertid + "&staffid=" + staffid, config);

//Daily Performance
export const postAllDailyPerformance = async (data, config = { timeout: 10000 }) =>
  await post(BASE_URL + URL.DAILY_PERFORMANCE_POST, data, config);

//get
//User and Manager
export const attendanceCount = async (staffID, roleid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.HOME_COUNT + "?staffid=" + staffID + "&roleid=" + roleid, config);

export const attendanceList = async (staffID, roleid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.HOME_LIST + "?staffid=" + staffID + "&roleid=" + roleid, config);

export const getAllUserEvents = async (designation, staffid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.CALENDAR + "?designation=" + designation + "&staffid=" + staffid, config);

export const viewRemarks = async (workitemid, tableidentifier, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.CALENDAR_VIEW + "?workitemid=" + workitemid + "&tableidentifier=" + tableidentifier, config);

//Manager
export const getMangersCount = async (Manager_id, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.MANAGER_COUNT + "?Manager_id=" + Manager_id, config);

//Chat  
export const getAllUser = async (config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ALL_USER, config);

export const getCounts = async (receiverid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.CLOSED_MESSAGE_COUNT + "?receiverid=" + receiverid, config);

export const getAllMessage = async (SenderId, ReceiverId, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GER_LIST_CHAT + "?SenderId=" + SenderId + "&ReceiverId=" + ReceiverId, config);

export const getAllMessaegList = async (staffid, roleid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.NOTIFICATION + "?staffid=" + staffid + "&roleid=" + roleid, config);

export const getAllMessaegList1 = async (staffid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.NOTIFICATION_SECTIONS + "?staffid=" + staffid, config);

//Team chat
export const getTeamMessagesCount = async (userid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ALL_TEAM_LIST_COUNT + "?userid=" + userid, config);

export const getTeamsList = async (userid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ALL_THE_USER + "?userid=" + userid, config);

export const getTeamChatsList = async (teamid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ALL_TEAM_LIST + "?teamid=" + teamid, config);

export const getAllMessges = async (teamid, userid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.GET_ALL_MESSAGES + "?teamid=" + teamid + "&userid=" + userid, config);

//Daily Performance
export const getAllDailyPerformance = async (date, staffid, config = { timeout: 10000 }) =>
  await get(BASE_URL + URL.DAILY_PERFORMANCE_GET + "?date=" + date + "&staffid=" + staffid, config);

const get = async (url, config) => {
  console.log("url", url,config);
  try {
    let res = await axios.get(url, config);
    console.log("res", res);
    return prepareResponse(res);
  } catch (err) {
    console.log("err", err);
    return handleException(err);
  }
};
const post = async (url, data, config) => {
  console.log("url", url, data, config);
  try {
    let res = await axios.post(url, data, config);
    console.log("res", res);
    return prepareResponse(res);
  } catch (err) {
    console.log("err", err);
    return handleException(err);
  }
};

const deleteMethod = async (url, data, config) => {
  console.log("url", url, data, config);
  try {
    let res = await axios.delete(url, data, config);
    console.log("res", res);
    return prepareResponse(res);
  } catch (err) {
    console.log("err", err);
    return handleException(err);
  }
};

const handleException = (err) => {
  try {
    if (err?.response?.data) {
      let { data, status, statusText, headers, config, request } = err.response;
      if (status === 400) {
        // Handle 400 Bad Request
        Alert.alert("Validation Failed", data?.message || "Unhandled validation occurred");
      } else if (status === 401) {
        // Handle 401 Unauthorized
        Alert.alert(
          "Unauthenticated Access",
          "Session Closed. Close your app and reopen",
          [
            {
              text: "Close",
              onPress: async () => {
                await clearAsyncStorage();
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: false }
        );
      } else if (status === 404) {
        // Handle 404 Not Found
        Alert.alert("Page Not Found", "This API could not be found");
      } else if (status === 415) {
        // Handle 415 Unsupported Media Type
        Alert.alert("Unsupported Media Type", "The server does not support the media type of the request");
      } else {
        // Handle other status codes
        Toast.show(`Server returns ${status}. Please try again later`, 2000);
      }
    } else {
      // Handle other errors
      Toast.show(`Server returns ${err}. Please try again later`, 2000);
    }
  } catch (error) {
    Toast.show(`Server returns ${error}. Please try again later`, 2000);
  }
  return null;
};

const prepareResponse = (res) => {
  if (res?.status) {
    let { status, data = {} } = res;
    if (status >= 200 && status <= 299) {
      return data;
    } else {
      Toast.show(
        "Internal server error" +
        `Status Code : ${status}\nMessage : ${data?.message}`, 4000
      );
    }
  }
  else {
    Toast.show(`Server returns ${res}. Please try again later`, 2000);
  }
  return {};
};
