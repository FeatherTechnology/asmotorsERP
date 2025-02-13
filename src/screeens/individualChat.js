import { StyleSheet, Text, View, TextInput, ScrollView, FlatList, Modal, Dimensions, KeyboardAvoidingView, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import res from '../components/responsive';
import { Colors } from '../utills/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from "react-native-simple-toast";
import { api } from '../services';
import NoMessage from '../components/NoMessage';
import Loaders from '../components/Loader';
import moment from 'moment';

const IndividualChat = ({ route, navigation }) => {
  const [message, setMessage] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [modal, setModal] = useState(false);
  const [messageTextStatus, setMessageTextStatus] = useState(true);

  useEffect(() => {
    getAllTheUsersChat();
  }, []);

  const getAllTheUsersChat = async () => {
    setModal(true)
    try {
      let loginResponse = await api.getAllMessage(route?.params?.getLoginDate?.user_id, route?.params?.name?.user_id);
      if (loginResponse) {
        setMessage(loginResponse);
        scrollToBottom();
        setModal(false)
      }
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };
  //Apply
  const insertTableValue = async () => {
    try {
      let params = {
        senderId: route?.params?.getLoginDate?.user_id,
        receiverId: route?.params?.name?.user_id,
        senderMessage: messageText,
        receiverMessage: ""
      };
      let loginResponse = await api.insertNewMessage(params);
      if (loginResponse) {
        setMessageText("");
        setMessageTextStatus(false);
        getAllTheUsersChat();
      }
      setModal(false)
    } catch (error) {
      setMessageText("")
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  //logout from personal
  const logoutFromPersonal = async () => {
    try {
      let loginResponse = await api.postOutTime(route?.params?.getLoginDate?.user_id?.toString(), route?.params?.name?.user_id?.toString());
      if (loginResponse) {
        console.log("loginResponse Logout",loginResponse);
        setMessageText("")
        // getAllTheUsersChat();
      }
      navigation.goBack()
      setModal(false)
    } catch (error) {
      setMessageText("")
      Toast.show(error, 4000);
      setModal(false)
      navigation.goBack()
    }
  };

  const ref = React?.useRef(null);

  const scrollToBottom = () => {
    ref.current.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.white, }}>
      <Header name={route?.params?.name?.fullname} imageName={route?.params?.imageName}
        onPressLeft={() => logoutFromPersonal()}
      />
      <FlatList
        ref={ref}
        // scrollToOverflowEnabled={true}
        // scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        //   { useNativeDriver: false }
        // )}
        bounces={false}
        data={message}
        renderItem={({ item, index }) => (
          <View key={index} style={{ backgroundColor: Colors.white, flex: 1 }}>
            {((route?.params?.countData !== undefined && route?.params?.countData?.length !== 0) &&
              // (route?.params?.countData[0]?.unreadcount < index) &&
              messageTextStatus===true&&
              (route?.params?.getLoginDate?.user_id !== item?.senderId) &&
              route?.params?.countData[0]?.ReceiverId === route?.params?.name?.user_id) ?
              <View style={{
                // borderTopWidth: 2,
                // borderColor: ((message?.length) - (route?.params?.countData[0]?.unreadcount)) === index ? Colors.themeColor : Colors.white,
                marginTop: ((message?.length) - (route?.params?.countData[0]?.unreadcount)) === index ? res(10) : 0
              }}>
                {((message?.length) - (route?.params?.countData[0]?.unreadcount)) === index ?
                  <View style={{ backgroundColor: Colors.themeColor, alignSelf: 'center', borderRadius: res(100) }}>
                    <Text style={{ color: Colors.white, fontSize: res(10), alignSelf: 'center', paddingHorizontal: res(15), paddingVertical: res(4) }}>
                      Last seen
                    </Text>
                  </View>
                  : null}

                {item?.senderMessage !== "" && item?.receiverMessage === "" ?
                  <View
                    style={{
                      alignSelf: route?.params?.getLoginDate?.user_id === item?.senderId ? 'flex-end' : 'flex-start',
                      backgroundColor: route?.params?.getLoginDate?.user_id === item?.senderId ? '#DCF8C6' : '#EAEAEA',
                      borderRadius: 8,
                      marginTop: 8,
                      marginHorizontal: 8,
                      padding: 8,
                      maxWidth: '70%',
                    }}
                  >
                    <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400' }}>{item.senderMessage}</Text>
                  </View> : null}
              </View> :
              <>
                {item?.senderMessage !== "" && item?.receiverMessage === "" ?
                  <View
                    style={{
                      alignSelf: route?.params?.getLoginDate?.user_id === item?.senderId ? 'flex-end' : 'flex-start',
                      backgroundColor: route?.params?.getLoginDate?.user_id === item?.senderId ? '#DCF8C6' : '#EAEAEA',
                      borderRadius: 8,
                      marginTop: 8,
                      marginHorizontal: 8,
                      padding: 8,
                      maxWidth: '70%',
                    }}
                  >
                    <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400' }}>{item.senderMessage}</Text>
                  </View> : null}
              </>
            }



            {item.receiverMessage !== "" ?
              <View
                style={{
                  alignSelf: route?.params?.getLoginDate?.user_id !== item?.senderId ? 'flex-end' : 'flex-start',
                  backgroundColor: route?.params?.getLoginDate?.user_id !== item?.senderId ? '#DCF8C6' : '#EAEAEA',
                  borderRadius: 8,
                  marginTop: 8,
                  marginHorizontal: 8,
                  padding: 8,
                  maxWidth: '70%',
                  marginBottom: res(15)
                }}
              >
                <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400' }}>{item.receiverMessage}</Text>
              </View> : null}
          </View>
        )}
        ListEmptyComponent={
          modal === false &&
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: Dimensions.get("screen").height / 1.2 }}>
            <NoMessage />
          </View>
        }
      />
      <View style={{ bottom: 0, flexDirection: 'row', padding: res(10) }}>
        <View
          style={{
            borderRadius: res(100),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginVertical: res(10),
            width: '85%',
          }}>
          <TextInput
            placeholderTextColor={Colors.liteBlack}
            placeholder={'Type something... '}
            value={messageText}
            onChangeText={value => setMessageText(value)}
            autoFocus={true}
            cursorColor={'black'}
            style={{
              alignSelf: 'flex-start',
              borderRadius: res(8),
              color: Colors.darkBlack,
              backgroundColor: Colors.white,
              fontSize: res(12),
              width: '100%',
              borderRadius: res(100),
              paddingLeft: res(10)
              // paddingVertical: res(20),
              // backgroundColor:"red"
            }}
          />
        </View>
        <View style={{ alignSelf: "center", marginLeft: res(10) }}>
          <Text
            disabled={messageText === "" ? true : false}
            onPress={() => {
              insertTableValue();
            }} style={{ fontWeight: 'bold', color: messageText === "" ? Colors.liteGreyShade : Colors.themeColor }}>Send</Text>
        </View>
      </View>
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
    </KeyboardAvoidingView>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({});
