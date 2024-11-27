const mongoose = require('mongoose');
const Tag = require('../models/Tag');

const tagData = [
    {
        id: 40,
        tags: "Junk Food"
    },
    {
        id: 39,
        tags: "Smoking"
    },
    {
        id: 17,
        tags: "Kidney"
    },
    {
        id: 6,
        tags: "Diabetes / Sugar"
    }
];

async function seedTags() {
    try {
        await mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await Tag.deleteMany({}); // Clear existing tag data

        await Tag.insertMany(tagData);

        console.log('Tags seeded successfully!');
    } catch (err) {
        console.error('Error seeding tags:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedTags();
