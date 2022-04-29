const config = async () => {
    return {
        "preset": "jest-puppeteer",
        setupFiles: ["./test/testEnvVars.js"]
    }
};

module.exports = config;