const apiKey = "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";

const maxImages = 4; // Number of images to generate for each prompt

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function addToHistory(prompt, imageUrl) {
    const history = JSON.parse(localStorage.getItem("imageHistory")) || [];

    // เพิ่มข้อมูลประวัติใหม่
    history.unshift({ prompt, imageUrl });

    // จำกัดจำนวนประวัติเพียงแค่ maxImages * 2 เพื่อไม่ให้ LocalStorage เต็มไปด้วยข้อมูล
    if (history.length > maxImages * 2) {
        history.pop();
    }

    // บันทึกข้อมูลใหม่ลงใน LocalStorage
    localStorage.setItem("imageHistory", JSON.stringify(history));
}
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("imageHistory")) || [];

    const historyContainer = document.getElementById("history-container");
    historyContainer.innerHTML = "";

    if (history.length === 0) {
        const noHistoryMessage = document.createElement("p");
        noHistoryMessage.textContent = "No history available";
        historyContainer.appendChild(noHistoryMessage);
    } else {
        history.forEach((item, index) => {
            const historyItem = document.createElement("div");
            historyItem.classList.add("history-item");

            const prompt = document.createElement("p");
            prompt.textContent = `Prompt: ${item.prompt}`;
            historyItem.appendChild(prompt);

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.alt = `art-${index + 1}`;
            historyItem.appendChild(img);

            historyContainer.appendChild(historyItem);
        });
    }
}



// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Function to enable the generate button after process
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Function to clear image grid
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function to generate images
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/prompthero/openjourney",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({ inputs: prompt }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to generate image!");
            }

            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);
            imageUrls.push(imgUrl);

            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `art-${i + 1}`;
            img.onclick = () => downloadImage(imgUrl, i);
            document.getElementById("image-grid").appendChild(img);

            // เพิ่มประวัติการสร้างรูปภาพ
            addToHistory(prompt, imgUrl);
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Failed to generate image!");
        }
    }

    loading.style.display = "none";
    enableGenerateButton();
}


document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    // Set filename based on the selected image
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}
window.onload = displayHistory;
