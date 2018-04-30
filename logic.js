const Board = () => {
    const set = new Set();
    const makeBoard = () => {
        var rows = 3;
        var cols = 3;
        var arr = new Array();

        for(var i = 0; i < rows; i++){
            arr[i] = new Array();
            for(var j = 0; j < cols; j++){
                arr[i][j] = "";
                var num = i*10 + j;
                set.add(num);
            }
        }
        return arr;
    }

    // remove the valid state from the r,c
    const removeCell = (row, col) =>
    {   
        var num = row * 10 + col;
        set.delete(num);
    }

    return {removeCell, makeBoard};
};

const Player = () =>
{   
    const x = "X";
    const y = "Y";
   
    //check who has won
    // flag: true = x, false = y
    checkGame = (row, col, flag, board) =>
    {
        var valid_var = flag ? x : y;

        var isWon = true;

        for(var i = 0; i < board.length; i++){
            if(board[row][i] !== valid_var){
                isWon = false;
                break;
            }
        }

        if(isWon){
            return true;
        }

        isWon = true;
        for(var i = 0; i < board.length; i++){
            if(board[i][col] !== valid_var){
                isWon = false;
                break;
            }
        }

        if(isWon){
            return true;
        }

        isWon = true;
        for(var i = 0; i < board.length; i++){
            if(board[i][i] !== valid_var)
            {
                isWon = false;
                break;
            }
        }
        
        if(isWon){
            return true;
        }

        isWon = true;

        for(var i = 0; i < board.length; i++){
            if(board[board.length-1-i][i] !== valid_var)
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
    
     // arrays and objects are passed by reference (by-default) in JS
     // add move to the board
     addMove = (row, col, flag, board) =>
     {  
         // check for errors
         if (row < 0 || row >= board.length)
         {
             alert("invalid row");
             return;
         }
 
         if(col < 0 || col >= board.length)
         {
             alert("invalid column");
             return;
         }
 
         if(board[row][col] !== "" )
         {
             alert("aleary taken");
             return;
         }
 
         if(flag)
         {
             board[row][col] = x;
         } 
         else
         {
            board[row][col] = y;
         }
         
         console.log("before");
         var result = checkGame(row,col,flag,board);
         console.log("after");

         if(result)
         {
             if(flag)
             {
                 return "Player X won";
             }
             return "Player Y won";
         }
         return "go on";
     }
 
    return {addMove};
};


function driver(id)
{      
    console.log(id);
    console.log("here");
}


var test = Board();
var arr = test.makeBoard();

console.log(arr);

var ply1 = Player();
// ply1.addMove(1,1,true,arr);
ply1.addMove(0,0,true,arr);
ply1.addMove(0,1,true,arr);
var result = ply1.addMove(0,2,true,arr);
console.log(result);
console.log(arr);


$( document ).ready(function() {
    document.getElementById("00");
});