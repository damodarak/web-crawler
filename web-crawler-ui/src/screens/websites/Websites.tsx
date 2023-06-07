import styled from "styled-components";
import {Container, Empty} from "@/components/Components";
import Title from "@/components/Title";
import { Website } from "@/model/model";
import Record from "@/screens/websites/components/Record";
import Navigation from "@/components/Navigation";
import {useRouter} from "next/router";
import Button from "@/components/Button";

interface Props {
    websites: Website[];
}

export default function Websites(props: Props) {

    const router = useRouter();
    const limit = router.query.limit ? parseInt(router.query.limit.toString()) : 0;

    const { websites } = props;

    const SortPanel = () => {
        function setSortBy(sortBy: "url" | "timestamp") {
            router.replace({
                pathname: router.asPath.split("?")[0],
                query: { ...router.query, sortBy }
            });
        }

        function setSortOrder(sortOrder: "ASC" | "DESC") {
            router.replace({
                pathname: router.asPath.split("?")[0],
                query: { ...router.query, sortOrder }
            });
        }

        function getUrlButtonType() {
            return router.query.sortBy !== "url" ? "secondary" : "primary";
        }

        function getTimestampButtonType() {
            return router.query.sortBy !== "timestamp" ? "secondary" : "primary";
        }

        function getAscButtonType() {
            return router.query.sortOrder !== "ASC" ? "secondary" : "primary";
        }

        function getDescButtonType() {
            return router.query.sortOrder !== "DESC" ? "secondary" : "primary";
        }

        return (
            <SortContainer>
                <Label>Sort by</Label>
                <Button type={getUrlButtonType()} size="small" onClick={() => setSortBy("url")}>URL</Button>
                <Button type={getTimestampButtonType()} size="small" onClick={() =>  setSortBy("timestamp")}>Timestamp</Button>
                <Divider />
                <Button type={getAscButtonType()} size="small" onClick={() => setSortOrder("ASC")}>Ascending</Button>
                <Button type={getDescButtonType()} size="small" onClick={() => setSortOrder("DESC")}>Descending</Button>
            </SortContainer>
        )
    }

    return (
        <Container>
            <Title>Website records</Title>
            <SortPanel />
            <List>
                {websites.map((website: Website, index: number) => <Record key={index} website={website} />)}
            </List>

            {websites.length === 0 && <Empty>No websites</Empty>}

            <Navigation hasNext={websites.length === limit} />
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

const SortContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, auto);
  grid-gap: 10px;
  align-items: center;
  
  margin-top: 40px;
  margin-bottom: -20px;
`;

const Label = styled.h4`
  color: black;
  font-size: 18px;
  font-weight: 700;
  line-height: 100%;
  
  margin-right: 20px;
`;

const Divider = styled.span`
  width: 3px;
  height: 35px;
  
  border-radius: 3px;
  
  margin: 0px 10px;
  
  background-color: lightgray;
`;