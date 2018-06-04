var CARD_COUNT = 12;
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

        if (clickCount === 2) {
          clickCount = 0;

          if (clickedCard[0].face === clickedCard[1].face) {
            clickedCard[0].match = true;
            clickedCard[1].match = true;
            matchCount++;

            if (matchCount === CARD_COUNT / 2) {
              setTimeout(function() { alert("You won!") }, 500);
              return;
            }

          }
          else {
            setTimeout(function() {
              for (var i = 0; i < CARD_COUNT; i++){
                console.log("card: " + cardList[i].id + " card match: " + cardList[i].match);
                if (!cardList[i].match && cardList[i].faceUp) {
                  var cardReset = $("#" + cardList[i].id);
                  cardReset.toggleClass("rotate-card-back");
                  cardReset.next(".card-front").toggleClass("rotate-card-front");
                  cardList[i].faceUp = false;
                  console.log("class: " + cardReset.attr("class"));
                }
              }
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
    var pairCount = [0, 0, 0, 0, 0, 0];

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

  var pairs = generatePairs();
  var cardList = dealCards();
  var deck = $(".card-deck");
  var card = $("#card-template .rotate-container");
  var clickedCard = [null, null];
  var clickCount = 0;
  var matchCount = 0;
  var totalClicks = 0;

  for (var i = 0; i < CARD_COUNT; i++) {
    insertCard(i);
  }

  registerEventListeners();
});
