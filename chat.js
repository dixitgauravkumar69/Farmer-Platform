document.getElementById("askQuestionForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const userQuestion = document.getElementById("userQuestion").value;
    
    const response = await fetch("/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userQuestion })
    });
    
    const data = await response.json();
    document.getElementById("faqAnswer").innerText = data.answer;
});
