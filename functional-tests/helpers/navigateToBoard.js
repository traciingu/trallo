const navigateToBoard = async (selector) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector(selector);
};

module.exports = navigateToBoard;