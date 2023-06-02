import {View, Text, Alert, Modal} from "react-native";
import {useEffect, useState} from "react";
import styled from "styled-components/native";
import { Camera as ExpoCamera } from 'expo-camera';
import {AntDesign} from "@expo/vector-icons";
import {ModalContentRecapProduct} from "../components/ModalContentRecapProduct";
import { useIsFocused } from "@react-navigation/native";

export const Camera = () => {

    const isFocused = useIsFocused();

    const [hasPermission, setHasPermission] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const [dataModal, setDataModal] = useState({});

    const closeModal = () => {
        setDataModal({});
        setIsScanning(false);
    }

    useEffect(() => {
        (async () => {
            const { status } = await ExpoCamera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, [isFocused]);

    const getDataFromOpenFoodFact = async (barcode) => {
        if (Object.keys(dataModal).length > 0) {
            return;
        }
        const request = await fetch(`https://world.openfoodfacts.org/api/v2/search?code=${barcode}&page_size=1&json=true`);
        const data = await request.json();
        const product = data.products[0];
        if (!product) {
            return Alert.alert("Erreur", "Le produit n'a pas été trouvé dans la base de donnée OpenFoodFact");
        }
        const {abbreviated_product_name_fr, brands, ingredients_text_fr, image_url, nutrition_grade_fr, product_name_fr} = product;
        setDataModal({
            name: abbreviated_product_name_fr || product_name_fr,
            brand: brands,
            ingredients : ingredients_text_fr,
            image: image_url,
            nutritionGrade : nutrition_grade_fr,
            barcode
        });
        setIsScanning(false);
    }

    const handleBarCodeScanned = async ({data}) => {

        if (!isScanning) {
            const regexEAN13 = /^(?:\d{13})$/;

            if (!regexEAN13.test(data)) {
                return Alert.alert("Erreur", "Le code barre scanné n'est pas un code barre EAN13");
            }
            setIsScanning(true);
            await getDataFromOpenFoodFact(data);
        }

    }

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>Pas d'accès à la caméra</Text>;
    }

    return (
        <ContainerCamera>
            <Modal
                onRequestClose={() => setDataModal({})}
                visible={Object.keys(dataModal).length > 0}
                style={{flex : 1}}
            >

                <ActionModal>
                    <CloseBoxModal onPress={() => setDataModal({})}>
                        <View>
                            <AntDesign name="close" size={24} color="black" />
                        </View>
                    </CloseBoxModal>
                </ActionModal>
                <ModalContentRecapProduct product={dataModal} closeModal={closeModal} />

            </Modal>
            {
                Object.keys(dataModal).length === 0
                && <ExpoCamera style={{flex : 1}} type={ExpoCamera.Constants.Type.back} onBarCodeScanned={handleBarCodeScanned} />
            }

        </ContainerCamera>
    )
}

const ContainerCamera = styled.View`
    flex: 1;
`;
const ActionModal = styled.View`
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 10;
`;
const CloseBoxModal = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
