import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { updateCard, deleteCard } from "./cardSlice";
import { connect } from "react-redux";
import { setModalDisplay } from "../board/boardSlice";


const Card = ({ id, index, title, description, updateCard, deleteCard, setModalDisplay, modal }) => {
    const { Draggable } = useContext(di);
    const [canEditCardTitle, setCanEditCardTitle] = useState(false);
    const [cardTitleInputText, setCardTitleInputText] = useState(title);

    const handleEditButtonClick = (e) => {
        e.stopPropagation();
        setCanEditCardTitle(!canEditCardTitle);
    };

    const handleInputChange = (e) => {
        setCardTitleInputText(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateCard({ title: e.target[0].value, id });
        setCanEditCardTitle(!canEditCardTitle);
    };

    const handleDeleteButtonClick = (e) => {
        e.stopPropagation();
        deleteCard({ id });
    }

    const handleCardClick = (e) => {
        setModalDisplay({
            isDisplayed: !modal.isDisplayed,
            dataAttribute: 'card',
            mode: 'edit',
            title, description
        });
    }

    return (<Draggable draggableId={id} index={index} key={id}>
        {(provided) => (
            <div
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="card"
                data-item-type="card"
                data-card-title={title}
                onClick={handleCardClick}
            >
                <h3 data-card-property="title" className={canEditCardTitle ? "hide" : ""}>
                    {title}
                </h3>
                <form className={canEditCardTitle ? "" : "hide"} data-edit-item-form="card" onSubmit={handleFormSubmit}>
                    <input type="text" data-edit-item-input="card" value={cardTitleInputText} onChange={handleInputChange} />
                    <input type="button" data-delete-item="card" value="Delete" onClick={handleDeleteButtonClick} />
                </form>
                <input type="button" data-edit-item-button="card" value="Edit" onClick={handleEditButtonClick} />
            </div>
        )}
    </Draggable>
    )
};

const mdToProps = dispatch => {
    return {
        updateCard: info => { dispatch(updateCard(info)) },
        deleteCard: info => { dispatch(deleteCard(info)) },
        setModalDisplay: info => { dispatch(setModalDisplay(info)) },
    };
};

const msToProps = state => {
    return {
        modal: state.board.modal,
    };
};

export default connect(msToProps, mdToProps)(Card);