let clubs = "_of_clubs.png"
let dmnds = "_of_diamonds.png"
let hearts = "_of_hearts.png"
let spades = "_of_spades.png"
let shoe
let player = []
let dealer = []
let player_turn_over = false
let hand_num = 1
let player_hand_totals = []


const repeatArray = (arr, n) => Array.from({ length: n }, () => arr).flat();
const faces = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]
const suits = ["clubs", "diamonds", "hearts", "spades"]
const cardValue = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'jack':10,
    'queen':10,
    'king':10,
    'ace': 11

};

function shuffle(array) {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

   
    while (0 !== currentIndex) {
   
       randomIndex = Math.floor(Math.random() * currentIndex);
       currentIndex -= 1;
   
       temporaryValue = array[currentIndex];
       array[currentIndex] = array[randomIndex];
       array[randomIndex] = temporaryValue;
    }
   
    return array;
}

function createDeck(shoe_size){

    shoe = []

    var single_shoe = []
    for (face of faces) {
        for (suit of suits) {
            single_shoe.push([face,suit])
            
        } 
    }

    shoe = shuffle(repeatArray(single_shoe, shoe_size));

}

function hit(){
    if (!player_turn_over){

        var cur_card_pull = shoe.pop()

        player[player.length-1].push(cur_card_pull)
        displayCard(cur_card_pull, "player_hand_1")
        console.log(player[player.length-1])
        cur_total = getHandTotal(player[player.length-1])
        if (cur_total > 21){
            console.log("bust: ", cur_total )
            stand()
            return
        }
        if (cur_total === 21){
            console.log("force stand due to 21")
            stand()
            return
        }

    }
}

function getHandTotal(player){

    var ace_count = 0
    var hard_total = 0
    var soft_total = -1

    for (card of player){
        if (card[0] === 'ace'){
            ace_count += 1
        }
        else{
            hard_total += cardValue[card[0]]
        }
    }

    if (ace_count >= 1){
        soft_total = hard_total
        soft_total += ace_count

        if (hard_total > 10){
            hard_total += ace_count
        }

        else{
            hard_total += 11
            ace_count -= 1
        }
    }

    if (soft_total === -1){
        soft_total = hard_total
    }

    if (hard_total === 21 || soft_total === 21){
        return 21
    }

    return soft_total


    
}

function dealCards(){
    //the initial dealing
    player = []
    dealer = []
    player_turn_over = false
    player_hand_totals = []
    clearCardsDisplayed("dealer")
    clearCardsDisplayed("player_hand_1")
    
    //animate this
    player.push([shoe.pop()])
    displayCard(player[player.length - 1][0], "player_hand_1")

    dealer.push(shoe.pop())
    displayCard(dealer[0],"dealer")

    player[player.length - 1].push(shoe.pop())
    //hide this card on frontend
    dealer.push(shoe.pop())
    displayCard(player[player.length - 1][1], "player_hand_1")


    var player_total = getHandTotal(player[player.length - 1])

    //is dealer card that is showing is 10, then all players lose if they have an ace

    var dealer_total  = getHandTotal(dealer)
}

``

function stand(){

    if (!player_turn_over){
        console.log("stand")
        player_hand_totals.push(getHandTotal(player.pop()))
        checkPlayerEnd()
    }
}


function checkPlayerEnd(){

    if (player.length === 0){
        player_turn_over = true
        showDealerHand()
        return 
    }
    if (player[player.length-1].length === 1){
        //need to draw a card for the pair ting
        console.log("gave card to the other pair hand")
        player[player.length-1].push(shoe.pop())
        console.log(player[player.length-1])

    }

}


function double(){
    if (!player_turn_over){
        var player_card = shoe.pop()
        player[player.length-1].push(player_card)
        displayCard(player_card, "player_hand_1")

        stand()
    }




}

function split(){
    if (!player_turn_over){
        // (A, A) -> (A,A) , (A,?) -> (A,A), (A,?), (A,?)
        //  [0]  -> [1,0] -> 
        let first_card = player[player.length-1][0]
        let second_card = player[player.length-1][1]

        if (first_card[0] === second_card[0]){
            //since using stack push the second card first, so the first is on top
            //remove the pair from stack
            player.pop()
            //put to the front to preserve order
            player.unshift([second_card])

            player.push([first_card, shoe.pop()])
            console.log("first split hand: ", player[player.length-1])
            getHandTotal(player[player.length-1])
            

        }


    
    }
}

function surrender(){
    if (!player_turn_over){
        console.log("surrender")
        stand()
        checkPlayerEnd()
    }
}

function showDealerHand(){


    let dealer_total = getHandTotal(dealer)

    while (dealer_total <= 16){
        var dealer_card = shoe.pop()
        dealer.push(dealer_card)
        displayCard(dealer_card, "dealer")

        dealer_total = getHandTotal(dealer)
    }





    if (player_hand_totals[0] <= 21){
        if (dealer_total > 21 || player_hand_totals[0] > dealer_total){
            displayOutcome("WIN", 1)
        }
        else if (player_hand_totals[0] < dealer_total){
            displayOutcome("LOSE", 1)
        }
        else{
            displayOutcome("PUSH", 1)
        }
    }
    else{
        displayOutcome("BUST", 1)
    }


}



function displayCard(hand,player_type){
    var div = document.getElementById(player_type);
    var cur_card = hand[0] + " , " + hand[1] + " " 
    var textNode = document.createTextNode(cur_card);
    div.appendChild(textNode);
}

function displayOutcome(outcome, hand_num){
    var outcome_id = "player_hand_" + hand_num.toString() + "_outcome"
    var div = document.getElementById(outcome_id);
    var textNode = document.createTextNode(outcome);
    div.appendChild(textNode);  
}


function clearCardsDisplayed(player_type){
    var div = document.getElementById(player_type);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

}

