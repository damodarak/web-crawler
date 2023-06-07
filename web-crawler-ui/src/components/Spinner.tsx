import styled from "styled-components";

export default function Spinner({ showing }) {

    if (showing) return null;

    return <Container />;
}

const Container = styled.div`
  width: 30px;
  height: 30px;
  
  border-radius: 100%;
  border: 4px solid rgba(0, 0, 0, 0.07);
  
  border-left: 4px solid black;
  border-top: 4px solid black;
  
  animation: spinner 800ms infinite linear;
  
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;