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
        resetgame()
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
(function shuffle(){   // Function that shuffles the map correctly 
    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
        return $(shuffled);
    };
})(jQuery);

var images = document.querySelectorAll('.frontside');

cards.forEach(card => card.addEventListener(`click`, flipCard)) ;

window.addEventListener('load', function(){
    $(images).shuffle();
});

var tries = 0;  //  keeps track of how many times user has checked for pairs
function onTry() {
    tries += 1;
    document.getElementById("tries").innerHTML = tries;
    document.getElementById("victry").innerHTML = tries;
};

$(".resetbutton").on('click', resetgame)  // allows you to reset the map by clicking the button allowing you to "retry"

function resetgame() {  //    function to make the game resettable by removing any flipped cards and re-randomizing the map layout.
    $(".card").removeClass('flip');
    cards.forEach(card => card.addEventListener(`click`, flipCard));
    setTimeout(() => { 
        $(images).shuffle();
    }, 1300)
    onTry(tries = -1)
}

var modal = document.getElementById("myModal");  // The modal that pops up when completed

window.onclick = function(event) {  // Closes the modal when clicked outside of
  if (event.target == modal) {
    modal.style.display = "none";
  }
}