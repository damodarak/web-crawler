import styled from "styled-components";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Loading() {

    const router = useRouter();

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            showLoading();
        });

        router.events.on("routeChangeComplete", () => {
            hideLoading();
        });

        return () => {
            router.events.off("routeChangeComplete", () => {
                hideLoading();
            });
        };
    }, [router.events]);

    return (
        <Container id="loading">
            <Loader />
        </Container>
    )
}

export function showLoading() {
    let loading = document.getElementById("loading");
    loading.style.display = "inline-block";
}

export function hideLoading() {
    let loading = document.getElementById("loading");
    loading.style.display = "none";
}

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  
  width: 100vw;
  height: 3px;
  
  overflow: hidden;
  
  display: none;
`

const Loader = styled.div`
  width: 100%;
  height: 100%;
  
  background-color: rgb(5, 114, 206);
  
  animation: indeterminate 1s infinite linear;
  transform-origin: 0% 50%;

  @keyframes indeterminate {
    0% { transform:  translateX(0) scaleX(0); }
    40% { transform:  translateX(0) scaleX(0.4); }
    100% { transform:  translateX(100%) scaleX(0.5); }
  }
`;

/*
const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  
  width: 100vw;
  height: 100vh;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  background-color: rgba(0, 0, 0, 0.5);
  
  z-index: 10;
`

const Loader = styled.div`
  width: 40px;
  height: 40px;

  border-radius: 50%;

  border: 3px solid white;
  border-top: 3px solid black;
  border-left: 3px solid black;

  -webkit-animation: spin 800ms linear infinite;
  animation: spin 800ms linear infinite;

  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
*/