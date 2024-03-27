document.addEventListener("DOMContentLoaded", function () {
    const promptFe = document.getElementById("prompt");
    const runButton = document.getElementById("runButton");
    const outputDiv = document.getElementById("output");
    const styleDropdown = document.getElementById("style");
    const denoisingStrengthInput = document.getElementById("denoisingStrength");
    const denoisingStrengthValue = document.getElementById("denoisingStrengthValue");
    const promptStrengthInput = document.getElementById("promptStrength");
    const promptStrengthValue = document.getElementById("promptStrengthValue");
    const controlDepthStrengthInput = document.getElementById("controlDepthStrength");
    const controlDepthStrengthValue = document.getElementById("controlDepthStrengthValue");
    const instantIdStrengthInput = document.getElementById("instantIdStrength");
    const instantIdStrengthValue = document.getElementById("instantIdStrengthValue");
    const imageInput = document.getElementById("imageInput");

    denoisingStrengthInput.addEventListener("input", function() {
        denoisingStrengthValue.textContent = this.value;
    });

    promptStrengthInput.addEventListener("input", function() {
        promptStrengthValue.textContent = this.value;
    });

    controlDepthStrengthInput.addEventListener("input", function() {
        controlDepthStrengthValue.textContent = this.value;
    });

    instantIdStrengthInput.addEventListener("input", function() {
        instantIdStrengthValue.textContent = this.value;
    });

    runButton.addEventListener("click", async () => {
        const prompt = promptFe.value;
        const selectedStyle = styleDropdown.value;
        const denoisingStrength = parseFloat(denoisingStrengthInput.value);
        const promptStrength = parseFloat(promptStrengthInput.value);
        const controlDepthStrength = parseFloat(controlDepthStrengthInput.value);
        const instantIdStrength = parseFloat(instantIdStrengthInput.value);
        outputDiv.innerHTML = "Running...";

        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = async function(event) {
            const imageDataUrl = await convertToPNG(event.target.result);

            const response = await fetch("/runReplicate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: 'fofr/face-to-many:35cea9c3164d9fb7fbd48b51503eabdb39c9d04fdaef9a68f368bed8087ec5f9',
                    input: {
                        image: imageDataUrl,
                        style: selectedStyle,
                        prompt: prompt,
                        negative_prompt: '',
                        prompt_strength: promptStrength,
                        denoising_strength: denoisingStrength,
                        control_depth_strength: controlDepthStrength,
                        instant_id_strength: instantIdStrength,
                    }
                }),
            });

            const data = await response.json();
            const imageUrl = data[0];
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.style.height = '400px';

            outputDiv.innerHTML = '';

            outputDiv.appendChild(imgElement);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });
    async function convertToPNG(imageDataUrl) {
        const img = new Image();
        img.src = imageDataUrl;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        return canvas.toDataURL('image/png');
    }
});
