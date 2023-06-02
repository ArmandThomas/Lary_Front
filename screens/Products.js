import styled from "styled-components/native";
import Searchbar from "../components/Searchbar";
import {FlatList, RefreshControl, ScrollView, View} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UrlLary} from "../utils";
import {CardProduct} from "../components/CardProduct";
import {useEffect, useState} from "react";
import { FontAwesome } from '@expo/vector-icons';

export const Products = () => {
    const isFocused = useIsFocused();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filterProducts, setFilterProducts] = useState('Tout');
    const [homeName, setHomeName] = useState('Ma maison');

    const productTypes = ['Tout', 'Frigo', 'Congélateur', 'Placard'];

    const refresh = async () => {
        setRefreshing(true);
        await getUserProducts();
        setRefreshing(false);
    }

    const getUserProducts = async () => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const response = await request.json();
        setProducts(response);
    }

    useEffect(() => {
        getUserProducts();
        getHomeName();
    }, [isFocused]);

    const getHomeName = async () => {
        const token = await AsyncStorage.getItem('token');
        const request = await fetch(`${UrlLary}/homes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        const response = await request.json();
        if (response.name) {
            setHomeName(response.name);
        }
    }

    return (
        <Container>
            <Searchbar />
            <HouseNameContent>
                <FontAwesome name="home" size={28} color="black" />
                <HouseName>{homeName}</HouseName>
            </HouseNameContent>
            <FilterProductsContent>
                <FlatList
                    horizontal
                    data = {productTypes}
                    renderItem={({item}) => (
                        <FilterProductsButton
                            key={item}
                            active={filterProducts === item}
                            onPress={() => setFilterProducts(item)}
                        >
                            <FilterProductsText active={filterProducts === item}>{item}</FilterProductsText>
                        </FilterProductsButton>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </FilterProductsContent>
            <ScrollView
                style={{flex: 1, width: "100%"}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
            >
                <ContainerListCardProduct>
                    {
                        products.map(product => <CardProduct key={product._id} product={product} />)
                    }
                </ContainerListCardProduct>

            </ScrollView>

        </Container>
    )
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

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

const FilterProductsContent = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 30px 0 10px;
`;

const FilterProductsButton = styled.TouchableOpacity`
  border-color: ${props => props.active ? '#33efab' : '#888888'};
  border-width: 0.5px;
  border-style: solid;
  border-radius: 18px;
  padding: 10px 20px;
  margin: 0 5px;
  background: ${props => props.active ? '#33efab' : 'transparent'};
`;

const FilterProductsText = styled.Text`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  color: ${props => props.active ? '#fff' : '#888888'};
`;

const ContainerListCardProduct = styled.View`
   padding: 10px 10px;
`;