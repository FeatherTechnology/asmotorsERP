import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  SafeAreaView,
  Keyboard
} from "react-native";
import { Colors } from "../utills/colors";
import res from "../components/responsive";
import WhiteHeader from "../components/whiteHeader";
import { api, storage } from "../services";
import Toast from "react-native-simple-toast";
import Loaders from "../components/Loader";
import { useIsFocused } from "@react-navigation/native";
import STabView from "../components/ATabView";
import { Plus } from "../assets";
import { ASMotorsContext } from "../navigations/context";

const Chat = ({ navigation }) => {
  const { setNotificaitonCount, setNotificaitonCountPersonal, setNotificaitonCountTeam } = useContext(ASMotorsContext);

  const [search, setSearch] = useState("");
  const [getAllTheUsers, setGetAllTheUsers] = useState([]);
  const [getAllTheUsersDup, setGetAllTheUsersDup] = useState([]);
  const [getLoginDate, setLoginData] = useState();
  const [modal, setModal] = useState(false);
  const [countData, setCountData] = useState([]);
  const isFocused = useIsFocused();
  const [selectedTab, setSelectedTab] = useState("Personal");
  const [teamName, setTeamName] = useState("");

  //Team
  const [countDataTeam, setCountDataTeam] = useState([])
  const [countDataTeamList, setCountDataTeamList] = useState([])
  const [teamMessages, setTeamMessages] = useState([])

  const fetchLocalData = async () => {
    let res = await storage.getSaveUserDate();
    setLoginData(res);
  };

  useEffect(() => {
    setModal(true)
    fetchLocalData();
  }, []);

  useEffect(() => {
    if (getLoginDate !== null && isFocused === true) {
      getAllTheUser();
      getAllTheUserMessagesCount();
      getTeamsList();
      getTeamMessagesCount();
    }
  }, [getLoginDate, isFocused])


  const getAllTheUser = async () => {
    try {
      let loginResponse = await api.getAllUser();
      if (loginResponse) {
        setGetAllTheUsersDup(loginResponse);
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const getAllTheUserMessagesCount = async () => {
    try {
      if (getLoginDate?.user_id !== undefined) {
        let loginResponse = await api.getCounts(getLoginDate?.user_id);
        if (loginResponse) {
          setCountData(loginResponse);
          setNotificaitonCountPersonal(loginResponse?.length);
          setNotificaitonCount(loginResponse?.length + countDataTeam?.length)
        }
        setModal(false)
      }
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  //Team
  const getTeamMessagesCount = async () => {
    try {
      if (getLoginDate?.user_id !== undefined) {
        let loginResponse = await api.getTeamMessagesCount(getLoginDate?.user_id);
        if (loginResponse) {
          setCountDataTeam(loginResponse);
          setNotificaitonCountTeam(loginResponse?.length);
          setNotificaitonCount(loginResponse?.length + countData?.length);
        }
        setModal(false)
      }
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const getTeamsList = async () => {
    try {
      if (getLoginDate?.user_id !== undefined) {
        let loginResponse = await api.getTeamsList(getLoginDate?.user_id);
        if (loginResponse) {
          setCountDataTeamList(loginResponse);
        }
        setModal(false)
      }
    } catch (error) {
      Toast.show(error, 4000);
      setModal(false)
    }
  };

  const createTeam = async () => {
    try {
      let params = {
        teamname: teamName,
        userid: getLoginDate?.user_id?.toString()
      };
      let loginResponse = await api.createTeam(params);
      if (loginResponse) {
        setTeamName("");
        getTeamsList();
        getTeamMessagesCount();
        setCreateTeamModal(false);
        Toast.show("Team created!", 4000);
      }
      setModal(false)
    } catch (error) {
      Toast.show(error, 4000);
      setCreateTeamModal(false);
    }
  };



  const userListRender = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('IndividualChat', {
            name: item,
            getLoginDate: getLoginDate,
            countData: countData?.filter((value) => value?.SenderId === item?.user_id),
            showImage: true,
            imageName:
              'https://w7.pngwing.com/pngs/24/958/png-transparent-cartoon-animation-happy-face-child-face-hand.png',
          });
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
          borderRadius: res(12),
          paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}>
        <View
          style={{ height: res(50), width: res(50), alignSelf: 'flex-start' }}>
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/24/958/png-transparent-cartoon-animation-happy-face-child-face-hand.png',
            }}
            style={styles.permission}
          />
        </View>
        <View style={{ paddingHorizontal: res(10), paddingVertical: res(5), flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: 'space-between', flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                color: Colors.darkBlack,
                fontSize: res(16),
                alignSelf: 'flex-start',
                fontWeight: '700',
              }}>
              {item?.fullname}
            </Text>
            {countData?.length !== 0 &&
              countData?.map((value) => {
                return (
                  <>
                    {value?.SenderId === item?.user_id ?
                      <View style={{ backgroundColor: Colors.themeColor, borderRadius: res(100), justifyContent: 'center', height: res(20), width: res(20), alignItems: 'center' }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            // flex: 1,
                            // padding:5,
                            color: Colors.white,
                            fontSize: res(10),
                            alignItems: 'center',
                            fontWeight: 'bold',
                          }}>
                          {value?.SenderId === item?.user_id ? value?.unreadcount : ""}
                        </Text>
                      </View> : null
                    }
                  </>
                )
              })}
          </View>


          <Text
            style={{
              color: Colors.liteGreyShade,
              fontSize: res(10),
              alignSelf: 'flex-start',
              paddingVertical: res(2),
              // fontWeight: '300',
            }}>
            {item?.user_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const userListRenderTeamChart = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('GroupChat', {
            name: item,
            getLoginDate: getLoginDate,
            countData: countDataTeam?.filter((value) => value?.team_id === item?.team_id),
            showImage: true,
            filteredUsers: filteredUsers,
            imageName:
              'https://w7.pngwing.com/pngs/582/608/png-transparent-child-mother-and-child-love-child-photography-thumbnail.png'
          });
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
          borderRadius: res(12),
          paddingHorizontal: res(10),
          paddingVertical: 10,
          marginHorizontal: res(5),
        }}>
        <View
          style={{ height: res(50), width: res(50), alignSelf: 'flex-start' }}>
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/582/608/png-transparent-child-mother-and-child-love-child-photography-thumbnail.png',
            }}
            style={styles.permission}
          />
        </View>
        <View style={{ paddingHorizontal: res(10), paddingVertical: res(5), flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: 'space-between', flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                color: Colors.darkBlack,
                fontSize: res(16),
                alignSelf: 'flex-start',
                fontWeight: '700',
              }}>
              {item?.team_name}
            </Text>
            {countDataTeam !== undefined && countDataTeam?.length !== 0 &&
              countDataTeam?.map((value) => {
                return (
                  <>
                    {value?.team_id === item?.team_id ?
                      <View style={{ backgroundColor: Colors.themeColor, borderRadius: res(100), justifyContent: 'center', height: res(20), width: res(20), alignItems: 'center' }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            // flex: 1,
                            // padding:5,
                            color: Colors.white,
                            fontSize: res(10),
                            alignItems: 'center',
                            fontWeight: 'bold',
                          }}>
                          {value?.team_id === item?.team_id ? value?.unreadcount : ""}
                        </Text>
                      </View> : null
                    }
                  </>
                )
              })}

          </View>

        </View>
      </TouchableOpacity>
    );
  };

  // Filtering the list based on full names
  const filteredUsers = getAllTheUsersDup.filter(
    (item) => item?.fullname.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsersTeams = countDataTeamList.filter(
    (item) => item?.team_name.toLowerCase().includes(search.toLowerCase()))

  const [createTeamModal, setCreateTeamModal] = useState(false);

  function showModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={createTeamModal}
        onRequestClose={() => {
          setCreateTeamModal(!createTeamModal);
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
              }]}>Create Team</Text>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  Keyboard.dismiss()
                  setCreateTeamModal(false);
                }}>
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnqfAUp7cSldnrwYaY32SXurAa8qC9aKVJkvgKoek8mA&s'
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
                marginVertical: res(10)
              }}>
              <TextInput
                placeholderTextColor={Colors.liteBlack}
                placeholder={'Team Name '}
                value={teamName}
                onChangeText={(value) => setTeamName(value)}
                autoFocus={false}
                cursorColor={'black'}
                style={{
                  borderRadius: res(8),
                  color: Colors.darkBlack,
                  backgroundColor: Colors.white,
                  fontSize: res(12),
                  // paddingHorizontal: res(20),
                  // marginVertical: res(5),
                  // paddingVertical: res(15),
                  borderRadius: res(100),
                  // paddingVertical: res(20),
                  // flex: 1,
                  // backgroundColor:"red"
                }}
              />
            </View>
            <TouchableOpacity
              disabled={teamName !== "" ? false : true}
              style={{ backgroundColor: teamName !== "" ? Colors.themeColor : Colors.liteGreyShade, borderRadius: res(100), marginVertical: res(10), marginHorizontal: res(20) }}
              onPress={() => {
                Keyboard.dismiss();
                createTeam();
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
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <WhiteHeader name={"Messages"} />
      <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
        <STabView
          data={['Personal', "Teams"]}
          countData={[countData?.length, countDataTeam?.length]}
          viewHeight={45}
          textSize={16}
          tabMargin={5}
          getCurrentTab={(tab) => {
            setSelectedTab(tab)
          }} />
      </View>
      <ScrollView style={{ backgroundColor: Colors.white, flex: 1 }}>
        <View
          style={{
            borderRadius: res(100),
            borderWidth: res(1),
            borderColor: Colors.border,
            marginBottom: res(5),
            marginHorizontal: res(20),
          }}>
          <TextInput
            placeholderTextColor={Colors.liteBlack}
            placeholder={'Search '}
            value={search}
            onChangeText={(value) => setSearch(value)}
            autoFocus={false}
            cursorColor={'black'}
            style={{
              borderRadius: res(8),
              color: Colors.darkBlack,
              backgroundColor: Colors.white,
              fontSize: res(12),
              paddingHorizontal: res(20),
              borderRadius: res(100),
              // paddingVertical: res(20),
              flex: 1,
              // backgroundColor:"red"
            }}
          />
        </View>
        {selectedTab === "Personal" ?
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              bounces={false}
              data={filteredUsers.filter(
                (item) => item?.user_id !== getLoginDate?.user_id
              )}
              renderItem={userListRender}
              ListEmptyComponent={() => (
                modal === false &&
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: res(100),
                    fontSize: res(14),
                    color: Colors.darkBlack,
                    fontWeight: 'bold',
                  }}>
                  No Search Found!
                </Text>
              )}
            />
          </SafeAreaView> :
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              bounces={false}
              data={filteredUsersTeams}
              renderItem={userListRenderTeamChart}
              ListEmptyComponent={() => (
                modal === false &&
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: res(100),
                    fontSize: res(14),
                    color: Colors.darkBlack,
                    fontWeight: 'bold',
                  }}>
                  {"No Search Found!"}
                </Text>
              )}
            />
          </SafeAreaView>}
      </ScrollView>

      {selectedTab !== "Personal" ?
        <TouchableOpacity activeOpacity={.7}
          style={{
            backgroundColor: Colors.themeColor,
            borderRadius: 100,
            position: 'absolute',
            bottom: 0,
            right: res(10),
            alignSelf: 'flex-end',
            marginRight: res(10),
            marginBottom: res(20),
            padding: res(6),
          }}
          onPress={() => {
            setCreateTeamModal(true);
          }}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: Colors.themeColor,
              borderRadius: res(100),
              zIndex: 1030,
            }}
          >
            <Image
              source={Plus}
              tintColor={Colors.white}
              style={{ height: res(15), width: res(15), padding: res(10) }}
            />
          </View>

        </TouchableOpacity> : null}
      {modal === true ?
        <Modal transparent={true} visible={modal}>
          <Loaders />
        </Modal> : null}
      {showModal()}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  permission: {
    justifyContent: "center",
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    borderRadius: res(100),
    borderColor: Colors.borderColor,
  },
});
