const table = document.getElementById("game");
// to know the player
var flag = true;

const state = {
	storage : localStorage,
	getData : function()
	{
		if (this.storage.getItem('game')) {
			return JSON.parse(this.storage.getItem('game')); 
		} else {
            // store the entire object
            return new Board();
		}
	},
    // pass the board state
    // input: the Board state
	saveData: function(obj)
	{	

        // stringify before storing data
        strObj = JSON.stringify(obj);
        // console.log("saved data is: ")
        // console.log(strObj)
		this.storage.setItem('game',strObj);
    },
    
    removeData: function()
    {
        this.storage.removeItem('game');
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
        this.validCells = ["00","01","02","10","11","12","20","21","22"];
        // true -> x, false -> y
        this.flag = true;
        this.player = this.flag ? 'x':'o';
        this.opponent = this.flag ? 'o' : 'x';
        this.count = 0;
    }

    setData(board, validCells){
        this.board = board;
        this.validCells = validCells;
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

    // evaluation function should be static
    evaluate(flag) {
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                var r = i.toString();
                var c = j.toString();
                var rcPair = r + c;
                if(this.checkGame(rcPair,flag,false)){
                    return 10;
                }
        
                if(this.checkGame(rcPair,flag,true)){
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

    // the flag
    minimax(depth,isMaxPlayer){
        if(this.checkOver){
            return this.evaluate(this.flag)
        } else {

            if(isMaxPlayer){
                var bestMax = -10000;

                for(let i = 0; i < this.board.length; i++){
                    for(let j = 0; j < this.board[i].length; j++){
                        
                        if(this.isOpen(i,j)){
                            
                            this.board[i][j] = this.player;

                            var score = this.minimax(depth +1, !isMaxPlayer);
                        
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
    
                                var score = this.minimax(depth +1, !isMaxPlayer);
                                
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
    }

    findMove(){
        var bestRow = -1;
        var bestCol = -1;
        var bestScore = -1;
        // console.log(this.validCells)
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                this.board[i][j] = this.player;
            
                var score = this.minimax(0,true);
                if(score > bestScore){
                    bestRow = row;
                    bestCol = col;
                }
        
                this.board[row][col] = "";
            }
        }
               
    }        
        
    
    
}

// Clear all the data
function reset() {
    state.removeData();
    location.reload();
}


// https://zeit.co/blog/async-and-await
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  
 table.addEventListener('click',(e)=> 
{   

    // console.log(flag);

    var cell = e.target;

    console.log(cell);
    
    // get the data

    var persist = state.getData();

    var board_obj = new Board()
    board_obj.setData(persist.board,persist.validCells)

    // console.log(persist);
    
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

    state.saveData(board_obj);

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

})


// Debug AI
b = new Board();
b.findMove()

// var array = [2, 5, 9];
// var index = array.indexOf(5);
// if (index > -1) {
//   array.splice(index, 1);
// }

// console.log(array)


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
