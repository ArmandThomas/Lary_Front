import {Text} from "react-native";
import styled from "styled-components/native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";



export const CardInvite = ({isPair, home, acceptInvitation, refuseInvitation}) => {
    return (
        <ContaiterCardInvite
            isPair={isPair}
        >
            <ContentCardInvite>
                <Text>{home.name}</Text>
                <ContainerAcceptRefuse>
                    <Ionicons
                        name="ios-checkmark-circle-outline"
                        size={32}
                        color="#33efab"
                        onPress={() => acceptInvitation(home._id)}
                    />
                    <MaterialIcons
                        name="highlight-remove"
                        size={32}
                        color="red"
                        onPress={() => refuseInvitation(home._id)}
                    />
                </ContainerAcceptRefuse>
            </ContentCardInvite>
        </ContaiterCardInvite>
    )
}

const ContaiterCardInvite = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${props => props.isPair ? '#eee' : '#fff'};
  align-self: center;
`;

const ContentCardInvite = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ContainerAcceptRefuse = styled.View`
    flex-direction: row;
`;