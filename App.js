import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import {Camera} from "./screens/Camera";
import {Home} from "./screens/Home";
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import {Connexion} from "./screens/Connexion";
import {Inscription} from "./screens/Inscription";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {

    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then((value) => {
            if (value !== null) {
                setIsLogin(true);
            }
        })
    }, [])

  return (
              isLogin ?
                  <NavigationContainer>
                      <Tab.Navigator
                          screenOptions={
                              {
                                  "tabBarActiveTintColor": "#FF8C00",
                                  "tabBarInactiveTintColor": "gray",
                                  "tabBarStyle": [
                                      {
                                          "display": "flex"
                                      },
                                      null
                                  ]
                              }
                          }
                      >
                          <Tab.Screen name="Home" options={{
                              headerShown: false,
                              tabBarIcon: ({ color }) => {
                                  return <Entypo name="home" size={24} color={color} />
                              }
                          }} component={Home} />
                          <Tab.Screen
                              name="Camera"
                              options={{
                                  headerShown: false,
                                  tabBarIcon: ({color}) => {
                                      return <Entypo name="camera" size={24} color={color} />
                                  }
                              }} component={Camera} />
                      </Tab.Navigator>
                  </NavigationContainer>
                  :
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen
                                name="Connexion"
                            >
                                {
                                    props => <Connexion {...props} setIsLogin={setIsLogin} />
                                }
                            </Stack.Screen>
                            <Stack.Screen
                                name="Inscription"
                                component={Inscription} />
                        </Stack.Navigator>
                    </NavigationContainer>
  );
}