import React, { useContext, useState } from "react";
import di from '../../injection_container';


const Card = ({ id, index, title }) => {
    const { Draggable } = useContext(di);
    const [ canEditCardTitle, setCanEditCardTitle ] = useState(false);
    const [ cardTitleInputText, setCardTitleInputText ] = useState(title);

    const handleEditButtonClick = (e) => {
        setCanEditCardTitle(!canEditCardTitle);
    };

    const handleInputChange = (e) => {
        setCardTitleInputText(e.target.value);
    };

    return (<Draggable draggableId={id} index={index} key={id}>
        {(provided) => (
            <div
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="card"
            >
                <h3 data-card-title={title} className={canEditCardTitle ? "hide" : "" }>
                  {title}
                </h3>
                <input type="text" data-edit-item-input="card" className={canEditCardTitle ? "" : "hide" } value={cardTitleInputText} onChange={handleInputChange} />
                <input type="button" data-edit-item-button="card" value="Edit" onClick={handleEditButtonClick}/>
            </div>
        )}
    </Draggable>
    )
};

export default Card;