import React, { useState } from "react";
import { connect } from "react-redux";
import { ListContainerStyling } from "./listStyles";
import List from "./List";
import { createList } from "./listSlice";

const ListContainer = ({ lists, listsOrdering, boardId, createList }) => {
    const [canEdit, setCanEdit] = useState(false);
    const [createListValue, setCreateListValue] = useState('');

    const handleClick = (e) => {
        setCanEdit(!canEdit);
    };

    const handleCreateListValueChange = (e) => {
        setCreateListValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createList({ title: e.target[0].value, boardId });
        setCreateListValue('');
    };

    return (
        <ListContainerStyling>
            {lists && listsOrdering.map((key, index) => (
                <List id={lists[key].id} index={index} title={lists[key].title} key={lists[key].id} />
            ))}
            <input className={canEdit ? "hide" : ""} type="button" data-add-button="list" value="Add list" onClick={handleClick} />
            <form data-create-item-container="list" className={!canEdit ? "hide" : ""} onSubmit={handleSubmit}>
                <input type="text" data-create-item-input="list" value={createListValue} onChange={handleCreateListValueChange} />
                <input type="submit" data-create-item-confirm="list" value="Add List" />
                <input type="button" data-create-item-cancel="list" value="Cancel" onClick={handleClick} />
            </form>
        </ ListContainerStyling>
    );
};

const msToProps = state => {
    return {
        lists: state.lists.byId,
        listsOrdering: state.lists.allIds,
        boardId: state.board.id,

    }
}

const mdToProps = dispatch => {
    return {
        createList: (info) => dispatch(createList(info)),
    }
}



export default connect(msToProps, mdToProps)(ListContainer);