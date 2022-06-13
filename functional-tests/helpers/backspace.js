const backspace = async (wordToBackspace) => {
    for (let i = 0; i < wordToBackspace.length; i++) {
        await page.keyboard.press('Backspace');
    }
};

module.exports = backspace;