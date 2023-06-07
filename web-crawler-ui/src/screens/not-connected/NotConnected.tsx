import {Container, Text} from "@/components/Components";
import Title from "@/components/Title";
import styled from "styled-components";
import Button from "@/components/Button";
import {useRouter} from "next/router";

export default function NotConnected() {

    const router = useRouter();

    return (
        <Container>
            <Title>Server not responding...</Title>
            <Message>
                Server is not responding. It is either shut down or a problem has arisen. Try reconnecting again later.
            </Message>
            <Button onClick={() => router.replace("/")}>Reload</Button>
        </Container>
    )
}

const Message = styled(Text)`
  margin: 25px 0px;
`;