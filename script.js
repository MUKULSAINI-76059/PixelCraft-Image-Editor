
const filters = {
    brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    grayScale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }
};

const presets = {
    original: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotation: 0,
        blur: 0,
        grayScale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    oldSchool: {
        brightness: 110,
        contrast: 120,
        saturation: 70,
        hueRotation: 0,
        blur: 0,
        grayScale: 20,
        sepia: 65,
        opacity: 100,
        invert: 0
    },

    vintage: {
        brightness: 105,
        contrast: 110,
        saturation: 80,
        hueRotation: 350,
        blur: 0,
        grayScale: 10,
        sepia: 35,
        opacity: 100,
        invert: 0
    },

    blackAndWhite: {
        brightness: 105,
        contrast: 125,
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayScale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    coolTone: {
        brightness: 105,
        contrast: 110,
        saturation: 115,
        hueRotation: 190,
        blur: 0,
        grayScale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    warmTone: {
        brightness: 110,
        contrast: 105,
        saturation: 115,
        hueRotation: 340,
        blur: 0,
        grayScale: 0,
        sepia: 25,
        opacity: 100,
        invert: 0
    },

    vibrant: {
        brightness: 110,
        contrast: 120,
        saturation: 165,
        hueRotation: 0,
        blur: 0,
        grayScale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    dreamy: {
        brightness: 115,
        contrast: 90,
        saturation: 110,
        hueRotation: 0,
        blur: 1,
        grayScale: 0,
        sepia: 10,
        opacity: 100,
        invert: 0
    },

    cyberpunk: {
        brightness: 105,
        contrast: 130,
        saturation: 180,
        hueRotation: 280,
        blur: 0,
        grayScale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    filmGrain: {
        brightness: 105,
        contrast: 115,
        saturation: 80,
        hueRotation: 0,
        blur: 0,
        grayScale: 15,
        sepia: 20,
        opacity: 100,
        invert: 0
    },

    sepia: {
        brightness: 105,
        contrast: 110,
        saturation: 80,
        hueRotation: 0,
        blur: 0,
        grayScale: 0,
        sepia: 100,
        opacity: 100,
        invert: 0
    },

    moody: {
        brightness: 80,
        contrast: 135,
        saturation: 75,
        hueRotation: 200,
        blur: 0,
        grayScale: 10,
        sepia: 10,
        opacity: 100,
        invert: 0
    }
};

// DOM elements
const filterContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets");
const imgInput = document.querySelector("#image-input");
const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");
const imageCanvas = document.querySelector("#imageCanvas");
const imagePlaceholder = document.querySelector(".placeholder");

const canvasCtx = imageCanvas.getContext("2d");

let img = null;

// Create a readable name from a filter or preset key
function formatName(name) {
    return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, char => char.toUpperCase());
}

// Create an individual filter slider
function createFilterElement(name, config) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const label = document.createElement("p");
    label.textContent = formatName(name);

    const input = document.createElement("input");
    input.type = "range";
    input.name = name;
    input.min = config.min;
    input.max = config.max;
    input.value = config.value;
    input.step = 1;
    input.setAttribute("aria-label", formatName(name));

    input.addEventListener("input", () => {
        filters[name].value = Number(input.value);
        applyFilter();
    });

    div.append(label, input);

    return div;
}

// Create all filter sliders
function createFilters() {
    filterContainer.innerHTML = "";

    Object.keys(filters).forEach(name => {
        const filterElement = createFilterElement(
            name,
            filters[name]
        );

        filterContainer.appendChild(filterElement);
    });
}

// Update slider positions from the current filter values
function updateFilterSliders() {
    Object.keys(filters).forEach(name => {
        const input = filterContainer.querySelector(
            `input[name="${name}"]`
        );

        if (input) {
            input.value = filters[name].value;
        }
    });
}

// Apply filters to the image
function applyFilter() {
    if (!img) return;

    canvasCtx.clearRect(
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    );

    canvasCtx.filter = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturation.value}%)
        hue-rotate(${filters.hueRotation.value}deg)
        blur(${filters.blur.value}px)
        grayscale(${filters.grayScale.value}%)
        sepia(${filters.sepia.value}%)
        opacity(${filters.opacity.value}%)
        invert(${filters.invert.value}%)
    `;

    canvasCtx.drawImage(
        img,
        0,
        0,
        imageCanvas.width,
        imageCanvas.height
    );

    canvasCtx.filter = "none";
}

// Upload an image
imgInput.addEventListener("change", event => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        imgInput.value = "";
        return;
    }

    const imageURL = URL.createObjectURL(file);
    const newImage = new Image();

    newImage.onload = () => {
        img = newImage;

        imageCanvas.width = img.naturalWidth;
        imageCanvas.height = img.naturalHeight;

        imageCanvas.style.display = "block";
        imagePlaceholder.style.display = "none";

        applyFilter();

        URL.revokeObjectURL(imageURL);
    };

    newImage.onerror = () => {
        alert("Unable to load this image. Please try another file.");
        URL.revokeObjectURL(imageURL);
    };

    newImage.src = imageURL;
});

// Reset all filters to their default values
function resetFilters() {
    Object.keys(filters).forEach(name => {
        filters[name].value =
            name === "brightness" ||
            name === "contrast" ||
            name === "saturation" ||
            name === "opacity"
                ? 100
                : 0;
    });

    updateFilterSliders();
    applyFilter();
}

resetBtn.addEventListener("click", resetFilters);

// Download the edited image
downloadBtn.addEventListener("click", () => {
    if (!img) {
        alert("Please choose an image first.");
        return;
    }

    const link = document.createElement("a");

    link.href = imageCanvas.toDataURL("image/png");
    link.download = "edited-image.png";

    link.click();
});

// Create preset buttons
function createPresets() {
    presetsContainer.innerHTML = "";

    Object.keys(presets).forEach(name => {
        const presetBtn = document.createElement("button");

        presetBtn.type = "button";
        presetBtn.classList.add("btn");
        presetBtn.textContent = formatName(name);

        presetBtn.addEventListener("click", () => {
            const preset = presets[name];

            Object.keys(preset).forEach(filterName => {
                filters[filterName].value = preset[filterName];
            });

            updateFilterSliders();
            applyFilter();
        });

        presetsContainer.appendChild(presetBtn);
    });
}

// Initialize the editor
createFilters();
createPresets();
