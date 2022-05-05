import React, { useContext } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";

const Card = ({ cards, listId, cardsOrdering }) => {
    const { Draggable } = useContext(di);

    const cardStyle = (draggableStyle) => ({
        padding: "10px",
        backgroundColor: "white",
        ...draggableStyle
    });

    return (
        <>
            {cards && cardsOrdering[listId]?.map((cardId, index) => {
                return (<Draggable draggableId={cards[cardId].id} index={index} key={cards[cardId].id}>
                    {(provided) => (
                        <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            style={cardStyle(provided.draggableProps.style)}
                            className="card"
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

export default connect(mapStateToProps)(Card);