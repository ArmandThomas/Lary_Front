import {View, ScrollView, RefreshControl} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UrlLary} from "../utils";
import {CardProduct} from "../components/CardProduct";
import styled from "styled-components/native";

export const Home = () => {

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
        <View>
            <ScrollView
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

        </View>
    )
}

const ContainerListCardProduct = styled.View`
   margin-top: 20px;
   padding: 0 10px;
`;