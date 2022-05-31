import styled from "styled-components";

export const ListContainerStyling = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 3em;

  .hide {
      display: none;
  }

  .list {
    max-width: 270px;
    min-width: 150px;
    padding: 1em;
    background-color: rgba(200, 100, 100, .5);
    
    h2 {
      margin-top: 0;
    }
  }

  .card {
    border-style: solid;
    border-color: green;
  }
  `;

const listWidth = "270px";