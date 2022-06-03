const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Card modal', () => {
    let connection;
    let db;

    beforeAll(async () => {
        try {
            await installMouseHelper(page);

            connection = await MongoClient.connect("mongodb+srv://tracy:1234@cluster0.7rbuc.mongodb.net/trallo?retryWrites=true&w=majority");
            db = await connection.db("trallo");

            const cards = db.collection('cards');
            await cards.deleteMany({});

            const lists = db.collection('lists');
            await lists.deleteMany({});

            const boards = db.collection('boards');
            await boards.deleteMany({});

        } catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {
        await connection.close();
    })

    afterEach(async () => {
        try {
            const cards = db.collection('cards');
            await cards.deleteMany({});

            const lists = db.collection('lists');
            await lists.deleteMany({});

            const boards = db.collection('boards');
            await boards.deleteMany({});

        } catch (err) {
            console.log(err);
        }
    });

    describe("Starts with a card that has a description", () => {
        const boardState = [
            { title: 'Todo', cards: [{title: "Hello", description: "Goodbye"}] },
        ];

        const expectedBoardState =  [
            { title: 'Todo', cards: ["Hello"] },
        ];
        
        beforeEach(async () => {
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
                                return { title: card.title, description: card.description };
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
                await boards.insertOne(state);

                // >>>>>>>>>>>>>>>>> MODIFIED CHECK BOARD
                await navigateToBoard('[data-item-type="list"]');
                const actualLists = [];
                lists = [];
                lists = await page.$$('[data-item-type="list"]');
            
                for (let i = 0; i < lists.length; i++) {
                    const title = (await lists[i].$$eval('h2', nodes => nodes.map(n => n.innerText)))[0];
                    const cards = await lists[i].$$('.card');
                    const newCards = [];
                    for (let j = 0; j < cards.length; j++) {
                        const cardText = await cards[j].evaluate((card) => card.textContent);
                        newCards.push(cardText);
                    }
            
                    actualLists.push({ title, cards: newCards });
                }
            
                console.log(actualLists);
                expect(actualLists).toEqual(expectedBoardState);
        
            } catch (err) {
                console.log(err);
            }
        });

        it('opens the card modal', async () => {
            await navigateToBoard('[data-item-type="card"]');

            await page.waitForSelector('[data-modal-type="card"]', {visible: false});
            
            const expectedCardTitle = boardState[0].cards[0].title;
            const expectedCardDescription = boardState[0].cards[0].description;

            await page.click('[data-item-type="card"]');
            await page.waitForSelector('[data-modal-type="card"]', {visible: true});

            const modal = await page.$('[data-modal-type="card"]');
            const modalTitle = await modal.$('[data-modal-property="title"]');
            const titleText = await modalTitle.evaluate(element => element.textContent);

            const modalDescription = await modal.$('[data-modal-property="description"]');
            const descriptionText = await modalDescription.evaluate(element => element.textContent);
 
            expect(titleText).toEqual(expectedCardTitle);
            expect(descriptionText).toEqual(expectedCardDescription);
        });
    });
});