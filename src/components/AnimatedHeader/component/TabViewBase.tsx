import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, ImageBackground, View } from "react-native";
import staticData from "../config/staticData";
import {
  CollapsibleHeaderTabView,
  CollapsibleHeaderTabView as ZHeaderTabView,
  ZTabViewProps,
} from "react-native-tab-view-collapsible-header";

import ScrollViewPage from "./ScrollViewPage";
import { styles } from "../styles";
import FlatListPage from "./FlatListPage";
import SectionListPage from "./SectionListPage";
import { TabBar, TabViewProps } from "react-native-tab-view";
import { NormalText } from "../../Text";
import { Colors } from "@/src/constants/Colors";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const G_WIN_WIDTH = Dimensions.get("window").width;
const TIMECOUNT = 3000;
const HEAD_HEIGHT = 180;

interface ScrollableTabViewContainerProps {
  renderScrollHeader?: () =>
    | React.ComponentType<any>
    | React.ReactElement
    | null;
  sceneRefreshEnabled?: boolean;
  tabsRefreshEnabled?: boolean;
}

interface Routes {
  key: string;
  title: string;
}

const ScrollableTabViewContainer: React.FC<
  ScrollableTabViewContainerProps & Partial<TabViewProps>
> = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mTimer = useRef<number | null>(null);
  const onStartRefresh = () => {
    setIsRefreshing(true);
    mTimer.current = setTimeout(() => {
      setIsRefreshing(false);
    }, TIMECOUNT);
  };

  const _renderScrollHeader = () => {
    return (
      <ImageBackground
        source={{
          uri: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fpuppy&psig=AOvVaw2yHhhUeHIzWtttse4Kxh92&ust=1726559942323000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjhoJL_xogDFQAAAAAdAAAAABAE",
        }}
        resizeMode={"stretch"}
        style={[styles.headerStyle, { height: HEAD_HEIGHT }]}
      />
    );
  };

  useEffect(() => {
    return mTimer.current ? clearTimeout(mTimer.current) : () => {};
  }, []);

  return (
    <CollapsibleHeaderTabView
      onStartRefresh={props.tabsRefreshEnabled ? onStartRefresh : undefined}
      isRefreshing={isRefreshing}
      renderScrollHeader={_renderScrollHeader}
      {...props}
    >
      <ScrollViewPage
        key={"ScrollViewPage"}
        tabLabel={"ScrollView"}
        index={0}
        refreshEnabled={props.sceneRefreshEnabled}
      />
      <FlatListPage
        key={"FlatListPage"}
        tabLabel={"FlatList"}
        index={1}
        refreshEnabled={props.sceneRefreshEnabled}
      />
      <SectionListPage
        key={"SectionListPage"}
        tabLabel={"SectionList"}
        index={2}
        refreshEnabled={props.sceneRefreshEnabled}
      />
    </CollapsibleHeaderTabView>
  );
};

const TabViewContainer: React.FC<
  ScrollableTabViewContainerProps & Partial<ZTabViewProps<any>>
> = (props) => {
  const [index, setIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mTimer = useRef<number | null>(null);

  const [routes] = useState<Routes[]>([
    { key: "first", title: "Posts" },
    { key: "second", title: "Comments" },
    { key: "third", title: "About" },
  ]);

  const onStartRefresh = () => {
    setIsRefreshing(true);
    mTimer.current = setTimeout(() => {
      setIsRefreshing(false);
    }, TIMECOUNT);
  };

  useEffect(() => {
    return mTimer.current ? clearTimeout(mTimer.current) : () => {};
  }, []);

  const _renderScene = (e: any) => {
    const { route } = e;

    if (route.key == "first") {
      return (
        <ScrollViewPage index={0} refreshEnabled={props.sceneRefreshEnabled} />
      );
    } else if (route.key == "second") {
      return (
        <FlatListPage index={1} refreshEnabled={props.sceneRefreshEnabled} />
      );
    } else if (route.key == "third") {
      return (
        <SectionListPage index={2} refreshEnabled={props.sceneRefreshEnabled} />
      );
    }
    return null;
  };

  const _renderTabBar = (props: any) => (
    <TabBar
      {...props}
      renderLabel={() => null}
      renderIcon={({ route }: { route: any }) => (
        <View
          style={{
            borderRadius: 20,
          }}
        >
          <NormalText
            style={{
              color: Colors.black,
              marginVertical: RFPercentage(1),
              fontSize: RFValue(10),
            }}
            numberOfLines={1}
          >
            {route.title}
          </NormalText>
        </View>
      )}
      style={{ backgroundColor: Colors.white }}
      labelStyle={{ fontSize: 12 }}
      inactiveColor="gray"
      indicatorStyle={{
        backgroundColor: Colors.primeColor,
      }}
    />
  );

  const _renderScrollHeader = () => {
    return (
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVwcHl8ZW58MHx8MHx8fDA%3D",
        }}
        resizeMode={"stretch"}
        style={[styles.headerStyle, { height: HEAD_HEIGHT }]}
      />
    );
  };

  return (
    <ZHeaderTabView
      onStartRefresh={props.tabsRefreshEnabled ? onStartRefresh : undefined}
      isRefreshing={isRefreshing}
      navigationState={{ index, routes }}
      renderScene={_renderScene}
      onIndexChange={setIndex}
      initialLayout={styles.tabviewLayout}
      lazy={true}
      renderScrollHeader={_renderScrollHeader}
      renderTabBar={_renderTabBar}
      {...props}
    />
  );
};

export { ScrollableTabViewContainer, TabViewContainer };
