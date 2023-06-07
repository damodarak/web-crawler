import styled from "styled-components";
import {useRouter} from "next/router";
import Button from "@/components/Button";
import {useEffect, useState} from "react";

export default function Navigation({ hasNext }) {

    const router = useRouter();

    const [limit, setLimit] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        updateLimitAndOffset();
    }, [router]);

    function updateLimitAndOffset() {
        const { limit, offset } = router.query;

        const queryLimit = parseInt(limit.toString());
        const queryOffset = parseInt(offset.toString());

        setLimit(queryLimit);
        setOffset(queryOffset);
    }

    function nextPage() {
        const { limit, offset } = router.query;

        const queryLimit = parseInt(limit.toString());
        const queryOffset = parseInt(offset.toString());

        router.replace({
            pathname: router.asPath.split("?")[0],
            query: {
                ...router.query,
                limit: queryLimit,
                offset: queryOffset + 1
            }
        });
    }

    function previousPage() {
        const { limit, offset } = router.query;

        const queryLimit = parseInt(limit.toString());
        const queryOffset = parseInt(offset.toString());

        if (queryOffset === 0) return;

        router.replace({
            pathname: router.asPath.split("?")[0],
            query: {
                ...router.query,
                limit: queryLimit,
                offset: queryOffset - 1
            }
        });
    }

    return (
        <Container>
            <PageNumber>Page {offset + 1}</PageNumber>
            <div />
            <Button disabled={offset === 0} type="secondary" size="small" onClick={() => previousPage()}>Previous</Button>
            <Button disabled={!hasNext} type="primary" size="small" onClick={() => nextPage()}>Next</Button>
        </Container>
    )
}

const Container = styled.div`
  width: 100%;
  
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  
  margin-top: 50px;
`;

const PageNumber = styled.p`
  color: black;
  font-size: 16px;
  font-weight: 400;
  line-height: 100%;
`;