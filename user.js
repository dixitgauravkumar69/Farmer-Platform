const express = require("express");
const router = express.Router();
const FAQ = require("../models/faq");

// User route to ask questions
router.get("/", (req, res) => {
    res.render("chat");
});

router.post("/ask", async (req, res) => {
    const { userQuestion } = req.body;

    if (!userQuestion) {
        return res.status(400).json({ answer: "Please ask a question." });
    }

    try {
        const faq = await FAQ.findOne({ question: new RegExp(userQuestion, "i") });

        if (faq) {
            return res.json({ answer: faq.answer });
        } else {
            return res.json({ answer: "Sorry, I don't have an answer for that." });
        }
    } catch (error) {
        return res.status(500).json({ answer: "Something went wrong." });
    }
});

module.exports = router;
