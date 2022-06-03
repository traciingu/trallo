const checkBoard = async (expectedLists) => {
    const actualLists = [];
    const lists = await page.$$('[data-item-type="list"]');

    for (let i = 0; i < lists.length; i++) {
        const title = (await lists[i].$$eval('h2', nodes => nodes.map(n => n.innerText)))[0];
        const cards = await lists[i].$$('[data-item-type="card"]');
        const newCards = [];
        for (let j = 0; j < cards.length; j++) {
            const cardText = await cards[j].evaluate((card) => card.textContent);
            newCards.push(cardText);
        }

        actualLists.push({ title, cards: newCards });
    }

    expect(actualLists).toEqual(expectedLists);

};

module.exports = checkBoard;