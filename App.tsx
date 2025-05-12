// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./components/navigators/RootNavigator";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
