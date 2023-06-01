import React from 'react';
import {Text, TextInput, Pressable, Image, useWindowDimensions} from "react-native";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';

export const Connexion = ({navigation}) => {

    const width = useWindowDimensions().width;
    const imageWidth = width * 0.9;

    return (
        <Container>
            <Logo
                source={require('../assets/images/logo_lary_blanc.png')}
                resizeMode="contain"
                imageWidth={imageWidth}
            />

            <TitlePage>Connexion</TitlePage>

            <InputContainer>
                <Icon name="user" size={30} color="#33efad" />
                <Input
                    placeholder="Email"
                    placeholderTextColor="#9E9E9E"
                />
            </InputContainer>

            <InputContainer>
                <Icon name="lock" size={30} color="#33efad" />
                <Input
                    placeholder="Mot de passe"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry
                />
            </InputContainer>

            <ButtonContainer>
                <ButtonText>Connexion</ButtonText>
            </ButtonContainer>

            <QuestionText>Vous n'avez pas de compte ?</QuestionText>
            <Pressable onPress={() => navigation.navigate('Inscription')}>
                <LinkText>Inscrivez-vous ici !</LinkText>
            </Pressable>
        </Container>
    )
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #1E1E1E;
`;

const Logo = styled.Image`
  margin-bottom: 10px;
  width: ${props => props.imageWidth}px;
  height : 180px;
  align-self: center;
  margin-top: -30px;
`;

const TitlePage = styled.Text`
  //font-family: 'Roboto';
  font-size: 32px;
  font-weight: normal;
  line-height: 27px;
  font-style: normal;
  text-align: center;
  color: #ffffff;
  padding: 10px 0;
`;

const InputContainer = styled.View`
    width: 80%;
    flex-direction: row;
    align-items: center;
    border-bottom-color: #f5f5f5;
    border-bottom-width: 2px;
    margin: 25px 0;
    padding-bottom: 10px;
    align-self: center;
`;

const Input = styled.TextInput`
  width: 100%;
  font-size: 25px;
  font-weight: normal;
  line-height: 32px;
  font-style: normal;
  color: #ffffff;
  padding-left: 10px;
`;

const ButtonContainer = styled.Pressable`
  background: #33efad;
  border: 2px solid #33efad;
  border-radius: 5px;
  margin: 20px 0;
`;

const ButtonText = styled.Text`
    font-size: 22px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #000000;
    padding: 10px 80px;
`;

const QuestionText = styled.Text`
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #ffffff;
    margin-top: 30px;
`;

const LinkText = styled.Text`
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #33efad;
    padding: 5px 0;
`;
