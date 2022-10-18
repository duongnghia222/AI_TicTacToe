
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const o = 'circle';
const x = 'x';
let circleTurn;
const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const winningMessageText =  document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
/* #################3  */
// const cells = document.querySelectorAll('.cell');

var origBoard;
/* #################3  */
restartButton.addEventListener('click', startGame);

startGame();

// function findAvailableSpot() {
//     let available = [];
//     cellElements.forEach(cell => {
//         if (cell.classList.contains(x) || cell.classList.contains(o)){
//             available.add()
//         }
//     })
// }

function startGame() {
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cellElements.length; i++) {
		cellElements[i].innerText = '';
    }
    //console.log(typeof(cellElements[1]));
//#######################33 
    cellElements.forEach(cell => {
        cell.classList.remove(x);
        cell.classList.remove(o);
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', handleClick, {once:true})
    })
    circleTurn = true;
    setBoardHover();
    winningMessageElement.classList.remove('show');
}

function handleClick(event) {
    var square = event.target.id;
    const current = circleTurn ? o : x;
    console.log(`${current}'s turn`);
    placeMark(square, current);
    circleTurn = !circleTurn;
    if(!checkWin(o) && !isDraw()){
        var availSpots = emptySquares();
        var random = random_item(availSpots);
        placeMark(random, x);
        circleTurn = !circleTurn;
    }
    setBoardHover();
}

function placeMark(square, current){
    if (typeof origBoard[square] == 'number') {
		origBoard[square] = current;
	    document.getElementById(square).innerText = current;
        document.getElementById(square).classList.add(current); // for css only
        document.getElementById(square).removeEventListener('click', handleClick, false);
	}
    else{
        console.log("invalid move");
    }

    if (checkWin(current)){
        endGame(false); // it is not a draw 
    } else if(isDraw()){
        endGame(true); 
    }
    
}


function random_item(items)
{
  
return items[Math.floor(Math.random()*items.length)];
     
}


function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {

}



function endGame(draw) {
    if (draw) {
        winningMessageText.innerText = `Draw !!!`;
    }  else {
        winningMessageText.innerText = `${circleTurn ? "You Win !!!" : "You Lose"}`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(x) || cell.classList.contains(o)
    })
}




function setBoardHover() {
    board.classList.remove(x);
    board.classList.remove(o);
    if(circleTurn){
        board.classList.add(o);
    }
    else{
        board.classList.add(x);
    }
}

function checkWin(current) {
    // return win.some(c => {
    //     return c.every(index => {
    //         return cellElements[index].classList.contains(current)
    //     })
    // })
    let isWin = false;
    win.forEach(c => {
            if (c.every(e =>{
                return cellElements[e].classList.contains(current);
            })){
                isWin = true;
                c.forEach(index => {
                    document.getElementById(index).style.backgroundColor = "green";
                })
            }
            
    })
    
    return isWin;
}