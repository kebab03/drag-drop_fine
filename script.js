function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  const targetZone = ev.target;

  // Verifica se il target è una dropzone
  if (targetZone.classList.contains("dropzone")) {
    if (targetZone.children.length > 0 && targetZone.children[0].classList.contains("word")) {
      // Se la dropzone contiene già una parola, scambia gli elementi
      const existingElement = targetZone.children[0];
      const draggedParent = draggedElement.parentNode;
      const existingParent = existingElement.parentNode;

      // Scambia gli elementi
      draggedParent.replaceChild(existingElement, draggedElement);
      existingParent.appendChild(draggedElement);
    } else {
      // Aggiungi l'elemento trascinato alla dropzone
      targetZone.appendChild(draggedElement);
    }
  } else if (targetZone.classList.contains("word")) {
    // Se il target è una parola, scambia gli elementi
    const existingElement = targetZone;
    const draggedParent = draggedElement.parentNode;
    const existingParent = existingElement.parentNode;

    // Scambia gli elementi
    draggedParent.replaceChild(existingElement, draggedElement);
    existingParent.appendChild(draggedElement);
  }
}

function resetWord(ev) {
  ev.preventDefault();
  const data = ev.target.id;
  const draggedElement = document.getElementById(data);
  document.getElementById("ContainerdiRisposte").appendChild(draggedElement);
}

function checkAnswers(correctOrder) {
  const dropzones = document.querySelectorAll(".dropzone");
  let isCorrect = true;

  dropzones.forEach((zone, index) => {
    const word = zone.firstChild ? zone.firstChild.textContent.trim() : null;
    if (word !== correctOrder[index]) {
      isCorrect = false;
    }
  });

  const resultBox = document.querySelector(".answers-box");
  if (resultBox) {
    resultBox.textContent = isCorrect
      ? "Tutte le risposte sono corrette!"
      : "Alcune risposte sono sbagliate.";
    resultBox.style.backgroundColor = isCorrect ? "#4CAF50" : "#f44336";
  }
}

// Function to set up draggable questions
function setupDragableQuestion(questionData, quiz) {
  const container = document.createElement("div");
  container.classList.add("container", "mt-4");

  const title = document.createElement("h3");
  title.textContent = questionData.question;
  container.appendChild(title);

  const row = document.createElement("div");
  row.classList.add("row");

  // Left column for answers
  const colLeft = document.createElement("div");
  colLeft.classList.add("col-md-6");
  
  const paroleDiv = document.createElement("div");
  paroleDiv.id = "ContainerdiRisposte";
  
  questionData.itemsInOrder.forEach((answer, index) => {
    const parola = document.createElement("div");
    parola.id = `text${index + 1}`;
    parola.classList.add("Risposte", "word");
    parola.draggable = true;
    parola.textContent = answer;
    parola.ondragstart = drag;
    parola.ondblclick = resetWord;
    paroleDiv.appendChild(parola);
  });

  colLeft.appendChild(paroleDiv);
  row.appendChild(colLeft);

  // Right column for phrases
  const colRight = document.createElement("div");
  colRight.classList.add("col-md-6");

  questionData.itemsInOrder.forEach((_, index) => {
    const fraseContainer = document.createElement("div");
    fraseContainer.classList.add("frase", "mb-4");

    const inizioFrase = document.createElement("span");
    inizioFrase.textContent = questionData[`fase${index + 1}`][0].inizio;
    fraseContainer.appendChild(inizioFrase);

    const dropzone = document.createElement("div");
    dropzone.classList.add("dropzone");
    dropzone.ondrop = (ev) => drop(ev, questionData); // Passa questionData come parametro
    dropzone.ondragover = allowDrop;
    fraseContainer.appendChild(dropzone);

    const fineFrase = document.createElement("span");
    fineFrase.textContent = questionData[`fase${index + 1}`][1].fine;
    fraseContainer.appendChild(fineFrase);
    
    colRight.appendChild(fraseContainer);
  });

  row.appendChild(colRight);
  
  container.appendChild(row);
  quiz.appendChild(container);

  // Aggiungi il bottone per verificare le risposte
  const checkButton = document.createElement("button");
  checkButton.textContent = "Verifica le risposte";
  checkButton.onclick = () => checkAnswers(questionData.itemsInOrder);
  quiz.appendChild(checkButton);
}

window.onload = function() {
  const questionData = {
    question: "Sposta le parole nella frase corretta",
    type: "dragable",
    fase1: [{ inizio: "la" }, { fine: "amica" }],
    fase2: [{ inizio: "gli" }, { fine: "spogliatoi" }],
    fase3: [{ inizio: "quando" }, { fine: "tornare" }],
    itemsInOrder: ["mia", "miei", "vuoi"]
  };

  const quizContainer = document.getElementById("quizContainer") || document.body; // Usa body se quizContainer non esiste
  setupDragableQuestion(questionData, quizContainer);

  const answersBox = document.createElement("div");
  answersBox.classList.add("answers-box");
  answersBox.textContent = "Le risposte corrette appariranno qui.";
  quizContainer.appendChild(answersBox);
}
