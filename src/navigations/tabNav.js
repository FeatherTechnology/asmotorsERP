import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Home from '../screeens/home';
import Calendar from '../screeens/calendar';
import Chat from '../screeens/chat';
import { IconNotifications, calendarIcon, chatIcon, grayChat, greyCalendar, homeIcon, iconsSets } from '../assets';
import res from '../components/responsive';
import Notifications from '../screeens/notifications';
import { Colors } from '../utills/colors';
import { ASMotorsContext } from './context';
import { api, storage } from '../services';

const Bottom = createBottomTabNavigator();

export default function BottomStackNavigator({ navigation, route }) {
  const { notificationCount, setNotificaitonCount, setNotificaitonCountPersonal, setNotificaitonCountTeam } = useContext(ASMotorsContext);

  useEffect(() => {
    setTimeout(() => {
      fetchLocalData();
    }, 2000);
  }, []);

  async function fetchLocalData() {
    let res = await storage.getSaveUserDate();
    if (res) {
      let loginResponse = await api.getCounts(res?.user_id);
      let loginResponse1 = await api.getTeamMessagesCount(res?.user_id);
      setNotificaitonCountPersonal(loginResponse?.length);
      setNotificaitonCountTeam(loginResponse1?.length);
      setNotificaitonCount(loginResponse?.length + loginResponse1?.length)
    }
  }

  return (
    <Bottom.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={'NriHome'}>
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={homeIcon}
                style={{ height: res(25), width: res(25) }}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={calendarIcon}
                style={{ height: res(25), width: res(25) }}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <View style={{}}>
              {notificationCount !== undefined && notificationCount !== 0 ?
                <View style={{
                  backgroundColor: 'red', height: res(10), width: res(10),
                  position: 'absolute', alignSelf: 'flex-end', borderRadius: res(100), zIndex: 100,
                }}>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        zIndex: 100,
                        color: Colors.white,
                        fontSize: res(8),
                        fontWeight: '500',
                      }}>
                      {notificationCount !== undefined && notificationCount !== 0 ? notificationCount : ""}
                    </Text>
                  </View>

                </View> : null}
              <Image
                source={chatIcon}
                style={{ height: res(25), width: res(25) }}
              />
            </View>
          ),
        }}
      />
      <Bottom.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={IconNotifications}
                style={{ height: res(25), width: res(25) }}
              />
            </View>
          ),
        }}
      />
    </Bottom.Navigator>
  );
}
