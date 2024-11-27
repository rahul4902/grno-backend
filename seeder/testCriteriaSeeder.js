const mongoose = require('mongoose');
const TestCriteria = require('../models/TestCriteria');

const TestCriteriaData = [
    {
        question: "Who all are eligible for this test?",
        answer: [
            "A kidney function test is a simple test that uses blood or urine samples to help analyze the problems in the kidneys and is eligible for:",
            "Patients with hypertension",
            "People experiencing problems related to Urinary Tract Infections (UTIs), autoimmune problems or genetic renal problems like Polycystic Kidney Disease",
            "KFT tests are recommended to patients experiencing problems related to painful or frequent urination, hematuria etc."
        ]
    },
    {
        question: "Why take KFT test in Delhi?",
        answer: [
            "The purpose of kidney function test is to perform routine health checkups",
            "KFT test is also done during pregnancy to check for any uterine or reproductive health problems",
            "Signs or symptoms associated with kidney problems",
            "KFT is also done to examine or track the progress of the treatment"
        ]
    },
    {
        question: "What are the benefits of this test?",
        answer: [
            "Kidney function test helps in screening the presence of blood and protein in the urine",
            "KFT helps in examining if creatinine is building up in the blood because high levels of creatinine mean a kidney issue",
            "Helps doctor diagnose causes related to unexplained high blood pressure",
            "Helps doctor examine the underlying cause of obesity",
            "Reduces risks of kidney damage due to advanced age, cigarette smoking, etc."
        ]
    }
];

async function seedTestCriteria() {
    try {
        await mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await TestCriteria.deleteMany({}); // Clear existing Test criteria

        await TestCriteria.insertMany(testCriteriaData);

        console.log('Test criteria seeded successfully!');
    } catch (err) {
        console.error('Error seeding test criteria:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedTestCriteria();
