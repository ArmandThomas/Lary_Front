import React from 'react';
import {SafeAreaView, Platform, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/images/logo_lary_blanc.png';

export const NavBar = () => {

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
                <Ionicons name="ios-settings-sharp" size={28} color="white" />
            </NavbarContainer>
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
