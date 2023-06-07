import styled from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 50px;
`;

export const Heading = styled.h3`
  color: black;
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
  
  margin-bottom: 15px;
`;

export const Text = styled.p`
  color: black;
  font-size: 15px;
  font-weight: 300;
  line-height: 170%;
  
  opacity: 0.5;
  
  margin-bottom: 15px;
`;

export const InputField = styled.input`
  min-width: 350px;
  
  color: black;
  font-size: 13px;
  font-weight: 400;
  line-height: 100%;
  
  padding: 8px;
  
  outline: none;
  
  border: 2px solid lightgray;
  border-bottom: 5px solid black;
  border-radius: 5px;
  
  &:disabled {
    color: rgba(0, 0, 0, 0.7);
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const Panel = styled.div`
  width: 100%;
  max-width: ${props => props.fullWidth ? "100%" : "900px"};

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 30px;
  border-radius: 5px;

  margin-top: 40px;

  box-shadow: 0px 0px 10px -5px gray;
`;

export const Label = styled.span`
  color: black;
  font-size: 15px;
  font-weight: 400;
  line-height: 100%;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const TagItem = styled.div`
  color: black;
  font-size: 12px;
  font-weight: 400;
  line-height: 100%;

  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  align-items: center;

  padding: 8px 8px 8px 15px;
  margin: 3px;

  border-radius: 30px;

  background-color: rgba(0, 0, 0, 0.1);
`;

export const RemoveIcon = styled.span`
  color: black;
  font-size: 12px;
  font-weight: 500;
  line-height: 100%;

  width: 22px;
  height: 22px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 100px;

  background-color: rgba(0, 0, 0, 0.1);

  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background-color: black;
    color: white;
  }
`;

export const Empty = styled.p`
  color: black;
  font-size: 18px;
  font-weight: 400;
`;