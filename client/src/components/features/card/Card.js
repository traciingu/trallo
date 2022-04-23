import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";

const Card = ({ cards, listId, cardsOrdering }) => {

    const cardStyle = (draggableStyle) => ({
        padding: "10px",
        backgroundColor: "white",
        ...draggableStyle
    });

    return (
        <>
            {cardsOrdering[listId]?.map((cardId, index) => {
                return (<Draggable draggableId={cards[cardId]._id} index={index} key={cards[cardId]._id}>
                    {(provided) => (
                        <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            style={cardStyle(provided.draggableProps.style)}
                        >
                            {cards[cardId].title}
                        </div>
                    )}
                </Draggable>
                )
            }
            )
            }


        </>
    );
};

const mapStateToProps = state => {
    return {
        cards: state.cards.byId,
        cardsOrdering: state.cards.allIds
    }
};

// export default Card;
export default connect(mapStateToProps)(Card);