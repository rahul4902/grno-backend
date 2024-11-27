const mongoose = require('mongoose');
const Category = require("../models/Category")
// Database connection
mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Sample category data
const categories = [
    {
        name: "Kidney",
        icon: "https://media-cdn.redcliffelabs.com/media/category-files/20/140416b5-e16b-432f-bf96-e60435468829.webp",
        icon_2: null,
        id: 20,
        display_name: "Kidney",
        icon_1: null,
        order: 72
    }
];

// Seeder function
async function seedCategories() {
    try {
        // Clear existing categories
        await Category.deleteMany({});

        // Insert new categories
        await Category.insertMany(categories);

        console.log('Categories seeded successfully!');
    } catch (err) {
        console.error('Error seeding categories:', err);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
}

// Run the seeder
seedCategories();
