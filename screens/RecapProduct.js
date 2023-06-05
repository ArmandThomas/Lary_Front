import {Alert, View} from "react-native";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {Entypo} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

export const RecapProduct = ({route}) => {

    const navigation = useNavigation();

    const {barcode} = route.params;

    const [data, setData] = useState({});

    const getInfoProduct = async () => {
        const requestUrl = `https://world.openfoodfacts.org/api/v2/search?code=${barcode}&page_size=1&json=true`;
        const request = await fetch(requestUrl);
        const response = await request.json();
        const product = response.products[0];
        if (!product) {
            Alert.alert("Erreur", "Aucun produit n'a été trouvé");
        } else {
            setData(product);
        }
    }

    useEffect(() => {
        if (barcode) {
           getInfoProduct();
        } else {
            Alert.alert("Erreur", "Aucun code barre n'a été renseigné");
        }
    }, []);
    return (
        <Container>
            <ArrowBack>
                <Entypo
                    name="chevron-left"
                    size={24}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
            </ArrowBack>
            {
                Object.keys(data).length > 0 &&
                <View>
                    <ContainerImageAndInfo>
                        <ImageContainerProduct>
                            <ImageProduct source={{uri: data.image_url}}/>
                        </ImageContainerProduct>
                        <InfoContainerProduct>
                            <TitleProduct>{
                                data.abbreviated_product_name_fr || data.product_name_fr
                            }</TitleProduct>
                            <ContainerBrandAndWeight>
                                <BrandProduct>
                                    {
                                        data.brands
                                    }
                                </BrandProduct>
                                <WeightProduct>
                                    {
                                        data.quantity
                                    }
                                </WeightProduct>
                            </ContainerBrandAndWeight>
                        </InfoContainerProduct>
                    </ContainerImageAndInfo>
                    <ContainerNutritionGradeEcoGradeNovaGrade>
                        <ImageNutritionGrade source={{uri: `https://static.openfoodfacts.org/images/misc/nutriscore-${data.nutrition_grades}.png`}}/>
                        <ImageNovaGrade source={{uri: `https://static.openfoodfacts.org/images/attributes/nova-group-${data.nova_group}.png`}}/>
                        {
                            data.ecoscore_grade && data.ecoscore_grade !== 'unknown' &&
                            <ImageEcoGrade source={{uri: `https://static.openfoodfacts.org/images/icons/ecoscore-${data.ecoscore_grade}.png`}}/>
                        }
                    </ContainerNutritionGradeEcoGradeNovaGrade>
                    <ContainerNutrimentsBy100G>
                        <TextNutrimentsBy100G>
                            Nutriments pour 100g :
                        </TextNutrimentsBy100G>
                        <TextKcal>
                            {data.nutriments.energy_value} kcal
                        </TextKcal>
                        <ContainerNutriments>
                            <TextNutriments>
                                Matières grasses / Lipides : {data.nutriments.fat_100g}g
                            </TextNutriments>
                            <TextNutriments>
                                Acides gras saturés : {data.nutriments["saturated-fat_100g"]}g
                            </TextNutriments>
                            <TextNutriments>
                                Sucres : {data.nutriments.sugars_100g}g
                            </TextNutriments>
                            <TextNutriments>
                                Sel : {data.nutriments.salt_100g}g
                            </TextNutriments>
                        </ContainerNutriments>
                    </ContainerNutrimentsBy100G>
                </View>

            }
        </Container>
    )
}

const Container = styled.View`
`;
const ImageContainerProduct = styled.View`
  width: 40%;
`;

const ImageProduct = styled.Image`
  width: 100%;
  height: 150px;
  resize-mode: contain;
`;

const ContainerImageAndInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const InfoContainerProduct = styled.View`
  width: 60%;
  margin-left: 10px;
`;

const TitleProduct = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
const BrandProduct = styled.Text`
  font-size: 16px;
`;
const ContainerBrandAndWeight = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const WeightProduct = styled.Text`
  font-size: 16px;
`;

const ContainerNutritionGradeEcoGradeNovaGrade = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px;
`;

const ImageNutritionGrade = styled.Image`
  width: 50px;
  height: 70px;
  resize-mode: contain;
`;
const ImageNovaGrade = styled.Image`
  width: 50px;
  height: 70px;
  resize-mode: contain;
`;

const ImageEcoGrade = styled.Image`
  width: 50px;
  height: 70px;
  resize-mode: contain;
`;

const ContainerNutrimentsBy100G = styled.View`
  padding: 20px;
`;
const TextNutrimentsBy100G = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;
const ContainerNutriments = styled.View`
  margin-top: 10px;
`;
const TextNutriments = styled.Text`
  font-size: 16px;
`;

const ArrowBack = styled.View`
  margin-top: 10px;
  margin-left: 10px;
`;

const TextKcal = styled.Text`
  font-size: 16px;
`;