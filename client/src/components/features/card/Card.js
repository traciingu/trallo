import { Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";

const Card = ({ cards }) => {

    const cardStyle = (draggableStyle) => ({
        padding: "10px",
        backgroundColor: "white",
        ...draggableStyle
    });

    return (
        <>
        {Object.keys(cards).map((key, index) => (
        <Draggable draggableId={cards[key]._id} index={index} key={cards[key]._id}>
            {(provided) => (
                <div
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    style={cardStyle(provided.draggableProps.style)}
                >
                    {cards[key].title}
                </div>
            )}
        </Draggable>))}
        </>
    );
};

const mapStateToProps = state => {
    console.log(state)
    return {
        cards: state.cards.byId
    }
};

// export default Card;
export default connect(mapStateToProps)(Card);