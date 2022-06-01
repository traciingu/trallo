const checkBoard = async (expectedLists) => {
    const actualLists = [];
    const lists = await page.$$('.list');

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

    expect(expectedLists).toEqual(actualLists);

};

module.exports = checkBoard;