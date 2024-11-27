const mongoose = require('mongoose');
const SampleType = require('../models/SampleType');

const sampleTypes = [
    { name: 'Blood', id: 52, display_name: 'Blood' },
    { name: 'Urine', id: 53, display_name: 'Urine' },
    { name: 'Saliva', id: 54, display_name: 'Saliva' },
    // Add more sample types as needed
];

async function seedSampleTypes() {
    try {
        await mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await SampleType.deleteMany({}); // Clear existing sample types

        await SampleType.insertMany(sampleTypes);

        console.log('Sample types seeded successfully!');
    } catch (err) {
        console.error('Error seeding sample types:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedSampleTypes();
