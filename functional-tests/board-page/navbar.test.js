const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, populate, checkBoard } = require('../helpers');

describe('Navbar', () => {
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

    describe('Start with one board', () => {
        const boardState = [];
        let board;

        beforeEach(async () => {
            try {
                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('creates a new board from navbar', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            const navbarHomeButton = await page.$('[data-navbar-button="home"]');
            const navbarHomeButtonText = await navbarHomeButton.evaluate(element => element.innerText);

            expect(navbarHomeButtonText).toEqual("Home");

            const createButton = await page.$('[data-create-item-button="board"]');
            const createButtonValue = await createButton.evaluate(element => element.value);

            expect(createButtonValue).toEqual('Create Board');

            await page.click('[data-create-item-button="board"]');
            await page.waitForSelector('[data-modal-type="board"]', { visible: true });
            await page.waitForTimeout(700);
            const modal = await page.$('[data-modal-type="board"]');
            let modalVisibility = await modal.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalVisibility).not.toEqual('none');


            const modalForm = await page.$('[data-modal-input-form="title"]');
            const modalFormVisibility = await modalForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalFormVisibility).not.toEqual('none');

            const boardTitleText = 'test board';
            const modalTitleInput = await page.$('[data-modal-edit-property="title"]');
            await page.click('[data-modal-edit-property="title"]');
            await modalTitleInput.type(boardTitleText);
            await page.keyboard.press('Enter');

            await page.waitForSelector('[data-modal-type="board"]', { hidden: true });

            modalVisibility = await modal.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalVisibility).toEqual('none');

            const boardCollection = await page.$('[data-collection="board"]');
            await page.waitForSelector(`[data-board-collection-item-title="${boardTitleText}"]`);
            const newBoardItem = await boardCollection.$(`[data-board-collection-item-title="${boardTitleText}"]`);
            const newBoardItemText = await newBoardItem.evaluate(element => element.innerText);            

            expect(newBoardItemText).toEqual(boardTitleText);

            const boardId = await page.$eval(`[data-board-collection-item-title="${boardTitleText}"]`, element => element.dataset.boardCollectionItemId);
            await page.click(`[data-board-collection-item-title="${boardTitleText}"]`);
            await page.waitForSelector('[data-component="navbar"]');

            const url = await page.url();
            expect(url).toEqual(`http://localhost:3000/b/${boardId}`);
        });

        it('Navigates to home', async () => {
            await page.goto(`http://localhost:3000/b/${board.insertedId}`);
            await page.waitForSelector('[data-component="navbar"]');

            await page.click('[data-navbar-button="home"]');
            await page.waitForSelector('[data-component="navbar"]');

            const url = await page.url();
            expect(url).toEqual('http://localhost:3000/home');
        });
    });
});