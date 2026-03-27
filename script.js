// ─── Constants ───────────────────────────────────────────────────
const CHOICES = ['rock', 'paper', 'scissors'];
const ICONS   = { rock: '🪨', paper: '📄', scissors: '✂️' };
const BEATS   = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

// ─── State ───────────────────────────────────────────────────────
let score   = { you: 0, cpu: 0 };
let round   = 0;
let history = [];
let busy    = false;

// ─── DOM Refs ────────────────────────────────────────────────────
const iconYou     = document.getElementById('icon-you');
const iconCpu     = document.getElementById('icon-cpu');
const scoreYou    = document.getElementById('s-you');
const scoreCpu    = document.getElementById('s-cpu');
const roundCount  = document.getElementById('round-count');
const resultBanner= document.getElementById('result-banner');
const playAgainBtn= document.getElementById('play-again');
const historyDots = document.getElementById('history-dots');
const choicesBtns = document.querySelectorAll('.choice-btn');

// ─── Helpers ─────────────────────────────────────────────────────
function getComputerChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function determineWinner(userChoice, cpuChoice) {
  if (userChoice === cpuChoice) return 'tie';
  return BEATS[userChoice] === cpuChoice ? 'win' : 'lose';
}

function setButtonsDisabled(disabled) {
  choicesBtns.forEach(btn => (btn.disabled = disabled));
}

function animateShake(el) {
  el.classList.remove('shake', 'reveal');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
}

function animateReveal(el) {
  el.classList.remove('shake', 'reveal');
  void el.offsetWidth;
  el.classList.add('reveal');
}

function bumpScore(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
  el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
}

function addHistoryDot(outcome) {
  if (history.length >= 20) history.shift();
  history.push(outcome);

  historyDots.innerHTML = history
    .map(o => `<div class="h-dot ${o}"></div>`)
    .join('');
}

function showResult(outcome) {
  const messages = {
    win:  '🎉 You win this round!',
    lose: '😬 CPU wins this round',
    tie:  '🤝 It\'s a draw!'
  };
  resultBanner.textContent  = messages[outcome];
  resultBanner.className    = `result-banner ${outcome}`;
  resultBanner.style.display = 'block';
}

// ─── Core Game Logic ─────────────────────────────────────────────
function playRound(userChoice) {
  if (busy) return;
  busy = true;

  setButtonsDisabled(true);
  playAgainBtn.style.display = 'none';
  resultBanner.style.display = 'none';

  // Reset icons to fist (fight animation)
  iconYou.textContent = '🤜';
  iconCpu.textContent = '🤛';
  animateShake(iconYou);
  animateShake(iconCpu);

  const cpuChoice = getComputerChoice();
  const outcome   = determineWinner(userChoice, cpuChoice);

  setTimeout(() => {
    // Reveal icons
    iconYou.textContent = ICONS[userChoice];
    iconCpu.textContent = ICONS[cpuChoice];
    animateReveal(iconYou);
    animateReveal(iconCpu);

    // Update scores
    round++;
    roundCount.textContent = `Round ${round}`;

    if (outcome === 'win') {
      score.you++;
      scoreYou.textContent = score.you;
      bumpScore(scoreYou);
    } else if (outcome === 'lose') {
      score.cpu++;
      scoreCpu.textContent = score.cpu;
      bumpScore(scoreCpu);
    }

    // Show result & history
    showResult(outcome);
    addHistoryDot(outcome);
    playAgainBtn.style.display = 'inline-block';

    busy = false;
  }, 620);
}

function resetRound() {
  iconYou.textContent = '?';
  iconCpu.textContent = '?';
  iconYou.className   = 'arena-icon';
  iconCpu.className   = 'arena-icon';
  resultBanner.style.display  = 'none';
  playAgainBtn.style.display  = 'none';
  setButtonsDisabled(false);
}

// ─── Event Listeners ─────────────────────────────────────────────
choicesBtns.forEach(btn => {
  btn.addEventListener('click', () => playRound(btn.dataset.choice));
});

playAgainBtn.addEventListener('click', resetRound);
