import styled from "styled-components";

export default function Title({ children }) {
    return <Text>{children}</Text>;
}

const Text = styled.h2`
  color: black;
  font-size: 35px;
  font-weight: 700;
  line-height: 35px;
  
  display: flex;
  flex-direction: row;
  align-items: center;
`;