import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { updateCard } from "./cardSlice";
import { connect } from "react-redux";


const Card = ({ id, index, title, updateCard }) => {
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
        updateCard({title: e.target[0].value, id });
        setCanEditCardTitle(!canEditCardTitle);
    };

    return (<Draggable draggableId={id} index={index} key={id}>
        {(provided) => (
            <div
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="card"
            >
                <h3 data-card-title={title} className={canEditCardTitle ? "hide" : ""}>
                    {title}
                </h3>
                <form className={canEditCardTitle ? "" : "hide"} data-edit-item-form="card" onSubmit={handleFormSubmit}>
                    <input type="text" data-edit-item-input="card"  value={cardTitleInputText} onChange={handleInputChange} />
                </form>
                <input type="button" data-edit-item-button="card" value="Edit" onClick={handleEditButtonClick} />
            </div>
        )}
    </Draggable>
    )
};

const mdToProps = dispatch => {
    return {
        updateCard: info => { dispatch(updateCard(info))},
    };
};

export default connect(null, mdToProps)(Card);