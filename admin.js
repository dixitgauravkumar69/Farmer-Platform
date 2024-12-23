const express = require("express");
const router = express.Router();
const FAQ = require("../models/faq");

// Admin route to display the admin panel and the list of FAQs
router.get("/admin", async (req, res) => {
    try {
        // Fetch all FAQs from the database
        const faqs = await FAQ.find({});
        res.render("admin", { faqs });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).send("Error fetching FAQs.");
    }
});

// Admin route to add FAQs
router.post("/admin/add", async (req, res) => {
    const { question, answer } = req.body;
    
    if (!question || !answer) {
        return res.status(400).send("Please provide both a question and an answer.");
    }

    const newFAQ = new FAQ({ question, answer });
    try {
        await newFAQ.save();
        res.redirect("/admin");
    } catch (error) {
        res.status(500).send("Error saving FAQ.");
    }
});

module.exports = router;
