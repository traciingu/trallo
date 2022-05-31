import React, { useContext } from "react";
import di from '../../injection_container';
import { connect } from "react-redux";
import Card from './Card';

const CardContainer = ({ cards, listId, cardsOrdering }) => {

    return (
        <>
            {cards && cardsOrdering[listId]?.map((cardId, index) => {
                return <Card id={cards[cardId].id} index={index} title={cards[cardId].title} key={cards[cardId].id} />;
            })}
        </>
    );
};

const mapStateToProps = state => {
    return {
        cards: state.cards.byId,
        cardsOrdering: state.cards.allIds
    }
};

export default connect(mapStateToProps)(CardContainer);