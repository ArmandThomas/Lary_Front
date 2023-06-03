import styled from "styled-components/native";
import {Alert, FlatList, RefreshControl, ScrollView, View} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UrlLary} from "../utils";
import {CardProduct} from "../components/CardProduct";
import {useEffect, useState} from "react";
import { FontAwesome } from '@expo/vector-icons';
import {productTypes} from "../utils";
import {ButtonStockage} from "../components/ButtonStockage";

export const Products = () => {
    const isFocused = useIsFocused();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filterProducts, setFilterProducts] = useState('Tout');
    const [homeName, setHomeName] = useState('Ma maison');



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
        if (response && response.name) {
            setHomeName(response.name);
        }
    }

    const updateQuantity = async (productId, quantity) => {

        const token = await AsyncStorage.getItem('token');
        try {
            const request = await fetch(`${UrlLary}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity
                })
            });
            return await request.json();
        } catch (e) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour de la quantité');
        }
    }

    const deleteProduct = async (productId) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const request = await fetch(`${UrlLary}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            await request.json();
            setProducts(products.filter(product => product._id !== productId));
        } catch (e) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression du produit');
        }
    }

    const filteredData = filterProducts === 'Tout' ? products : products.filter(product => product.where === filterProducts.toLocaleLowerCase());

    return (
        <Container>
            <HouseNameContent>
                <FontAwesome name="home" size={28} color="black" />
                <HouseName>{homeName}</HouseName>
            </HouseNameContent>
            <FilterProductsContent>
                <FlatList
                    horizontal
                    data = {productTypes}
                    renderItem={({item}) => (
                        <ButtonStockage key={item} currentFilter={filterProducts} data={item} updateFilter={setFilterProducts}/>
                    )}
                    showsHorizontalScrollIndicator={false}
                    style={{paddingLeft: 15}}
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
                        filteredData.map(product =>
                            <CardProduct
                                key={product._id}
                                product={product}
                                updateQuantityMethod={updateQuantity}
                                deleteProductMethod={deleteProduct}
                            />)
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

const ContainerListCardProduct = styled.View`
   padding: 10px 10px;
`;