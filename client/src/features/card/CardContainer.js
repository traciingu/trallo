import { connect } from "react-redux";
import Card from './Card';
import { CardContainerStyling } from "./cardStyling";

const CardContainer = ({ cards, listId, cardsOrdering }) => {
    return (
        <CardContainerStyling>
            {cards && cardsOrdering[listId]?.map((cardId, index) => {
                return <Card id={cards[cardId].id} index={index} title={cards[cardId].title} description={cards[cardId].description} key={cards[cardId].id} />;
            })}
        </CardContainerStyling>
    );
};

const mapStateToProps = state => {
    return {
        cards: state.cards.byId,
        cardsOrdering: state.cards.allIds
    }
};

export default connect(mapStateToProps)(CardContainer);