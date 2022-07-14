const cardsContainer = document.getElementById('cards-container')
const newDeckBtn = document.getElementById("new-deck")
const drawCardsBtn = document.getElementById("draw-cards")
const newGameBtn = document.getElementById('new-game')
const playerScoreEl = document.querySelector('.player-score')
const computerScoreEl = document.querySelector('.computer-score')
const remainingCardsEl = document.getElementById('remaining-cards')

let deckId = localStorage.getItem('deckId')
let playerScore = 0;
let computerScore = 0;
let remainingCards = 0;

const availableCards = {'2':2, '3':3, '4':4, '5':5,'6':6,'7':7,'8':8,'9':9,'10':10, 'JACK':11, 'QUEEN':12, 'KING':13, 'ACE':14}

newDeckBtn.addEventListener("click", handleClick)
drawCardsBtn.addEventListener("click", drawCards)
newGameBtn.addEventListener('click', shuffleCards)

controlBtns()
// localStorage.clear()

function controlBtns() {
    if(deckId){
        newDeckBtn.classList.add('hide')
        drawCardsBtn.classList.remove('hide')
    }else{
        newDeckBtn.classList.remove('hide')
        drawCardsBtn.classList.add('hide')
    }
}


// Get a new deck from api
function handleClick() {
    deckId = "l"
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            remainingCards = data.remaining
            updateGameState()
            localStorage.setItem('deckId', deckId)
            alert('deck generated')
        })
        controlBtns()
}


// Draw Card Data from deck
function drawCards() {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        genCards(data.cards[0].image, data.cards[1].image)
        checkWinningCard(data.cards[0].value, data.cards[1].value)
        remainingCards = data.remaining
        updateGameState()
    })
}


// Generate Images for cards
function genCards(card1, card2){
    cardsContainer.children[0].innerHTML = `<img class="card" src=${card1}></img>`
    cardsContainer.children[1].innerHTML = `<img class="card" src=${card2}></img>`
}

// Start a new game without generating a new deck from the api
function shuffleCards(){
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/shuffle/`)
        .then(res => res.json())
        .then(data => {
            resetGame()
            remainingCards = data.remaining
            playerScore = 0;
            computerScore = 0;
            updateGameState()
        })
}

// Check the numeric value assigned to each card
function checkWinningCard(card1, card2) { 
    if(availableCards[card1] > availableCards[card2]) {
        playerScore++
        cardsContainer.children[0].classList.add('winning-card')
        cardsContainer.children[1].classList.remove('winning-card')
    }else if(availableCards[card1] < availableCards[card2]){
        computerScore++
        cardsContainer.children[1].classList.add('winning-card')
        cardsContainer.children[0].classList.remove('winning-card')
    }else{
        cardsContainer.children[0].classList.remove('winning-card')
        cardsContainer.children[1].classList.remove('winning-card')
        return
    }
    
}

function updateGameState() {
    playerScoreEl.textContent = `Player: ${playerScore}`
    computerScoreEl.textContent = `Computer: ${computerScore}`
    remainingCardsEl.textContent = `Remaining Cards: ${remainingCards}`
    if(!remainingCards){
        drawCardsBtn.disabled = true
        drawCardsBtn.classList.add('disabled')
        setTimeout(checkGameWinner, 500)
        resetGame()
    }else if(remainingCards){
        drawCardsBtn.disabled = false
        drawCardsBtn.classList.remove('disabled')
    }
}

function checkGameWinner() {
    if(playerScore > computerScore){
        alert('The Player Wins!')
    }else if(playerScore < computerScore){
        alert('The Computer Wins!')
    }
}

function resetGame() {
    cardsContainer.children[0].innerHTML = ""
    cardsContainer.children[1].innerHTML = ""
    cardsContainer.children[0].classList.remove('winning-card')
    cardsContainer.children[1].classList.remove('winning-card')
}