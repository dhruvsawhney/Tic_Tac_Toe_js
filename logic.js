const table = document.getElementById("game");

// to know the player
var flag = true;

// COMMENT OUT FOR AI MODE
// const gameMode = document.getElementById("gameMode")
// var isAIMode = false;


// key1: 'game' for normal version of the game
// key2: 'ai' for the ai mode of the game

const state = {
	storage : localStorage,
	getData : function(key)
	{
		if (this.storage.getItem(key)) {
			return JSON.parse(this.storage.getItem(key)); 
		} else {
            // store the entire object
            return new Board();
		}
	},
    // pass the board state
    // input: the Board state
	saveData: function(key, obj)
	{	

        // stringify before storing data
        strObj = JSON.stringify(obj);
        // console.log("saved data is: ")
        // console.log(strObj)
		this.storage.setItem(key,strObj);
    },
    
    removeData: function(key)
    {
        this.storage.removeItem(key);
    }
}

class Board {
    constructor() {
        this.board = function () {
            var rows = 3;
            var cols = 3;
            var arr = new Array();

            for(var i = 0; i < rows; i++){
                arr[i] = new Array();
                for(var j = 0; j < cols; j++){                
                    arr[i][j] = "";
                }
            }
            return arr;
        }();
        // control the remaining number of valid cells on the board
        this.validCells = ["00","01","02","10","11","12","20","21","22"];
        
        // X is first person
        // true -> x, false -> y
        // true means user goes first and gets X
        // false means comp goes first and gets X
        this.flag = true;
        this.player = this.flag ? 'x':'o';
        this.opponent = this.flag ? 'o' : 'x';
        this.isAIMode = false;

        this.count = 0;
    }
    // set the board,validCells, count
    setData(board, validCells, isAIMode){
        this.board = board;
        this.validCells = validCells;
        this.isAIMode = isAIMode;
    }
    
    setPlayer(bool)
    {
        if(bool){
            this.flag = true;
            this.player = 'x'
            this.opponent = 'o'
        } else {
            this.flag = false;
            this.player = 'o'
            this.opponent = 'x'
        }
    }

    // check if the game has been won
    checkGame (rcPair, flag, checkOpp)
    {   

        var row = parseInt(rcPair.charAt(0));
        var col = parseInt(rcPair.charAt(1));

        var valid_var = flag ? 'x' : 'o';
        
        // flip the valid_var to check if the opponent has won
        if(checkOpp){
            if(valid_var === 'x'){
                valid_var = 'o';
            } else{
                valid_var = 'x';
            }
        }

        var isWon = true;

        for(var i = 0; i < this.board.length; i++){
            if(this.board[row][i] !== valid_var){
                isWon = false;
                break;
            }
        }

        if(isWon){
            return true;
        }

        isWon = true;
        for(var i = 0; i < this.board.length; i++){
            if(this.board[i][col] !== valid_var){
                isWon = false;
                break;
            }
        }

        if(isWon){
            return true;
        }

        isWon = true;
        for(var i = 0; i < this.board.length; i++){
            if(this.board[i][i] !== valid_var)
            {
                isWon = false;
                break;
            }
        }
        
        if(isWon){
            return true;
        }

        isWon = true;

        for(var i = 0; i < this.board.length; i++){
            if(this.board[this.board.length-1-i][i] !== valid_var)
            {
                isWon = false;
                break;
            }
        }

        if(isWon){
            return true;
        }

        return false;
    }
    
    removeValidCell(rcPair){
        var index = this.validCells.indexOf(rcPair);

        var arr1 = this.validCells.slice(0,index)
        var arr2 = this.validCells.slice(index+1)

        this.validCells = arr1.concat(arr2);

    }


    // add cell to board and remove it from ValidCells list
    addCell(rcPair,flag)
    {   
        // not a valid element
        if(!this.validCells.includes(rcPair)){
            return false;
        }
        
        var r = parseInt(rcPair.charAt(0));
        var c = parseInt(rcPair.charAt(1));

        if(flag){
            this.board[r][c] = 'x';
        } else {
            this.board[r][c] = 'o';
        }

        var index = this.validCells.indexOf(rcPair);

        var arr1 = this.validCells.slice(0,index)
        var arr2 = this.validCells.slice(index+1)

        this.validCells = arr1.concat(arr2);
        
        return true;
    }

    // overload for AI
    addCellAI(rcPair){
        if(!this.validCells.includes(rcPair)){
            return false;
        }

        var index = this.validCells.indexOf(rcPair);

        var arr1 = this.validCells.slice(0,index)
        var arr2 = this.validCells.slice(index+1)

        this.validCells = arr1.concat(arr2);
        
        return true;
    }

    // evaluation function should be static
    evaluate(flag) {
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                var r = i.toString();
                var c = j.toString();
                var rcPair = r + c;
                // check if Comp has won
                if(this.checkGame(rcPair,flag,false)){
                    // console.log(i.toString() + " " +  j.toString() + " " + "10")
                    return 10;
                }
                // check if opponent has won
                if(this.checkGame(rcPair,flag,true)){
                    // console.log(i.toString() + " " +  j.toString() +" " + "-10")
                    return -10;
                }
            }
        }
        // ends in a tie
        return 0;
    }

    checkOver(){
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                if(this.board[i][j] !== ""){
                    return false;
                }
            }
        }
        return true;
    }

    isOpen(i,j){
        return this.board[i][j] === "";
    }

    // the flag wrt comp ('x')
    minimax(depth,isMaxPlayer){
        var score = this.evaluate(this.flag);

        if(score === 10){
            return 10;
        }

        if(score === -10){
            return -10
        }

        if(this.checkOver){
            return 0;
        }

        if(isMaxPlayer){
            var bestMax = -10000;

            for(let i = 0; i < this.board.length; i++){
                for(let j = 0; j < this.board[i].length; j++){
                    
                    if(this.isOpen(i,j)){
                        
                        this.board[i][j] = this.player;
                        isMaxPlayer = !isMaxPlayer
                        var score = this.minimax(depth +1, isMaxPlayer);
                    
                        this.board[row][col] = "";

                        if(score > bestMax){
                            bestMax = score
                            }
                        }
                    }
                }
                return bestMax;
            
            } else {
                var bestMin = 10000;
                for(let i = 0; i < this.board.length; i++){
                    for(let j = 0; j < this.board[i].length; j++){
                        
                        if(this.isOpen(i,j)){

                            this.board[i][j] = this.opponent;
                            
                            isMaxPlayer = !isMaxPlayer

                            console.log(this.board)
                            var score = this.minimax(depth +1, isMaxPlayer);
                            
                            this.board[row][col] = "";

                            if(score < bestMin){
                                bestMin = score
                                }
                            }
                        }
                    }
                return bestMin;
        }
        
    }

    findMove(){
        var bestRow = -1;
        var bestCol = -1;
        var bestScore = -1000000;
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){

                if(this.isOpen(i,j)){

                    this.board[i][j] = this.player;
            
                    var score = this.minimax(0,false);
                    if(score > bestScore){
                        bestRow = i;
                        bestCol = j;
                        bestScore = score;
                    }
                    this.board[i][j] = "";
                }
            }
        }

        return [bestRow,bestCol,bestScore];
    }            
}

// Clear all the data
function reset() {
    state.removeData('game');
    location.reload();
}


// https://zeit.co/blog/async-and-await
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  
 table.addEventListener('click',(e)=> 
{   

        var cell = e.target;
    
        var persist = state.getData('game');

        var board_obj = new Board()
        board_obj.setData(persist.board,persist.validCells, persist.isAIMode)
        
        //  lines above are common to both the branches
        var AIBranch = board_obj.isAIMode;

        if(AIBranch) {

            var x_or_o = null;

            if(board_obj.count%2 === 0){ // comp turn
                var lst = board_obj.findMove();
                
                var r = lst[0].toString();
                var c = lst[1].toString();
                var rcPair = r + c;

                board_obj.addCellAI(rcPair)
                x_or_o = 'x';

            } else { // user turn 
                var isValid = board_obj.addCellAI(cell.id)

                if(isValid){ // user clicked open cell
                    x_or_o = 'o';
                } else { // break the function
                    return;
                }
            }
            board_obj.count +=1;
            
            state.saveData('game');

            const h = document.createElement('h1');
            h.align = "center";
            var t = document.createTextNode(x_or_o);
            h.appendChild(t)
            cell.appendChild(h);



        } else {
            var isValid = board_obj.addCell(cell.id,flag);

            if(isValid)
            {   
                const h = document.createElement('h1');
                h.align = "center";

                if(flag){
                    
                    var t = document.createTextNode("x");
                    h.appendChild(t);

                } else {
                    var t = document.createTextNode("o");
                    h.appendChild(t);
                }
                
                cell.appendChild(h);
            }

            state.saveData('game',board_obj);

            var result = board_obj.checkGame(cell.id,flag);

            if(!result && board_obj.validCells.length === 0){
                alert("it's a tie!");
            }

            if(result){
                if(flag){
                    alert("Player 1 has won");
                } else{
                    alert("Player 2 has won");
                }
                // sleep for user effect
                sleep(1000).then(() => {
                reset();
                })
            }
            

            if(flag === true){
                flag = false;
            } else {
                flag = true;
            }
        }

    })




// 1 : user goes first
// 2 : comp goes first
function ai(){

    reset()
    var input = prompt("Choose 1 to go first or 2 for comp to go first")
    // santize user input
    input = input.replace(/\s+/g, '');
    if(input === "1" || input === "2"){
        var board_obj = new Board();
        
        // // the global var Flag
        // flag = "1" ? true : false;
        
        board_obj.isAIMode = true;

        state.saveData('game',board_obj);
    } else {
        alert("invalid input, please try again")
        
    }
    console.log(state.getData('game'))
}


// gameMode.addEventListener('click',(e)=> {
//     e.preventDefault();

//     const btn = e.target

//     if(btn.textContent === "AI mode"){

//         var bool = true

//         while(bool){
//             var input = prompt("Choose 1 to go first or 2 for comp to go first")
//             // santize user input
//             input = input.replace(/\s+/g, '');
//             if(input === "1" || input === "2"){
//                 var board_obj = new Board();
//                 // the global var Flag
//                 flag = "1" ? true : false;
//                 board_obj.isAIMode = true;
//                 state.saveData('game',board_obj);
//                 bool = false;
//             } else {
//                 alert("invalid input, please try again")       
//             }
//         }

//         btn.textContent = "User mode"

//     } else {
//         btn.textContent = "AI mode"
//     }

//     console.log(state.getData('game'))
// })


// b = new Board();
// b.board[0][0] = 'x'
// b.board[0][1] = 'o'
// b.board[0][2] = 'x'
// b.board[1][0] = 'o'
// b.board[1][1] = 'o'
// b.board[1][2] = 'x'
// console.log(b.board)

// var move = b.findMove()
// console.log(move)





// Sessions work

// var test = state.getData();
// test.board[0][0] = "aa";
// console.log(test.board);
// state.saveData(test);

// console.log("Retrieve data")
// console.log(state.getData())
// console.log("clear data")
// state.removeData();
// console.log(state.getData())
