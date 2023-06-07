import styled from "styled-components";
import Link from "next/link";

export default function Menu() {
    return (
        <Container>
            <Heading>Crawler</Heading>
            <Item href="/">Dashboard</Item>
            <Item href="/websites">Websites</Item>
            <Item href="/executions">Executions</Item>
            <ButtonItem href="/crawl">New website</ButtonItem>

            <FillSpace />
            <Credits>Made by<br />Tomas Boda & David Kroupa</Credits>
        </Container>
    )
}

const Container = styled.div`
  min-width: 350px;
  height: 100%;
  
  position: fixed;
  top: 0px;
  left: 0px;
  
  display: flex;
  flex-direction: column;
  
  padding: 30px;

  background-color: black;
`;

const Heading = styled.h3`
  color: white;
  font-size: 25px;
  font-weight: 700;
  line-height: 30px;
  
  padding: 15px 15px 30px 15px;
`;

const Item = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 17px;
  font-weight: 300;
  line-height: 17px;
  text-decoration: none;
  
  padding: 12px 15px;
  margin: 2px;
  
  border-radius: 5px;
  transition: all 200ms;
  cursor: pointer;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const ButtonItem = styled(Link)`
  color: black;
  font-size: 17px;
  font-weight: 600;
  line-height: 17px;
  text-decoration: none;
  text-align: center;

  padding: 12px 15px;
  margin: 30px 2px;

  border: 2px solid transparent;
  border-radius: 5px;
  transition: all 200ms;
  cursor: pointer;
  
  background-color: white;

  &:hover {
    color: white;
    background-color: black;
    border: 2px solid white;
  }
`;

const FillSpace = styled.div`
  flex: 1;
`;

const Credits = styled.p`
  color: white;
  font-size: 14px;
  font-weight: 200;
  line-height: 200%;
  
  opacity: 0.7;
`;