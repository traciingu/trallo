import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";
import { createCard } from "../card/cardSlice";
import { CreateCardForm, CreateCardContainer } from "./listStyles";
import { updateList } from "./listSlice";


const List = ({ createCard, id, index, title, updateList }) => {
    const { Droppable, Draggable, Card } = useContext(di);
    const [canCreateCard, setCanCreateCard] = useState(false);
    const [canEditList, setCanEditList] = useState(false);
    const [listTitleInputText, setListTitleInputText] = useState(title);

    const handleListEditSubmit = (e) => {
        e.preventDefault();
        updateList({id, title: e.target[0].value});
        setCanEditList(!canEditList);
    };

    const handleChange = (e) => {
        setListTitleInputText(e.target.value);
    };

    const handleCreateCardButtonClick = (e) => {
        setCanCreateCard(!canCreateCard);
    };

    const handleEditListButtonClick = (e) => {
        setCanEditList(!canEditList);
    }

    const handleCreateCardSubmit = (e) => {
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
                <form className={canEditList ? "" : "hide"} onSubmit={handleListEditSubmit}>
                    <input type="text" data-edit-item-input="list"  onChange={handleChange} value={listTitleInputText} />
                </form>
                <h2 className={canEditList ? "hide" : ""}
                data-list-title={title}   
                    {...provided.dragHandleProps}
                >
                    {title}
                </h2>

                <input type="button" data-edit-item-button="list" value="Edit" onClick={handleEditListButtonClick} />

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
                    <input type="button" data-add-button="card" value="Add card" onClick={handleCreateCardButtonClick} className={canCreateCard ? "hide" : ""} />
                    <CreateCardForm data-create-item-container="card" className={canCreateCard ? "" : "hide"} data-list-id={id} onSubmit={handleCreateCardSubmit} >
                        <input type="text" data-create-item-input="card" />
                        <input type="button" data-create-item-cancel="card" value="Cancel" onClick={handleCreateCardButtonClick} />
                        <input type="submit" data-create-item-confirm="card" value="Add Card" />
                    </ CreateCardForm>
                </CreateCardContainer>
            </div>
        )}
    </Draggable>
};

const mapDispatchToProps = dispatch => {
    return {
        createCard: (info) => { dispatch(createCard(info)); },
        updateList: (info) => { dispatch(updateList(info)); }
    }
}

export default connect(null, mapDispatchToProps)(List);