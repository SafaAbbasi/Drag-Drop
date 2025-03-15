let selectedElement = null;
let selectedElementType = null;

document.querySelectorAll(".element").forEach((element) => {
  element.addEventListener("dragstart", dragStart);
});

const playground = document.getElementById("playground");
const propertiesPanel = document.getElementById("properties-panel");

playground.addEventListener("dragover", dragOver);
playground.addEventListener("drop", drop);

function dragStart(event) {
  event.dataTransfer.setData("type", event.target.dataset.type);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const type = event.dataTransfer.getData("type");
  const offsetX = event.clientX - playground.getBoundingClientRect().left;
  const offsetY = event.clientY - playground.getBoundingClientRect().top;

  createElement(type, offsetX, offsetY);
  propertiesPanel.style.display = "block";
}

function createElement(type, x, y) {
  let element;
  if (type === "text") {
    element = document.createElement("div");
    element.textContent = "New Text";
    element.style.fontFamily = "Arial";
    element.style.fontSize = "16px";
    element.style.position = "absolute";
    element.style.cursor = "pointer";
    element.style.color = "#2c3e50";
  } else if (type === "image") {
    element = document.createElement("img");
    element.src =
      "https://www.ivertech.com/Articles/Images/KoalaBear200x200.jpg";
    element.style.position = "absolute";
    element.style.cursor = "pointer";
  } else if (type === "shape") {
    element = document.createElement("div");
    element.innerHTML = `<svg width="100" height="100"><path d="M10 10 H90 V90 H10 Z" fill="lightblue"></svg>`;
    element.style.position = "absolute";
    element.style.cursor = "pointer";
  }

  element.classList.add("draggable");
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.draggable = true;

  element.addEventListener("click", () => {
    selectedElement = element;
    selectedElementType = type;
    updatePropertiesPanel();
  });

  element.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "");
    selectedElement = element;
    selectedElementType = type;
    updatePropertiesPanel();
  });

  element.addEventListener("dragend", (e) => {
    const rect = playground.getBoundingClientRect();
    element.style.left = `${e.clientX - rect.left}px`;
    element.style.top = `${e.clientY - rect.top}px`;
  });

  playground.appendChild(element);
}

function updatePropertiesPanel() {
  const form = document.getElementById("properties-form");
  form.reset();

  if (selectedElementType === "text") {
    document.getElementById("text-properties").style.display = "block";
    document.getElementById("image-properties").style.display = "none";
    document.getElementById("shape-properties").style.display = "none";

    form["font-family"].value = selectedElement.style.fontFamily || "Arial";
    form["font-size"].value = parseInt(selectedElement.style.fontSize) || 16;
    form["bold"].checked = selectedElement.style.fontWeight === "bold";
    form["italic"].checked = selectedElement.style.fontStyle === "italic";
    form["underline"].checked =
      selectedElement.style.textDecoration === "underline";
  } else if (selectedElementType === "image") {
    document.getElementById("text-properties").style.display = "none";
    document.getElementById("image-properties").style.display = "block";
    document.getElementById("shape-properties").style.display = "none";

    form["image-source"].value = selectedElement.src;
  } else if (selectedElementType === "shape") {
    document.getElementById("text-properties").style.display = "none";
    document.getElementById("image-properties").style.display = "none";
    document.getElementById("shape-properties").style.display = "block";

    form["svg-path"].value = selectedElement
      .querySelector("path")
      .getAttribute("d");
  }

  document.getElementById("common-properties").style.display = "block";
  form["width"].value = selectedElement.offsetWidth;
  form["height"].value = selectedElement.offsetHeight;
}

document
  .getElementById("properties-form")
  .addEventListener("input", (event) => {
    if (!selectedElement) return;

    if (selectedElementType === "text") {
      selectedElement.style.fontFamily = event.target.form["font-family"].value;
      selectedElement.style.fontSize = `${event.target.form["font-size"].value}px`;
      selectedElement.style.fontWeight = event.target.form["bold"].checked
        ? "bold"
        : "normal";
      selectedElement.style.fontStyle = event.target.form["italic"].checked
        ? "italic"
        : "normal";
      selectedElement.style.textDecoration = event.target.form["underline"]
        .checked
        ? "underline"
        : "none";
    } else if (selectedElementType === "image") {
      selectedElement.src = event.target.form["image-source"].value;
    } else if (selectedElementType === "shape") {
      selectedElement
        .querySelector("path")
        .setAttribute("d", event.target.form["svg-path"].value);
    }

    selectedElement.style.width = `${event.target.form["width"].value}px`;
    selectedElement.style.height = `${event.target.form["height"].value}px`;
  });
