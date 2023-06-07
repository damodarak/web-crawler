import styled from "styled-components";
import { useEffect } from "react";
import {getDateTime, getFormattedURL} from "@/utils/utils";
import Button from "@/components/Button";

export default function Record({ website }) {

    const { identifier, label, url, regexp, periodicity, tags, active, timestamp, crawling } = website;

    function getLabel(): string {
        return label.trim() === "" ? "No label" : label;
    }

    function getTags(): string {
        return tags.length === 1 && tags[0] === "" ? "No tags" : tags.join(" | ");
    }

    return (
        <Container>
            <Active active={active} title={active ? "Active - crawled regularly" : "Not active"} />
            <Value title="Website URL">{getFormattedURL(url)}</Value>
            <Value title="Website label">{getLabel()}</Value>
            <Value title="Crawl periodicity">{periodicity} seconds</Value>
            <Value title="Date and time of last crawl">{getDateTime(timestamp)}</Value>

            <Active active={crawling} />
            <Value>{crawling ? "Crawling..." : "Idle"}</Value>

            <Value title="List of tags">{getTags()}</Value>

            <Button type="primary" size="small" href={`/websites/${identifier}`}>Detail</Button>
        </Container>
    )
}

const Container = styled.div`
  width: 100%;
  
  display: grid;
  grid-template-columns: auto 150px 150px 100px 150px auto 65px 1fr auto;
  gap: 15px;
  align-items: center;
  
  padding: 15px 15px 15px 25px;
  
  background-color: white;
  box-shadow: 0px 0px 10px -5px gray;
  border-radius: 5px;
`;

const Active = styled.span`
  width: 10px;
  height: 10px;
  
  border-radius: 5px;
  
  background-color: ${props => props.active ? "green" : "red"};
`;

const Value = styled.p`
  color: black;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;