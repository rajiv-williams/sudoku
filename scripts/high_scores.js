$(document).ready(function(){
    let table = $('#high_scores');
    let array = [{"date": "2021/03/02", "duration": "2:51"},
                {"date": "2022/02/24", "duration": "3:40"}];

    //TODO: replace 'array' with listHS when done with time functions
    buildHighScores(table,array);

    //document.getElementById("printout").innerHTML = 0;
})


//Dynamically creates the High Scores Table
function buildHighScores(table,array){
    
    //Adding headers to the table
    var firstRow = $('<tr>');
    for(i=0;i<2;i++){
        var th = $('<th>');

        //date header processing
        if(i == 0){
            th.attr('id','date_header');
            th.text("Date");
            firstRow.append(th);
        }

        //duration header processing
        if(i == 1){
            th.attr('id','duration_header');
            th.text("Duration");
            firstRow.append(th); 
        }
    }
    table.append(firstRow);
    
    //Adding data to the high scores table
    for(i=0; i<array.length; i++){
        var tr = $('<tr>');
        for(j=0; j<2; j++){
            var td = $('<td>');
            //processing date
            if(j==0){
                td.attr('id', 'date' + i);
                td.text(array[i].date);  
                tr.append(td);
            }

            //processing duration
            if(j==1){
                td.attr('id', 'duration' + i);
                td.text(array[i].duration);  
                tr.append(td);
            }            
        }
        
        table.append(tr);
    }
}