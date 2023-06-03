import {Alert, FlatList, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UrlLary} from "../utils";
import {AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import styled from "styled-components/native";
import {CardInvite} from "../components/CardInvite";
import {CardUserProfil} from "../components/CardUserProfil";
import * as MailComposer from 'expo-mail-composer';
import {CardDate} from "../components/CardDate";

export const Profil = () => {

    const [home, setHome] = useState(undefined);
    const [invitedHome, setInvitedHome] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [inputName, setInputName] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [products, setProducts] = useState([]);

    const [userWantToCreateHome, setUserWantToCreateHome] = useState(false);
    const [userWantToInviteHome, setUserWantToInviteHome] = useState(false);

    const cartes = [
        { date: new Date(), infos: 'Infos 1' },
        { date: new Date(), infos: 'Infos 2' },
        { date: new Date(), infos: 'Infos 3' },
        { date: new Date(), infos: 'Infos 4' },
        { date: new Date(), infos: 'Infos 5' },
        { date: new Date(), infos: 'Infos 6' },
        // Ajoutez autant de cartes que vous le souhaitez ici
    ];

    const getInvitedHome = async () => {


        const token = await AsyncStorage.getItem('token');
        const requestInvitation = await fetch(`${UrlLary}/homes/waiting`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        const responseInvitation = await requestInvitation.json();
        setInvitedHome(responseInvitation);
    }

    const getProducts = async () => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const response = await request.json();

        const onlyProductWithExpiration = response.filter((product) => {
            return product.expirationDate !== null;
        });
        const sortedProducts = onlyProductWithExpiration.sort((a, b) => {
            return new Date(a.expirationDate) - new Date(b.expirationDate);
        });
        setProducts(sortedProducts);
    }

    useEffect(() => {
        getHomeFromUser();
    }, [])

    const getHomeFromUser = async () => {
        setRefreshing(true);
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        const response = await request.json();
        await getProducts();
        if (response && response.name) {
            setRefreshing(false)
            return setHome(response);
        }
        await getInvitedHome();
        setRefreshing(false);
    }
    const refuseInvitation = async (homeId) => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${homeId}/waiting`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        await request.json();
        setInvitedHome(prevState => prevState.filter(home => home._id !== homeId));
    }
    const acceptInvitation = async (homeId) => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${homeId}/waiting`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({accept: true})
        });
        await request.json();
        setInvitedHome(prevState => prevState.filter(home => home._id !== homeId));
        await getHomeFromUser();
    }
    const createHome = async () => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({name: inputName})
        });
        await request.json();
        await getHomeFromUser();
    }
    const leaveHome = async () => {

        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${home._id}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        await request.json();
        setHome(undefined);

    }
    const removeUserFromHome = async (userId) => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${home._id}/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
        await request.json();
        setHome(prevState => {
            return {
                ...prevState,
                users: prevState.users.filter(user => user._id !== userId)
            }
        });
    }
    const sendInvitationByMail = async (emailToSend) => {
        const available = await MailComposer.isAvailableAsync();
        if (available) {
            const me = home.users.find(user => user.me === true);
            await MailComposer.composeAsync({
                recipients: [emailToSend],
                subject: `Invitation à rejoindre ${home.name} sur Lary`,
                body: `Bonjour, ${me.email} vous invite à rejoindre sa maison !`
            })
        }
    }
    const inviteUserToHome = async () => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${home._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({user : inputEmail})
        });
        await request.json();
        Alert.alert("Si l'utilisateur à un compte une invitation lui a été envoyée !");
        await sendInvitationByMail(inputEmail);
        await getHomeFromUser();
    }

    const cancelInvitation = async (userId) => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes/${home._id}/waiting/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        await request.json();
        setHome(prevState => {
            return {
                ...prevState,
                waitingList: prevState.waitingList.filter(user => user._id !== userId)
            }
        });

    }

    const combinedListUsers = home ? [...home.users.map(user => { return {...user, waiting : false}}), ...home.waitingList.map(user => { return {...user, waiting : true}})] : [];

    const getDatesFromProducts = () => {
        const dates = products.map(product => {
            return new Date(product.expirationDate.split('T')[0]);
        });
        return dates;
    }

    const filterUniqueDates = (dates) => {
        const uniqueDates = [];
        const datesSet = new Set();

        dates.forEach(date => {
            const dateString = date.toISOString().split('T')[0]; // Obtenir la date au format "YYYY-MM-DD"

            if (!datesSet.has(dateString)) {
                datesSet.add(dateString);
                uniqueDates.push(date);
            }
        });

        return uniqueDates;
    };

    const dates = filterUniqueDates(getDatesFromProducts());

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getHomeFromUser} />
                }
            >
                <View>

                    {
                        home
                        ?
                        <View>
                            <HouseNameContent>
                                <FontAwesome name="home" size={28} color="black"/>
                                <HouseName>{home.name}</HouseName>
                            </HouseNameContent>
                            <LeaveHomeButton
                                onPress={leaveHome}
                            >
                                <LeaveHomeText>Quitter la maison</LeaveHomeText>
                            </LeaveHomeButton>
                            <ScrollViewListUser>
                                {
                                    combinedListUsers.map((user, index) =>
                                        <CardUserProfil
                                            key={index}
                                            user={user}
                                            isPair={!index % 2 === 0}
                                            removeUserFromHome={removeUserFromHome}
                                            cancelInvitation={cancelInvitation}
                                            sendInvitationByMail={sendInvitationByMail}
                                        />
                                    )
                                }
                            </ScrollViewListUser>
                            {
                                userWantToInviteHome
                                    ?
                                    <View>
                                        <Hr/>

                                        <ContainerFormAddUser>
                                            <TextInputAddUser
                                                placeholder="L'adresse mail de l'utilisateur"
                                                onChangeText={(text) => setInputEmail(text)}
                                            />
                                            <MaterialCommunityIcons
                                                name="email-fast"
                                                size={32}
                                                color="#33efad"
                                                onPress={() => inviteUserToHome()
                                                    .catch(err => Alert.alert(err))
                                                    .finally(() => {
                                                    setUserWantToInviteHome(false);
                                                    setInputEmail('');
                                                })}
                                            />
                                        </ContainerFormAddUser>
                                    </View>
                                    :
                                    <TouchableOpacity
                                        onPress={() => setUserWantToInviteHome(true)}
                                    >
                                        <TextAddUser>Add a user :</TextAddUser>
                                        <AntDesign
                                            name="adduser"
                                            size={32}
                                            color="#33efad"
                                            style={{alignSelf: 'center', marginTop : 10}}
                                        />
                                    </TouchableOpacity>

                            }


                        </View>
                            :
                            <View>
                                        <View>
                                            {
                                                !userWantToCreateHome
                                                    ?
                                                    <TouchableOpacity
                                                        onPress={() => setUserWantToCreateHome(true)}
                                                    >
                                                        <HouseNameContent
                                                        >
                                                            <MaterialIcons name="add-circle-outline" size={24} color="#33efad" />
                                                            <TextCreateNewHome>Créer une maison</TextCreateNewHome>
                                                        </HouseNameContent>
                                                    </TouchableOpacity>
                                                    :
                                                    <ContainerFormCreateHome>
                                                        <TextInputNameHome
                                                            placeholder="Le nom de votre maison"
                                                            onChangeText={(text) => setInputName(text)}
                                                        />
                                                        <ContainerActionCreateHome>
                                                            <Ionicons
                                                                name="ios-checkmark-circle-outline"
                                                                size={32}
                                                                color="#33efab"
                                                                onPress={() => {
                                                                    createHome().finally(() => {
                                                                        setUserWantToCreateHome(false);
                                                                        setInputName('');
                                                                    });
                                                                }}
                                                            />
                                                            <MaterialIcons
                                                                name="highlight-remove"
                                                                size={32}
                                                                color="red"
                                                                onPress={() => {
                                                                    setUserWantToCreateHome(false);
                                                                    setInputName('');
                                                                }}
                                                            />
                                                        </ContainerActionCreateHome>
                                                    </ContainerFormCreateHome>
                                            }
                                        </View>
                                <Hr/>
                                <ContentInvitation>
                                    <Text>Invitations recues ({invitedHome.length})</Text>
                                    <ContainerListInvitation>
                                        <ScrollView>
                                            {
                                                invitedHome.map((home, index) =>
                                                    <CardInvite
                                                        key={index}
                                                        home={home}
                                                        isPair={index % 2 !== 0}
                                                        refuseInvitation={refuseInvitation}
                                                        acceptInvitation={acceptInvitation}
                                                    />
                                                )
                                            }
                                        </ScrollView>
                                    </ContainerListInvitation>

                                </ContentInvitation>
                            </View>
                    }
                </View>

                <View>
                    <Hr/>
                    <ContainerCalendar>
                        <FlatList data={dates} renderItem={
                            ({item}) => <CardDate date={item} products={products}/>
                        }  horizontal={true} />
                    </ContainerCalendar>
                </View>
            </ScrollView>
        )
}

const HouseNameContent = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
`;
const HouseName = styled.Text`
    font-size: 28px;
    font-weight: normal;
    font-style: normal;
    color: #000;
    padding-left: 5px;
`;

const LeaveHomeText = styled.Text`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  color: red;
`;
const LeaveHomeButton = styled.TouchableOpacity`
  border-color: red;
  border-width: 1px;
  border-style: solid;
  border-radius: 18px;
  padding: 8px 16px;
  margin: 10px 5px;
  align-self: center;
`;

const TextCreateNewHome = styled.Text`
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  margin-left: 5px;
  color: #000;
`;

export const Hr = styled.View`
  border: 1px solid #33efad;
  width: 80%;
  align-self: center;
  margin-top: 20px;
`;

const ContentInvitation = styled.View`
    margin-top: 20px;
    padding: 0 10px;
`;

const ContainerListInvitation = styled.View`
    margin-top: 20px;
`;

const TextInputNameHome = styled.TextInput`
    border: 1px solid #33efad;
    border-radius: 18px;
    padding: 8px 16px;
    margin: 0px 5px;
    width: 70%;
`;

const ContainerFormCreateHome = styled.View`
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
`;

const ContainerActionCreateHome = styled.View`
    flex-direction: row;
    margin-top: 20px;
    align-items: center;
`;

const ScrollViewListUser = styled.ScrollView`
    margin-top: 20px;
    padding: 0 20px;
`;

const TextAddUser = styled.Text`
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    margin-left: 5px;
    color: #000;
    align-self: center;
    margin-top: 20px;
`;

const ContainerFormAddUser = styled.View`
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const TextInputAddUser = styled.TextInput`
    border: 1px solid #33efad;
    border-radius: 18px;
    padding: 12px 28px;
    margin: 20px 5px;
    align-self: center;
`;

const ContainerCalendar = styled.View`
    margin-top: 20px;
    padding: 0 20px;
`;