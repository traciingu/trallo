import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";
import { createCard } from "../card/cardSlice";
import { CreateCardForm, CreateCardContainer } from "./listStyles";


const List = ({createCard, id, index, title}) => {
    const { Droppable, Draggable, Card } = useContext(di);
    const [canEdit, setCanEdit] = useState(false);
    
    const handleClick = (e) => {
        setCanEdit(!canEdit);
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        createCard({
            listId: e.target.dataset.listId,
            title: e.target[0].value,
        });
    }

    return <Draggable draggableId={`${id}`} index={index} key={id}>
        {provided => (
            <div
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="list"
                data-item-type="list"
            >
                <h2
                    {...provided.dragHandleProps}
                >{title}</h2>

                <Droppable droppableId={`${id}`} key={id} type="cards">
                    {(providedDroppable) => (
                        <div
                            {...providedDroppable.droppableProps}
                            ref={providedDroppable.innerRef}
                        >
                            <div    >
                                <Card listId={id} />
                                {providedDroppable.placeholder}
                            </div>
                        </div>)}
                </Droppable>
                <CreateCardContainer>
                    <input type="button" data-add-button="card" value="Add card" onClick={handleClick} className={canEdit ? "hide" : ""} />
                    <CreateCardForm data-create-item-container="card" className={canEdit ? "" : "hide"} data-list-id={id} onSubmit={handleSubmit} >
                        <input type="text" data-create-item-input="card" />
                        <input type="button" data-create-item-cancel="card" value="Cancel" onClick={handleClick} />
                        <input type="submit" data-create-item-confirm="card" value="Add Card" />
                    </ CreateCardForm>
                </CreateCardContainer>
            </div>
        )}
    </Draggable>
};

const mapDispatchToProps = dispatch => {
    return {
        createCard: (info) => { dispatch(createCard(info)); }
    }
}



export default connect(null, mapDispatchToProps)(List);