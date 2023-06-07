import styled from "styled-components";
import {useEffect, useState} from "react";

export default function Toggle({ label, toggled, onToggle }) {

    const [isChecked, setIsChecked] = useState(toggled);

    useEffect(() => {
          setIsChecked(toggled);
    }, [toggled]);

    const ToggleComponent = () => {
        return (
            <Switch>
                <Checkbox type="checkbox" checked={isChecked} onChange={onToggle} />
                <Slider />
            </Switch>
        );
    }

    if (label) {
        return (
            <Container>
                <ToggleComponent />
                <Label>{label}</Label>
            </Container>
        )
    } else {
        return (
            <ToggleComponent />
        )
    }
}

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
  
  align-items: center;
`;

const Label = styled.span`
  color: black;
  font-size: 16px;
  font-weight: 500;
  line-height: 100%;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
`;

const Slider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background-color: #ccc;
  
  transition: 400ms;
  cursor: pointer;
  border-radius: 28px;
  
  &:before {
    content: "";
    
    position: absolute;
    left: 4px;
    bottom: 4px;
    
    height: 20px;
    width: 20px;
    
    background-color: white;
    transition: 400ms;
    border-radius: 50%;
  }
`;

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + ${Slider} {
    background-color: black;
  }
  
  &:checked + ${Slider}:before {
    transform: translateX(20px);
  }
  
  &:focus + ${Slider} {
    box-shadow: 0 0 1px transparent;
  }
`;