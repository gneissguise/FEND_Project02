const CARD_COUNT = 16;
const PAIR_COUNT = CARD_COUNT / 2;
const EMOJI_LIST = ['em-8ball', 'em-alien', 'em-apple', 'em-avocado',
  'em-bacon', 'em-bear', 'em-bee', 'em-beer', 'em-beetle',
  'em-birthday', 'em-bomb', 'em-brain', 'em-burrito', 'em-cactus',
  'em-candy', 'em-cat', 'em-doughnut', 'em-eagle', 'em-fire',
  'em-flushed', 'em-fox_face', 'em-ghost', 'em-grinning', 'em-hankey',
  'em-heart_eyes', 'em-jack_o_lantern', 'em-joy', 'em-kiss',
  'em-monkey_face', 'em-mushroom', 'em-palm_tree', 'em-pizza'];
const MAX_EMOJI = EMOJI_LIST.length;
const STAR_EMOJI = "<i class='em-svg em-star'></i>";

$(() => {
  // Function to register all of my event listeners
  const registerEventListeners = () => {
    // Cheat mode for design purposes
    //$("h1").click(showAll());

    // Reset button listener
    resetBtn.click(() => {
      resetGame();
    });

    // Modal window button listener
    winModalClose.click(() => {
      winModal.modal("hide");
    });

    // One listener for all of the cards!
    deck.click((e) => {
      const target = $(e.target);
      const id = target.attr("id");
      const elClass = target.attr("class");

      // If it's a card, then do things
      if (elClass === "card-back" && clickCount < 2) {
        const cardSelected = findCardById(id);

        // Rotation animation
        target.toggleClass("rotate-card-back");
        target.next(".card-front").toggleClass("rotate-card-front");

        cardSelected.faceUp = true;
        clickedCard[clickCount] = cardSelected;
        clickCount++;

        // if this is the second click, we want to check for a match
        if (clickCount === 2) {
          // Reset the click count, and update the totalClicks
          clickCount = 0;
          totalClicks++;
          $("#clicks").html(totalClicks);
          setStarRating("#stars");

          if (clickedCard[0].face === clickedCard[1].face) {
            clickedCard[0].match = true;
            clickedCard[1].match = true;

            // glow effect
            setTimeout(() => {
              const card1 = $("#" + clickedCard[0].id).next(".card-front");
              const card2 = $("#" + clickedCard[1].id).next(".card-front");

              card1.toggleClass("glow");
              card2.toggleClass("glow");
              setTimeout(() => {
                card1.toggleClass("glow");
                card2.toggleClass("glow");
              }, 1205);
            }, 0);

            // up match count
            matchCount++;
            $("#matches").html(matchCount);

            // Winner condition modal
            if (matchCount === PAIR_COUNT) {
              const finalTimeElapsed = timeElapsed;
              const clickCountHtml = $("#click-div").text();
              const matchCountHtml = $("#match-div").text();
              //const starCountHtml = $("#star-div").text();

              turnOffTimer();

              $("#scoreRow1").append(clickCountHtml);
              $("#scoreRow2").append(matchCountHtml);
              $("#scoreRow3").append(formatTime(finalTimeElapsed));
              //$("#scoreRow4").append(starCountHtml);
              setStarCount("#scoreRow4");
              winModal.modal("show");
              setTimeout(() => {
                resetBtn.trigger("click");
              }, 300);
            }

          }
          else {
            setTimeout(() => {
              faceDown({shown: false});
            }, 500);
          }
        }
        // Start timer on first click
        if (totalClicks === 0) {
            toggleTimer();
        }
      }
    });
  };

  // Card's div id generator
  const newCardId = (n) => {
    return "card-" + (n < 10 ? "0" : "") + n.toString();
  };

  // Random number function wrapper
  const rando = (max) => {
    return Math.floor(Math.random() * max);
  };

  // Inserts cards into the deck
  const insertCard = (id) => {
    const c = cardList[id];
    const newCard = card.clone();
    const cardBack = newCard.find(".card-back");
    const cardFront = newCard.find(".card-front");

    cardBack.prop("id", c.id);
    cardFront.append("<i class='em-svg " + c.face + "'></i>");
    newCard.appendTo(deck);
  };

  // Builds the matching pairs
  const generatePairs = () => {
    let selected = [];

    for (let i = 0; i < (PAIR_COUNT); i++) {
      let n = rando(MAX_EMOJI);

      if (selected.length !== 0 &&
          selected.indexOf(EMOJI_LIST[n]) !== -1) {
        while(selected.indexOf(EMOJI_LIST[n]) > -1) {
          n = rando(MAX_EMOJI);
        }
      }
      selected.push(EMOJI_LIST[n]);
    }

    return selected;
  }

  // Lookup card object
  const findCardById = (id) => {
    return cardList.find((c) => {
      return (c.id === id);
    });
  }

  // Deals the cards
  const dealCards = function() {
    let cards = [];
    const pairCount = function() {
      let a = [];
      for (let i = 0; i < PAIR_COUNT; i++){
        a.push(0);
      }
      return a;
    }();

    for (let i = 0; i < CARD_COUNT; i++) {
      let n = rando(CARD_COUNT);
      let p = rando(PAIR_COUNT);

      if (i === 0) {
        pairCount[p] = 1;
      }
      else {
        while (pairCount[p] === 2) {
          p = rando(PAIR_COUNT);
        }
        pairCount[p]++;

        while (cards.find((c) => {
          return (c.id === newCardId(n));
        })){
          n = rando(CARD_COUNT);
        }
      }
      cards.push({
        id: newCardId(n),
        face: pairs[p],
        faceUp: false,
        match: false,
      })
    }

    return cards;
  }

  // Sets the cards face down again
  const faceDown = (option) => {
    for (let i = 0; i < CARD_COUNT; i++){
      if ((!cardList[i].match && cardList[i].faceUp) ||
        (option.shown && cardList[i].faceUp)) {
        let cardReset = $("#" + cardList[i].id);
        cardReset.toggleClass("rotate-card-back");
        cardReset.next(".card-front").toggleClass("rotate-card-front");
        cardList[i].faceUp = false;
      }
    }
  };

  // Resets game to new state
  const resetGame = () => {
    clickedCard = [null, null];
    clickCount = 0;
    matchCount = 0;
    $("#matches").html(matchCount);
    totalClicks = 0;
    $("#clicks").html(totalClicks);
    faceDown({shown: true});
    timeElapsed = 0;
    $("#timer").html(formatTime(timeElapsed));
    turnOffTimer();
    setStarRating("#stars");

    setTimeout(() => {
      pairs = generatePairs();
      cardList = dealCards();
      for (let i = 0; i < CARD_COUNT; i++) {
        const c = $("#" + cardList[i].id);
        let cFront = c.next(".card-front").children("i");

        cFront.removeClass(cFront.attr("class"));
        cFront.addClass("em-svg " + cardList[i].face);
      }
    }, 500);
  };

  // Generates star rating on a win
  const setStarRating = (id) => {
    let rating = 0;

    $(id).html("");

    if (totalClicks < PAIR_COUNT + 5) {
      rating = 4;
    }
    else if (totalClicks >= PAIR_COUNT + 5 && totalClicks < PAIR_COUNT + 10) {
      rating = 3;
    }
    else if (totalClicks >= PAIR_COUNT + 10 && totalClicks < PAIR_COUNT + 15) {
      rating = 2;
    }
    else if (totalClicks >= PAIR_COUNT + 15) {
      rating = 1;
    }

    for (let i = 0; i < rating; i++){
      $(id).append(STAR_EMOJI);
    }
  };

  // Shows all cards (for debugging)
  const showAll = () => {
    $(".card-back").toggleClass("rotate-card-back");
    $(".card-front").toggleClass("rotate-card-front");
  };

  const formatTime = (t) => {
    const date = new Date(null);
    date.setSeconds(t); // specify value for SECONDS here

    const result = date.toISOString().substr(11, 8);

    return "Time: " + result;
  }

  const turnOffTimer = () => {
    clearInterval(gameTimer);
    gameTimer = null;
    timeElapsed = 0;
    $("#timer").html(formatTime(timeElapsed));
  }

  // Toggle game timer
  const toggleTimer = () => {
    // If the timer exists, then turn it off.
    if (gameTimer != null) {
      turnOffTimer();
    }
    else {
      gameTimer = setInterval(() => {
        timeElapsed++;
        $("#timer").html(formatTime(timeElapsed));
      }, 1000);
    }
  }

  // Global declarations
  let pairs = generatePairs();
  let cardList = dealCards();
  let deck = $(".card-deck");
  let card = $("#card-template .rotate-container");
  let resetBtn = $("#reset");
  let winModal = $("#winModal");
  let winModalClose = $("#winModalClose");
  let clickedCard = [null, null];
  let clickCount = 0;
  let matchCount = 0;
  let totalClicks = 0;
  let gameTimer = null;
  let timeElapsed = 0;

  // Create all of the cards
  for (let i = 0; i < CARD_COUNT; i++) {
    insertCard(i);
  }

  // Then register the listeners!
  registerEventListeners();
});
