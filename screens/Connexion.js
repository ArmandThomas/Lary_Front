import {Pressable, Alert, useWindowDimensions, KeyboardAvoidingView} from "react-native";
import {useState} from 'react';
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import {UrlLary} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Connexion = ({navigation, setIsLogin}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const width = useWindowDimensions().width;
    const imageWidth = width * 0.9;

    const handleLogIn = async () => {
        try {
            const request = await fetch(`${UrlLary}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    email,
                    password
                })
            });
            const response = await request.json();
            if (response.jwt) {
                await AsyncStorage.setItem('token', response.jwt);
                return setIsLogin(true);
            } else {
                Alert.alert('Erreur', "Une erreur est survenue lors de la connexion");
            }
        } catch (e) {
            Alert.alert('Erreur', e.message);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
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
                    value={email}
                    onChangeText={setEmail}
                />
            </InputContainer>

            <InputContainer>
                <Icon name="lock" size={30} color="#33efad" />
                <Input
                    placeholder="Mot de passe"
                    placeholderTextColor="#9E9E9E"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </InputContainer>

            <ButtonContainer
                onPress={handleLogIn}
            >
                <ButtonText>Connexion</ButtonText>
            </ButtonContainer>

                <QuestionText>Vous n'avez pas de compte ?</QuestionText>
                <Pressable onPress={() => navigation.navigate('Inscription')}>
                    <LinkText>Inscrivez-vous ici !</LinkText>
                </Pressable>
            </Container>
        </KeyboardAvoidingView>
    )
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #1E1E1E;
`;

export const Logo = styled.Image`
  margin-bottom: 10px;
  width: ${props => props.imageWidth}px;
  height : 180px;
  align-self: center;
  margin-top: -30px;
`;

export const TitlePage = styled.Text`
  font-size: 32px;
  font-weight: normal;
  line-height: 27px;
  font-style: normal;
  text-align: center;
  color: #ffffff;
  padding: 10px 0;
`;

export const InputContainer = styled.View`
    width: 80%;
    flex-direction: row;
    align-items: center;
    border-bottom-color: #f5f5f5;
    border-bottom-width: 2px;
    margin: 20px 0;
    padding-bottom: 10px;
    align-self: center;
`;

export const Input = styled.TextInput`
  width: 100%;
  font-size: 24px;
  font-weight: normal;
  line-height: 32px;
  font-style: normal;
  color: #ffffff;
  padding-left: 10px;
  padding-right: 20px;
`;

export const ButtonContainer = styled.Pressable`
  background: #33efad;
  border: 2px solid #33efad;
  border-radius: 5px;
  margin: 30px 0;
`;

export const ButtonText = styled.Text`
    font-size: 22px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #000000;
    padding: 10px 80px;
`;

export const QuestionText = styled.Text`
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #ffffff;
    margin-top: 20px;
`;

export const LinkText = styled.Text`
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    text-align: center;
    color: #33efad;
    padding: 5px 0;
`;
