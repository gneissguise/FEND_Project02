var CARD_COUNT = 16;
var EMOJI_LIST = ['em-8ball', 'em-alien', 'em-apple', 'em-avocado',
  'em-bacon', 'em-bear', 'em-bee', 'em-beer', 'em-beetle',
  'em-birthday', 'em-bomb', 'em-brain', 'em-burrito', 'em-cactus',
  'em-candy', 'em-cat', 'em-doughnut', 'em-eagle', 'em-fire',
  'em-flushed', 'em-fox_face', 'em-ghost', 'em-grinning', 'em-hankey',
  'em-heart_eyes', 'em-jack_o_lantern', 'em-joy', 'em-kiss',
  'em-monkey_face', 'em-mushroom', 'em-palm_tree', 'em-pizza'];
var MAX_EMOJI = EMOJI_LIST.length;

$(function() {
  var registerEventListeners = function() {
    // Cheat mode for design purposes
    //$("h1").click(showAll());

    resetBtn.click(function() {
      resetGame();
    });

    winModalClose.click(function() {
      winModal.modal("hide");
      resetGame();
    });

    deck.click(function(e) {
      var target = $(e.target);
      var id = target.attr("id");
      var elClass = target.attr("class");

      console.log("Click: " + id + " " + target.attr("class") + " clickCount: " + clickCount);

      if (elClass === "card-back" && clickCount < 2) {
        console.log("current id: " + id);
        console.log("findCardById: " + findCardById(id));
        var cardSelected = findCardById(id);

        target.toggleClass("rotate-card-back");
        target.next(".card-front").toggleClass("rotate-card-front");

        cardSelected.faceUp = true;
        clickedCard[clickCount] = cardSelected;
        clickCount++;
        totalClicks++;
        $("#clicks").html(totalClicks);

        if (clickCount === 2) {
          clickCount = 0;

          if (clickedCard[0].face === clickedCard[1].face) {
            clickedCard[0].match = true;
            clickedCard[1].match = true;

            setTimeout(function() {
              $("#" + clickedCard[0].id).parent().toggleClass("glow");
              $("#" + clickedCard[1].id).parent().toggleClass("glow");
              setTimeout(function() {
                $("#" + clickedCard[0].id).parent().toggleClass("glow");
                $("#" + clickedCard[1].id).parent().toggleClass("glow");
              }, 500);
            }, 500);

            matchCount++;
            $("#matches").html(matchCount);

            if (matchCount === CARD_COUNT / 2) {
              $("#winClicks").html(totalClicks);
              setStarRating();
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
      }
    });
  };

  var newCardId = function(n) {
    return "card-" + (n < 10 ? "0" : "") + n.toString();
  };

  var rando = function(max) {
    return Math.floor(Math.random() * max);
  };

  var insertCard = function(id) {
    var c = cardList[id];
    var newCard = card.clone();
    var cardBack = newCard.find(".card-back");
    var cardFront = newCard.find(".card-front");

    cardBack.prop("id", c.id);
    cardFront.append("<i class='em-svg " + c.face + "'></i>");
    newCard.appendTo(deck);
  };

  var generatePairs = function() {
    var selected = [];

    for (var i = 0; i < (CARD_COUNT / 2); i++) {
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

  var findCardById = function(id) {
    return cardList.find(function(c) {
      return (c.id === id);
    });
  }

  var dealCards = function() {
    var cards = [];
    var pairCount = function() {
      var a = [];
      for (var i = 0; i < CARD_COUNT / 2; i++){
        a.push(0);
      }
      return a;
    }();

    for (var i = 0; i < CARD_COUNT; i++) {
      var n = rando(CARD_COUNT);
      var p = rando(CARD_COUNT / 2);

      if (i === 0) {
        pairCount[p] = 1;
      }
      else {
        while (pairCount[p] === 2) {
          p = rando(CARD_COUNT / 2);
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

  var faceDown = function(option) {
    for (var i = 0; i < CARD_COUNT; i++){
      console.log("card: " + cardList[i].id + " card match: " + cardList[i].match);
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

  var resetGame = function() {
    clickedCard = [null, null];
    clickCount = 0;
    matchCount = 0;
    $("#matches").html(matchCount);
    totalClicks = 0;
    $("#clicks").html(totalClicks);
    faceDown({shown: true});

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

  var setStarRating = function() {
    var rating = 0;

    $("#winRating").html("");

    if (totalClicks >= CARD_COUNT && totalClicks < CARD_COUNT + 5) {
      rating = 4;
    }
    else if (totalClicks >= CARD_COUNT + 5 && totalClicks < CARD_COUNT + 10) {
      rating = 3;
    }
    else if (totalClicks >= CARD_COUNT + 10 && totalClicks < CARD_COUNT + 15) {
      rating = 2;
    }
    else if (totalClicks >= CARD_COUNT + 15) {
      rating = 1;
    }

    for (var i = 0; i < rating; i++){
      $("#winRating").append("<i class='em-svg em-star'></i>");
    }
  };

  var showAll = function() {
    $(".card-back").toggleClass("rotate-card-back");
    $(".card-front").toggleClass("rotate-card-front");
  };

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

  for (var i = 0; i < CARD_COUNT; i++) {
    insertCard(i);
  }

  registerEventListeners();
});
