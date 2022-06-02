import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { updateCard, deleteCard } from "./cardSlice";
import { connect } from "react-redux";


const Card = ({ id, index, title, updateCard, deleteCard }) => {
    const { Draggable } = useContext(di);
    const [canEditCardTitle, setCanEditCardTitle] = useState(false);
    const [cardTitleInputText, setCardTitleInputText] = useState(title);

    const handleEditButtonClick = (e) => {
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
        deleteCard({ id });
    }

    return (<Draggable draggableId={id} index={index} key={id}>
        {(provided) => (
            <div
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="card"
                data-item-type="card"
            >
                <h3 data-card-title={title} className={canEditCardTitle ? "hide" : ""}>
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
    };
};

export default connect(null, mdToProps)(Card);