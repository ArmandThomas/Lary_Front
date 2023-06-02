import { useState } from "react";
import {Alert, FlatList, Image, Platform, ScrollView, Text, View} from "react-native";
import styled from "styled-components/native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {FontAwesome, Fontisto} from "@expo/vector-icons";
import {productTypes, UrlLary} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar";
import {ButtonStockage} from "./ButtonStockage";

export const ModalRecapProduct = ({product, closeModal}) => {

    const [quantity, setQuantity] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [updateDate, setUpdateDate] = useState(false);
    const [selectedStockage, setSelectedStockage] = useState('Tout');
    const [isTextExpanded, setIsTextExpanded] = useState(false);

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
            stockage: selectedStockage
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
                            title: `La date de péremption de votre produit "${product.name}" expire ce jours la`,
                            startDate: date,
                            endDate: date,
                            timeZone: 'Europe/Paris',
                            alarms: [{
                                relativeOffset: -60 * 24,
                                method: Calendar.AlarmMethod.ALERT,
                            }],
                            notes: `La date de péremption de votre produit ${product.name} de la marque ${product.brand} expire le ${date.toLocaleDateString()}`
                        });
                    }
                }
            }
        } catch (e) {
            Alert.alert('Erreur', e.message);
        }


    }

    return (
        <ScrollView>
            <Container>
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
                    <Section >
                        <TitleBlock>Description :</TitleBlock>
                        <Text
                            numberOfLines={isTextExpanded ? undefined : 3}
                        >
                            {product.ingredients}
                        </Text>
                        <TextButton onPress={() => setIsTextExpanded(!isTextExpanded)}>
                            {isTextExpanded ? "Voir moins" : "Voir plus"}
                        </TextButton>
                    </Section>
                    <Section>
                        <TitleBlock>Quantité :</TitleBlock>
                        <Input
                            keyboardType="numeric"
                            value={quantity.toString()}
                            onChangeText={setQuantity}
                        ></Input>
                    </Section>
                    <Section>
                        <TitleBlock>Date de péremption :</TitleBlock>
                        {
                            Platform.OS === "ios"
                                ?
                                <IosRNDateTimePicker
                                    minimumDate={new Date()}
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
                                            textColor="#33efab"
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
                <Section>
                    <ContainerCenteredText>
                        <TitleBlock>Où ranger le produit ? </TitleBlock>
                    </ContainerCenteredText>
                    <FilterProductsContent>
                        <FlatList
                            horizontal
                            data = {productTypes}
                            renderItem={({item}) => (
                                <ButtonStockage key={item} currentFilter={selectedStockage} data={item} updateFilter={setSelectedStockage}/>
                            )}
                            showsHorizontalScrollIndicator={false}
                            style={{paddingLeft: 15}}
                        />
                    </FilterProductsContent>

                </Section>
                <ActionContainer>
                    <ContainerButton
                        onPress={handleSubmitAddProduct}
                    >
                        <LabelButton>Ajouter</LabelButton>
                    </ContainerButton>
                </ActionContainer>
            </Container>
        </ScrollView>
    )


}

const Container = styled.ScrollView`
    padding: 20px 0 30px;
`;

const ContainerRecapProduct = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 60px;
  padding: 10px 20px;
`;

const H3 = styled.Text`
  font-size: 20px;
  font-weight: normal;
`;

const Section = styled.View`
  margin: 15px 0;
`;

const ContainerRightText = styled.View`
    margin-left: 20px;
    word-break: break-word;
`;

const ContainerCenteredText = styled.View`
    padding: 0 30px;
`;

const TitleBlock = styled.Text`
    font-weight: bold;
`;

const TextButton = styled.Text`
    color: #33efab;
    text-decoration: underline;
    text-decoration-color: #33efab;
    margin-top: 3px;
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

const LabelButton = styled.Text`
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
`;

const FilterProductsContent = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 10px 0 20px;
`;

const ActionContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const ContainerButton = styled.Pressable`
    background: #33efad;
    border: 2px solid #33efad;
    border-radius: 5px;
    margin: 20px 0 30px;
    padding: 10px 42px;
`;

const IosRNDateTimePicker = styled(RNDateTimePicker)`
    align-self: start;
    margin-top: 10px;
    color: #33efab;
`;