import {Pressable, KeyboardAvoidingView, useWindowDimensions, Alert} from "react-native";
import styled from "styled-components/native";
import {ButtonContainer, ButtonText, Input, InputContainer, LinkText, Logo, QuestionText, TitlePage} from "./Connexion";
import {useState} from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import {UrlLary} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Inscription = ({navigation, setIsLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const width = useWindowDimensions().width;
    const imageWidth = width * 0.9;

    const handleSignIn = async () => {
        try {
            const request = await fetch(`${UrlLary}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    email,
                    password,
                    confirmPassword : passwordConfirm
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

                <TitlePage>Inscription</TitlePage>

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

                <InputContainer>
                    <Icon name="lock" size={30} color="#33efad" />
                    <Input
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#9E9E9E"
                        secureTextEntry
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                    />
                </InputContainer>

                <ButtonContainer
                    onPress={handleSignIn}
                >
                    <ButtonText>S'inscrire</ButtonText>
                </ButtonContainer>

                <QuestionText>Vous êtes déjà inscris ?</QuestionText>
                <Pressable onPress={() => navigation.navigate('Connexion')}>
                    <LinkText>Connectez-vous ici !</LinkText>
                </Pressable>
            </Container>
        </KeyboardAvoidingView>
    )
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background: #1E1E1E;
`;