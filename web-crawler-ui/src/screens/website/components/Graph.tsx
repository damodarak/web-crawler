import { GraphCanvas, recommendLayout } from "reagraph";
import styled from "styled-components";
import React, {useEffect} from "react";

export interface GraphNode {
    id: string;
    label: string;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
}

export interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export default function Graph({ nodes }) {

    const graphData = getGraphData();

    const actives = nodes.filter(node => node.crawlTime).map(node => node.id);

    function getGraphData(): GraphData {
        function getGraphNodes(): GraphNode[] {
            return nodes.map(node => ({
                id: node.id,
                label: node.title ?? "No title",
                active: false
            }));
        }

        function getGraphsEdges(): GraphEdge[] {
            return nodes.filter(node => node.parentId).map(node => ({
                id: node.id + node.parentId,
                source: node.parentId,
                target: node.id
            }))
        }

        return {
            nodes: getGraphNodes(),
            edges: getGraphsEdges()
        }
    }

    return (
        <Container>
            <GraphCanvas
                labelType="nodes"
                layoutType="radialOut2d"
                defaultNodeSize={5}
                draggable={true}
                sizingType="attribute"
                edgeInterpolation="radialOut2d"
                nodes={graphData.nodes}
                edges={graphData.edges}
                actives={actives}
            />
        </Container>
    )
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;