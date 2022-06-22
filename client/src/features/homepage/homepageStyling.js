import styled from "styled-components";

export const BoardsCollectionGrid = styled.div`
display: flex;
margin: 5em auto;
flex-wrap: wrap;
justify-content: flex-start;
align-items: flex-start;
max-width: 60%;

a:link {
    text-decoration: none;
}
`;

export const BoardsCollectionItem = styled.div`
padding: 1em;
padding-bottom: 2em;
margin: 0 .25em;
margin-bottom: .5em;
border-radius: 5px;
background: linear-gradient(to left top, #d3c6c0, #696760);
min-height: 65px;
max-height: 80px;
width: 10em;
max-width: 175px;

h1 {
    font-size: 1.25rem;
    margin-top: 0;
    color: #ffffff;
}
`;