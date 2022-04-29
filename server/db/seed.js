const mongoose = require('mongoose');
require('dotenv').config();


const { Board, List, Card } = require('./models');

async function seed() {
    mongoose.connect(process.env.MONGO_URI);

    // const b1 = 
    // const c1 = await new Card({
    //     title: "You say",
    //     description: "Why?"
    // }).save();

    // const c2 = await new Card({
    //     title: "I say",
    //     description: "I don't know"
    // }).save();

    // const c3 = await new Card({
    //     title: "Hello",
    //     description: "Goodbye"
    // }).save();

    console.log(await new Card({
            title: "Seed Test",
            description: "Goodbye"
        }).save());

    // await new List({
    //     title: "Todo",
    //     cards:[c3, c1]
    // }).save();

    // await new List({
    //     title: "In progress",
    //     cards:[c2]
    // }).save();

    // await new List({
    //     title: "Done",
    //     cards:[]
    // }).save();

    // const allLists = await List.find({});

    // console.log(allLists);
    // console.log(await new Board({
    //     title: "Dummy",
    //     background: "#000000",
    //     lists: allLists
    // }).save());

    // await b1.save();

    // const tmpB = await Board.findOne();
    // console.log(typeof tmpB._id)

    // const todo = new List({
    //     title: "todo",
    //     board: tmpB._id
    // });

    // await todo.save();

    // const tmpC = await List.findOne();

    // const todoItem = new Card({
    //     title: "todo item",
    //     description: "do this",
    //     list: tmpC._id
    // });

    // await todoItem.save();
}

async function runSeed() {
    try {
        console.log("seeding...");
        await seed();
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        console.log("Complete! Closing db connection");
        mongoose.connection.close();
        console.log("db connection closed");
    }
}

// runSeed(); 

module.exports = runSeed;
