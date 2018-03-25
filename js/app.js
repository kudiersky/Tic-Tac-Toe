//jake Kudiersky

game = {
    currentPlayer: whosFirst(), //randomises the first player
    possibleMoves: [], //possible moves for AI
    singlePlayer: false //set fALSE for 2 player game, TRUE for 1 player
}

player1 = {
    screenName: 'Player 1', //set by player max of 13 characters
    playerID: 1, //playerID used in current player
    win: false, //set to TRUE on winner
    selectedBoxes: [] //array of boxes selected by player
};

player2 = { //as above
    screenName: 'Player 2',
    playerID: 2,
    win: false,
    selectedBoxes: []
};

$('#boardPage,#finishPage,#playerInfoPage').hide(); //initially hide board,playerinfo and finish page.

$('#moveToPlayerInfoButton').click(function() { //click to go t playerInfoPage, hide other pages.

    $('#playerInfoPage').show(); //show the player info DIVs
    $('.flex-item.PlayerInfo.AI').hide(); //hode the AI'robot' DIV as default
    $('#startPage').hide(); //hide the start page
});

function whosFirst() {  //allows for random whos first, coin toss.
    return Math.floor((Math.random() * 2) + 1);
}

function isEven(n) { //if even selector, used in switching active player
    return n % 2 == 0;
}

function findPossibleMoves() { //remove event listener to allow winning row to be displayed
    let boxes = document.querySelectorAll('.box:not(.selected)') //for each of the boxes not selected add to possible moves for AI
    boxes.forEach((box) => {
        game.possibleMoves.push(box.id)
    });
};

function highlight(a, b, c) { //highlight winning combination of LIs a,b,c are the 3 winning LIs
    a.classList.add("highlighted")
    b.classList.add("highlighted")
    c.classList.add("highlighted")
    setTimeout(RemoveClass, 2000); //remove class after 2000ms

    function RemoveClass() {
        $(".highlighted").removeClass("highlighted"); //remove the class of highlighted
    }
};

$('.switch').click(function() { //check radio button for single player game
    singlePlayerGameCheck();
});

function singlePlayerGameCheck() {   //if the radio button is selected the index =1 if not selected index = 0
    if ($("input:checked").length > 0) {
        player2.screenName = 'Robot'; //set the screen name of AI as robot for 1 player game
        game.singlePlayer = true; //If 1 player set as false
        $('.flex-item.PlayerInfo.player2').hide()
        $('.flex-item.PlayerInfo.AI').show()
    } else if ($("input:checked").length < 1) {
        player2.screenName = $("input.player2").val();
        game.singlePlayer = false;              //if 2 player set as FALSE
        $('.flex-item.PlayerInfo.player2').show();
        $('.flex-item.PlayerInfo.AI').hide();
    }
};


function setNames() {
    player1.screenName = $("input.player1").val(); //set names from stored value
    player2.screenName = $("input.player2").val(); //set names from stored value
    $("#player1Name").append('<h1>' + player1.screenName + '</h1>'); //add to gamebaord
    $("#player2Name").append('<h1>' + player2.screenName + '</h1>');
}

function startGame() {
    let currentPlayer = String('player' + game.currentPlayer)
    document.getElementById(currentPlayer).classList.add('active') //higlight whos first
    $('#playerInfoPage').hide(); //hide other pages and show board.
    $('#boardPage').show();
    setNames();

    if (game.singlePlayer === true && game.currentPlayer === 2) {
        AIPlay(); //if playing against computer let AI play
    }
};

function activateBoxes() {
    var boxes = document.getElementsByClassName('box')
    for (var i = 0; i < boxes.length; i++) { //for loop to add event listener to each box
        boxes[i].addEventListener('click', fillBox, false);
        boxes[i].addEventListener('mouseover', mouseOn, false); //add mouse over for current player svg
        boxes[i].addEventListener('mouseout', mouseOff, false); //remove on mouse off
    }
}

$("#startButton").on("click", startGame); //start the game, move to boardPage

activateBoxes(); //activate boxes on start


function gameReset() { //cycle through Array to remove box fills and selected.
    let boxes = document.querySelectorAll('li');
    boxes.forEach((box) => {
        box.classList.remove('box-filled-1', 'box-filled-2', 'selected');
        box.addEventListener('click', fillBox, false); //readd event listener
    });
    activateBoxes(); //activate boxes on reset
    $('#finishPage').hide(); //show final page dynamilcally
    $('#boardPage').show(); //show the board page
    player1.win = false; //restore defaults
    player2.win = false; //restore defaults
    game.tie = false; //restore defaults
    player1.selectedBoxes = []; //restore defaults
    player2.selectedBoxes = []; //restore defaults
}; //clear boxes

function removeActiveBoxes() { //remove event listener to allow winning row to be displayed
    let boxes = document.querySelectorAll('li');
    boxes.forEach((box) => {
        box.removeEventListener("click", fillBox);
        box.removeEventListener("mouseover", mouseOn);
        box.removeEventListener("mouseout", mouseOff);

    });
};

function AIPlay() { //simulates human player
    findPossibleMoves(); //fins out what boxes are available
    var totalPossibleMoves = game.possibleMoves.length; //how big is the array before mixing the results
    var randomiseAIMove = Math.floor(Math.random() * totalPossibleMoves); //mix up the possible moves
    var nextMove = String(game.possibleMoves[randomiseAIMove]); //set as a var
    var el = document.getElementById(nextMove); //get the box that is to be filled
    el.classList.add('box-filled-2', 'selected');
    player2.selectedBoxes.push(nextMove); //push the selected box to an array of player 1
    checkWin(player2); //check if AI player has won
    game.possibleMoves = []; //empty possible moves array to prevent duplicates
    game.currentPlayer = 1; //Set the player as player one after AI player has turn
    playerSwitch(); //switch player
    checkWinner(); //displays who's won
    activateBoxes(); //activate boxes after disabling them for AIPlay
};

function playerSwitch() { //using a play counter if the counter is even the current player is 2, if odd the current player is 1.

    if (isEven(game.currentPlayer) == true && game.singlePlayer == false) { //if the current player is even and 2 player game
        game.currentPlayer = 2;
        $('.players').removeClass('active');
        document.getElementById('player' + game.currentPlayer).classList.add('active');
    } else if (isEven(game.currentPlayer) == true && game.singlePlayer == true) { //if the current player is even and a single player game
        game.currentPlayer = 2;
        $('.players').removeClass('active');
        document.getElementById('player' + game.currentPlayer).classList.add('active');
    } else if (isEven(game.currentPlayer) == false) { //if the current player is 1 set active player as player 1.
        game.currentPlayer = 1;
        $('.players').removeClass('active');
        document.getElementById('player' + game.currentPlayer).classList.add('active');
    }
};

function mouseOn(){//callback in activateBoxes()
  if (!$(this).hasClass('selected'))  { //add class of current player to box on mouse over
  $(this).addClass('box-filled-' + game.currentPlayer);
  }
}

function mouseOff(){ //callback in activateBoxes()
  if (!$(this).hasClass('selected'))  { //remove class of current player to box on mouse over 
  $(this).removeClass('box-filled-' + game.currentPlayer);
  }
}



function fillBox() { //fill boxes with irent players sign and only if free, alert if filled

    if (!$(this).hasClass('selected')) { // if not selected
        $(this).addClass('box-filled-' + game.currentPlayer + ' ' + 'selected'); //add the class dynamically adding current player
        if (game.currentPlayer == 1) {
            player1.selectedBoxes.push($(this).attr("id")) //push the selected box to an array of player 1
        } else if (game.currentPlayer == 2) {
            player2.selectedBoxes.push($(this).attr("id")) //push the selected box to an array of player 2
        }
        checkWin(player1); //check if player 2 has won
        checkWin(player2); //check if player 1 has won
        checkWinner(); //check who has won to give message
        game.currentPlayer++;
        playerSwitch(); //switch player
    } else {
        alert('this is taken, try another square'); //if square is taken then alert.
    }
    if (game.currentPlayer == 2 && game.singlePlayer == true) {
        removeActiveBoxes();
        setTimeout(AIPlay, 2000) //delay AIPLay to give impression of thought for 2000
    }
};


function highlightRow() {  //add higlighted class for 1000 then remove
    $('.highlighted').removeClass('highlighted');
    $('#boardPage').hide();
    $('#finishPage').show();
}

function checkWinner() {

    if (player1.win === true || player2.win === true || game.tie === true) { //if win or draw
        removeActiveBoxes(); //reactivat the boxes that were frozen during highlighted phase
        setTimeout(highlightRow, 1000);  //highlight the winning row for 1000



        if (player1.win == true) { //winning html will comnsist of CSS background, SVG and winning player in text
            var winningScreenName = player1.screenName;
            var winnerID = player1.playerID;
            var winningLine = '<p class="screen-win">' + winningScreenName + ' wins</p>';
            var PlayerWinButton = '<a href="#" id="newGameButton" class="newGameButton1 button">New game</a>';
        } else if (player2.win == true) {
            var winningScreenName = player2.screenName;
            var winnerID = player2.playerID;
            var winningLine = '<p class="screen-win">' + winningScreenName + ' wins</p>';
            var PlayerWinButton = '<a href="#" id="newGameButton" class="newGameButton2 button">New game</a>';
        } else if (game.tie === true) { //if a draw, no winning name should be displayed
            var winningScreenName = 'draw';
            var winnerID = 'tie';
            var winningLine = '<p class="screen-win">Draw</p>';
            var PlayerWinButton = '<a href="#" id="newGameButton" class="button">New game</a>';

        }


        var html = '<div id="finishPage" class="screen screen-win screen-win-' + winnerID + '">'; //give page the correct CSS
        html += '<header>';
        html += '<h1>Tic Tac Toe</h1>';
        html += winningLine;       // display who has won
        html += PlayerWinButton    //button can change CSS to match the winning player
        html += '</header>';
        html += '</div>';

        document.getElementById('finishPage').innerHTML = html;  //this is message to be displayed on final page

        var newGameButton = document.getElementById('newGameButton');
        if (newGameButton) {
            newGameButton.addEventListener("click", gameReset);
        };

    }
};


function checkWin(e) { //pass in current player to check their selected boxes against winning combinations.
    if (e.selectedBoxes.includes('oneOne') && (e.selectedBoxes.includes('oneTwo')) && (e.selectedBoxes.includes('oneThree'))) {
        highlight(oneOne, oneTwo, oneThree); //pass winning boxes to highlight
        return e.win = true;
    } else if (e.selectedBoxes.includes('twoOne') && (e.selectedBoxes.includes('twoTwo')) && (e.selectedBoxes.includes('twoThree'))) {
        highlight(twoOne, twoTwo, twoThree)
        return e.win = true;
    } else if (e.selectedBoxes.includes('threeOne') && (e.selectedBoxes.includes('threeTwo')) && (e.selectedBoxes.includes('threeThree'))) {
        highlight(threeOne, threeTwo, threeThree);
        return e.win = true;
    } else if (e.selectedBoxes.includes('oneOne') && (e.selectedBoxes.includes('twoOne')) && (e.selectedBoxes.includes('threeOne'))) {
        highlight(oneOne, twoOne, threeOne);
        return e.win = true;
    } else if (e.selectedBoxes.includes('oneTwo') && (e.selectedBoxes.includes('twoTwo')) && (e.selectedBoxes.includes('threeTwo'))) {
        highlight(oneTwo, twoTwo, threeTwo);
        return e.win = true;
    } else if (e.selectedBoxes.includes('oneThree') && (e.selectedBoxes.includes('twoThree')) && (e.selectedBoxes.includes('threeThree'))) {
        highlight(oneThree, twoThree, threeThree);
        return e.win = true;
    } else if (e.selectedBoxes.includes('oneOne') && (e.selectedBoxes.includes('twoTwo')) && (e.selectedBoxes.includes('threeThree'))) {
        highlight(oneOne, twoTwo, threeThree);
        return e.win = true;
    } else if (e.selectedBoxes.includes('threeOne') && (e.selectedBoxes.includes('twoTwo')) && (e.selectedBoxes.includes('oneThree'))) {
        highlight(threeOne, twoTwo, oneThree);
        return e.win = true;
    } else if ($('.selected').length === 9 && player2.win === false && player2.win === false) {
        game.tie = true;
    } else {
        return false;
    }

}
