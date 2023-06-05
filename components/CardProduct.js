import styled from "styled-components/native";
import {Alert, Image, Pressable, Text, useWindowDimensions} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";

export const CardProduct = ({product, updateQuantityMethod, deleteProductMethod}) => {

    const [quantity, setQuantity] = useState(product.quantity);
    const [actionBeDone, setActionBeDone] = useState(false);

    useEffect(() => {
        if (actionBeDone) {
            updateQuantityMethod(product._id, quantity);
        }
    }, [quantity])

    const updateQuantity = (quantity) => {
        if (quantity === 0) {
            return Alert.alert("Erreur", "La quantité ne peut pas être égale à 0");
        } else {
            setQuantity(quantity);
        }
    }

    const widthScreen = useWindowDimensions().width;

    const widthImage = widthScreen / 5;



    return (
        <ContainerCardProduct>
            <NavigateToProduct
                data={product}
            >
                <Image
                    style={{width: widthImage, height : 90, resizeMode: 'contain'}}
                    source={{uri: product.image}}
                />
            </NavigateToProduct>
            <ContainerTitleBrand>
                <ContainerWithLeftStuff>
                    <ContainerLeft>
                        <NavigateToProduct
                            data={product}
                        >
                            <TitleProduct numberOfLines={1}>{product.name}</TitleProduct>
                            <TitleBrand numberOfLines={1}>{product.brand}</TitleBrand>
                        </NavigateToProduct>
                    </ContainerLeft>
                    <ContainerIconsQuantity>
                        <Ionicons
                            name="remove-circle-outline"
                            size={26}
                            color="black"
                            onPress={() => {
                                setActionBeDone(true);
                                updateQuantity(quantity - 1);
                            }}
                        />
                        <QuantityText>{quantity}</QuantityText>
                        <Ionicons
                            name="add-circle-outline"
                            size={26}
                            color="black"
                            onPress={() => {
                                setActionBeDone(true);
                                updateQuantity(quantity + 1);
                            }}
                        />
                    </ContainerIconsQuantity>
                </ContainerWithLeftStuff>
                <ContainerWithLeftStuff>
                    <ContainerLeft second>
                        <NavigateToProduct
                            data={product}
                        >
                            <ImageProduct
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
                        </NavigateToProduct>

                    </ContainerLeft>
                    <ContainerDeleteIcon>
                        <MaterialIcons
                            name="delete"
                            size={26}
                            color="#33efad"
                            onPress={() => deleteProductMethod(product._id)}
                        />
                    </ContainerDeleteIcon>
                </ContainerWithLeftStuff>

            </ContainerTitleBrand>

        </ContainerCardProduct>

    )
}

const ContainerCardProduct = styled.View`
  padding: 20px 10px;
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

const ImageProduct = styled.Image`
    margin: 5px 0;
`;

const NavigateToProduct = ({children, data}) => {

    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() =>
                navigation.navigate('recapProduct', {barcode : data.barcode})
            }
        >
            {children}
        </Pressable>
    )

};