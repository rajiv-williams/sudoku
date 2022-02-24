//Author: Rajiv Williams
//Date: February 24, 2022

$(document).ready(function(){

    //Initialize board and palette (with undo button)
    let board = $('#board');
    let palette = $('#palette');
    const img = $('#undo_button');
    let winner = $('#winner');
    winner.attr('class','hidden');

    let bArray = createBoard(board);
    createPalette(palette,img);    

    //start total game time
        //TODO
    
    //check winning condition
    if(gameDone(bArray)){
        //stop total game time
            //TODO

        //add high score ()
            //TODO

        //show winning condition
        winner.removeAttr('class');
        winner.text("CONGRATULATIONS!")

        //unhide a "PLAY AGAIN" button that refreshes screen
        //unhide a "VIEW HIGH SCORES" button
    }
    //document.getElementById("printout").innerHTML = error;
})

//---GLOBAL VARIABLES---

let paletteValue = ''; 
let gameSize = 9;
let allMoves = new Array(gameSize*gameSize);
let currentMove = 0;
let error = false;
let listHS = new Set();

//---TIMING FUNCTIONS---
// function addHighScore(timeTaken){
//     var d = new Date();
//     listHS.add({"date": d.getFullYear()+"/"+d.getMonth()+1+"/"+getDate(), "duration": timeTaken});
// }

// -------HELPER FUNCTIONS--------

//Returns a 2 dimensional array for the sudoku board numbers
function make2DArray(size){
    var array = new Array(size);

    for(i=0; i<size; i++){
        array[i] = new Array(size);
    }

    return array;
}

//Returns an array of numbers from 1-9 in a random order, 
//with no number duplication
function randomDistinctArray(size){
    var nums = new Array(size);

    for(i=0;i<size;i++){
        var ran;

        //generate random numbered list with distinct numbers
        while(nums.includes(ran)){
            ran = Math.floor((Math.random()*size) + 1);
        }

        nums[i] = ran;

    }
    return nums;
}

// -------CONSTRAINTS--------

function sameBlock(x1, y1, x2, y2) {
    let firstRow = Math.floor(x1 / 3) * 3;
    let firstCol = Math.floor(y1 / 3) * 3;
    return (x2 >= firstRow && x2 <= (firstRow + 2) && y2 >= firstCol && y2 <= (firstCol + 2));
}
 
function sameRow(x1, y1, x2, y2) {
    return y1 == y2;
}
 
function sameColumn(x1, y1, x2, y2) {
    return x1 == x2;
}

//--------GAME MOVE LOGIC--------

function makeMoves(td,bn){
    
    //array to hold the current conflicting cells periodically,
    //also storing if they were played by the user (bool)
    var conflictingCells = new Array(3);

    //index used to iterate through the conflicting cells
    var confIndex = 0;

    //if cell is available        
        td.click(function(){
            var selectedCell = td.attr('id');
            var cell = String(selectedCell);
            var row = parseInt(cell[4]);
            var col = parseInt(cell[5]);
            if((paletteValue !== '')){
                if((!error)){
                    td.text(paletteValue);
                    td.attr('class','user-input');
                    //alert(selectedCell);
                    for(i=0;i<gameSize;i++){
                        for(j=0;j<gameSize;j++){
                            //if there are conflicting cells
                            if(((sameBlock(row,col,i,j))||
                                (sameRow(row,col,i,j))||
                                (sameColumn(row,col,i,j)))&&
                                (bn[i][j]==parseInt(paletteValue))&&
                                (selectedCell !== 'cell'+i+j)){

                                //make selected cell red
                                td.attr('class','error');
                                
                                //make conflicting cells red
                                conflictingCells[confIndex] = $('#cell' + i + j);
                                conflictingCells[confIndex].attr('class','error');
                                confIndex++;
                                
                                //making it known there is an error that needs to be handled
                                error = true;
                                
                            }
                            else{
                                //storing current move
                                allMoves[currentMove] = td; 

                                //update board numbers in the program for logic purposes
                                bn[row][col] = parseInt(paletteValue);  

                                currentMove++;
                            }
                        }
                    }
                    
                    
                }
                else{alert("PRESS UNDO TO FIX ERROR");}
            }
            else{alert("SELECT A NUMBER FROM THE PALETTE");}   
        });
        $('#undo_button').click(function(){
            //if there was a previous move
            if(allMoves[currentMove-1] != null){

                //remove all changes from the previous move
                var previousMove = allMoves[currentMove-1];
                previousMove.removeAttr('class');
                previousMove.text('');

                var cellToRemove = String(previousMove.attr('id'));
                var row_index = parseInt(cellToRemove[4]);
                var col_index = parseInt(cellToRemove[5]);
                bn[row_index][col_index] = -1;

                //removing the red from all conflicting cells
                for(i=0;i<conflictingCells.length;i++){
                    if(conflictingCells[i] != null){
                        conflictingCells[i].removeAttr('class');
                    }  
                }

                confIndex = 0;
                error = false;
                currentMove--;
            }
        });           
}

//add reset button to top of game board
function reset(){

}

//--------SUDOKU BOARD CREATION---------

//Generates a Random Sudoku Board
function generateBoardNumbers(){

    //PRE-DETERMINED CELLS TO PLACE NUMBERS
    var coords = [[[0,1],[4,6],[6,2]],  //a -first random number assigned here
                    [[4,0],[1,6]],      //b
                    [[7,1],[3,7]],      //c
                    [[4,4],[1,2]],      //d
                    [[2,5]],            //e
                    [[6,6]],            //f
                    [[8,2]],            //g
                    [[6,3],[2,2],[7,7]],//h
                    [[0,7]]]            //i  -last random number assigned here  


    //---RANDOM NUMBER GENERATION---

    var result = make2DArray(gameSize);
    var nums = randomDistinctArray(gameSize);

    //Randomly placing numbers into the designated cells
    for(i=0;i<gameSize;i++){
        for(j=0;j<coords[i].length;j++){
            var row = coords[i][j][0];
            var col = coords[i][j][1];
            result[row][col] = nums[i];
        }
    }
    
    return result;
}

//Dynamically creates the Sudoku Board
function createBoard(board){
    var bn = generateBoardNumbers();
    //Assigning cells to 'board'
    for(i=0; i<gameSize; i++){
        var tr = $('<tr>');
        for(j=0; j<gameSize; j++){
            var td = $('<td>');
            td.attr('id', 'cell' + i + j);
            //if cell is supposed to start with a number
            if(bn[i][j] != null){
                td.text(bn[i][j]);
            }
            //if cell is supposed to start blank
            else{
                //td.click(boardClick);
                bn[i][j] = -1;               
            }
            if(bn[i][j]==-1){
                makeMoves(td,bn,i,j);  
            }
            tr.append(td);
        }
        
        board.append(tr);
    }

    return bn;
}

//Dynamicaly creates the palette for the Sudoku board
function createPalette(palette,img){
    var previousClick = null;
    for(i=0; i<1; i++){
        var tr = $('<tr>');
        for(j=1; j<10; j++){
            var td = $('<td>');
            td.attr('id', 'pal' + j);
            td.text(j);
            td.click(function(){
                if(previousClick != null){
                    previousClick.removeAttr('class');
                }
                paletteValue = $(this).text();
                previousClick = $(this);
                $(this).attr('class','selected');
                //alert('SELECTED: '+ $(this).text());
            })
            tr.append(td);

            //adding undo button
            if(j == 9){
                tr.append(img);
            }
        }
        palette.append(tr);
    }
}

//------GAME WINNING CONDITION-----

function gameDone(array){
    if(error){
        return false;
    }
    for(i=0;i<gameSize;i++){
        for(j=0;j<gameSize;j++){
            if(array[i][j]== -1){
                return false;
            }
        }
    }
    return true;
}

// -------EXTRA FUNCTIONS--------

// //Returns the column in the Sudoku Board, given the index
// function getColumn(array,index){
//     var result = new Array(gameSize);
//     for(i=0;i<gameSize;i++){
//         result[i] = array[i][index];
//     }
//     return result;
// }

// //Finds the range (which block area) in which a dimension belongs on the Sudoku board
// //ROW: 0-2 3-5 6-8
// //COL: 0-2 3-5 6-8
// function findRange(dimension){
//     var step = blockLen-1;
//     var start = 0;
//     var end = 0;
//     var range = new Array(blockLen);
//     for(var i=0;i<gameSize;i++){
//         start = i;
//         end = i+step;
//         if((dimension >= start) && (dimension <= end) && (i % blockLen == 0)){
//             break;
//         }
        
//     }
//     for(i=start;i<end+1;i++){
//         range[i-start] = i;
//     }

//     return range;
// }