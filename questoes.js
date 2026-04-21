const qData = window.QUESTOES_DATA || [];

const qToc = document.getElementById("questionToc");
const topicCountEl = document.getElementById("topicCount");
const questionProgressEl = document.getElementById("questionProgress");
const topicIconLine = document.getElementById("topicIconLine");
const topicTitle = document.getElementById("topicTitle");
const topicSubtitle = document.getElementById("topicSubtitle");
const scoreBadge = document.getElementById("scoreBadge");
const typeBadge = document.getElementById("typeBadge");
const quizProgressFill = document.getElementById("quizProgressFill");
const quizProgressText = document.getElementById("quizProgressText");
const questionNumber = document.getElementById("questionNumber");
const questionTag = document.getElementById("questionTag");
const questionPrompt = document.getElementById("questionPrompt");
const questionExtra = document.getElementById("questionExtra");
const optionsContainer = document.getElementById("optionsContainer");
const feedbackPanel = document.getElementById("feedbackPanel");
const feedbackBadge = document.getElementById("feedbackBadge");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackAnswer = document.getElementById("feedbackAnswer");
const feedbackRationale = document.getElementById("feedbackRationale");
const prevQuestionBtn = document.getElementById("prevQuestion");
const nextQuestionBtn = document.getElementById("nextQuestion");
const finishCard = document.getElementById("finishCard");
const finishSummary = document.getElementById("finishSummary");
const resetQuizBtn = document.getElementById("resetQuiz");
const restartTopicBtn = document.getElementById("restartTopic");
const nextTopicBtn = document.getElementById("nextTopic");

let currentTopicIndex = 0;
let currentQuestionIndex = 0;
let currentAnswered = false;
let topicState = qData.map(topic => ({
  answers: new Array(topic.questions.length).fill(null),
  correctCount: 0,
  completed: false,
}));

function arAnswerText(letter){
  const map = {
    A:"I e II são verdadeiras, e II justifica I.",
    B:"I e II são verdadeiras, mas II não justifica I.",
    C:"I é verdadeira, e II é falsa.",
    D:"I é falsa, e II é verdadeira.",
    E:"I e II são falsas."
  };
  return map[letter] || letter;
}

function createTopicButtons(){
  qToc.innerHTML = "";
  qData.forEach((topic, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "topic-select-btn";
    btn.dataset.index = index;
    btn.innerHTML = `<span>${topic.icon}</span><span>${topic.title}</span>`;
    btn.addEventListener("click", () => switchTopic(index));
    qToc.appendChild(btn);
  });
  updateTopicButtons();
}

function updateTopicButtons(){
  [...qToc.querySelectorAll(".topic-select-btn")].forEach((btn, index) => {
    btn.classList.toggle("active", index === currentTopicIndex);
    const state = topicState[index];
    btn.classList.toggle("done", state.completed);
  });
}

function switchTopic(index){
  currentTopicIndex = index;
  currentQuestionIndex = 0;
  currentAnswered = topicState[index].answers[0] !== null;
  updateTopicButtons();
  renderCurrentQuestion();
}

function formatMcqOptions(options){
  const letters = ["A","B","C","D","E"];
  return options.map((opt, i) => ({ letter: letters[i], text: opt }));
}

function formatArOptions(){
  return [
    { letter:"A", text:"I e II são verdadeiras, e II justifica I." },
    { letter:"B", text:"I e II são verdadeiras, mas II não justifica I." },
    { letter:"C", text:"I é verdadeira, e II é falsa." },
    { letter:"D", text:"I é falsa, e II é verdadeira." },
    { letter:"E", text:"I e II são falsas." }
  ];
}

function getCurrentTopic(){ return qData[currentTopicIndex]; }
function getCurrentQuestion(){ return getCurrentTopic().questions[currentQuestionIndex]; }
function getCurrentState(){ return topicState[currentTopicIndex]; }

function renderCurrentQuestion(){
  const topic = getCurrentTopic();
  const question = getCurrentQuestion();
  const state = getCurrentState();
  const savedAnswer = state.answers[currentQuestionIndex];
  currentAnswered = savedAnswer !== null;

  topicIconLine.textContent = `${topic.icon} bloco selecionado`;
  topicTitle.textContent = topic.title;
  topicSubtitle.textContent = "10 questões • 5 ABCDE + 5 asserção-razão";
  scoreBadge.textContent = `${state.correctCount} acertos`;
  typeBadge.textContent = question.type === "mcq" ? "ABCDE" : "Asserção-razão";
  questionProgressEl.textContent = `${currentQuestionIndex + 1}/10`;
  quizProgressText.textContent = `Questão ${currentQuestionIndex + 1} de ${topic.questions.length}`;
  quizProgressFill.style.width = `${((currentQuestionIndex + 1) / topic.questions.length) * 100}%`;
  questionNumber.textContent = `${currentQuestionIndex + 1}`;
  questionTag.textContent = question.type === "mcq" ? "ABCDE" : "Asserção-razão";
  questionPrompt.textContent = question.type === "mcq" ? question.prompt : "Analise as asserções a seguir:";
  questionExtra.innerHTML = "";
  optionsContainer.innerHTML = "";
  feedbackPanel.classList.add("hidden");
  finishCard.classList.add("hidden");

  if(question.type === "ar"){
    const box = document.createElement("div");
    box.className = "assertion-box";
    box.innerHTML = `<p><strong>I.</strong> ${question.assertion}</p><p><strong>II.</strong> ${question.reason}</p>`;
    questionExtra.appendChild(box);
  }

  const choices = question.type === "mcq" ? formatMcqOptions(question.options) : formatArOptions();
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-option-btn";
    btn.dataset.letter = choice.letter;
    btn.innerHTML = `<span class="option-letter">${choice.letter}</span><span>${choice.text}</span>`;
    btn.disabled = currentAnswered;
    btn.addEventListener("click", () => handleAnswer(choice.letter));
    optionsContainer.appendChild(btn);
  });

  if(savedAnswer){
    showFeedback(savedAnswer, true);
  }

  prevQuestionBtn.disabled = currentQuestionIndex === 0;
  nextQuestionBtn.disabled = !currentAnswered;
  nextQuestionBtn.textContent = currentQuestionIndex === topic.questions.length - 1 ? "Ver resultado do bloco →" : "Próxima questão →";

  updateTopicButtons();
}

function handleAnswer(selectedLetter){
  if(currentAnswered) return;
  const question = getCurrentQuestion();
  const state = getCurrentState();
  const isCorrect = selectedLetter === question.answer;
  state.answers[currentQuestionIndex] = selectedLetter;
  if(isCorrect) state.correctCount += 1;
  currentAnswered = true;
  showFeedback(selectedLetter, false);
  nextQuestionBtn.disabled = false;
  if(currentQuestionIndex === getCurrentTopic().questions.length - 1){
    state.completed = true;
    updateTopicButtons();
  }
}

function showFeedback(selectedLetter, fromSaved){
  const question = getCurrentQuestion();
  const correct = selectedLetter === question.answer;

  [...optionsContainer.querySelectorAll(".answer-option-btn")].forEach(btn => {
    btn.disabled = true;
    const letter = btn.dataset.letter;
    btn.classList.toggle("correct", letter === question.answer);
    btn.classList.toggle("wrong", letter === selectedLetter && letter !== question.answer);
    btn.classList.toggle("selected", letter === selectedLetter);
  });

  feedbackPanel.classList.remove("hidden");
  feedbackPanel.classList.toggle("is-correct", correct);
  feedbackPanel.classList.toggle("is-wrong", !correct);
  feedbackBadge.textContent = correct ? "✔️" : "💭";
  feedbackTitle.textContent = correct ? "Boa! Você acertou." : "Quase! Vamos ajustar isso.";
  feedbackAnswer.innerHTML = `<strong>Gabarito:</strong> ${question.answer}${question.type === "ar" ? ` — ${arAnswerText(question.answer)}` : ""}`;
  feedbackRationale.textContent = question.rationale;

  if(currentQuestionIndex === getCurrentTopic().questions.length - 1 && !fromSaved){
    finishSummary.textContent = `Você terminou o bloco “${getCurrentTopic().title}” com ${getCurrentState().correctCount} acertos de ${getCurrentTopic().questions.length}.`;
    finishCard.classList.remove("hidden");
  }
}

prevQuestionBtn.addEventListener("click", () => {
  if(currentQuestionIndex > 0){
    currentQuestionIndex -= 1;
    renderCurrentQuestion();
  }
});

nextQuestionBtn.addEventListener("click", () => {
  const topic = getCurrentTopic();
  if(currentQuestionIndex < topic.questions.length - 1){
    currentQuestionIndex += 1;
    renderCurrentQuestion();
  } else {
    finishSummary.textContent = `Você terminou o bloco “${topic.title}” com ${getCurrentState().correctCount} acertos de ${topic.questions.length}.`;
    finishCard.classList.remove("hidden");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
});

function resetCurrentTopic(){
  topicState[currentTopicIndex] = {
    answers: new Array(getCurrentTopic().questions.length).fill(null),
    correctCount: 0,
    completed: false,
  };
  currentQuestionIndex = 0;
  currentAnswered = false;
  updateTopicButtons();
  renderCurrentQuestion();
}

resetQuizBtn.addEventListener("click", resetCurrentTopic);
restartTopicBtn.addEventListener("click", resetCurrentTopic);
nextTopicBtn.addEventListener("click", () => {
  const nextIndex = (currentTopicIndex + 1) % qData.length;
  switchTopic(nextIndex);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

topicCountEl.textContent = qData.length;
createTopicButtons();
renderCurrentQuestion();
