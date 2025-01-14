// https://opentdb.com/api.php?amount=10&type=multiple

const _question = document.getElementById("question");
const _options = document.querySelector(".quiz-options");
const _correctScore = document.getElementById("correct-score");
const _totalQuestion = document.getElementById("total-question");
const _checkBtn = document.getElementById("check-answer");
const _playAgainBtn = document.getElementById("play-again");
const _result = document.getElementById("result");

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10,
  questionList = [],
  currentQuestionIndex = 0;

function evenListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  evenListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
  try {
    if (questionList.length === 0) {
      const result = await fetch(APIUrl);
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }

      const data = await result.json();
      if (!data.results || data.results.length === 0) {
        throw new Error(`No questions available. Please try again later.`);
      }

      questionList = data.results;
    }

    if (currentQuestionIndex < questionList.length) {
      _result.innerHTML = "";
      showQuestion(questionList[currentQuestionIndex]); // This load the first question
    }
  } catch (error) {
    _result.innerHTML = `<p>Error: ${error.message}</p>`;
    console.error("Error loading question:", error);
  }
}

function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span class = "category">${data.category}
  </span>`;
  _options.innerHTML = `
    ${optionsList
      .map(
        (option, index) => `
            <li> ${index + 1}. <span> ${option} </span> </li>
        `
      )
      .join("")}
  `;

  selectOption();
}

function selectOption() {
  _options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });

  console.log(correctAnswer);
}

function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p> <i class = "fas fa-check"></i>Correct Answer! </p>`;
    } else {
      _result.innerHTML = `<p> <i class = "fas fa-times"></i>Incorrect Answer! </p> <p><small><b>Correct Answer: </b> ${correctAnswer}</small></p>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option! </p>`;
    _checkBtn.disabled = false;
  }
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  currentQuestionIndex++;
  if (askedCount === totalQuestion) {
    _result.innerHTML += `<p> Your score is ${correctScore}/10. </p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 2000);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  currentQuestionIndex = 0;
  questionList = [];
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
