import React, { useContext, useState } from "react";
import di from '../../injectionContainer';
import { connect } from "react-redux";
import { createCard } from "../card/cardSlice";
import { CreateCardForm, CreateCardContainer } from "./listStyles";
import { updateList, deleteList } from "./listSlice";


const List = ({ createCard, id, index, title, updateList, deleteList }) => {
    const { Droppable, Draggable, CardContainer } = useContext(di);
    const [canCreateCard, setCanCreateCard] = useState(false);
    const [canEditList, setCanEditList] = useState(false);
    const [listTitleInputText, setListTitleInputText] = useState(title);
    const [createCardValue, setCreateCardValue] = useState('');

    const handleListEditSubmit = (e) => {
        e.preventDefault();
        updateList({ id, title: e.target[0].value });
        setCanEditList(!canEditList);
    };

    const handleChange = (e) => {
        setListTitleInputText(e.target.value);
    };

    const handleCreateCardValueChange = (e) => {
        setCreateCardValue(e.target.value);
    };

    const handleCreateCardButtonClick = (e) => {
        setCanCreateCard(!canCreateCard);
    };

    const handleEditListButtonClick = (e) => {
        setCanEditList(!canEditList);
    };

    const handleCreateCardSubmit = (e) => {
        e.preventDefault();
        createCard({
            listId: e.target.dataset.listId,
            title: e.target[0].value,
        });
        setCreateCardValue('');
    };

    const handleDeleteListButtonClick = (e) => {
        deleteList({ id });
    };

    return <Draggable draggableId={`${id}`} index={index} key={id}>
        {provided => (
            <div
                {...provided.draggableProps}
                ref={provided.innerRef}
                className="list"
                data-item-type="list"
                data-list-title={title}
            >
                <form className={canEditList ? "" : "hide"} onSubmit={handleListEditSubmit}>
                    <input type="text" data-edit-item-input="list" onChange={handleChange} value={listTitleInputText} />
                    <input type="button" data-delete-item="list" value="Delete" onClick={handleDeleteListButtonClick} />
                </form>
                <h2 className={canEditList ? "hide" : ""}
                    data-list-property="title"
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
                                <CardContainer listId={id} />
                                {providedDroppable.placeholder}
                            </div>
                        </div>)}
                </Droppable>
                <CreateCardContainer>
                    <input type="button" data-add-button="card" value="Add card" onClick={handleCreateCardButtonClick} className={canCreateCard ? "hide" : ""} />
                    <CreateCardForm
                        data-create-item-container="card"
                        className={canCreateCard ? "" : "hide"}
                        data-list-id={id}
                        onSubmit={handleCreateCardSubmit}
                        data-create-item-container-visibility={canCreateCard}
                    >
                        <input type="text" data-create-item-input="card" value={createCardValue} onChange={handleCreateCardValueChange} />
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
        updateList: (info) => { dispatch(updateList(info)); },
        deleteList: (info) => { dispatch(deleteList(info)); }
    }
}

export default connect(null, mapDispatchToProps)(List);