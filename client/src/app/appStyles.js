import styled from "styled-components";

export const AppContainer = styled.div`
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

* {
    font-family: sans-serif;
}

h3 {
    font-weight: 300;
}

.hide {
    display: none;
}

input[type="button"], input[type="submit"] {
    background-color: inherit;
    border: none;
    border-radius: 4px;
    padding: .55em;
    margin: .25em 0;
    background-color: #f0f0f5;
    transition: background-color .1s;

    :hover {
        background-color: #d9d9de;
    }
}

`;