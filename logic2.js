
const table = document.getElementById("game");

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
        console.log(strObj);
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
    }

    //check who has won
    // flag: true = x, false = y

    checkGame (row, col, flag)
    {
        var valid_var = flag ? x : y;

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
    
    addCell(rcPair)
    {   
        // not a valid element
        if(!this.validCells.includes(rcPair)){
            return false;
        }
        
        var index = this.validCells.indexOf(rcPair);

        var arr1 = this.validCells.slice(0,index)
        var arr2 = this.validCells.slice(index+1)

        this.validCells = arr1.concat(arr2);
        
        return true;
    }
}

// the board object
// const b = new Board();
// console.log(b)
// console.log(b.addCell("01"));
// console.log(b.addCell("00"));



table.addEventListener('click',(e)=> 
{
    var cell = e.target;
    console.log(cell);


    // var r = parseInt(cell.id.charAt(0))
    // var c = parseInt(cell.id.charAt(1))

    
    // get the data

    var board_obj = state.getData();
    var isValid = board_obj.addCell(cell.id);

    if(isValid)
    {   
        console.log("here");
        cell.textContent = 'x';
    }


})


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
