import styled from "styled-components";

export const BoardsCollectionGrid = styled.div`
display: grid;
margin: 5em auto;
grid-template-columns: repeat(4, 1fr);
max-width: 60%;
`;

export const BoardsCollectionItem = styled.div`
padding: 1em;
padding-bottom: 2em;
border-radius: 5px;
background-color: lightblue;
min-height: 65px;
max-height: 80px;
max-width: 175px;
`;