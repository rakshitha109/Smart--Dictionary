document.addEventListener("mouseup", async function () {
    let selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    let wordData = await fetchWordData(selectedText);
    if (wordData) showTooltip(wordData);
});

async function fetchWordData(word) {
    try {
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        let data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            let firstMeaning = data[0].meanings[0] || {};
            let firstDefinition = firstMeaning.definitions ? firstMeaning.definitions[0] : {};

            let meaning = firstDefinition.definition || "No definition available.";
            let audio = data[0].phonetics.find(p => p.audio)?.audio || "";

            return { word, meaning, audio };
        }
    } catch (error) {
        console.error("Error fetching word data:", error);
    }
    return null;
}

function showTooltip(wordData) {
    let existingTooltip = document.querySelector(".hover-tooltip");
    if (existingTooltip) existingTooltip.remove();

    let tooltip = document.createElement("div");
    tooltip.className = "hover-tooltip";

    tooltip.innerHTML = `
        <b>${wordData.word}</b><br>
        ${wordData.meaning} <br>
        ${wordData.audio ? `<button class="play-audio">🔊</button>` : ""}
    `;

    document.body.appendChild(tooltip);

    if (wordData.audio) {
        let audio = new Audio(wordData.audio);
        tooltip.querySelector(".play-audio").addEventListener("click", () => audio.play());
    }

    setTimeout(() => tooltip.remove(), 3000);
}
