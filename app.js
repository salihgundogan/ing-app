/* ═══════════════════════════════════════════════════════════════
   Princess Zeynep's English Kingdom — App Logic (app.js)
   ═══════════════════════════════════════════════════════════════ */

// ─── State ───
const state = {
  currentPage: 'kingdom',
  score: parseInt(localStorage.getItem('royalPoints') || '0'),
  allTimeScore: parseInt(localStorage.getItem('royalPointsAllTime') || '0'),

  // Words module
  currentTopic: null,
  currentWords: [],
  currentCardIndex: 0,
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,

  // Grammar module
  currentGrammarTopic: null,
  exercises: [],
  exerciseIndex: 0,
  exerciseScore: 0,

  // Conversation module
  convoScenario: null,
  convoCharacter: null,
  convoHistory: [],
  convoExchanges: 0,

  // Luna chat
  lunaChatHistory: [],
};

// ─── Initialization ───
document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();
  setRandomQuote();
  setRandomTip();
  createStars();
  renderVocabTopics();
  renderGrammarTopics();
  renderScenarios();
  setupEnterKeys();
});

// ─── Star Particles ───
function createStars() {
  const container = document.getElementById('stars-container');
  if (!container) return;
  const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 12000));
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star' + (Math.random() > 0.85 ? ' large' : '');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    star.style.animationDelay = (Math.random() * 5) + 's';
    container.appendChild(star);
  }
}

// ─── Navigation ───
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');

  state.currentPage = page;

  // Reset sub-pages when navigating to main pages
  if (page === 'words') showWordsSub('words-topics');
  if (page === 'grammar') showGrammarSub('grammar-topics');
  if (page === 'conversation') showConvoSub('convo-picker');
}

function openConversationPicker() {
  navigateTo('conversation');
}

function showWordsSub(id) {
  document.querySelectorAll('#page-words .sub-page').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showGrammarSub(id) {
  document.querySelectorAll('#page-grammar .sub-page').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showConvoSub(id) {
  document.querySelectorAll('#page-conversation .sub-page').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Score Management ───
function addPoints(points) {
  state.score += points;
  state.allTimeScore += points;
  localStorage.setItem('royalPoints', state.score);
  localStorage.setItem('royalPointsAllTime', state.allTimeScore);
  updateScoreDisplay();
  checkMilestones();
}

function updateScoreDisplay() {
  const el = document.getElementById('score-value');
  if (el) el.textContent = state.score;
}

function checkMilestones() {
  const milestones = CONTENT.milestones;
  for (const threshold of Object.keys(milestones).map(Number).sort((a, b) => a - b)) {
    const key = `milestone_${threshold}`;
    if (state.allTimeScore >= threshold && !localStorage.getItem(key)) {
      localStorage.setItem(key, 'true');
      showMilestone(milestones[threshold]);
      break;
    }
  }
}

function showMilestone(milestone) {
  document.getElementById('milestone-title').textContent = milestone.title;
  document.getElementById('milestone-message').textContent = milestone.message;
  document.getElementById('milestone-modal').classList.remove('hidden');
}

function closeMilestoneModal() {
  document.getElementById('milestone-modal').classList.add('hidden');
}

// ─── Random Quote & Tip ───
function setRandomQuote() {
  const quotes = CONTENT.lunaQuotes;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('luna-quote').textContent = `"${q}"`;
}

function setRandomTip() {
  const tips = CONTENT.lunaTips;
  const t = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById('luna-tip').textContent = t;
}

// ─── Enter-key Support ───
function setupEnterKeys() {
  document.getElementById('luna-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendLunaMessage();
  });
  document.getElementById('convo-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendConvoMessage();
  });
}

// ─── API Helper ───
async function callAI(type, payload) {
  showLoading();
  try {
    const resp = await fetch('/.netlify/functions/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`API error ${resp.status}: ${errorText}`);
    }
    const data = await resp.json();
    return data.result;
  } catch (err) {
    console.error('AI call failed:', err.message || err);
    return null;
  } finally {
    hideLoading();
  }
}

function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

function showError(container) {
  if (typeof container === 'string') container = document.getElementById(container);
  if (container) {
    container.innerHTML = `
      <div class="results-card">
        <h2 class="gold-text">🧚 Oh no!</h2>
        <p class="luna-message">The magic network is down, Princess! Please try again. ✨</p>
        <p class="luna-message" style="font-size:0.85rem">(Sihirli ağ çalışmıyor, Prenses! Lütfen tekrar dene. ✨)</p>
      </div>`;
  }
}

// ═══════════════════════════════════════
// ═══ MODULE: WORDS (Vocabulary) ═══
// ═══════════════════════════════════════

function renderVocabTopics() {
  const grid = document.getElementById('vocab-topic-grid');
  if (!grid) return;
  grid.innerHTML = CONTENT.vocabularyTopics.map(t => `
    <div class="topic-card" onclick="selectVocabTopic('${t.id}')">
      <span class="topic-icon">${t.icon}</span>
      <span class="topic-name">${t.name}</span>
      <span class="topic-name-tr">${t.nameTr}</span>
    </div>
  `).join('');
}

async function selectVocabTopic(topicId) {
  const topic = CONTENT.vocabularyTopics.find(t => t.id === topicId);
  if (!topic) return;

  state.currentTopic = topic;
  state.currentCardIndex = 0;

  document.getElementById('flashcard-topic-title').textContent = `${topic.icon} ${topic.name}`;

  const words = await callAI('vocabulary', { topic: topic.name });
  if (!words || !Array.isArray(words)) {
    showWordsSub('words-flashcards');
    showError('words-flashcards');
    return;
  }

  state.currentWords = words;
  document.getElementById('card-total').textContent = words.length;
  showFlashcard(0);
  showWordsSub('words-flashcards');
  document.getElementById('btn-start-quiz').style.display = 'none';
}

function showFlashcard(index) {
  const word = state.currentWords[index];
  if (!word) return;

  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');

  document.getElementById('fc-english').textContent = word.english;
  document.getElementById('fc-turkish').textContent = word.turkish;
  document.getElementById('fc-example-en').textContent = word.example_en;
  document.getElementById('fc-example-tr').textContent = word.example_tr;
  document.getElementById('card-current').textContent = index + 1;

  // Show quiz button on last card
  const isLast = index === state.currentWords.length - 1;
  document.getElementById('btn-start-quiz').style.display = isLast ? 'block' : 'none';
  document.getElementById('btn-next-card').textContent = isLast ? 'Finish ✨' : 'Next →';
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  if (state.currentCardIndex < state.currentWords.length - 1) {
    state.currentCardIndex++;
    showFlashcard(state.currentCardIndex);
  } else {
    // Completed viewing all cards → award points
    addPoints(5);
    document.getElementById('btn-start-quiz').style.display = 'block';
  }
}

function prevCard() {
  if (state.currentCardIndex > 0) {
    state.currentCardIndex--;
    showFlashcard(state.currentCardIndex);
  }
}

// ─── Quiz ───
async function startQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;

  const questions = await callAI('quiz', { words: state.currentWords });
  if (!questions || !Array.isArray(questions)) {
    showWordsSub('words-quiz');
    showError('words-quiz');
    return;
  }

  state.quizQuestions = questions;
  document.getElementById('quiz-question-total').textContent = questions.length;
  document.getElementById('quiz-results').classList.add('hidden');
  document.querySelector('.quiz-container').classList.remove('hidden');
  showQuizQuestion(0);
  showWordsSub('words-quiz');
}

function showQuizQuestion(index) {
  const q = state.quizQuestions[index];
  if (!q) return;

  document.getElementById('quiz-question-num').textContent = index + 1;
  document.getElementById('quiz-question').textContent = q.question;
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');

  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" onclick="answerQuiz(${i})">${opt}</button>
  `).join('');
}

function answerQuiz(selected) {
  const q = state.quizQuestions[state.quizIndex];
  const options = document.querySelectorAll('.quiz-option');
  const feedbackEl = document.getElementById('quiz-feedback');

  options.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === q.correct) btn.classList.add('correct');
    if (i === selected && selected !== q.correct) btn.classList.add('wrong');
  });

  const isCorrect = selected === q.correct;
  if (isCorrect) {
    state.quizScore += 10;
    addPoints(10);
    feedbackEl.className = 'quiz-feedback correct';
    feedbackEl.textContent = q.luna_feedback || 'Wonderful, Princess! ✨';
  } else {
    feedbackEl.className = 'quiz-feedback wrong';
    feedbackEl.textContent = `Almost! The correct answer is: "${q.options[q.correct]}" 👑`;
  }
  feedbackEl.classList.remove('hidden');
  document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function nextQuizQuestion() {
  state.quizIndex++;
  if (state.quizIndex < state.quizQuestions.length) {
    showQuizQuestion(state.quizIndex);
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  document.querySelector('.quiz-container').classList.add('hidden');
  const resultsEl = document.getElementById('quiz-results');
  resultsEl.classList.remove('hidden');

  document.getElementById('quiz-score').textContent = state.quizScore;
  document.getElementById('quiz-max').textContent = state.quizQuestions.length * 10;

  const pct = state.quizScore / (state.quizQuestions.length * 10);
  let msg;
  if (pct >= 0.9) msg = "Outstanding, Your Highness! You are a true word wizard! 👑✨";
  else if (pct >= 0.7) msg = "Wonderful work, Princess! The kingdom celebrates your knowledge! 🌟";
  else if (pct >= 0.5) msg = "Good effort, Princess! Practice makes perfect — you're getting closer! 💫";
  else msg = "Don't worry, Princess! Every great queen learns step by step! Try again? 🧚";

  document.getElementById('quiz-luna-msg').textContent = msg;
}

// ═══════════════════════════════════════
// ═══ MODULE: GRAMMAR ═══
// ═══════════════════════════════════════

function renderGrammarTopics() {
  const list = document.getElementById('grammar-topic-list');
  if (!list) return;
  list.innerHTML = CONTENT.grammarTopics.map(t => `
    <div class="topic-list-item" onclick="selectGrammarTopic('${t.id}')">
      <span class="topic-icon">${t.icon}</span>
      <div class="topic-info">
        <div class="topic-name">${t.name}</div>
        <div class="topic-name-tr">${t.nameTr}</div>
      </div>
    </div>
  `).join('');
}

function selectGrammarTopic(topicId) {
  const topic = CONTENT.grammarTopics.find(t => t.id === topicId);
  if (!topic) return;

  state.currentGrammarTopic = topic;
  document.getElementById('grammar-topic-title').textContent = `${topic.icon} ${topic.name}`;

  // Render explanation with formatting
  const contentEl = document.getElementById('grammar-content');
  contentEl.textContent = topic.explanation;

  showGrammarSub('grammar-explanation');
}

async function startGrammarExercises() {
  state.exerciseIndex = 0;
  state.exerciseScore = 0;

  const exercises = await callAI('grammar_exercise', { topic: state.currentGrammarTopic.name });
  if (!exercises || !Array.isArray(exercises)) {
    showGrammarSub('grammar-exercises');
    showError('exercise-container');
    return;
  }

  state.exercises = exercises;
  document.getElementById('exercise-total').textContent = exercises.length;
  document.getElementById('exercise-results').classList.add('hidden');
  document.getElementById('exercise-container').classList.remove('hidden');
  document.getElementById('exercise-feedback').classList.add('hidden');
  document.getElementById('exercise-next-btn').classList.add('hidden');
  showExercise(0);
  showGrammarSub('grammar-exercises');
}

function showExercise(index) {
  const ex = state.exercises[index];
  if (!ex) return;

  document.getElementById('exercise-num').textContent = index + 1;
  document.getElementById('exercise-feedback').classList.add('hidden');
  document.getElementById('exercise-next-btn').classList.add('hidden');

  const container = document.getElementById('exercise-container');

  if (ex.type === 'fill_blank') {
    container.innerHTML = `
      <p class="exercise-question">${ex.question}</p>
      <input type="text" class="exercise-input" id="fill-input" placeholder="Type your answer... / Cevabını yaz..." autocomplete="off" />
      <button class="btn-gold exercise-submit" onclick="checkFillBlank()">Check ✨</button>
    `;
    document.getElementById('fill-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') checkFillBlank();
    });
  } else if (ex.type === 'multiple_choice') {
    container.innerHTML = `
      <p class="exercise-question">${ex.question}</p>
      <div class="quiz-options">
        ${ex.options.map((opt, i) => `
          <button class="quiz-option" onclick="checkMC(${i})">${opt}</button>
        `).join('')}
      </div>
    `;
  } else if (ex.type === 'order') {
    state._orderWords = [];
    const shuffled = [...(ex.words || [])].sort(() => Math.random() - 0.5);
    container.innerHTML = `
      <p class="exercise-question">${ex.question}</p>
      <div class="sentence-build" id="sentence-build"></div>
      <div class="word-bank" id="word-bank">
        ${shuffled.map((w, i) => `
          <button class="word-chip" data-idx="${i}" onclick="selectWord(this, '${w.replace(/'/g, "\\'")}')">${w}</button>
        `).join('')}
      </div>
      <button class="btn-gold exercise-submit" onclick="checkOrder()">Check ✨</button>
    `;
  }
}

function checkFillBlank() {
  const input = document.getElementById('fill-input');
  if (!input) return;
  const answer = input.value.trim().toLowerCase();
  const ex = state.exercises[state.exerciseIndex];
  const correct = ex.answer.toLowerCase();
  const isCorrect = answer === correct;
  showExerciseFeedback(isCorrect, ex);
}

function checkMC(selected) {
  const ex = state.exercises[state.exerciseIndex];
  const correctIdx = typeof ex.correct === 'number' ? ex.correct : ex.options.indexOf(ex.answer);
  const options = document.querySelectorAll('#exercise-container .quiz-option');

  options.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === correctIdx) btn.classList.add('correct');
    if (i === selected && selected !== correctIdx) btn.classList.add('wrong');
  });

  showExerciseFeedback(selected === correctIdx, ex);
}

function selectWord(btn, word) {
  btn.classList.add('selected');
  state._orderWords.push(word);

  const buildEl = document.getElementById('sentence-build');
  const chip = document.createElement('span');
  chip.className = 'sentence-word';
  chip.textContent = word;
  chip.onclick = () => {
    // Remove word on click
    const idx = state._orderWords.indexOf(word);
    if (idx > -1) state._orderWords.splice(idx, 1);
    chip.remove();
    btn.classList.remove('selected');
  };
  buildEl.appendChild(chip);
}

function checkOrder() {
  const ex = state.exercises[state.exerciseIndex];
  const userSentence = state._orderWords.join(' ');
  const isCorrect = userSentence.toLowerCase().trim() === ex.answer.toLowerCase().trim();
  showExerciseFeedback(isCorrect, ex);
}

function showExerciseFeedback(isCorrect, exercise) {
  const feedbackEl = document.getElementById('exercise-feedback');

  if (isCorrect) {
    state.exerciseScore += 15;
    addPoints(15);
    feedbackEl.className = 'quiz-feedback correct';
    feedbackEl.textContent = exercise.luna_feedback || 'Perfect, Princess! ✨';
  } else {
    feedbackEl.className = 'quiz-feedback wrong';
    feedbackEl.textContent = `Almost! The correct answer is: "${exercise.answer}" 👑`;
  }

  feedbackEl.classList.remove('hidden');
  document.getElementById('exercise-next-btn').classList.remove('hidden');
}

function nextExercise() {
  state.exerciseIndex++;
  if (state.exerciseIndex < state.exercises.length) {
    showExercise(state.exerciseIndex);
  } else {
    showExerciseResults();
  }
}

function showExerciseResults() {
  document.getElementById('exercise-container').classList.add('hidden');
  document.getElementById('exercise-feedback').classList.add('hidden');
  document.getElementById('exercise-next-btn').classList.add('hidden');

  const resultsEl = document.getElementById('exercise-results');
  resultsEl.classList.remove('hidden');

  document.getElementById('exercise-score').textContent = state.exerciseScore;
  document.getElementById('exercise-max').textContent = state.exercises.length * 15;

  const pct = state.exerciseScore / (state.exercises.length * 15);
  let msg;
  if (pct >= 0.9) msg = "Magnificent, Your Highness! Your grammar is truly royal! 👑✨";
  else if (pct >= 0.7) msg = "Wonderful work, Princess! Your grammar skills are growing! 🌟";
  else if (pct >= 0.5) msg = "Good effort! Keep practicing and you'll master this, Princess! 💫";
  else msg = "Don't worry, Princess! Grammar takes practice. Try reading the lesson again! 🧚";

  document.getElementById('exercise-luna-msg').textContent = msg;
}

// ═══════════════════════════════════════
// ═══ MODULE: CONVERSATION ═══
// ═══════════════════════════════════════

function renderScenarios() {
  const royalEl = document.getElementById('royal-scenarios');
  const realEl = document.getElementById('realworld-scenarios');
  if (!royalEl || !realEl) return;

  royalEl.innerHTML = CONTENT.royalScenarios.map(s => `
    <div class="scenario-card" onclick="startConversation('royal', '${s.id}')">
      <span class="scenario-icon">${s.icon}</span>
      <div>
        <div class="scenario-name">${s.name}</div>
        <div class="scenario-name-tr">${s.nameTr}</div>
      </div>
    </div>
  `).join('');

  realEl.innerHTML = CONTENT.realWorldScenarios.map(s => `
    <div class="scenario-card" onclick="startConversation('real', '${s.id}')">
      <span class="scenario-icon">${s.icon}</span>
      <div>
        <div class="scenario-name">${s.name}</div>
        <div class="scenario-name-tr">${s.nameTr}</div>
      </div>
    </div>
  `).join('');
}

async function startConversation(type, scenarioId) {
  const scenarios = type === 'royal' ? CONTENT.royalScenarios : CONTENT.realWorldScenarios;
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (!scenario) return;

  state.convoScenario = scenario;
  state.convoCharacter = scenario.character;
  state.convoHistory = [];
  state.convoExchanges = 0;

  document.getElementById('convo-title').textContent = `${scenario.icon} ${scenario.name}`;
  document.getElementById('convo-messages').innerHTML = '';

  // Luna starts the conversation
  const startMsg = await callAI('conversation', {
    scenario: scenario.name,
    character: scenario.character,
    history: '',
    userMessage: '[START CONVERSATION — greet the user and set the scene in 2-3 sentences]',
  });

  if (startMsg) {
    addConvoBubble('luna', startMsg);
    state.convoHistory.push({ role: 'Luna', text: startMsg });
  } else {
    addConvoBubble('luna', `Welcome to "${scenario.name}", Princess Zeynep! 👑✨ Let's practice together!\n(Hoş geldin Prenses Zeynep! Birlikte pratik yapalım!)`);
  }

  showConvoSub('convo-chat');
}

async function sendConvoMessage() {
  const input = document.getElementById('convo-input');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  addConvoBubble('user', msg);
  state.convoHistory.push({ role: 'Zeynep', text: msg });
  state.convoExchanges++;

  showTypingIndicator('convo-messages');

  const historyText = state.convoHistory.map(h => `${h.role}: ${h.text}`).join('\n');
  const response = await callAI('conversation', {
    scenario: state.convoScenario.name,
    character: state.convoCharacter,
    history: historyText,
    userMessage: msg,
  });

  removeTypingIndicator('convo-messages');

  if (response) {
    addConvoBubble('luna', response);
    state.convoHistory.push({ role: 'Luna', text: response });
  } else {
    addConvoBubble('luna', "Oh no, the magic connection is lost! 🧚 Please try again, Princess! ✨\n(Sihirli bağlantı koptu! Lütfen tekrar dene, Prenses!)");
  }

  // After 8-10 exchanges, award points
  if (state.convoExchanges >= 8 && state.convoExchanges % 8 === 0) {
    addPoints(25);
    addConvoBubble('luna', "🌟 Amazing practice, Princess! You earned 25 Royal Points! Keep going or tap ← End to finish. 👑\n(Harika pratik, Prenses! 25 Kraliyet Puanı kazandın!)");
  }
}

function endConversation() {
  state.convoHistory = [];
  state.convoExchanges = 0;
  showConvoSub('convo-picker');
}

function addConvoBubble(sender, text) {
  const container = sender === 'luna'
    ? (state.currentPage === 'luna' ? document.getElementById('luna-messages') : document.getElementById('convo-messages'))
    : (state.currentPage === 'luna' ? document.getElementById('luna-messages') : document.getElementById('convo-messages'));

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'luna' ? 'luna-bubble' : 'user-bubble'}`;

  const avatar = document.createElement('div');
  avatar.className = `bubble-avatar ${sender === 'luna' ? 'luna-avatar' : 'user-avatar'}`;
  avatar.textContent = sender === 'luna' ? '👑' : '🧚';

  const content = document.createElement('div');
  content.className = 'bubble-content';
  content.innerHTML = formatChatText(text);

  bubble.appendChild(avatar);
  bubble.appendChild(content);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function formatChatText(text) {
  // Convert newlines to <br>, wrap Turkish parts in <small>
  return text
    .replace(/\n/g, '<br/>')
    .replace(/\(Türkçe:(.+?)\)/g, '<small>(Türkçe:$1)</small>');
}

function showTypingIndicator(containerId) {
  const container = document.getElementById(containerId);
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typing-' + containerId;
  indicator.innerHTML = `
    Luna is thinking... ✨
    <div class="typing-dots"><span></span><span></span><span></span></div>
  `;
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator(containerId) {
  const indicator = document.getElementById('typing-' + containerId);
  if (indicator) indicator.remove();
}

// ═══════════════════════════════════════
// ═══ MODULE: LUNA CHATBOT ═══
// ═══════════════════════════════════════

async function sendLunaMessage() {
  const input = document.getElementById('luna-input');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  addLunaBubble('user', msg);
  state.lunaChatHistory.push({ role: 'Zeynep', text: msg });

  showTypingIndicator('luna-messages');

  const historyText = state.lunaChatHistory.map(h => `${h.role}: ${h.text}`).join('\n');
  const response = await callAI('chat', {
    history: historyText,
    userMessage: msg,
  });

  removeTypingIndicator('luna-messages');

  if (response) {
    addLunaBubble('luna', response);
    state.lunaChatHistory.push({ role: 'Luna', text: response });
  } else {
    addLunaBubble('luna', "Oh no, the magic network is down! 🧚 Please try again, Princess! ✨\n(Sihirli ağ çalışmıyor! Lütfen tekrar dene, Prenses!)");
  }
}

function addLunaBubble(sender, text) {
  const container = document.getElementById('luna-messages');

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender === 'luna' ? 'luna-bubble' : 'user-bubble'}`;

  const avatar = document.createElement('div');
  avatar.className = `bubble-avatar ${sender === 'luna' ? 'luna-avatar' : 'user-avatar'}`;
  avatar.textContent = sender === 'luna' ? '👑' : '🧚';

  const content = document.createElement('div');
  content.className = 'bubble-content';
  content.innerHTML = formatChatText(text);

  bubble.appendChild(avatar);
  bubble.appendChild(content);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}
