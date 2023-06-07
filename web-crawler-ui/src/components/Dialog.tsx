import styled from "styled-components";
import { Heading, Text } from "@/components/Components";
import Button from "@/components/Button";

export default function Dialog() {

    return (
        <Container id="dialog">
            <Panel>
                <Heading id="dialog-heading"></Heading>
                <Text id="dialog-text"></Text>

                <ButtonPanel>
                    <Button id="dialog-button-primary" type="primary" size="small"></Button>
                    <Button id="dialog-button-secondary" type="warn" size="small"></Button>
                </ButtonPanel>
            </Panel>
        </Container>
    )
}

export function showEmptyDialog(...fields: string[]) {
    const valueString = fields.map(field => `'${field}'`).join(", ");

    showDialog({
       heading: "Values cannot be empty",
       text: `Values ${valueString} cannot be empty`,
        primary: {
           label: "Okay",
            onClick: () => {}
        },
        secondary: {
           label: "Cancel",
            onClick: () => {}
        }
    });
}

export function showDialog({ heading, text, primary, secondary }) {
    let dialog = document.getElementById("dialog");

    let headingComponent = document.getElementById("dialog-heading");
    let textComponent = document.getElementById("dialog-text");
    let buttonPrimary = document.getElementById("dialog-button-primary");
    let buttonSecondary = document.getElementById("dialog-button-secondary");

    headingComponent.innerHTML = heading;
    textComponent.innerHTML = text;

    buttonPrimary.innerHTML = primary.label;
    buttonPrimary.onclick = () => {
        hideDialog();
        primary.onClick();
    }
    buttonSecondary.innerHTML = secondary.label;
    buttonSecondary.onclick = () => {
        hideDialog();
        secondary.onClick();
    }

    dialog.style.display = "flex";
}

export function hideDialog() {
    let dialog = document.getElementById("dialog");
    dialog.style.display = "none";
}

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;

  width: 100vw;
  height: 100vh;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.2);
  
  display: none;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 500px;
  
  padding: 20px;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  border-radius: 5px;
  
  background-color: white;
`;

const ButtonPanel = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
`;