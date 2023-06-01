import {View, Text} from "react-native";
import styled from "styled-components/native";

export const Inscription = () => {
    return (
        <Container>
            <Text>Inscription</Text>
        </Container>
    )
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background: #1E1E1E;
`;