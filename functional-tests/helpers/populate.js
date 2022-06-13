const populate = async (db, boardState) => {
    try {
        const cardsCollection = db.collection('cards');
        const listsCollection = db.collection('lists');
        let lists = { insertedIds: {} };
        if (boardState.length > 0) {
            let listStateCopy = [];
            for (let i = 0; i < boardState.length; i += 1) {
                let cards = { insertedIds: {} };
                if (boardState[i].cards.length > 0) {
                    const cardsJson = boardState[i].cards.map(card => {
                        return { title: card, description: null };
                    });
                    cards = await cardsCollection.insertMany(cardsJson);
                }

                listStateCopy.push({
                    ...boardState[i],
                    cards: Object.keys(cards.insertedIds).map(key => cards.insertedIds[key])
                });
            }

            lists = await listsCollection.insertMany(listStateCopy);
        }

        const state = {
            title: "Dummy",
            lists: Object.keys(lists.insertedIds).map(key => lists.insertedIds[key]),
        };

        const boards = db.collection('boards');
        const newBoard = await boards.insertOne(state);

        return newBoard;

    } catch (err) {
        console.log(err);
    }
};

module.exports = populate;