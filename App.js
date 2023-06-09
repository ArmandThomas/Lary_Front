import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import {Camera} from "./screens/Camera";
import {Products} from "./screens/Products";
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import {Connexion} from "./screens/Connexion";
import {Inscription} from "./screens/Inscription";
import {UrlLary} from "./utils";
import {Profil} from "./screens/Profil";
import { NavBar } from "./components/NavBar";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {

    const [isLogin, setIsLogin] = useState(undefined);

    const [refreshToken, setRefreshToken] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('token').then((value) => {
            if (value !== null) {
                const request = fetch(`${UrlLary}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${value}`
                    }
                });
                request.then((response) => response.json()).then((response) => {
                    if (response._id) {
                        setIsLogin(true);
                    }
                }).catch((error) => {
                    setIsLogin(false);
                })
            } else {
                setIsLogin(false);
            }
        })
    }, [refreshToken])

    const handleRemoveToken = () => {
        setRefreshToken(prevState => !prevState)
    }

    if (isLogin === undefined) {
        return null;
    }

    return (
        isLogin ? (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={
                        {
                            headerShown: false,
                            "tabBarActiveTintColor": "#33efab",
                            "tabBarInactiveTintColor": "gray",
                            "tabBarStyle": [
                              {
                                  "display": "flex",
                                  "paddingTop": 10,
                              },
                              null
                            ]
                        }
                    }
                >
                    <Tab.Screen
                        name="Produits"
                        options={{
                            header: () => <NavBar refreshToken={handleRemoveToken}/>,
                            headerShown: true,
                            tabBarIcon: ({ color }) => {
                              return <MaterialCommunityIcons name="fridge" size={28} color={color} />
                            }
                        }} component={Products}
                    />
                    <Tab.Screen
                        name="Scan"
                        options={{
                            headerShown: false,
                            tabBarIcon: ({color}) => {
                              return <MaterialCommunityIcons name="barcode-scan" size={28} color={color} />
                            }
                        }} component={Camera}
                    />
                    <Tab.Screen
                        name="Profile"
                        options={{
                            header: () => <NavBar refreshToken={handleRemoveToken}/>,
                            headerShown: true,
                            tabBarIcon: ({color}) => {
                              return <FontAwesome name="user" size={24} color={color} />
                            }
                        }} component={Profil}
                    />
                </Tab.Navigator>
            </NavigationContainer>
            ) : (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Connexion"
                        options={{
                            headerShown: false
                        }}
                    >
                        {
                            props => <Connexion {...props} setIsLogin={setIsLogin} />
                        }
                    </Stack.Screen>
                    <Stack.Screen
                        name="Inscription"
                        options={{
                            headerShown: false
                        }}
                    >
                        {
                            props => <Inscription {...props} setIsLogin={setIsLogin} />
                        }
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        )
    );
}