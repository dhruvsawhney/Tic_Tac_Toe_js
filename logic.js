

// const g = {

// 	storage : localStorage,

// 	getData : function()
// 	{
// 		if (this.storage.getItem('game')) {
// 			return JSON.parse(this.storage.getItem('game')); 
// 		} else {
//             // store the entire object
//             return {'game': Board()};
// 		}
// 	},

//     // pass the board state
//     // input: the Board state
// 	saveData: function(obj)
// 	{	
// 		// set this for storage

//         // stringify before storing data
//         console.log("Saving the obj");
//         console.log(obj);

//         var hash  = {'game' : obj}
//         hash = JSON.stringify(hash) 
//         console.log("before str")
//         console.log(hash);
// 		this.storage.setItem('game',hash);
// 	}
// }


const Board = () => {
    
    const set = [];
    const makeBoard = () => {
        set.push("00");
        set.push("01");
        set.push("02");

        var rows = 3;
        var cols = 3;
        var arr = new Array();

        for(var i = 0; i < rows; i++){
            arr[i] = new Array();
            for(var j = 0; j < cols; j++){                
                arr[i][j] = "";
                if(i != 0){
                    var num = i*10 + j;
                    set.push(num.toString());
                }
            
            }
        }
        return arr;
    }


    // remove the valid state from the r,c
    removeCell = (row, col) =>
    {   
        var num = row * 10 + col;
        set.delete(num);
    }

    // the actual board
    const b_obj = makeBoard();


    const cell_isActive = (rcNum) =>
    {
        return set.includes(rcNum);
    }

    return {removeCell, cell_isActive};
};


var b = Board();


// $( document ).ready(function() {
    
//     console.log(b);
//     console.log(b.cell_isActive("00"));
//     // g.saveData(b);

//     // var getGame = g.getData();
//     // console.log(getGame['game'])

// });




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
    
    // call on active state of an object
    // console.log("here");

    var num = parseInt(id);
    var col = num%10;
    var row = (num/10)%10;

    console.log("here");
    // var hash = g.getData();
    // console.log(hash);

    // var board_obj = hash['game'];

    // console.log(board_obj);

    if (b.cell_isActive(num) === false){
        return;
    }

    b.removeCell(row,col);

    document.getElementById(id).innerHTML = "X";

    console.log("call");
    // game.saveData(board_obj);

}


$( document ).ready(function() {
    

    // // game.getData();

    // // returns a HashMap
    // var board_obj = game.getData();
    // var arr = board_obj['game'].b_obj

    // console.log(arr);

    // var ply1 = Player();
    // ply1.addMove(1,1,true,arr);
    // console.log(arr)

    // // save the data
    // game.saveData(board_obj);

    // var board_obj = game.getData();

    // var arr = board_obj['game'].b_obj

    // console.log(arr);

});

