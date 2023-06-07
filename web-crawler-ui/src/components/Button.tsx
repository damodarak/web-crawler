import styled, { css } from "styled-components";
import Link from "next/link";

type ButtonSize = "large" | "small";
type ButtonType = "primary" | "secondary" | "warn";

interface Props {
    id?: string;
    children: any;
    href?: string;
    type?: ButtonType;
    size?: ButtonSize;
    onClick?: Function;
    disabled?: boolean;
}

export default function Button(props: Props) {

    const children = props.children;
    const href = props.href;
    const type = props.type ?? "primary";
    const size = props.size ?? "small";
    const onClick = props.onClick;
    const disabled = props.disabled ?? false;

    if (href) {
        return (
            <StyledLinkButton
                id={props.id}
                type={type}
                size={size}
                href={disabled ? null : href}
                disabled={disabled}
            >
                {children}
            </StyledLinkButton>
        )
    }

    return (
        <StyledButton
            id={props.id}
            type={type}
            size={size}
            onClick={disabled ? null : onClick}
            disabled={disabled}
        >
            {children}
        </StyledButton>
    )
}

const ButtonStyles = css`
  color: ${props => props.type === "primary" && "white"};
  color: ${props => props.type === "secondary" && "black"};
  color: ${props => props.type === "warn" && "white"};
  
  font-size: ${props => props.size === "large" && "13px"};
  font-size: ${props => props.size === "small" && "12px"};
  
  font-weight: 600;
  line-height: 100%;
  text-decoration: none;
  
  padding: ${props => props.size === "large" && "12px 30px"};
  padding: ${props => props.size === "small" && "9px 22px"};

  border-radius: 5px;
  
  cursor: pointer;
  
  border: ${props => props.type === "primary" && "3px solid black"};
  border: ${props => props.type === "secondary" && "3px solid black"};
  border: ${props => props.type === "warn" && "3px solid #B81D13"};
  
  background-color: ${props => props.type === "primary" && "black"};
  background-color: ${props => props.type === "secondary" && "transparent"};
  background-color: ${props => props.type === "warn" && "#B81D13"};
  
  transition: all 150ms;
  
  border: ${props => props.disabled && "3px solid rgb(220, 220, 220)"};
  background-color: ${props => props.disabled && "transparent"};
  color: ${props => props.disabled && "rgb(200, 200, 200)"};
  cursor: ${props => props.disabled && "not-allowed"};
  
  &:hover {
    opacity: ${props => props.disabled ? "1.0" : "0.8"};
  }
`;

const StyledButton = styled.div`${ButtonStyles}`;

export const StyledLinkButton = styled(Link)`${ButtonStyles}`;