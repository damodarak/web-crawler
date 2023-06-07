import styled from "styled-components";
import Button from "@/components/Button";
import {useEffect} from "react";
import {hideLoading, showLoading} from "@/components/Loading";
import {addWebsiteQuery} from "@/api/api";
import {hideDialog, showDialog} from "@/components/Dialog";
import {useRouter} from "next/router";
import {getDateTime} from "@/utils/utils";

export default function Node({ node }) {

    const router = useRouter();

    const { id, title, url, crawlTime, parentId } = node;

    function tryAddWebsite() {
        showDialog({
           heading: "Crawl new webpage",
           text: `Do you really want to create a new website record on URL ${url}?`,
           primary: {
               label: "Crawl",
               onClick: () => addWebsite()
           },
            secondary: {
               label: "Cancel",
                onClick: () => hideDialog()
            }
        });
    }

    function addWebsite() {
        router.push({
            pathname: "/crawl",
            query: { domainUrl: encodeURI(url) }
        })
    }

    return (
        <Container>
            <Active active={crawlTime} title={crawlTime ? "Crawled" : "Not crawled"} />
            <Value title="URL title">{title ?? "No title"}</Value>
            <Value>{crawlTime ? getDateTime(crawlTime) : "Not crawled"}</Value>
            <Value title="Node URL">{url}</Value>
            <Button type="primary" size="small" onClick={() => tryAddWebsite()}>Crawl</Button>
        </Container>
    )
}

const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: auto 200px 150px 1fr auto;
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

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Active = styled.span`
  width: 10px;
  height: 10px;

  border-radius: 5px;

  background-color: ${props => props.active ? "green" : "red"};
`;