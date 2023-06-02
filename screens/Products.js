import styled from "styled-components/native";
import Searchbar from "../components/Searchbar";
import {RefreshControl, ScrollView, View} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UrlLary} from "../utils";
import {CardProduct} from "../components/CardProduct";
import {useEffect, useState} from "react";

export const Products = () => {
    const isFocused = useIsFocused();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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
    }, [isFocused]);

    return (
        <Container>
            <Searchbar />
            <TitlePage>Mes produits</TitlePage>
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

const TitlePage = styled.Text`
    font-size: 32px;
    font-weight: normal;
    line-height: 27px;
    font-style: normal;
    text-align: center;
    color: #ffffff;
    padding: 10px 0;
`;

const ContainerListCardProduct = styled.View`
   margin-top: 20px;
   padding: 0 10px;
`;