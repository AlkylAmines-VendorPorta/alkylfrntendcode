export function cloneTableWidth(table_1_id,table_2_id){
    var td1 = "#" + table_1_id + " td";
    var td2 = "#" + table_2_id + " th";
    var length = document.querySelectorAll(td1).length;
    for(var i=0; i<length;i++){
        document.querySelectorAll(td2)[i].style.width = document.querySelectorAll(td1)[i].offsetWidth+'px';
    }
    // var w1 = document.querySelectorAll("#table_1_id td")[0].offsetWidth;
    // =w1+'px';
    // document.querySelectorAll("#table_1_id td")[0].offsetWidth;
} 