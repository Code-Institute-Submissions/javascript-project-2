var cards = document.querySelectorAll(`.card`);

let flippedCard = false;
let firstCard, secondCard;
let locked = false;

function flipCard() {
    if (locked) return;    // makes you unable to check for a second pair while the first one is still visible
    if (this === firstCard) return;     // makes it so that you can't doubleclick a card
     this.classList.toggle('flip');

    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;    
        
        return;
    } 
    secondCard = this;

    checkMatch();   // checks for matches and if theres a match it keeps them up and makes them unable to click
    // if theres no match they flip themselves back after a short delay
    onTry()
}

function checkMatch() {
    if (firstCard.firstElementChild.dataset.image === secondCard.firstElementChild.dataset.image) {
        disableCards();  // disables the cards, making them unclickable since there was a match
    } else {
        unflipCards();  // flips the cards clicked back since there was no match
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard)
    secondCard.removeEventListener('click', flipCard)

    resetMap();  // Resets the map when there is a mismatch, making sure you can select "firstCard" again.

    setTimeout(() => {
        completed()
    }, 1300)
}

function completed() {
    if ($(".card.flip").length == $(".card").length) {   // checks to see whether these were the last cards you needed to flip or not
        modal.style.display = "block";  //  if it was the last card that needed to be flipped it pops up the "completed" screen
        $(".card").removeClass('flip');
        setTimeout(() => { 
            shuffle();
            cards.forEach(card => card.addEventListener(`click`, flipCard));
        }, 1300)
    }
}

function unflipCards() { // unflips the cards when there is no match after a brief delay
    locked = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetMap();
    }, 1300)
}

function resetMap() { // makes the cards clickable again when there is no match
    [flippedCard, locked] = [null, null];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPlace = Math.floor(Math.random() * 12);
        card.style.order = randomPlace;
    });
};

var images = document.querySelectorAll('.frontside');

cards.forEach(card => card.addEventListener(`click`, flipCard)) ;

var tries = 0;  //  keeps track of how many times user has checked for pairs
function onTry() {
    tries += 1;
    document.getElementById("tries").innerHTML = tries;
    document.getElementById("victry").innerHTML = tries;
};

$(".resetbutton").on('click', resetgame)  // allows you to reset the map by clicking the button allowing you to "retry"

function resetgame() {  //    function to make the game resettable by removing any flipped cards and re-randomizing the map layout.
    $(".card").removeClass('flip');
    setTimeout(() => { 
        shuffle();
        cards.forEach(card => card.addEventListener(`click`, flipCard));
    }, 1300)
    onTry(tries = -1);
}

window.addEventListener('load', function(){
    shuffle();
});

var modal = document.getElementById("myModal");  // The modal that pops up when completed

window.onclick = function(event) {  // Closes the modal when clicked outside of
  if (event.target == modal) {
    modal.style.display = "none";
    onTry(tries = -1);
  }
}

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

function highscore() {
    if(highscore !== null){
        if (tries < highscore) {
            localStorage.setItem("highscore", tries);      
        }
    }
    else {
        localStorage.setItem("highscore", tries);
    }

    document.getElementById("highscoreview").innerHTML = localStorage.getItem("highscore");
}