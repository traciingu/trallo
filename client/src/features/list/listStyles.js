import styled from "styled-components";

export const CreateCardForm = styled.form``;

export const CreateCardContainer = styled.div``;

export const ListContainerStyling = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 3em;

  

  .list {
    max-width: 270px;
    min-width: 200px;
    padding: 1em;
    background-color: #e7e7e9;
    border-radius: 5px;
    box-shadow: 0px 2px 3px #cfcfd2;
    
    h2 {
      margin-top: 0;
    }

    input[type="button"], input[type="submit"] {
      background-color: inherit;
    }
  }
  `;