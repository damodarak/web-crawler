import styled from "styled-components";
import {useEffect, useState} from "react";
import Toggle from "@/components/Toggle";
import Title from "@/components/Title";
import { Container, Label, Heading, Text, InputField, Panel, TagList, TagItem, RemoveIcon } from "@/components/Components";
import Button from "@/components/Button";
import {addWebsiteQuery, getExecutionsQuery} from "@/api/api";
import { Website } from "@/model/model";
import {useRouter} from "next/router";
import {hideLoading, showLoading} from "@/components/Loading";
import {showDialog, showEmptyDialog} from "@/components/Dialog";
import {areEmpty} from "@/utils/utils";

const defaultValues: Website = {
    url: "",
    label: "",
    regexp: ".*",
    periodicity: 3600,
    tags: [],
    active: true
}

export default function Crawl() {

    const router = useRouter();

    const [advanced, setAdvanced] = useState(true);

    const [url, setUrl] = useState(defaultValues.url);
    const [label, setLabel] = useState(defaultValues.label);
    const [regexp, setRegexp] = useState(defaultValues.regexp);
    const [periodicity, setPeriodicity] = useState(defaultValues.periodicity);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState(defaultValues.tags);
    const [active, setActive] = useState(defaultValues.active);

    useEffect(() => {
        setUrl(getQueryDomainURL());
    }, []);

    function getQueryDomainURL(): string {
        const { domainUrl } = router.query;
        return domainUrl ? decodeURI(domainUrl.toString()) : "";
    }

    async function addWebsite() {
        showLoading();

        if (areEmpty(url)) {
            hideLoading();
            showEmptyDialog("url");
            return;
        }

        const params = { label, url, regexp: encodeURIComponent(regexp), periodicity, tags, active };
        const response = await addWebsiteQuery(params);
        const result = response?.data?.data?.addWebsite ?? null;

        const status = result?.status ?? null;
        const message = result?.message ?? null;

        hideLoading();

        if (message === "Website added successfully" && status === 200) {
            showDialog({
                heading: "Website added",
                text: "New website was added successfully to your websites list. If you selected active, the website will be crawled as soon as possible.",
                primary: {
                    label: "See websites",
                    onClick: () => router.push("/websites")
                },
                secondary: {
                    label: "Cancel",
                    onClick: () => router.reload()
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
            <Title>Crawl new website</Title>
            <Panel>
                <Heading>Add a domain to get started</Heading>
                <Text>
                    To crawl a new website and all its nested redirects, enter the URL to the domain you would like to crawl.
                    The given domain will be crawled instantly and added to the list of crawled websites.
                </Text>

                <InputFormHorizontal>
                    <InputField type="text" value={url} placeholder="Enter domain URL" onChange={e => setUrl(e.target.value)} />
                    <Button type="primary" size="large" onClick={() => addWebsite()}>Crawl</Button>
                </InputFormHorizontal>

                <Label onClick={() => setAdvanced(!advanced)}>
                    {advanced ? "Hide advanced options" : "Show advanced options"}
                </Label>
            </Panel>

            {advanced &&
            <Panel>
                <Heading>Advanced options</Heading>
                <Text>
                    Configure crawling options for the new domain URL to be crawled.
                    These options can be updated later in the website settings.
                </Text>

                <InputFormVertical>
                    <Toggle label="Active" toggled={active} onToggle={() => setActive(!active)} />
                    <InputField type="text" value={label} placeholder="Enter website label" onChange={e => setLabel(e.target.value)} />
                    <InputField type="text" value={regexp} placeholder="Enter crawling regex" onChange={e => setRegexp(e.target.value)} />
                    <InputField type="text" value={periodicity} placeholder="Enter crawling periodicity" pattern="[0-9]*" onChange={e => setPeriodicity((value) => e.target.validity.valid ? Number(e.target.value) : value)} />
                    <InputField type="text" value={tag} placeholder="Enter a new tag (press Enter)" onChange={e => setTag(e.target.value)} onKeyDown={addTag} />
                    <TagList>
                        {tags.map((tag, index) =>
                            <TagItem key={index}>
                                {tag}
                                <RemoveIcon onClick={() => removeTag(index)}>x</RemoveIcon>
                            </TagItem>
                        )}
                    </TagList>
                </InputFormVertical>
            </Panel>
            }
        </Container>
    )
}

const InputFormHorizontal = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;

  align-items: center;

  margin: 30px 0px;
`;

const InputFormVertical = styled.div`

  display: grid;
  grid-template-columns: auto;
  gap: 12px;

  justify-items: flex-start;

  margin-top: 30px;
`;
