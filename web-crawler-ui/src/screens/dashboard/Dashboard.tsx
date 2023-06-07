import styled from "styled-components";
import {Container} from "@/components/Components";
import Title from "@/components/Title";
import {useEffect} from "react";
import {getWebsitesQuery} from "@/api/api";
import {notConnected} from "@/utils/utils";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

export default function Dashboard({ websitesCount, executionsCount }) {

    const WebsitesCount = () => {
        const websitesCountString = websitesCount + " " + (websitesCount === 1 ? "website" : "websites");
        return <Value>{websitesCountString}</Value>;
    }

    const ExecutionsCount = () => {
        const executionsCountString = executionsCount + " " + (executionsCount === 1 ? "execution" : "executions");
        return <Value>{executionsCountString}</Value>;
    }

    const Links = () => {
        return (
            <ButtonPanel>
                <Button type="primary" size="small" href="/websites">See websites</Button>
                <Button type="primary" size="small" href="/executions">See executions</Button>
            </ButtonPanel>
        )
    }

    return (
        <Container>
            <Title>Dashboard</Title>

            <List>
                <Param>Total websites</Param>
                <WebsitesCount />

                <Param>Total executions</Param>
                <ExecutionsCount />
            </List>

            <Links />
        </Container>
    )
}

const List = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 5px 50px;
  
  margin-top: 50px;
`;

const Param = styled.p`
  color: black;
  font-size: 18px;
  font-weight: 600;
`;

const Value = styled.p`
  color: black;
  font-size: 18px;
  font-weight: 400;
`;

const ButtonPanel = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  
  margin-top: 20px;
`;