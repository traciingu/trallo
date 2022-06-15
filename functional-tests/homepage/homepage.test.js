const { MongoClient } = require('mongodb');
const { installMouseHelper, navigateToBoard, backspace, populate, checkBoard } = require('../helpers');

describe('Homepage', () => {
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

    describe("Starts without board components", () => {
        const boardState = [];

        let board;

        beforeEach(async () => {
            try {
                board = await populate(db, boardState);
            } catch (err) {
                console.log(err);
            }
        });

        it('Does not display lists', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            const listExists = await page.$eval('[data-item-type="list"]', () => true).catch(() => false);
            expect(listExists).toEqual(false);

        });

        it('Opens and closes the create board modal on an empty homepage', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            const placeholder = await page.$('[data-placeholder="empty-homepage"]');
            const placeholderText = await placeholder.evaluate(element => element.innerText);

            expect(placeholderText).toEqual("You have no boards");

            const createButton = await page.$('[data-medium-button="homepage-create-board"]');
            const createButtonText = await createButton.evaluate(element => element.value);

            expect(createButtonText).toEqual("Create Board");

            await page.click('[data-medium-button="homepage-create-board"]');
            await page.waitForSelector('[data-modal-type="board"]', { visible: true });            

            await page.click('[data-small-button="close-modal"]');
            await page.waitForSelector('[data-modal-type="board"]', { hidden: true });

            const createBoardModal = await page.$('[data-modal-type="board"]');
            const createBoardModalVisibility = await createBoardModal.evaluate(element => getComputedStyle(element).getPropertyValue('display'));

            expect(createBoardModalVisibility).toEqual('none');

        });

        it('creates a new board', async () => {
            await page.goto(`http://localhost:3000/home`);
            await page.waitForSelector('[data-component="navbar"]');

            await page.click('[data-medium-button="homepage-create-board"]');
            await page.waitForSelector('[data-modal-type="board"]', { visible: true });
            const modal = await page.$('[data-modal-type="board"]');
            let modalVisibility = await modal.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalVisibility).not.toEqual('none');


            const modalForm = await page.$('[data-modal-input-form="title"]');
            const modalFormVisibility = await modalForm.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalFormVisibility).not.toEqual('none');

            const modalTitleInput = await page.$('[data-modal-edit-property="title"]');
            await page.click('[data-modal-edit-property="title"]');
            await modalTitleInput.type('test board');
            await page.keyboard.press('Enter');

            await page.waitForSelector('[data-modal-type="board"]', { hidden: true });

            modalVisibility = await modal.evaluate(element => getComputedStyle(element).getPropertyValue('display'));
            expect(modalVisibility).toEqual('none');

        });
    });

    // describe("Starts without board components", () => {
    //     const boardState = [];

    //     let board;

    //     beforeEach(async () => {
    //         try {
    //             board = await populate(db, boardState);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     });
    // });
});
