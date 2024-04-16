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
const max_splits = 4

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
        displayCard(cur_card_pull, getHandID(hand_num))
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


function clearTable(){
    clearCardsDisplayed("dealer")
    for (let i = 0; i < max_splits; i++) {
        let player_hand = "player_hand_" + (i+1).toString()
        clearCardsDisplayed(player_hand)
        clearCardsDisplayed(player_hand + "_outcome")

    }
}

function getHandID(hand_num){
    return "player_hand_" + (hand_num).toString()
}

function pairCheck(){
    if (player[player.length - 1][0][0] === player[player.length - 1][1][0]){
        document.getElementById("split").disabled=false
    }
    else{
        document.getElementById("split").disabled=true
    }

}

function dealCards(){
    //the initial dealing
    player = []
    dealer = []
    player_turn_over = false
    player_hand_totals = []
    hand_num = 1
    document.getElementById("split").disabled=true
    document.getElementById("insurance").disabled=true

    clearTable()

    //animate this
    player.push([shoe.pop()])
    displayCard(player[player.length - 1][0], getHandID(hand_num))

    dealer.push(shoe.pop())
    displayCard(dealer[0],"dealer")

    player[player.length - 1].push(shoe.pop())
    //hide this card on frontend
    dealer.push(shoe.pop())
    displayCard(player[player.length - 1][1],getHandID(hand_num))

    pairCheck()


    var player_total = getHandTotal(player[player.length - 1])

    if (player_total === 21){
        stand()
    }

    var dealer_total  = getHandTotal(dealer)
    if (cardValue[dealer[0][0]] === 10 && dealer_total === 21 ){
        stand()
    }
}



function stand(){

    if (!player_turn_over){
        //locking in the stand value of the player hand
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
        hand_num += 1
        let first_hand_card = player[player.length-1][0]
        let hand_id = getHandID(hand_num)
        displayCard(first_hand_card,hand_id)


        console.log("gave card to the other pair hand")
        let second_hand_card =  shoe.pop()
        player[player.length-1].push(second_hand_card)
        pairCheck()
        displayCard(second_hand_card,hand_id)
    }

}


function double(){
    if (!player_turn_over){
        var player_card = shoe.pop()
        player[player.length-1].push(player_card)
        displayCard(player_card, getHandID(hand_num))
        stand()
    }
}

//3 people, last one scanning, second one scanning, 

function split(){
    if (!player_turn_over){
        // (A, A) -> (A,A) , (A,?) -> (A,A), (A,?), (A,?)
        //  [0]  -> [1,0] -> 
        let first_card = player[player.length-1][0]
        let second_card = player[player.length-1][1]

        if (first_card[0] === second_card[0]){
            let hand_id_one = getHandID(hand_num)
            clearCardsDisplayed(hand_id_one)
            displayCard(first_card,hand_id_one)

            //since using stack push the second card first, so the first is on top
            //remove the pair from stack
            player.pop()
            //put to the front to preserve order
            player.unshift([second_card])
            let hand_second_card =  shoe.pop()

            player.push([first_card, hand_second_card])
            pairCheck()
            displayCard(hand_second_card,hand_id_one)
            getHandTotal(player[player.length-1])
            

        }


    
    }
}

function surrender(){
    if (!player_turn_over){
        console.log("surrender")
        stand()
    }
}

function insurance(){

}

function showDealerHand(){


    let dealer_total = getHandTotal(dealer)
    displayCard(dealer[1], "dealer")

    while (dealer_total <= 16){
        var dealer_card = shoe.pop()
        dealer.push(dealer_card)
        displayCard(dealer_card, "dealer")

        dealer_total = getHandTotal(dealer)
    }


    for (let i = 0; i < max_splits; i++) {
    


        if (player_hand_totals[i] <= 21){
            if (dealer_total > 21 || player_hand_totals[i] > dealer_total){
                displayOutcome("WIN", i+1)
            }
            else if (player_hand_totals[i] < dealer_total){
                displayOutcome("LOSE", i+1)
            }
            else{
                displayOutcome("PUSH", i+1)
            }
        }
        else{
            displayOutcome("BUST", i+1)
        }
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

