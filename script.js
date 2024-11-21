// Function to get the computer's choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Function to determine the winner
function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "It's a tie!";
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

// Event listeners for the buttons
const buttons = document.querySelectorAll('.choice');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const userChoice = button.getAttribute('data-choice');
        const computerChoice = getComputerChoice();
        const winner = determineWinner(userChoice, computerChoice);
        const playAgain = document.getElementById('playAgain');
        playAgain.addEventListener('click', () => {
            location.reload();
        });

        // Display choices and winner
        document.getElementById('userChoice').innerText = `Your Choice: ${userChoice}`;
        document.getElementById('computerChoice').innerText = `Computer's Choice: ${computerChoice}`;
        document.getElementById('winner').innerText = `Winner: ${winner}`;
    });
});