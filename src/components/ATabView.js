/**
 * @description
 * - Interactive UI Tab View for enhancement for the project modules.

 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '../utills/colors';
import { FONT_SIZE, textFamily } from '../utills/fonts';
import res from './responsive';

/**
 * 
 * @param {{
 *  getCurrentTab
 * }} props 
 * @returns 
 */
export default function STabView(props) {
  console.log("countData",props?.countData);

  const {
    children, activeTabIndex, backgroundTabColor, borderRadiusLayout, borderRadiusTab, data, isAnimateSwitch,
    isRenderScrollable, isTabScrollable, getCurrentTab, marginSpace, renderItem, tabActiveBorderColor,
    tabActiveColor, tabInactiveBorderColor, tabInactiveColor, textActiveColor, textFontFamily, textInactiveColor,
    textSize, viewHeight,
  } = props;

  const window = Dimensions.get("window");
  const scrollViewRef = useRef(null);
  const viewRef = useRef(null);

  const arrangeArray = () => {
    var arrTabs = [];
    if (data[0].tabName) {
      arrTabs = [...data];
    } else {
      data.map((item, index) => {
        arrTabs.push({
          tabName: item,
          isActive: activeTabIndex === index ? true : false,
          xTab: 0
        });
      });
    }
    return arrTabs;
  }

  const [tabs, setTabs] = useState(arrangeArray);
  const [tabWidth, setTabWidth] = useState(1);
  //const [activeTab, setActiveTab] = useState(tabs[0].tabName);
  //const [xTab, setXTab] = useState(0);
  //const [xTabOne, setXTabOne] = useState(0);
  //const [xTabTwo, setXTabTwo] = useState(0);
  //const [xTabThree, setXTabThree] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  //const [translateXTabOne, setTranslateXTabOne] = useState(new Animated.Value(0));
  //const [translateXTabTwo, setTranslateXTabTwo] = useState(new Animated.Value(width));
  //const [translateY, setTranslateY] = useState(-1000);

  function handleSlide(type, index) {
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true
    }).start();
    // if (tabs[index].isActive) {
    //   Animated.parallel([
    //     Animated.spring(translateXTabOne, {
    //       toValue: 0,
    //       duration: 100,
    //       useNativeDriver: true
    //     }).start(),
    //     Animated.spring(translateXTabTwo, {
    //       toValue: width,
    //       duration: 100,
    //       useNativeDriver: true
    //     }).start()
    //   ]);
    // } else {
    //   Animated.parallel([
    //     Animated.spring(translateXTabOne, {
    //       toValue: -width,
    //       duration: 100,
    //       useNativeDriver: true
    //     }).start(),
    //     Animated.spring(translateXTabTwo, {
    //       toValue: 0,
    //       duration: 100,
    //       useNativeDriver: true
    //     }).start()
    //   ]);
    // }
  };

  useEffect(() => {
    // const windowWidth = Dimensions.get('window').width;
    // const screenWidth = Dimensions.get('screen').width;
    // const windowHeight = Dimensions.get('window').height;
    // const screenHeight = Dimensions.get('screen').height;
    // Console.debug("windowWidth", windowWidth,
    //   "\nscreenWidth", screenWidth,
    //   "\nwindowHeight", windowHeight,
    //   "\nscreenHeight", screenHeight);
  }, []);

  function layoutUpdateTabs(eventX, index) {
    let newArrTabs = [...tabs]
    newArrTabs[index].xTab = eventX
    setTabs(newArrTabs);
    if (tabs[index].isActive) {
      handleSlide(tabs[index].xTab);
    }
  }

  function tabButtons() {
    return (
      tabs.map((item, index) =>
        <TouchableOpacity
          ref={viewRef}
          key={index}
          style={[
            { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isTabScrollable ? 20 : 0 ,flexDirection:'row',},
            isAnimateSwitch
              ? {}
              : {
                backgroundColor: item.isActive ? tabActiveColor : tabInactiveColor,
                borderColor: item.isActive ? tabActiveBorderColor : tabInactiveBorderColor,
                borderWidth: 1, borderRadius: borderRadiusTab, margin: marginSpace,
              }
          ]}
          onLayout={(event) => layoutUpdateTabs(event.nativeEvent.layout.x, index)}
          activeOpacity={0.75}
          onPress={() => {
            viewRef.current?.measure((fx, fy, width, height, px, py) => {
              // console.log('Component width is: ' + width)
              // console.log('Component height is: ' + height)
              // console.log('X offset to frame: ' + fx)
              // console.log('Y offset to frame: ' + fy)
              // console.log('X offset to page: ' + px)
              // console.log('Y offset to page: ' + py)
              // console.log('width * index: ' + width * index)
              scrollViewRef.current?.scrollTo({ x: width * index, y: 0, animated: true });
            });
            if (!tabs[index].isActive) {
              let newArrTabs = [...tabs];
              for (let i = 0; i < tabs.length; i++) {
                if (i === index) {
                  newArrTabs[i].isActive = !item.isActive;
                } else {
                  newArrTabs[i].isActive = false;
                }
              }
              setTabs(newArrTabs);
              if (isAnimateSwitch) {
                handleSlide(item.xTab, index);
              }
              getCurrentTab(item.tabName)
            }
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: item.isActive ? textActiveColor : textInactiveColor, fontSize: textSize,
              fontFamily: textFamily(textFontFamily),
            }}>
            {item.tabName}
          </Text>
          {props?.countData[index] !== undefined && props?.countData[index] !== 0 ?
            <View style={{
              backgroundColor: 'red', height: res(10), width: res(10), flexDirection:'row',
              borderRadius: res(100), zIndex: 100, alignContent:'center',justifyContent:'center',
              marginHorizontal:res(5)
            }}>
              <View style={{ }}>
                <Text
                  numberOfLines={1}
                  style={{
                    zIndex: 100,
                    color: Colors.white,
                    fontSize: res(8),
                    fontWeight: '500',
                  }}>
                  {props?.countData[index]}
                </Text>
              </View>
            </View> : null}
        </TouchableOpacity>
      )
    );
  }

  function tabsList() {
    return (
      <View
        style={{
          flexDirection: 'row', marginTop: 2, marginBottom: 2, height: viewHeight,
          backgroundColor: backgroundTabColor, borderRadius: borderRadiusLayout,
        }}
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          //console.log("Width::", width);
          setTabWidth(width);
        }}>
        {isAnimateSwitch ?
          <Animated.View
            style={{
              position: 'absolute', margin: marginSpace, borderRadius: borderRadiusTab,
              backgroundColor: tabActiveColor, transform: [{ translateX }],
              width: (tabWidth / data.length) - (marginSpace * 2),
              height: (100 - (((marginSpace * 2) / viewHeight) * 100)) + "%"
            }} />
          : null
        }
        {tabButtons()}
      </View>
    );
  }

  return (
    <View>
      <View
        style={[
          isTabScrollable
            ? { marginLeft: "auto", marginRight: "auto" }
            : { width: '97%', marginLeft: "auto", marginRight: "auto" }
        ]}>
        {isTabScrollable ?
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={20}
            decelerationRate={'fast'}
            snapToInterval={100}
            snapToAlignment={"center"}
            //snapToOffsets={true}
            pagingEnabled={true}
            automaticallyAdjustInsets={true}
          //decelerationRate="fast"
          >
            {tabsList()}
          </ScrollView>
          :
          tabsList()
        }

        {isRenderScrollable
          ?
          <ScrollView>
            {renderItem}
          </ScrollView>
          :
          <View>
            {renderItem}
          </View>
        }
      </View>
    </View>
  );
};


STabView.propTypes = {
  children: PropTypes.node,
  activeTabIndex: PropTypes.number,
  backgroundTabColor: PropTypes.string,
  borderRadiusLayout: PropTypes.number,
  borderRadiusTab: PropTypes.number,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  getCurrentTab: PropTypes.func,
  isAnimateSwitch: PropTypes.bool,
  isRenderScrollable: PropTypes.bool,
  isTabScrollable: PropTypes.bool,
  marginSpace: PropTypes.number,
  renderItem: PropTypes.object,
  tabActiveBorderColor: PropTypes.string,
  tabActiveColor: PropTypes.string,
  textActiveColor: PropTypes.string,
  textFontFamily: PropTypes.oneOf(['poppins400', 'poppins500', 'poppins600', 'poppins700', 'roboto400', 'roboto500', 'roboto600']),
  textInactiveColor: PropTypes.string,
  textSize: PropTypes.number,
  tabInactiveBorderColor: PropTypes.string,
  tabInactiveColor: PropTypes.string,
  viewHeight: PropTypes.number,
};


STabView.defaultProps = {
  activeTabIndex: 0,
  backgroundTabColor: Colors.SECONDARY_COLOR,
  borderRadiusLayout: 200,
  borderRadiusTab: 200,
  data: [
    { tabName: "Tab 1", isActive: true, xTab: 0 },
    { tabName: "Tab 2", isActive: false, xTab: 0 },
    { tabName: "Tab 3", isActive: false, xTab: 0 },
  ],
  isAnimateSwitch: true,
  isRenderScrollable: false,
  isTabScrollable: false,
  marginSpace: 5,
  renderItem: null,
  tabActiveBorderColor: Colors.WHITE_TRANSPARENT,
  tabActiveColor: Colors.WHITE,
  tabInactiveBorderColor: Colors.BLACK,
  tabInactiveColor: Colors.WHITE_TRANSPARENT,
  textActiveColor: Colors.PRIMARY_COLOR,
  textFontFamily: "poppins400",
  textInactiveColor: Colors.BLACK,
  textSize: FONT_SIZE.TEXT,
  viewHeight: 45,
};