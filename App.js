import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { VisitProposal, VisitableView } from "react-native-turbo";
import {
  LinkingConfig,
  getLinkingObject,
  useCurrentUrl,
  useWebviewNavigate,
} from "react-native-web-screen";

const Stack = createNativeStackNavigator();

const baseURL = "https://turbo-native-demo.glitch.me/";

// see https://reactnavigation.org/docs/navigation-container/#linking
const linkingConfig: LinkingConfig = {
  screens: {
    Initial: "",
    Welcome: "welcome",
    Fallback: "*",
  },
};

const linking = getLinkingObject(baseURL, linkingConfig);
// see https://github.com/hotwired/turbo-ios/blob/c476bac66f260adbfe930ed9a151e7637973ff99/Source/Session/Session.swift#L4-L7
const sessionHandle = "app-dynamic-session-handle";

const WebView: React.FC = () => {
  const currentUrl = useCurrentUrl(baseURL, linkingConfig);
  const navigateTo = useWebviewNavigate();

  const onVisitProposal = useCallback(
    ({ action: actionType, url }: VisitProposal) => {
      navigateTo(url, actionType);
    },
    [navigateTo]
  );

  return (
    <VisitableView
      onVisitProposal={onVisitProposal}
      sessionHandle={sessionHandle}
      url={currentUrl}
      applicationNameForUserAgent="Turbo Native"
    />
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Initial" component={WebView} />
        <Stack.Screen
          name="Welcome"
          component={WebView}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Fallback" component={WebView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
