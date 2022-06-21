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
            { title: 'Todo', cards: [{ title: "Hello", description: "Goodbye" }] },
        ];

        let board;

        beforeEach(async () => {
            board = await cardModalPopulate(db, boardState);
        });

        it('opens the card modal', async () => {
            await navigateToBoard('[data-item-type="card"]', board.insertedId);

            const expectedCardTitle = boardState[0].cards[0].title;
            const expectedCardDescription = boardState[0].cards[0].description;
            const boardDiv = await page.$('[data-item-type="board"]');

            await page.click('[data-item-type="card"]');
            await boardDiv.waitForSelector('[data-modal-type="card"]', { visible: true });

            const cardModal = await boardDiv.$('[data-modal-type="card"]');
            const modalTitle = await cardModal.$('[data-modal-property="title"]');
            const titleText = await modalTitle.evaluate(element => element.textContent);

            const modalDescription = await cardModal.$('[data-modal-property="description"]');
            const descriptionText = await modalDescription.evaluate(element => element.textContent);

            expect(titleText).toEqual(expectedCardTitle);
            expect(descriptionText).toEqual(expectedCardDescription);
        });
    });

    describe('Starts with 1 empty list', () => {
        const boardState = [
            { title: 'Todo', cards: [] },
        ];

        let board;

        beforeEach(async () => {
            board = await cardModalPopulate(db, boardState);
        });

        it('creates a card, and edits the title in the modal', async () => {
            await navigateToBoard('[data-item-type="list"]', board.insertedId);
            await page.click('[data-add-button="card"]');

            const firstList = await page.$('[data-item-type="list"]');
            const newCardTitle = "test card";
            const createInputField = await firstList.$('[data-create-item-input="card"]');

            await createInputField.type(newCardTitle);
            await page.click('[data-create-item-confirm="card"]');
            await page.waitForSelector('[data-item-type="card"]');
            await page.click('[data-item-type="card"]');
            await page.waitForTimeout(2000);
            const boardDiv = await page.$('[data-item-type="board"]');
            const cardModal = await boardDiv.$('[data-modal-type="card"]');

            let modalTitle = await cardModal.$('[data-modal-property="title"]');
            let modalTitleVisibility = await modalTitle.evaluate(element => getComputedStyle(element).getPropertyValue('display'));            
            let modalEditTitleForm = await cardModal.$('[data-modal-input-form="title"]');
            let modalEditTitleFormVisibility = await modalEditTitleForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(modalTitleVisibility).not.toEqual('none');
            expect(modalEditTitleFormVisibility).toEqual('none');

            await page.click('[data-modal-property="title"]');
            await page.waitForSelector('[data-modal-edit-property="title"]');

            modalTitleVisibility = await modalTitle.evaluate(element => getComputedStyle(element).getPropertyValue('display'));            
            modalEditTitleFormVisibility = await modalEditTitleForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(modalTitleVisibility).toEqual('none');
            expect(modalEditTitleFormVisibility).not.toEqual('none');

            modalEditTitleInput = await cardModal.$('[data-modal-edit-property="title"]');
            let modalEditTitleInputValue = await modalEditTitleInput.evaluate(element => element.value);

            expect(modalEditTitleInputValue).toEqual(newCardTitle);
            await cardModal.click('[data-modal-edit-property="title"]');

            for (let i = 0; i < modalEditTitleInputValue.length; i++) {
                await modalEditTitleInput.press('Backspace');
            }

            const updatedCardTitle = "another card title";
            await modalEditTitleInput.type(updatedCardTitle);

            modalEditTitleInputValue = await modalEditTitleInput.evaluate(element => element.value);

            expect(modalEditTitleInputValue).toEqual(updatedCardTitle);

            await modalEditTitleInput.press("Enter");

            await cardModal.waitForSelector('[data-modal-property="title"]');
            await page.waitForTimeout(700)

            modalTitleVisibility = await modalTitle.evaluate(element => getComputedStyle(element).getPropertyValue('display'));            
            modalEditTitleFormVisibility = await modalEditTitleForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(modalTitleVisibility).not.toEqual('none');
            expect(modalEditTitleFormVisibility).toEqual('none');


            modalTitle = await cardModal.$('[data-modal-property="title"]');
            const modalTitleText = await modalTitle.evaluate(element => element.innerText);

            expect(modalTitleText).toEqual(updatedCardTitle);

        });
    });
});

const cardModalPopulate = async (db, boardState) => {
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
        const newBoard = await boards.insertOne(state);

        return newBoard;

    } catch (err) {
        console.log(err);
    }
};