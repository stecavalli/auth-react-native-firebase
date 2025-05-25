// components/navigators/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/LoginScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import EditProfileScreen from "../../screens/EditProfileScreen";

// 1. Definiamo il tipo delle rotte
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

// 2. Creiamo lo Stack Navigator con il tipo
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
	    name="Login" 
	    component={LoginScreen}
            options={{ headerShown: false }}	  
	  />
      <Stack.Screen 
	    name="Profile" 
            component={ProfileScreen}
            options={{ headerShown: false }}		 
	  />
	  <Stack.Screen  
	    name="Register" 
	    component={RegisterScreen} 
	    options={{ headerShown: false }} 
	  />
	  <Stack.Screen 
	    name="EditProfile" 
	    component={EditProfileScreen} 
	    options={{ title: "Pagina del profilo" }}
	  />
    </Stack.Navigator>
  );
}
