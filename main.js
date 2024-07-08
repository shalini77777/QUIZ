let quizData = [
  {
    question: "Which is the bet that you cannot win?",
    options: ["A bet against the house", "Alphabet", "A bet against yourself", "A bet with some probability"],
    correct: "Alphabet",
  },
  {
    question: "whats orange and sonds like a parrot?",
    options: ["A trumphet", "A carrot", "An orange", "A pumpkin"],
    correct: "A carrot",
  },
  {
    question: "What has a head, a tail, but no body?",
    options: ["A snake", "A coin", "A cornet", "A ghost"],
    correct: "A coin",
  },
  {
    question: "What has keys but can't open locks?",
    options: ["A map", "A piano", "A door", "A computer"],
    correct: "A piano",
  },
  {
    question: "What building has the most stories?",
    options: ["A skyscraper", "A bookstore", "A library", "A museum"],
    correct: "A library",
  },
  {
    question: "Why was the math book sad??",
    options: ["It got wet", "It was lost", "It had too many problems", "It was missing pages"],
    correct: "It had too many problems",
  },
  {
    question: "What has hands but cannot clap?",
    options: ["A clock", "A statue", "A robot", "A painting"],
    correct: "A clock",
  },
  {
    question: "What kind of room has no doors or windows?",
    options: ["A mushroom", "A classroom", "A ballroom", "A studyroom"],
    correct: "A mushroom",
  },
  {
    question: "What kind of band never plays music?",
    options: ["A rubber band", "A marching band", "A cover band", "A music band"],
    correct: "A rubber band",
  },
];

const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.querySelector(".quiz-container .question");
const optionsElement = document.querySelector(".quiz-container .options");
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn");

let questionNumber = 0;
let score = 0;
const MAX_QUESTIONS = 5;
let timerInterval;

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

quizData = shuffleArray(quizData);

const resetLocalStorage = () => {
  for (let i = 0; i < MAX_QUESTIONS; i++) {
    localStorage.removeItem(`userAnswer_${i}`);
  }
};

resetLocalStorage();

const checkAnswer = (e) => {
  let userAnswer = e.target.textContent;
  if (userAnswer === quizData[questionNumber].correct) {
    score++;
    e.target.classList.add("correct");
  } else {
    e.target.classList.add("incorrect");
  }

  localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);

  let allOptions = document.querySelectorAll(".quiz-container .option");
  allOptions.forEach((o) => {
    o.classList.add("disabled");
  });
};

const createQuestion = () => {
  clearInterval(timerInterval);

  let secondsLeft = 9;
  const timerDisplay = document.querySelector(".quiz-container .timer");
  timerDisplay.classList.remove("danger");

  timerDisplay.textContent = "Time Left: 10 seconds";

  timerInterval = setInterval(() => {
    timerDisplay.textContent = `Time Left: ${secondsLeft.toString().padStart(2, "0")} seconds`;
    secondsLeft--;

    if (secondsLeft < 3) {
      timerDisplay.classList.add("danger");
    }

    if (secondsLeft < 0) {
      clearInterval(timerInterval);
      displayNextQuestion();
    }
  }, 1000);

  optionsElement.innerHTML = "";
  questionElement.innerHTML = `<span class='question-number'>${questionNumber + 1}/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;

  const shuffledOptions = shuffleArray(quizData[questionNumber].options);

  shuffledOptions.forEach((o) => {
    const option = document.createElement("button");
    option.classList.add("option");
    option.innerHTML = o;
    option.addEventListener("click", (e) => {
      checkAnswer(e);
    });
    optionsElement.appendChild(option);
  });
};

const retakeQuiz = () => {
  questionNumber = 0;
  score = 0;
  quizData = shuffleArray(quizData);
  resetLocalStorage();

  createQuestion();
  quizResult.style.display = "none";
  quizContainer.style.display = "block";
};

const displayQuizResult = () => {
  quizResult.style.display = "flex";
  quizContainer.style.display = "none";
  quizResult.innerHTML = "";

  const resultHeading = document.createElement("h2");
  resultHeading.innerHTML = `You have scored ${score} out of ${MAX_QUESTIONS}.`;
  quizResult.appendChild(resultHeading);

  for (let i = 0; i < MAX_QUESTIONS; i++) {
    const resultItem = document.createElement("div");
    resultItem.classList.add("question-container");

    const userAnswer = localStorage.getItem(`userAnswer_${i}`);
    const correctAnswer = quizData[i].correct;

    let answeredCorrectly = userAnswer === correctAnswer;

    if (!answeredCorrectly) {
      resultItem.classList.add("incorrect");
    }

    resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${quizData[i].question}</div>
    <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
    <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;

    quizResult.appendChild(resultItem);
  }

  const retakeBtn = document.createElement("button");
  retakeBtn.classList.add("retake-btn");
  retakeBtn.innerHTML = "Retake Quiz";
  retakeBtn.addEventListener("click", retakeQuiz);
  quizResult.appendChild(retakeBtn);
};

const displayNextQuestion = () => {
  if (questionNumber >= MAX_QUESTIONS - 1) {
    displayQuizResult();
    return;
  }

  questionNumber++;
  createQuestion();
};

nextBtn.addEventListener("click", displayNextQuestion);

startBtn.addEventListener("click", () => {
  startBtnContainer.style.display = "none";
  quizContainer.style.display = "block";
  createQuestion();
});
