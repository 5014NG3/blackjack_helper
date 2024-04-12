let clubs = "_of_clubs.png"
let dmnds = "_of_diamonds.png"
let hearts = "_of_hearts.png"
let spades = "_of_spades.png"
let shoe
//need to have this be a list of list to account for multiple hands ie splits
//re-implement this using stack

//player is now a stack
let player = []
let dealer = []
let player_turn_over = false

//for splitting

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

        player[player.length-1].push(shoe.pop())
        console.log(player[player.length-1])
        cur_total = getHandTotal(player[player.length-1])
        if (cur_total > 21){
            console.log("bust within the hit func")
            stand()
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
    
    //animate this
    player.push([shoe.pop()])
    dealer.push(shoe.pop())
    player[player.length - 1].push(shoe.pop())
    //hide this card on frontend
    dealer.push(shoe.pop())
    console.log("player: ", player[player.length - 1][0], player[player.length - 1][1])
    console.log("dealer: ", dealer[0], "hole")
    getHandTotal(player[player.length - 1])
}

``

function stand(){

    if (!player_turn_over){
        console.log("stand")
        player.pop()
        checkPlayerEnd()
    }
}


function checkPlayerEnd(){

    if (player.length === 0){
        player_turn_over = true
        showDealerHand()
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
        player[player.length-1].push(shoe.pop())
        console.log(player[player.length-1])
        getHandTotal(player[player.length-1])
        //force stand
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

    console.log("DEALER: ")
    let dealer_total = getHandTotal(dealer)
    console.log(dealer[0], dealer[1], dealer_total)

    while (dealer_total <= 16){
        dealer.push(shoe.pop())
        dealer_total = getHandTotal(dealer)
        console.log(dealer_total)
    }


    console.log("end of round")
    //check dealer total against players

}




