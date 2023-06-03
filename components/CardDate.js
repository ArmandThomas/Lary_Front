import {Image, ScrollView, Text, View} from "react-native";
import styled from "styled-components/native";

export const CardDate = ({ date, products }) => {

    // from products, get the products that have the same date as date

    const productsOfTheDay = products.filter(product => {
        const dateProduct = new Date(product.expirationDate);
        return dateProduct.getDate() === date.getDate()
            && dateProduct.getMonth() === date.getMonth()
            && dateProduct.getFullYear() === date.getFullYear()
    });

    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

    const month = months[date.getMonth()];
    const day = days[date.getDay()];


    return (
        <ContainerCardDate
        >
            <ContainerDate>
                <TextDay>
                    {day} {date.getDate()}
                </TextDay>
                <TextMonth>{month}</TextMonth>
            </ContainerDate>
            <ContainerContent>
                <ScrollView>
                    {
                        productsOfTheDay.map(product =>
                            <Product key={product._id}>
                                <Image style={{width: 32, height: 32}} source={{uri: product.image}}/>
                                <ProductText>{product.name}</ProductText>
                            </Product>
                        )
                    }
                </ScrollView>
            </ContainerContent>
        </ContainerCardDate>
    )
}

const ContainerCardDate = styled.View`
  margin: 10px;
  width: 180px;
  flex : 1;
`;

const ContainerDate = styled.View`
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #eee;
`;

const TextDay = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const TextMonth = styled.Text`
  font-size: 12px;
`;

const ContainerContent = styled.View`
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Product = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ProductText = styled.Text`
  font-size: 12px;
  margin-left: 5px;
`;