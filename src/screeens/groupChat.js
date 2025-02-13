import { StyleSheet, Text, View, TextInput, FlatList, Modal, Dimensions, KeyboardAvoidingView, Keyboard, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/header';
import res from '../components/responsive';
import { Colors, ColorsChat } from '../utills/colors';
import Toast from "react-native-simple-toast";
import { api } from '../services';
import NoMessage from '../components/NoMessage';
import Loaders from '../components/Loader';
import { EmptyBox, TickBox } from '../assets';

const GroupChat = ({ route, navigation }) => {
  const [message, setMessage] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [modal, setModal] = useState(false);
  const [messageTextStatus, setMessageTextStatus] = useState(true);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [resultOf, setResultOf] = useState(route?.params?.filteredUsers);

  useEffect(() => {
    getAllTheUsersChat();
    getTeamMessages();
  }, []);

  const getAllTheUsersChat = async () => {
    setModal(true)
    try {
      let loginResponse = await api.getAllMessges(route?.params?.name?.team_id?.toString(), route?.params?.getLoginDate?.user_id);
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
      let params = { teamid: route?.params?.name?.team_id?.toString(), userid: route?.params?.getLoginDate?.user_id?.toString(), message: messageText }
      let loginResponse = await api.insertNewMessageTeam(params);
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
      let loginResponse = await api.postOutTimeTeam(route?.params?.getLoginDate?.user_id?.toString(), route?.params?.name?.team_id?.toString());
      if (loginResponse) {
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


  const getTeamMessages = async () => {
    try {
      let loginResponse = await api.getTeamChatsList(route?.params?.name?.team_id?.toString());
      if (loginResponse) {
        setAvailableMembers(loginResponse);

        let theUpdatedValue = resultOf?.map(itemA => {
          let matchingB = loginResponse.find(itemB => itemA.user_id === itemB.user_id);
          return {
            ...itemA,
            isChecked: false,
            selected: matchingB !== undefined
          };
        })
        setResultOf(theUpdatedValue);

      }
      setModal(false)

    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const [addMember, setAddMember] = useState(false)

  async function onAddMembers(item) {
    try {
      let params = {
        teamname: route?.params?.name?.team_name,
        userid: item?.toString()
      };
      let loginResponse = await api.createMultipleTeamMember(params);
      if (loginResponse) {
        Toast.show("Member added!", 4000);
        getTeamMessages();
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
    }
    setAddMember(false);
  }

  async function removeMember(item) {
    try {
      let loginResponse = await api.deleteTeamMember(item?.user_id, route?.params?.name?.team_id);
      if (loginResponse) {
        Toast.show("Member removed!", 4000);
        getTeamMessages();
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
    }
    setAddMember(false);
  }

  const [resultOfTemp, setResultOfTemp] = useState([]);

  useEffect(() => {
    if (resultOfTemp?.length !== 0) {
      setResultOf(resultOfTemp);
      setResultOfTemp([]);
    }
  }, [resultOfTemp])


  const userListRender = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        disabled={item?.selected === true ? true : false}
        // onPress={() => onAddMembers(item)}
        onPress={() => {
          let tempArray = resultOf;
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
          flexDirection: 'row',
          backgroundColor: Colors.white,
          borderRadius: res(12),
          paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}>

        <View style={{ paddingHorizontal: res(10), paddingVertical: res(5), flex: 1, flexDirection: 'row' }}>
          {item?.isChecked === false ?
            <Image
              source={EmptyBox}
              style={{ height: res(15), width: res(15), marginRight: res(5), alignSelf: 'center' }}
            /> :
            <Image
              source={TickBox}
              style={{ height: res(15), width: res(15), marginRight: res(5), alignSelf: 'center' }}
            />}
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: item?.selected === true ? Colors.DARK_GREY : Colors.darkBlack,
              fontSize: res(12),
              alignSelf: 'center',
              fontWeight: item?.selected === true ? '300' : '700',
            }}>
            {item?.fullname}
          </Text>
          {item?.selected === true ?
            <TouchableOpacity
              onPress={() => removeMember(item)}
            >
              <Image
                source={{
                  uri: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-512.png'
                }}
                style={{ height: res(20), width: res(20) }}
              />
            </TouchableOpacity>
            : null}
        </View>
      </TouchableOpacity>
    );
  };

  function showModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={addMember}
        onRequestClose={() => {
          setAddMember(!addMember);
        }}>

        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{ backgroundColor: Colors.white, borderRadius: res(8), padding: res(6) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: res(10), paddingVertical: res(8) }}>
              <Text style={[{
                alignSelf: 'center', fontSize: res(18),
                color: Colors.darkBlack,
                fontWeight: "600",
              }]}>Add to team chat</Text>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  Keyboard.dismiss()
                  setAddMember(false);
                }}>
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s'
                  }}
                  style={{ height: res(20), width: res(20) }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ height: res(300), backgroundColor: Colors.WHITE_TRANSPARENT }}>
              <FlatList
                bounces={false}
                data={resultOf}
                renderItem={userListRender}
                ListEmptyComponent={() => (
                  modal === false &&
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginVertical: res(100),
                      fontSize: res(14),
                      color: Colors.DARK_GREY,
                      fontWeight: '500',
                    }}>
                    No user Found!
                  </Text>
                )}
              />
              <TouchableOpacity
                onPress={() => {
                  let MultipleUserId = resultOf?.filter(item => item?.isChecked === true)
                    .map(item => item?.user_id)
                    .join(',');
                  onAddMembers(MultipleUserId);
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

  const [userColors, setUserColors] = useState({});

  // Function to get a color for a specific user
  const getRandomColor = (userId) => {
    if (!userColors[userId]) {
      // If the user doesn't have a color, assign a color from Colors object
      const colorKeys = Object.keys(ColorsChat);
      const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      const randomColor = ColorsChat[randomColorKey];

      setUserColors((prevColors) => ({ ...prevColors, [userId]: randomColor }));
      return randomColor;
    }

    // If the user already has a color, return it
    return userColors[userId];
  };

  const flatListRef = useRef(null);

  // Function to scroll to the bottom of the list
  const scrollToBottom = () => {
    ref.current.scrollToEnd({ animated: true });
  };
  
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.white, }}>
      <Header name={route?.params?.name?.team_name} imageName={route?.params?.imageName}
        onAddMembers={() => setAddMember(true)}
        onPressLeft={() => logoutFromPersonal()}
      />
      <FlatList
      ref={ref}
        showsVerticalScrollIndicator={false}
        bounces={false}
        data={message}
        keyExtractor={(item, index) => index.toString()}
        onLayout={scrollToBottom}
        renderItem={({ item, index }) => (
          <View key={index} style={{ backgroundColor: Colors.white, flex: 1 }}>
            {((route?.params?.countData !== undefined && route?.params?.countData?.length !== 0) &&
              messageTextStatus === true &&
              (route?.params?.getLoginDate?.user_id !== item?.user_id) &&
              route?.params?.countData[0]?.user_id === route?.params?.name?.user_id) ?
              <View style={{
                marginTop: ((message?.length) - (route?.params?.countData[0]?.unreadcount)) === index ? res(10) : 0
              }}>
                {((message?.length) - (route?.params?.countData[0]?.unreadcount)) === index ?
                  <View style={{ backgroundColor: Colors.themeColor, alignSelf: 'center', borderRadius: res(100) }}>
                    <Text style={{ color: Colors.white, fontSize: res(10), alignSelf: 'center', paddingHorizontal: res(15), paddingVertical: res(4) }}>
                      Last seen
                    </Text>
                  </View>
                  : null}

                <View
                  style={{
                    alignSelf: route?.params?.getLoginDate?.user_id === item?.user_id ? 'flex-end' : 'flex-start',
                    backgroundColor: route?.params?.getLoginDate?.user_id === item?.user_id ? '#DCF8C6' : '#EAEAEA',
                    borderRadius: 8,
                    marginTop: 8,
                    marginHorizontal: 8,
                    maxWidth: '70%',
                    marginBottom: res(15)
                  }}
                >
                  <View style={{}}>
                    <Text style={{ fontSize: res(8), color: getRandomColor(item.user_id), fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 5 }}>{item.fullname}</Text>
                  </View>
                  <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400', paddingHorizontal: 8, paddingBottom: 5 }}>{item.content}</Text>
                </View>
              </View> :
              <>
                {item?.user_id !== route?.params?.getLoginDate?.user_id ?
                  <View
                    style={{
                      alignSelf: route?.params?.getLoginDate?.user_id === item?.user_id ? 'flex-end' : 'flex-start',
                      backgroundColor: route?.params?.getLoginDate?.user_id === item?.user_id ? '#DCF8C6' : '#EAEAEA',
                      borderRadius: 8,
                      marginTop: 8,
                      marginHorizontal: 8,
                      maxWidth: '70%',
                      marginBottom: res(15)
                    }}
                  >
                    <View style={{}}>
                      <Text style={{ fontSize: res(8), color: getRandomColor(item.user_id), fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 5 }}>{item.fullname}</Text>
                    </View>
                    <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400', paddingHorizontal: 8, paddingBottom: 5 }}>{item.content}</Text>
                  </View> : null}
              </>
            }



            {item?.user_id === route?.params?.getLoginDate?.user_id ?
              <>
                <View
                  style={{
                    alignSelf: route?.params?.getLoginDate?.user_id === item?.user_id ? 'flex-end' : 'flex-start',
                    backgroundColor: route?.params?.getLoginDate?.user_id === item?.user_id ? '#DCF8C6' : '#EAEAEA',
                    borderRadius: 8,
                    marginTop: 8,
                    marginHorizontal: 8,
                    maxWidth: '70%',
                    marginBottom: res(15)
                  }}
                >
                  <View style={{}}>
                    <Text style={{ fontSize: res(8), color: Colors.GREEN, fontWeight: '700', alignSelf: 'flex-start', paddingHorizontal: 5 }}>{"You"}</Text>
                  </View>
                  <Text style={{ fontSize: res(12), color: Colors.darkBlack, fontWeight: '400', paddingHorizontal: 8, paddingBottom: 5 }}>{item.content}</Text>
                </View>
              </>
              : null}
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
      {showModal()}
    </KeyboardAvoidingView>
  );
};

export default GroupChat;

const styles = StyleSheet.create({});
