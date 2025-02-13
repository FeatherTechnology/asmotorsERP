// Production
export const BASE_URL = "http://sugabeautycare-001-site6.ctempurl.com/api";
// Testing
// export const BASE_URL = "http://spfeather-002-site4.atempurl.com/api";

export const URL = {
  //USER
  LOGIN: "/Users/login", //Done
  REGISTER:"/Users/CreateUserAccount", //Done

  //USER AND MANAGER
  HOME_COUNT:"/Attendance/getAttendanceCount", //Done
  HOME_LIST:"/Attendance/getAllAttendanceDetails", //Done
  INSERT_LEAVE:"/Attendance/insertApplyLeave",

  //MANAGER
  APPROVE_LEAVE:"/Attendance/updatestatus",//Done
  MANAGER_COUNT:'/Attendance/getManagerListCount',//Done

  //Calendar
  CALENDAR:"/Calendar/getCalendarBasedOnDepartmentEvents", //Done
  CALENDAR_UPDATE:"/Calendar/UpdateWorkStatus_V2", //Done
  CALENDAR_VIEW:"/Calendar/GetWorkItemDetails", //Done
  //TODO
  GET_TODO_ITEMS:"/Calendar/GetTODOItems", //Done
  GET_TODO_PROJECTS:"/Calendar/GetTODOProjects", //Done
  CREATE_TODO_ITEM:"/Calendar/CreateToDoItem", //Done
  CREATE_TODO_PROJECT:"/Calendar/CreateTODOProject", //Done
  UPDATE_TODO_ITEM:"/Calendar/UpdateToDoItem", //Done
  UPDATE_TODO_PROJECT:"/Calendar/UpdateToDoProject",//Done
  DELETE_TODO_PROJECT:"/Calendar/DeleteToDoProject",//Done
  GET_WORK_ITEMS_HISTORY:"/Calendar/GetWorkItemsHistory",
  GET_DAILY_TASKS:"/Calendar/GetDailyTasks",
  
  //CHAT
  GET_ALL_USER:'/Users/getALLUsersDetails', //Done
  GER_LIST_CHAT:"/Attendance/getMessages",//Done
  INSERT_MESSAGE:"/Attendance/insertMessages",//Done
  CLOSED_MESSAGE_TIME:"/Attendance/UpdateLastSeen",//Done
  CLOSED_MESSAGE_COUNT:"/Attendance/GetUnreadMessageCount",//Done
  GET_ASSET_HISTORY:"/Attendance/GetAssertHistory",

  //Team
  INSERT_TEAM_MESSAGE:"/Attendance/InsertTeamMessage",//POST  {  "teamid": "3",  "userid": "9",  "message": "New Test Message"}
  CREATE_TEAM:"/Attendance/CreateTeamandMembers",//POST  {  "teamname": "Testin Team 3",  "userid": "10"}
  GET_ALL_TEAM_LIST_COUNT:"/Attendance/GetTeamUnreadMessageCount",//GET  ?userid=6 //counts
  GET_ALL_TEAM_LAST_SEEN:"/Attendance/UpdateTeamLastSeen",//POST ?userid=6&teamid=2
  GET_ALL_THE_USER:"/Attendance/GetUsersTeams",//GET  ?userid=6 //List of teams
  GET_ALL_TEAM_LIST:"/Attendance/GetTeamDetails", //GET  ?teamid=2 //Addeduser list
  GET_ALL_MESSAGES:"/Attendance/GetTeamMessages", //GET  ?  userid=6&teamid=2  //All messages
  DELETE_TEAM_MEMBERS:"/Attendance/DeleteTeamMembers",
  CREATE_MULTIPLE_TEAM_MEMBERS:"/Attendance/CreateMultiplTeamMembers",

  //NOTIFICATE
  NOTIFICATION:"/Notification/GetLeaveNotificationList_V2",
  NOTIFICATION_SECTIONS:"/Notification/GetLeaveNotificationList",

  //Daily Performence
  DAILY_PERFORMANCE_POST:"/Attendance/UpdatePerformanceData",
  DAILY_PERFORMANCE_GET:"/Attendance/GetDailyPerformanceData"

};


export const LOGINDATE = "LOGINDATE";
export const regex =
  "\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED";
