import styled from "styled-components";
import Button from "@/components/Button";
import {getDateTime} from "@/utils/utils";

export default function Execution({ execution }) {

    const { id, page, timestamp } = execution;

    return (
        <Container>
            <Value>{id}</Value>
            <Value>{getDateTime(timestamp)}</Value>
        </Container>
    )
}

const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr auto;
  gap: 15px;
  align-items: center;

  padding: 15px 15px 15px 25px;

  background-color: white;
  box-shadow: 0px 0px 10px -5px gray;
  border-radius: 5px;
`;

const Value = styled.p`
  color: black;
  font-size: 12px;
  font-weight: 500;
  line-height: 100%;
`;