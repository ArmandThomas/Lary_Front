import styled from "styled-components/native";
import {Image, Text, useWindowDimensions, View} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

export const CardProduct = ({product}) => {

    const widthScreen = useWindowDimensions().width;

    const widthImage = widthScreen / 5;

    return (
        <ContainerCardProduct>
            <Image
                style={{width: widthImage, height : 90, resizeMode: 'contain'}}
                source={{uri: product.image}}
            />
            <ContainerTitleBrand>
                <ContainerWithLeftStuff>
                    <ContainerLeft>
                        <TitleProduct numberOfLines={1}>{product.name}</TitleProduct>
                        <TitleBrand numberOfLines={1}>{product.brand}</TitleBrand>
                    </ContainerLeft>
                    <ContainerIconsQuantity>
                        <Ionicons name="remove-circle-outline" size={24} color="black" />
                        <QuantityText>{product.quantity}</QuantityText>
                        <Ionicons name="add-circle-outline" size={24} color="black" />
                    </ContainerIconsQuantity>
                </ContainerWithLeftStuff>
                <ContainerWithLeftStuff>
                    <ContainerLeft second>
                        <Image
                            source={{uri: `https://static.openfoodfacts.org/images/misc/nutriscore-${product.nutritionGrade}.png`}}
                            style={{width: 100, height: 50}}
                            resizeMode="contain"
                        />
                        {
                            product.expirationDate &&
                            <ContainerExpiration>
                                <Text>Exp : {new Date(product.expirationDate).toLocaleDateString()}</Text>
                            </ContainerExpiration>
                        }
                    </ContainerLeft>
                    <ContainerDeleteIcon>
                        <MaterialIcons name="delete" size={24} color="#33efad"  />
                    </ContainerDeleteIcon>
                </ContainerWithLeftStuff>

            </ContainerTitleBrand>

        </ContainerCardProduct>

    )
}

const ContainerCardProduct = styled.View`
  padding: 20px 20px;
  flex-direction: row;
  border-bottom-width: 2px;
  border-bottom-color: #33efad;
`;

const ContainerTitleBrand = styled.View`
  margin-left: 10px;
`;

const TitleProduct = styled.Text`
  font-size: 17px;
  font-weight: bold;
`;

const TitleBrand = styled.Text`
  font-size: 12px;
`;

const ContainerExpiration = styled.View`
`;

const ContainerWithLeftStuff = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
`;

const ContainerIconsQuantity = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ContainerLeft = styled.View`
  justify-content: flex-start;
  width: 65%;
`;

const ContainerDeleteIcon = styled.View`
  margin-left: 40px;
`;

const QuantityText = styled.Text`
  margin: 0 5px;
`;