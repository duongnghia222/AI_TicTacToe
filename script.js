const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const o = 'circle';
const x = 'x';
var youFirst = true; // you go first by default
var ai = o;
var you = x;
var winBlocks = [];
const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winningMessageText =  document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
var origBoard;

restartButton.addEventListener('click', startGame);
var aiMode = false; // noob player by default
var decideMode = document.getElementById('decideMode');
decideMode.addEventListener('change', function(){
    if(this.checked){
        aiMode = true;
    console.log('ai mode');
    }else{
        aiMode = false;
    }
    startGame();
});
var decideTurn = document.getElementById('decideTurn');
decideTurn.addEventListener('change', function(){
    if(this.checked){
        youFirst = false;
        ai = x;
        you = o;
        startGame();
        console.log('ai goes first');
    }
    else{
        youFirst = true;
        ai = o;
        you = x;
        startGame();
    }
});

startGame();


function startGame() {
    setBoardHover(youFirst);
    origBoard = Array.from(Array(9).keys());
    winBlocks = [];
    cellElements.forEach(cell => {
        cell.classList.remove(x);
        cell.classList.remove(o);
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', yourTurn, {once:true})
        cell.innerText = '';
    })
    winningMessageElement.classList.remove('show');
    if(!youFirst){
        aiTurn();
    }
}


function yourTurn(event) {
    var square = event.target.id;
    placeMark(square, youFirst ? x : o);
    if(!checkWin(you, false) && !isDraw()){
        aiTurn();
    }
}

function aiTurn() {
    var spot;
    if(!aiMode){
        var availSpots = emptySquares();
        var random = random_item(availSpots);
        spot = random;
    }else {
        spot = bestSpot();
    }

    
    //placeMark(random, ai);
    placeMark(spot, ai);
}


function placeMark(square, currentPlayer){
    if (typeof origBoard[square] == 'number') {
		origBoard[square] = currentPlayer;
	    document.getElementById(square).innerText = currentPlayer;
        document.getElementById(square).classList.add(currentPlayer); // for css only
        document.getElementById(square).removeEventListener('click', yourTurn, false);
	}
    else{
        console.log("invalid move");
    }
    if (checkWin(currentPlayer)){
        endGame(false, currentPlayer); // it is not a draw 
    } else if(isDraw()){
        endGame(true, currentPlayer); 
    }
}


function random_item(items){
    return items[Math.floor(Math.random()*items.length)];    
}


function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}



function endGame(draw, current) {
    if (draw) {
        winningMessageText.innerText = `Draw !!!`;
    }  else {
        winningMessageText.innerText = `${(current == you) ? "You Win !!!" : "You Lose"}`;
    }
    winningMessageElement.classList.add('show');
    winBlocks.forEach(index =>{
        document.getElementById(index).style.backgroundColor = "green";
    })
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(x) || cell.classList.contains(o)
    })
}


function setBoardHover(youFirst) {
    board.classList.remove(x);
    board.classList.remove(o);
    if(youFirst){
        board.classList.add(x);
    }
    else{
        board.classList.add(o);
    }
}

function checkWin(currentPlayer) {
        win.forEach(c => {
            if (c.every(e =>{
                return cellElements[e].classList.contains(currentPlayer);
            })){
                c.forEach(index => {
                    winBlocks.push(index);
                }) 
            }
            
        })
        return winBlocks.length;
}
    

function aiCheckWin(board, currentPlayer){
        var arr = [];
        for(let i = 0; i < board.length; i++){
            if(board[i] == currentPlayer){
                arr.push(i);
            }
        }
        let aiWin = false;
        win.forEach(c => {
            if(c.every(e => {
                return (arr.indexOf(e) > -1) 
            })){
                aiWin = true;
            }
        })
        return aiWin;    
}

function bestSpot() {
    if(emptySquares().length == 9 && !youFirst){//ai always chooses the corner for the 1st move
        firstMove = [0,2,6,8];
        var corner = firstMove[Math.floor(Math.random()*firstMove.length)];
        return corner;
    }
    return minimax(origBoard, ai, 0).index;
}

function minimax(newBoard, player, depth) {
    var availSpots = emptySquares();
    //base case:
    if (aiCheckWin(newBoard, ai)){
        return {score: (20 - depth)};
    }
    else if (aiCheckWin(newBoard, you)){
        return {score: -(20 - depth)};
    }
    else if(availSpots.length == 0){
        return {score: 0};
    }
    depth += 1;
    //console.log(depth);
    var moves = [];
    for(let i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        if(move.index == 6){
            console.log(newBoard);
        }
        newBoard[availSpots[i]] = player;
        if(player == ai) {
            var res = minimax(newBoard, you, depth);
            move.score = res.score;
        }
        else{
            var res = minimax(newBoard, ai, depth);
            move.score = res.score;
        }
        // backtracking
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    var bestMove;
    if(player == ai) {
        var bestScore = -99999;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else{
        var bestScore = 99999;
        for(let i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];

}