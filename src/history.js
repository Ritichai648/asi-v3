document.addEventListener("DOMContentLoaded", function () {
    displayHistory();
});

function toggleHistory() {
    const historyContainer = document.getElementById("history-container");
    if (historyContainer.style.display === "none") {
        historyContainer.style.display = "grid"; // เมื่อปิดประวัติให้เปลี่ยนเป็น grid layout
    } else {
        historyContainer.style.display = "none";
    }
}



function displayHistory() {
    const history = JSON.parse(localStorage.getItem("imageHistory")) || [];
    const historyContainer = document.getElementById("history-container");

    // Clear history container first
    historyContainer.innerHTML = "";

    // Check if history is empty
    if (history.length === 0) {
        historyContainer.innerHTML = "<p>No history available</p>";
        return;
    }

    // Loop through each item in history and create HTML elements
    history.forEach((item, index) => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");

        const prompt = document.createElement("p");
        prompt.textContent = `Prompt: ${item.prompt}`;
        historyItem.appendChild(prompt);

        // Create image element
        const img = document.createElement("img");
        img.src = item.imageUrl;
        img.alt = `Artwork ${index + 1}`; // Set alt attribute
        img.title = `Artwork ${index + 1}`; // Set title attribute (optional, displays tooltip)
        historyItem.appendChild(img); // Append image to history item

        historyContainer.appendChild(historyItem); // Append history item to container
    });
}
