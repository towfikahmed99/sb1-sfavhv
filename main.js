import './style.css';

class ScratchLottery {
  constructor() {
    this.attemptsLeft = 3;
    this.totalWinnings = 0;
    this.prizes = [0, 5, 10, 20, 50, 100];
    this.revealedCards = 0;
    this.currentPrizes = [];
    this.prizeMatches = {};
    this.init();
  }

  init() {
    this.generatePrizes();
    this.renderGame();
    this.attachEventListeners();
    this.updateStats();
  }

  generatePrizes() {
    this.currentPrizes = Array(9).fill(null).map(() => {
      return this.prizes[Math.floor(Math.random() * this.prizes.length)];
    });
    
    // Ensure at least one winning combination
    const randomPrize = this.prizes[Math.floor(Math.random() * (this.prizes.length - 1)) + 1];
    const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      const position = positions.splice(randomIndex, 1)[0];
      this.currentPrizes[position] = randomPrize;
    }
  }

  renderGame() {
    const template = `
      <div class="container">
        <h1 class="game-title">Scratch & Win!</h1>
        <div class="scratch-container">
          ${this.currentPrizes.map((prize, i) => `
            <div class="scratch-card" data-index="${i}">
              <div class="prize">$${prize}</div>
              <div class="scratch-overlay">SCRATCH!</div>
              <div class="match-count"></div>
            </div>
          `).join('')}
        </div>
        <div id="winning-message"></div>
        <div class="controls">
          <button class="new-game-btn">New Game</button>
          <div class="stats">
            <p>Attempts Left Today: <span id="attempts">${this.attemptsLeft}</span></p>
            <p>Total Winnings: $<span id="winnings">${this.totalWinnings}</span></p>
          </div>
        </div>
        <div class="rules">
          <h2>Game Rules:</h2>
          <ul>
            <li>You have 3 attempts per day</li>
            <li>Scratch cards to reveal prizes</li>
            <li>Match 3 same amounts to win that prize</li>
            <li>Win up to $100 per game!</li>
          </ul>
        </div>
      </div>
    `;

    document.querySelector('#app').innerHTML = template;
  }

  attachEventListeners() {
    document.querySelectorAll('.scratch-card').forEach(card => {
      card.addEventListener('click', (e) => this.revealCard(e.target.closest('.scratch-card')));
    });

    document.querySelector('.new-game-btn').addEventListener('click', () => {
      if (this.attemptsLeft > 0) {
        this.resetGame();
      }
    });
  }

  revealCard(card) {
    if (this.attemptsLeft <= 0 || card.classList.contains('revealed')) return;

    const index = parseInt(card.dataset.index);
    const prize = this.currentPrizes[index];
    
    card.classList.add('revealed');
    this.revealedCards++;
    
    // Track prize matches
    this.prizeMatches[prize] = (this.prizeMatches[prize] || 0) + 1;
    
    // Update match count for all revealed cards with this prize
    document.querySelectorAll('.scratch-card.revealed').forEach(revealedCard => {
      const revealedPrize = this.currentPrizes[revealedCard.dataset.index];
      if (revealedPrize === prize) {
        revealedCard.querySelector('.match-count').textContent = 
          `${this.prizeMatches[prize]} matches`;
      }
    });

    // Check for winning combination
    if (this.prizeMatches[prize] === 3) {
      this.handleWin(prize);
    }

    if (this.revealedCards === 9) {
      this.attemptsLeft--;
      this.updateStats();
    }
  }

  handleWin(prize) {
    this.totalWinnings += prize;
    this.updateStats();
    
    // Highlight winning cards
    document.querySelectorAll('.scratch-card').forEach(card => {
      const cardPrize = this.currentPrizes[card.dataset.index];
      if (cardPrize === prize) {
        card.classList.add('winner');
      }
    });

    // Show winning message
    const messageEl = document.getElementById('winning-message');
    messageEl.className = 'winning-message';
    messageEl.textContent = `Congratulations! You won $${prize}! 🎉`;
  }

  resetGame() {
    this.revealedCards = 0;
    this.prizeMatches = {};
    this.generatePrizes();
    this.renderGame();
    this.attachEventListeners();
  }

  updateStats() {
    document.querySelector('#attempts').textContent = this.attemptsLeft;
    document.querySelector('#winnings').textContent = this.totalWinnings;
  }
}

// Initialize the game
new ScratchLottery();