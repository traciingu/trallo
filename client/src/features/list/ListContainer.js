import React, { useContext, useState } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";
import { CreateCardForm, CreateCardContainer } from "./listStyles";
import { createCard } from '../card/cardSlice';
import { ListContainerStyling } from "./listStyles";
import List from "./List";

const ListContainer = ({ lists, listsOrdering }) => {
    // const { Droppable, Draggable, Card } = useContext(di);
    const [canEdit, setCanEdit] = useState(false);

    const listStyle = (draggableStyle) => ({
        ...draggableStyle
    });

    const handleClick = (e) => {
        setCanEdit(!canEdit);
    }
    
    return (
        <ListContainerStyling>
            {lists && listsOrdering.map((key, index) => (
                // <Draggable draggableId={`${lists[key].id}`} index={index} key={lists[key].id}>
                //     {provided => (
                //         <div
                //             {...provided.draggableProps}
                //             ref={provided.innerRef}
                //             className="list"
                //             data-item-type="list"
                //         >
                //             <h2
                //                 {...provided.dragHandleProps}
                //             >{lists[key].title}</h2>
                //             <Droppable droppableId={`${lists[key].id}`} key={lists[key].id} type="cards">
                //                 {(providedDroppable) => (
                //                     <div
                //                         {...providedDroppable.droppableProps}
                //                         ref={providedDroppable.innerRef}
                //                     >
                //                         <div
                //                             style={listStyle(providedDroppable.droppableProps.draggableStyle)}
                //                         >
                //                             <Card listId={lists[key].id} />
                //                             {providedDroppable.placeholder}
                //                         </div>
                //                     </div>)}
                //             </Droppable>
                //             <CreateCardContainer>
                //                 <input type="button" data-add-button="card" value="Add card" onClick={handleClick} className={canEdit ? "hide" : ""} />
                //                 <CreateCardForm data-create-item-container="card" className={canEdit ? "" : "hide"} data-list-id={lists[key].id} onSubmit={handleSubmit} >
                //                     <input type="text" data-create-item-input="card" />
                //                     <input type="button" data-create-item-cancel="card" value="Cancel" onClick={handleClick} />
                //                     <input type="submit" data-create-item-confirm="card" value="Add Card" />
                //                 </ CreateCardForm>
                //             </CreateCardContainer>
                //         </div>
                //     )}
                // </Draggable>
                <List id={lists[key].id} index={index} title={lists[key].title} key={lists[key].id}/>
            ))}
            <input className={canEdit ? "hide" : ""} type="button" data-add-button="list" value="Add list" onClick={handleClick} />
            <form data-create-item-container="list" className={!canEdit ? "hide" : ""}>
                <input type="text" data-create-item-input="list" />
                <input type="submit" data-create-item-confirm="list" value="Add List" />
                <input type="button" data-create-item-cancel="list" value="Cancel" onClick={handleClick} />
            </form>
        </ ListContainerStyling>
    );
};

const msToProps = state => {
    return {
        lists: state.lists.byId,
        listsOrdering: state.lists.allIds

    }
}



export default connect(msToProps)(ListContainer);