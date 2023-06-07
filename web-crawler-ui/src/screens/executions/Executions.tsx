import styled from "styled-components";
import { Container, Empty } from "@/components/Components";
import Title from "@/components/Title";
import { Execution as ExecutionModel } from "@/model/model";
import {useEffect} from "react";
import {getExecutionsQuery} from "@/api/api";
import Execution from "@/screens/executions/components/Execution";
import Button from "@/components/Button";
import Navigation from "@/components/Navigation";
import {useRouter} from "next/router";

interface Props {
    executions: ExecutionModel[];
}

export default function Executions(props: Props) {

    const router = useRouter();
    const limit = router.query.limit ? parseInt(router.query.limit.toString()) : 0;

    const { executions } = props;

    return (
        <Container>
            <Title>Executions</Title>
            <List>
                {executions.map(execution => <Execution execution={execution} />)}
            </List>

            {executions.length === 0 && <Empty>No executions</Empty>}

            <Navigation hasNext={executions.length === limit} />
        </Container>
    )
}

const List = styled.div`
  width: 100%;
  
  display: grid;
  grid-template-columns: auto;
  gap: 15px;
  
  margin-top: 50px;
`;