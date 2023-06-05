import React, { useState } from 'react';
import { SafeAreaView, Platform, StatusBar, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import Logo from '../assets/images/logo_lary_blanc.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NavBar = ({refreshToken}) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setModalVisible(false);
        refreshToken();
    }

    return (
        <SafeArea
            style={{
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
            }}
        >
            <NavbarContainer>
                <LogoContainer>
                    <LogoImage source={Logo} />
                </LogoContainer>
                <MaterialIcons
                    name="logout"
                    size={28}
                    color="white"
                    onPress={() => setModalVisible(true)}
                />
            </NavbarContainer>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <CenteredView>
                    <ModalView>
                        <Text style={{marginBottom: 10}}>Voulez-vous vous déconnecter ?</Text>
                        <ButtonContainer>
                            <CanceledButton
                                style={{ margin: 10 }}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <TextCanceledButton>Annuler</TextCanceledButton>
                            </CanceledButton>
                            <LogoutButton
                                style={{ margin: 10 }}
                                onPress={handleLogout}
                            >
                                <TextLogoutButton>Déconnexion</TextLogoutButton>
                            </LogoutButton>
                        </ButtonContainer>
                    </ModalView>
                </CenteredView>
            </Modal>
        </SafeArea>
    )
}

const SafeArea = styled(SafeAreaView)`
  background-color: #33efab;
  width: 100%;
`;

const NavbarContainer = styled.View`
  height: 60px;
  width: 100%;
  padding: 10px 20px 10px 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LogoContainer = styled.View`
  width: 120px;
  height: 120px;
  overflow: hidden;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const CenteredView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`;

const ModalView = styled.View`
  width: 80%;
  background-color: white;
  padding: 35px;
  align-items: center;
  elevation: 5;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CanceledButton = styled.TouchableOpacity`
    border: 1px solid #33efab;
    padding: 8px 16px;
    margin: 10px 5px;
    border-radius: 18px;
`;

const TextCanceledButton = styled.Text`
    color: #33efab;
`;

const LogoutButton = styled.TouchableOpacity`
    border: 1px solid red;
    color: red;
    padding: 8px 16px;
    margin: 10px 5px;
    border-radius: 18px;
`;

const TextLogoutButton = styled.Text`
    color: red;
`;
