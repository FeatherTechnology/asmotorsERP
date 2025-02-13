// In App.js in a new project

import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../screeens/splash";
import Home from "../screeens/home";
import Calendar from "../screeens/calendar";
import Login from "../screeens/login";
import Register from "../screeens/register";
import Chat from "../screeens/chat";
import BottomStackNavigator from "./tabNav";
import Notifications from "../screeens/notifications";
import IndividualChat from "../screeens/individualChat";
import LeaveRequest from "../screeens/leaveRequest";
import AppliedListScreens from "../screeens/appliedListScreens";
import {
  horizontalAnimation,
  verticalAnimation,
} from "../components/transitionOne";
import ForgotPassword from "../screeens/forgotPassword";
import DetailingList from "../screeens/detailingList";
import GroupChat from "../screeens/groupChat";
import DailyPerformance from "../screeens/dailyPerformance";
import EditDailyPerformance from "../screeens/editDailyPerformance";
import { ASMotorsContext } from "./context";
import ToDoPage from "../screeens/todo";
import TodoCreation from "../screeens/todoCreation";
import DailyTasksEntry from "../screeens/dailyTaskEntry";
import TargetHistory from "../screeens/targetHistory";
import EditDailyTaskEntry from "../screeens/editDailyTaskEntry";
import CalendarHistroy from "../screeens/calendarHistory";

const Stack = createStackNavigator();
function StackNav(props) {
  const [notificationCount, setNotificaitonCount] = useState();
  const [notificationCountPersonal, setNotificaitonCountPersonal] = useState();
  const [notificationCountTeam, setNotificaitonCountTeam] = useState();

  return (
    <ASMotorsContext.Provider
      value={{
        notificationCount: notificationCount,
        notificationCountPersonal: notificationCountPersonal,
        notificationCountTeam: notificationCountTeam,
        setNotificaitonCount: setNotificaitonCount,
        setNotificaitonCountPersonal: setNotificaitonCountPersonal,
        setNotificaitonCountTeam: setNotificaitonCountTeam
      }}
    >
      <Stack.Navigator
        initialRouteName={"Splash"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="BottomStackNavigator"
          component={BottomStackNavigator}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="AppliedListScreens"
          component={AppliedListScreens}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Calendar"
          component={Calendar}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="IndividualChat"
          component={IndividualChat}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="LeaveRequest"
          component={LeaveRequest}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="DetailingList"
          component={DetailingList}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="DailyPerformance"
          component={DailyPerformance}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="DailyTasksEntry"
          component={DailyTasksEntry}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="TargetHistory"
          component={TargetHistory}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="EditDailyTaskEntry"
          component={EditDailyTaskEntry}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="CalendarHistroy"
          component={CalendarHistroy}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="EditDailyPerformance"
          component={EditDailyPerformance}
          options={verticalAnimation}
        />
        <Stack.Screen
          name="ToDoPage"
          component={ToDoPage}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name="TodoCreation"
          component={TodoCreation}
          options={horizontalAnimation}
        />
      </Stack.Navigator>
    </ASMotorsContext.Provider>
  );
}



export default StackNav;
