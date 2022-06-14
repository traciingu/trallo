import styled from "styled-components";

export const ModalContainerStyling = styled.div`
position: fixed;
background-color: rgb(255, 255, 255);
border-radius: 5px;
margin: 3em 20%;
padding: 2em;
width: 40%;
min-height: 500px;
top: 0;
`;

export const ModalOverlayStyling = styled.div`
position: fixed;
background-color: rgb(155, 155, 155);
opacity: .75;
width: 100%;
height: 100%;
top: 0;
left: 0;
`;