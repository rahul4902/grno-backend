const mongoose = require('mongoose');
const QnA = require('../models/QnA');

const qnaData = [
    {
        question: "How do I know if I am suffering from a kidney disorder?",
        answer: "As such, there are no symptoms of kidney disorder. However, you must take a kidney function test to properly diagnose kidney issues. The test can be booked from Redcliffe mobile app and website. The KFT test price easily comes within your budget."
    },
    {
        question: "What are the key causes of kidney disease?",
        answer: "Uncontrolled blood pressure and diabetes are the leading causes of decline in kidney function. The clinician will ask you to go for a diagnostic test such as the KFT test. Now, you can schedule the test at your convenience from Redcliffe Labs."
    },
    {
        question: "How can I prevent myself from kidney disease?",
        answer: "1. Manage cardiac disease, diabetes, and blood pressure. 2. Limit the use of alcohol. 3. Remain active by doing exercise on a daily basis. 4. Include green leafy vegetables and fruits in your diet. 5. Get a sound sleep. 6. Drink sufficient water."
    },
    {
        question: "What foods are good for kidney health?",
        answer: "The superfoods that can improve kidney function are cauliflower, cabbage, red peppers, blueberries, garlic, egg white, red grapes, and fish."
    }
];

async function seedQnA() {
    try {
        await mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await QnA.deleteMany({}); // Clear existing Q&A data

        await QnA.insertMany(qnaData);

        console.log('Q&A data seeded successfully!');
    } catch (err) {
        console.error('Error seeding Q&A data:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedQnA();
