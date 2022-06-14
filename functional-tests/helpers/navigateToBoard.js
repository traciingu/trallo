const navigateToBoard = async (selector, boardPath) => {
    await page.goto(`http://localhost:3000/b/${boardPath}`);
    await page.waitForSelector(selector);
};

module.exports = navigateToBoard;