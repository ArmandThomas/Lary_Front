import styled from "styled-components/native";

export const ButtonStockage = ({currentFilter, updateFilter, data}) => {

    return (
        <FilterProductsButton
            active={currentFilter === data}
            onPress={() => updateFilter(data)}
        >
            <FilterProductsText active={currentFilter === data}>{data}</FilterProductsText>
        </FilterProductsButton>
    )
}

const FilterProductsText = styled.Text`
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  color: ${props => props.active ? '#fff' : '#888888'};
`;
const FilterProductsButton = styled.TouchableOpacity`
  border-color: ${props => props.active ? '#33efab' : '#888888'};
  border-width: 0.5px;
  border-style: solid;
  border-radius: 18px;
  padding: 10px 20px;
  margin: 0 5px;
  background: ${props => props.active ? '#33efab' : 'transparent'};
`;