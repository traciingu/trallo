import React, { useContext } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";

const List = ({ lists }) => {
    const { Droppable, Draggable, Card } = useContext(di);

    const listStyle = (draggableStyle) => ({
        ...draggableStyle
    });

    return (
        <>
            {lists && Object.keys(lists).map((key, index) => (
                <Draggable draggableId={`${lists[key].id}`} index={index} key={lists[key].id}>
                    {provided => (
                        <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className="list"
                        >
                            <h2
                                {...provided.dragHandleProps}
                            >{lists[key].title}</h2>
                            <Droppable droppableId={`${lists[key].id}`} key={lists[key].id} type="cards">
                                {(providedDroppable) => (
                                    <div
                                        {...providedDroppable.droppableProps}
                                        ref={providedDroppable.innerRef}
                                    >
                                        <div
                                            style={listStyle(providedDroppable.droppableProps.draggableStyle)}
                                        >
                                            <Card listId={lists[key].id} />
                                            {providedDroppable.placeholder}
                                        </div>
                                    </div>)}
                            </Droppable>
                        </div>
                    )}
                </Draggable>
            ))}
        </>
    );
};

const msToProps = state => {
    return {
        lists: state.lists.byId
    }
}

export default connect(msToProps)(List);