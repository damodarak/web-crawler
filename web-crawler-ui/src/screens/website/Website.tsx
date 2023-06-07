import styled from "styled-components";
import React from "react";
import { Container, InputField, Panel, Heading, Text, TagList, TagItem, RemoveIcon, Label, Empty } from "@/components/Components";
import Title from "@/components/Title";
import {Execution as ExecutionModel, Website} from "@/model/model";
import {getDateTime, getFormattedURL} from "@/utils/utils";
import Toggle from "@/components/Toggle";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import dynamic from "next/dynamic";
import {
    crawlWebsiteQuery,
    deleteWebsiteQuery,
    getWebsiteCrawlingQuery,
    getWebsiteNodesQuery,
    updateWebsiteQuery
} from "@/api/api";
import {useRouter} from "next/router";
import {hideLoading, showLoading} from "@/components/Loading";
import {showDialog} from "@/components/Dialog";
import Node from "@/screens/website/components/Node";
import Execution from "@/screens/website/components/Execution";
import Navigation from "@/components/Navigation";
import Spinner from "@/components/Spinner";
const Graph = dynamic(() => import("./components/Graph"), { ssr: false });

interface Props {
    website: Website;
    executions: ExecutionModel[];
}

export default function Website(props: Props) {

    const router = useRouter();

    const { website, executions } = props;

    const [showingInfo, setShowingInfo] = useState(false);
    const [mode, setMode] = useState("nodes");
    const [updated, setUpdated] = useState(false);

    const [nodes, setNodes] = useState(null);
    const [skip, setSkip] = useState(0);
    const limit = 10;

    const [url, setUrl] = useState(website.url);
    const [label, setLabel] = useState(website.label);
    const [regexp, setRegexp] = useState(website.regexp);
    const [periodicity, setPeriodicity] = useState(website.periodicity);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState(website.tags);
    const [active, setActive] = useState(website.active);
    const [crawling, setCrawling] = useState(website.crawling);
    const [timestamp, setTimestamp] = useState(website.timestamp);

    let crawlingInterval;

    useEffect(() => {
        startCheckingCrawling();
        loadNodes();

        return () => clearInterval(crawlingInterval);
    }, []);

    async function loadNodes() {
        const getNodes = await getWebsiteNodesQuery({ webPages: [ website.identifier ] });
        const nodes = getNodes?.data?.data?.nodes ?? null;
        setNodes(nodes);
    }

    function startCheckingCrawling() {
        crawlingInterval = setInterval(async () => {
            const response = await getWebsiteCrawlingQuery(website.identifier ?? website.id);
            const crawling = response?.data?.data?.website?.crawling;
            setCrawling(crawling);
        }, 1000);
    }

    useEffect(() => {
        if (tags.length !== website.tags.length) {
            setUpdated(true);
            return;
        }

        for (let i = 0; i < tags.length; i++) {
            if (tags[i].trim() !== website.tags[i]) {
                setUpdated(true);
                return;
            }
        }

        if (url.trim() !== website.url ||
            label.trim() !== website.label ||
            regexp.trim() !== website.regexp ||
            periodicity !== website.periodicity ||
            active !== website.active) {
            setUpdated(true);
        } else {
            setUpdated(false);
        }
    }, [url, label, regexp, periodicity, tags, active]);

    async function updateWebsite() {
        showLoading();

        const params = { id: website.id ?? website.identifier, label, url, regexp: encodeURIComponent(regexp), periodicity, tags, active };
        const response = await updateWebsiteQuery(params);
        const result = response?.data?.data?.updateWebsite ?? null;

        const status = result?.status ?? null;
        const message = result?.message ?? null;

        hideLoading();

        if (message === "Website updated successfully" && status === 200) {
            showDialog({
                heading: "Website updated",
                text: "Website was updated successfully. The website will be recrawled automatically at this moment.",
                primary: {
                    label: "Reload",
                    onClick: () => router.reload()
                },
                secondary: {
                    label: "Cancel",
                    onClick: () => hideLoading()
                }
            });
        } else {
            showDialog({
                heading: "Error adding website",
                text: "The website couldn't be added to your websites list. Please try again later.",
                primary: {
                    label: "See websites",
                    onClick: () => router.push("/websites")
                },
                secondary: {
                    label: "Cancel",
                    onClick: () => router.reload()
                }
            });
        }
    }

    function tryCrawlWebsite() {
        showDialog({
           heading: "Crawl website",
           text: "Do you really want to recrawl this website? This action will force the crawling and the website will be recrawled instantly.",
           primary: {
               label: "Crawl",
               onClick: () => crawlWebsite()
           },
            secondary: {
               label: "Cancel",
                onClick: () => router.reload()
            }
        });
    }

    async function crawlWebsite() {
        await crawlWebsiteQuery(website.id ?? website.identifier);
        router.reload();
    }

    function tryDeleteWebsite() {
        showDialog({
            heading: "Delete website",
            text: "Do you really want to delete this website? All the corresponding data will be deleted as well.",
            primary: {
                label: "Delete",
                onClick: () => deleteWebsite()
            },
            secondary: {
                label: "Cancel",
                onClick: () => router.reload()
            }
        });
    }

    async function deleteWebsite() {
        showLoading();

        const response = await deleteWebsiteQuery(website.id ?? website.identifier);
        const result = response?.data?.data?.deleteWebsite ?? null;

        const status = result?.status ?? null;
        const message = result?.message ?? null;

        if (message === "Website deleted successfully" && status === 200) {
            hideLoading();
            showDialog({
                heading: "Website deleted",
                text: "The website was successfully deleted from your domain list. All the corresponding data was deleted as well.",
                primary: {
                    label: "See websites",
                    onClick: () => router.push("/websites")
                },
                secondary: {
                    label: "Cancel",
                    onClick: () => router.push("/websites")
                }
            });
        } else {
            showDialog({
                heading: "Error deleting website",
                text: "The website couldn't be deleted from your websites list. Please try again later.",
                primary: {
                    label: "See websites",
                    onClick: () => router.push("/websites")
                },
                secondary: {
                    label: "Cancel",
                    onClick: () => router.reload()
                }
            });
        }
    }

    function getPaginatedNodes(): any[] {
        return nodes.slice(skip * limit, skip * limit + limit);
    }

    function nextNodePage(): void {
        setSkip(skip + 1);
    }

    function previousNodePage(): void {
        setSkip(skip - 1);
    }

    function getNodePage(): number {
        return skip + 1;
    }

    function getTotalNodePages(): number {
        return Math.trunc(nodes.length / limit) + 1;
    }

    function hasNextNodePage(): boolean {
        return getPaginatedNodes().length === limit;
    }

    function hasPreviousNodePage(): boolean {
        return skip > 0;
    }

    function addTag(event) {
        if (event.key !== "Enter" || tag.trim() === "" || tags.includes(tag.trim().toLowerCase())) {
            return;
        }

        setTags([ ...tags, tag.trim().toLowerCase() ]);
        setTag("");
    }

    function removeTag(index: number) {
        const newTags = [ ...tags ];
        newTags.splice(index, 1);
        setTags(newTags);
    }

    return (
        <Container>
            <Title>
                <Active active={website.active} title="Active (website is crawled actively)" />
                {getFormattedURL(website.url)}
            </Title>

            <ButtonBar>
                <Button disabled={crawling} type="primary" size="small" onClick={() => tryCrawlWebsite()}>Crawl</Button>
                <Button type="warn" size="small" onClick={() => tryDeleteWebsite()}>Delete</Button>
            </ButtonBar>

            <Panel>
                <Heading>Website information</Heading>
                <Text>
                    This section shows general information about the given website. To update website information, edit desired fields and click on the update button;
                </Text>

                <Crawling>
                    <Active active={crawling} title="Active (website is crawled actively)" />
                    Crawling status: {crawling ? "Currently crawling..." : "Idle"} (last recrawl at {getDateTime(timestamp)})
                </Crawling>

                <Label onClick={() => setShowingInfo(!showingInfo)}>
                    {showingInfo ? "Hide website information" : "Show website information"}
                </Label>

                {showingInfo &&
                    <Content>
                        <Table>
                            <Param>Website ID</Param>
                            <InputField type="text" value={website.identifier} disabled={true}></InputField>

                            <Param>URL</Param>
                            <InputField type="text" value={url} onChange={e => setUrl(e.target.value)} disabled={true}></InputField>

                            <Param>Label</Param>
                            <InputField type="text" placeholder="Enter website label" value={label}
                                        onChange={e => setLabel(e.target.value)}></InputField>

                            <Param>Regexp</Param>
                            <InputField type="text" placeholder="Enter crawling regex" value={regexp}
                                        onChange={e => setRegexp(e.target.value)}></InputField>

                            <Param>Periodicity</Param>
                            <InputField type="text" value={periodicity} placeholder="Enter crawling periodicity" pattern="[0-9]*" onChange={e => setPeriodicity((value) => e.target.validity.valid ? Number(e.target.value) : value)} />

                            <Param>Tags</Param>
                            <InputField type="text" placeholder="Enter a new tag (press Enter)" value={tag}
                                        onChange={e => setTag(e.target.value)} onKeyDown={addTag}></InputField>

                            <span></span>
                            <TagList>
                                {tags.map((tag, index) =>
                                    <TagItem key={index}>
                                        {tag}
                                        <RemoveIcon onClick={() => removeTag(index)}>x</RemoveIcon>
                                    </TagItem>
                                )}
                            </TagList>

                            <span/><span/>

                            <Param>Active</Param>
                            <Toggle toggled={active} onToggle={() => setActive(!active)}/>
                        </Table>

                        <ButtonBar>
                            <Button disabled={!updated} type="primary" size="small" onClick={() => updateWebsite()}>Update</Button>
                        </ButtonBar>
                    </Content>
                }
            </Panel>

            <ButtonBar>
                <Button type={mode === "graph" ? "primary" : "secondary"} size="small" onClick={() => setMode("graph")}>Graph</Button>
                <Button type={mode === "nodes" ? "primary" : "secondary"} size="small" onClick={() => setMode("nodes")}>List</Button>
            </ButtonBar>

            {mode === "graph" &&
                <GraphPanel compact={nodes === null}>
                    <Heading>Nodes Graph</Heading>
                    <Spinner />
                    {nodes && <Graph nodes={nodes}/>}
                </GraphPanel>
            }

            {mode === "nodes" &&
                <Panel fullWidth>
                    <Heading>List of crawled nodes</Heading>
                    {!nodes && <Spinner />}

                    {nodes && <List>{getPaginatedNodes().map(node => <Node node={node} />)}</List>}
                    {nodes && nodes.length === 0 && <Empty>No nodes</Empty>}

                    {nodes && nodes.length > 0 && <Empty style={{ marginTop: "30px" }}>Page {getNodePage()} / {getTotalNodePages()}</Empty>}
                    {nodes && nodes.length > 0 &&
                        <ButtonBar>
                            <Button disabled={!hasPreviousNodePage()} type="secondary" size="small" onClick={previousNodePage}>Previous</Button>
                            <Button disabled={!hasNextNodePage()} type="primary" size="small" onClick={nextNodePage}>Next</Button>
                        </ButtonBar>
                    }
                </Panel>
            }

            <Panel fullWidth>
                <Heading>Executions</Heading>
                <List>{executions.map(execution => <Execution execution={execution} />)}</List>
                {executions.length === 0 && <Empty>No executions</Empty>}
            </Panel>
        </Container>
    )
}

const Crawling = styled.p`
  color: black;
  font-size: 16px;
  font-weight: 500;
  line-height: 100%;
  
  display: flex;
  flex-direction: row;
  align-items: center;
  
  margin: 10px 0px 30px 0px;
`;

const Active = styled.span`
  width: 15px;
  height: 15px;
  border-radius: 10px;
  
  margin-right: 20px;
  
  background-color: ${props => props.active ? "green" : "red"};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 100px auto;
  gap: 8px 50px;
  align-items: center;
  
  margin-top: 30px;
`;

const Param = styled.div`
  color: black;
  font-size: 15px;
  font-weight: 600;
`;

const ButtonBar = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 10px;
  
  margin-top: 30px;
`;

const GraphPanel = styled(Panel)`
  width: 100%;
  max-width: 100%;
  height: ${props => props.compact ? "auto" : "700px"};
  
  position: relative;
`;

const List = styled.div`
  width: 100%;
  
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;