
import styled from "styled-components/native";
import {Text} from "react-native";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";

export const CardUserProfil = ({ user, isPair, removeUserFromHome, cancelInvitation, sendInvitationByMail}) => {
    return (
        <ContainerCardUserProfil
            isPair={isPair}
        >
            <ContentCardUserProfil>
                <Text>{user.email}</Text>
                <ContainerRemoveUserFromHome>
                {
                    !user.me && user.waiting &&
                    <FontAwesome
                        name="send"
                        size={24}
                        color="black"
                        onPress={() => sendInvitationByMail(user.email)}
                    />
                }
                {
                    !user.me &&

                        <MaterialIcons
                            name="highlight-remove"
                            size={32}
                            color="red"
                            onPress={() => {
                                user.waiting
                                    ? cancelInvitation(user._id)
                                    : removeUserFromHome(user._id)
                            }}
                        />
                }
                </ContainerRemoveUserFromHome>
            </ContentCardUserProfil>


        </ContainerCardUserProfil>
    )
};

const ContainerCardUserProfil = styled.View`
  width: 100%;
  padding: 20px;
  background-color: ${props => props.isPair ? '#eee' : '#fff'};
  align-self: center;
`;

const ContentCardUserProfil = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContainerRemoveUserFromHome = styled.View`
  flex-direction: row;
`;