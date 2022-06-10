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
            await cardModalPopulate(db, boardState, expectedBoardState);
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

    describe('Starts with 1 empty list', () => {
        const boardState = [
            { title: 'Todo', cards: [] },
        ];

        const expectedBoardState =  [
            { title: 'Todo', cards: [] },
        ];
        
        beforeEach(async () => {
            await cardModalPopulate(db, boardState, expectedBoardState);
        });

        it('creates a card, and edits the title in the modal', async () => {
            await navigateToBoard('[data-item-type="list"]');
            await page.click('[data-add-button="card"]');
            const firstList = await page.$('[data-item-type="list"]');
            const newCardTitle = "test card";
            const createInputField = await firstList.$('[data-create-item-input="card"]');
            await createInputField.type(newCardTitle);
            await page.click('[data-create-item-confirm="card"]');
            await page.waitForSelector('[data-item-type="card"]');
            const firstCard = await page.$('[data-item-type="card"]');
            await page.click('[data-item-type="card"]');
            await page.waitForSelector('[data-modal-type="card"]', {visible: true});
            await page.click('[data-modal-property="title"]');
            await page.waitForSelector('[data-modal-edit-property="title"]');
            const modalEditTitleInput = await page.$('[data-modal-edit-property="title"]');
            const modalEditTitleInputValue = await modalEditTitleInput.evaluate(element => element.value);
            expect(modalEditTitleInputValue).toEqual(newCardTitle);
            await page.click('[data-modal-edit-property="title"]');

            for (let i = 0; i < modalEditTitleInputValue.length; i++) {
                await page.keyboard.press('Backspace');
            }

            const updatedCardTitle = "another card title";
            await modalEditTitleInput.type(updatedCardTitle);
            
            await page.waitForTimeout(700);

        });
    });
});

const cardModalPopulate = async (db, boardState, expectedBoardState) => {
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
        expect(actualLists).toEqual(expectedBoardState);

    } catch (err) {
        console.log(err);
    }
}