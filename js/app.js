var CARD_COUNT = 16;
var PAIR_COUNT = CARD_COUNT / 2;
var EMOJI_LIST = ['em-8ball', 'em-alien', 'em-apple', 'em-avocado',
  'em-bacon', 'em-bear', 'em-bee', 'em-beer', 'em-beetle',
  'em-birthday', 'em-bomb', 'em-brain', 'em-burrito', 'em-cactus',
  'em-candy', 'em-cat', 'em-doughnut', 'em-eagle', 'em-fire',
  'em-flushed', 'em-fox_face', 'em-ghost', 'em-grinning', 'em-hankey',
  'em-heart_eyes', 'em-jack_o_lantern', 'em-joy', 'em-kiss',
  'em-monkey_face', 'em-mushroom', 'em-palm_tree', 'em-pizza'];
var MAX_EMOJI = EMOJI_LIST.length;
var STAR_EMOJI = "<i class='em-svg em-star'></i>";

$(function() {
  // Function to register all of my event listeners
  var registerEventListeners = function() {
    // Cheat mode for design purposes
    //$("h1").click(showAll());

    // Reset button listener
    resetBtn.click(function() {
      resetGame();
      setStarRating();
    });

    // Modal window button listener
    winModalClose.click(function() {
      winModal.modal("hide");
      resetGame();
    });

    // One listener for all of the cards!
    deck.click(function(e) {
      var target = $(e.target);
      var id = target.attr("id");
      var elClass = target.attr("class");

      // If it's a card, then do things
      if (elClass === "card-back" && clickCount < 2) {
        var cardSelected = findCardById(id);

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
          setStarRating();

          if (clickedCard[0].face === clickedCard[1].face) {
            clickedCard[0].match = true;
            clickedCard[1].match = true;


            // glow effect
            setTimeout(function() {
              var card1 = $("#" + clickedCard[0].id).next(".card-front");
              var card2 = $("#" + clickedCard[1].id).next(".card-front");

              card1.toggleClass("glow");
              card2.toggleClass("glow");
              setTimeout(function() {
                card1.toggleClass("glow");
                card2.toggleClass("glow");
              }, 1205);
            }, 0);

            // up match count
            matchCount++;
            $("#matches").html(matchCount);

            // Winner condition modal
            if (matchCount === PAIR_COUNT) {
              $("#winClicks").html(totalClicks);
              winModal.modal("show");
              return;
            }

          }
          else {
            setTimeout(function() {
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
  var newCardId = function(n) {
    return "card-" + (n < 10 ? "0" : "") + n.toString();
  };

  // Random number function wrapper
  var rando = function(max) {
    return Math.floor(Math.random() * max);
  };

  // Inserts cards into the deck
  var insertCard = function(id) {
    var c = cardList[id];
    var newCard = card.clone();
    var cardBack = newCard.find(".card-back");
    var cardFront = newCard.find(".card-front");

    cardBack.prop("id", c.id);
    cardFront.append("<i class='em-svg " + c.face + "'></i>");
    newCard.appendTo(deck);
  };

  // Builds the matching pairs
  var generatePairs = function() {
    var selected = [];

    for (var i = 0; i < (PAIR_COUNT); i++) {
      var n = rando(MAX_EMOJI);

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
  var findCardById = function(id) {
    return cardList.find(function(c) {
      return (c.id === id);
    });
  }

  // Deals the cards
  var dealCards = function() {
    var cards = [];
    var pairCount = function() {
      var a = [];
      for (var i = 0; i < PAIR_COUNT; i++){
        a.push(0);
      }
      return a;
    }();

    for (var i = 0; i < CARD_COUNT; i++) {
      var n = rando(CARD_COUNT);
      var p = rando(PAIR_COUNT);

      if (i === 0) {
        pairCount[p] = 1;
      }
      else {
        while (pairCount[p] === 2) {
          p = rando(PAIR_COUNT);
        }
        pairCount[p]++;

        while (cards.find(function(c) {
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
  var faceDown = function(option) {
    for (var i = 0; i < CARD_COUNT; i++){
      if ((!cardList[i].match && cardList[i].faceUp) ||
        (option.shown && cardList[i].faceUp)) {
        var cardReset = $("#" + cardList[i].id);
        cardReset.toggleClass("rotate-card-back");
        cardReset.next(".card-front").toggleClass("rotate-card-front");
        cardList[i].faceUp = false;
        console.log("class: " + cardReset.attr("class"));
      }
    }
  };

  // Resets game to new state
  var resetGame = function() {
    clickedCard = [null, null];
    clickCount = 0;
    matchCount = 0;
    $("#matches").html(matchCount);
    totalClicks = 0;
    $("#clicks").html(totalClicks);
    faceDown({shown: true});
    //turnOffTimer();

    setTimeout(function() {
      pairs = generatePairs();
      cardList = dealCards();
      for (var i = 0; i < CARD_COUNT; i++) {
        var c = $("#" + cardList[i].id);
        var cFront = c.next(".card-front").children("i");

        cFront.removeClass(cFront.attr("class"));
        cFront.addClass("em-svg " + cardList[i].face);
      }
    }, 500);
  };

  // Generates star rating on a win
  var setStarRating = function() {
    var rating = 0;

    $("#winRating").html("");
    $("#stars").html("");

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

    console.log("clicks: " + totalClicks);
    console.log("rating: " + rating);
    for (var i = 0; i < rating; i++){
      $("#winRating").append(STAR_EMOJI);
      $("#stars").append(STAR_EMOJI);
    }
  };

  // Shows all cards (for debugging)
  var showAll = function() {
    $(".card-back").toggleClass("rotate-card-back");
    $(".card-front").toggleClass("rotate-card-front");
  };

  var formatTime = function(t) {
    var date = new Date(null);
    date.setSeconds(t); // specify value for SECONDS here

    var result = date.toISOString().substr(11, 8);

    return "Time: " + result;
  }

  var turnOffTimer = function() {
    clearInterval(gameTimer);
    gameTimer = null;
    timeElapsed = 0;
    $("#timer").html(formatTime(timeElapsed));
  }

  // Toggle game timer
  var toggleTimer = function() {
    // If the timer exists, then turn it off.
    if (gameTimer != null) {
      turnOffTimer();
    }
    else {
      gameTimer = setInterval(function() {
        timeElapsed++;
        $("#timer").html(formatTime(timeElapsed));
      }, 1000);
    }
  }

  // Global declarations
  var pairs = generatePairs();
  var cardList = dealCards();
  var deck = $(".card-deck");
  var card = $("#card-template .rotate-container");
  var resetBtn = $("#reset");
  var winModal = $("#winModal");
  var winModalClose = $("#winModalClose");
  var clickedCard = [null, null];
  var clickCount = 0;
  var matchCount = 0;
  var totalClicks = 0;
  var gameTimer = null;
  var timeElapsed = 0;

  // Create all of the cards
  for (var i = 0; i < CARD_COUNT; i++) {
    insertCard(i);
  }

  // Then register the listeners!
  registerEventListeners();
});
