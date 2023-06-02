import { useState } from "react";
import {Alert, Image, Platform, Text, View} from "react-native";
import styled from "styled-components/native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {Fontisto} from "@expo/vector-icons";
import {UrlLary} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar";

export const ModalContentRecapProduct = ({product, closeModal}) => {

    const [quantity, setQuantity] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [updateDate, setUpdateDate] = useState(false);

    const getPermissionsToAccessUserAgenda = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            return Platform.OS === 'ios' ? await Calendar.getDefaultCalendarAsync() : { id: (await Calendar.getCalendarsAsync())[0].id };
        } else {
            return false;
        }
    }

    const handleSubmitAddProduct = async () => {
        const body = {
            quantity,
            barcode : product.barcode,
            expirationDate: updateDate ? date : null,
        }
        const token = await AsyncStorage.getItem('token');


        if (!token) {
            return Alert.alert('Erreur', "Vous devez être connecté pour ajouter un produit");
        }

        try {
            // send a new request to the server to add the product the route is /search in post method and the body is the barcode of the product and add bearer
            const response = await fetch(`${UrlLary}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify(body)
            });

            if (response && response.status === 200) {
                Alert.alert('Succès', "Le produit a bien été ajouté");
                closeModal();

                if (updateDate) {
                    const isPermissionGranted = await getPermissionsToAccessUserAgenda();
                    if (isPermissionGranted) {
                        await Calendar.createEventAsync(isPermissionGranted.id, {
                            title: `Your product ${product.name} will expire`,
                            startDate: date,
                            endDate: date,
                            timeZone: 'Europe/Paris',
                            alarms: [{
                                relativeOffset: -60 * 24,
                                method: Calendar.AlarmMethod.ALERT,
                            }],
                            notes: `Your product ${product.name} of brand ${product.brand} will expire the ${date.toLocaleDateString()}`
                        });
                    }
                }
            }
        } catch (e) {
            Alert.alert('Erreur', e.message);
        }


    }

    return (
        <View>
            <ContainerRecapProduct>
                <Image
                    style={{width: 120, height : 180}}
                    source={{uri: product.image}}
                />
                <ContainerRightText>
                    <H3>{product.name}</H3>
                    <Text>{product.brand}</Text>
                    <Image
                        source={{uri: `https://static.openfoodfacts.org/images/misc/nutriscore-${product.nutritionGrade}.png`}}
                        style={{width: 100, height: 100}}
                        resizeMode="contain"
                    />
                </ContainerRightText>

            </ContainerRecapProduct>
            <ContainerCenteredText>
                <Section>
                    <H3>{product.ingredients}</H3>
                </Section>
                <Section>
                    <Text>Quantité :</Text>
                    <Input
                        keyboardType="numeric"
                        value={quantity.toString()}
                        onChangeText={setQuantity}
                    ></Input>
                </Section>
                <Section>
                    {
                        Platform.OS === "ios"
                            ?
                            <RNDateTimePicker
                                minimumDate={new Date()}
                                textColor="red"
                                mode="date"
                                value={date}
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || date;
                                    setShowDatePicker(false);
                                    setDate(currentDate);
                                    setUpdateDate(true);
                                }}
                            />
                            :
                            <View>
                                <ContainerAndroidDate
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text>Date de péremption :</Text>
                                    <ContainerIconAndText>
                                        <Fontisto name="date" size={24} color="black" />
                                        <TextDate>{date.toLocaleDateString()}</TextDate>
                                    </ContainerIconAndText>
                                </ContainerAndroidDate>
                                {
                                    showDatePicker && <RNDateTimePicker
                                        minimumDate={new Date()}
                                        textColor="red"
                                        mode="date"
                                        value={date}
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || date;
                                            setShowDatePicker(false);
                                            setDate(currentDate);
                                            setUpdateDate(true);
                                        }}
                                    />
                                }
                            </View>
                    }
                </Section>
            </ContainerCenteredText>
            <ActionContainer>
                <ContainerButton
                    onPress={handleSubmitAddProduct}
                >
                    <LabelButton>Ajouter</LabelButton>
                </ContainerButton>
            </ActionContainer>
        </View>
    )


}

const H3 = styled.Text`
  font-size: 20px;
  font-weight: normal;
`;

const ContainerRecapProduct = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 60px;
  padding: 20px;
`;

const Section = styled.View`
  margin-top: 20px;
`;

const ContainerRightText = styled.View`
    margin-left: 20px;
    word-break: break-word;
`;

const ContainerCenteredText = styled.View`
    
    padding: 0 30px;
        
`;
const Input = styled.TextInput`
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-top : 10px;
`;

const ContainerAndroidDate = styled.Pressable`
    margin-top: 20px;
`;

const TextDate = styled.Text`
    margin-left: 10px;
`;

const ContainerIconAndText = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
`;

const ContainerButton = styled.Pressable`
    background: #33efad;
    border: 2px solid #33efad;
    border-radius: 5px;
    margin: 20px 0;
    padding: 10px 42px;
`;

const LabelButton = styled.Text`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
`;

const ActionContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;



