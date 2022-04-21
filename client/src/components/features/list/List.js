import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "../card/Card";
import { connect } from "react-redux";
import { useEffect } from "react";


const List = ({ lists }) => {


    useEffect(() => {
        console.log(lists)
    }, []);

    const listStyle = (draggableStyle) => ({
        // display: "flex",
        ...draggableStyle
    });


    return (
        <>
            {Object.keys(lists).map((key, index) => (
                <Draggable draggableId={`${lists[key].id}`} index={index} key={lists[key].id}>
                    {provided => (
                        <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                        >
                            <h2
                                {...provided.dragHandleProps}
                            >{lists[key].title}</h2>
                            <Droppable droppableId={`${lists[key].id}`} key={lists[key].id} type="cards">
                                {provided => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <div
                                            style={listStyle(provided.droppableProps.draggableStyle)}
                                        >
                                            <Card listId={lists[key].id} />
                                            {provided.placeholder}
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

const mapStateToProps = state => {
    return {
        lists: state.lists.byId
        // Object.keys(state.lists).map((key) => state.lists[key].title)
    }
}

// export default List;
export default connect(mapStateToProps)(List);