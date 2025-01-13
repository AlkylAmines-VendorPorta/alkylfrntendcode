

  export function searchTableData() {
    var input, filter, table, tr, td, i, t;
    input = document.getElementById("SearchTableDataInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("DataTableBody");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      var filtered = false;
      var tds = tr[i].getElementsByTagName("td");
      for(t=0; t<tds.length; t++) {
          var td = tds[t];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              filtered = true;
            }
          }     
      }
      if(filtered===true) {
          tr[i].style.display = '';
      }
      else {
          tr[i].style.display = 'none';
      }
    }
  }
  export function searchTableDataTwo() {
    var input, filter, table, tr, td, i, t;
    input = document.getElementById("SearchTableDataInputTwo");
    filter = input.value.toUpperCase();
    table = document.getElementById("DataTableBodyTwo");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      var filtered = false;
      var tds = tr[i].getElementsByTagName("td");
      for(t=0; t<tds.length; t++) {
          var td = tds[t];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              filtered = true;
            }
          }     
      }
      if(filtered===true) {
          tr[i].style.display = '';
      }
      else {
          tr[i].style.display = 'none';
      }
    }
  }
  export function searchTableDataThree() {
    var input, filter, table, tr, td, i, t;
    input = document.getElementById("SearchTableDataInputThree");
    filter = input.value.toUpperCase();
    table = document.getElementById("DataTableBodyThree");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      var filtered = false;
      var tds = tr[i].getElementsByTagName("td");
      for(t=0; t<tds.length; t++) {
          var td = tds[t];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              filtered = true;
            }
          }     
      }
      if(filtered===true) {
          tr[i].style.display = '';
      }
      else {
          tr[i].style.display = 'none';
      }
    }
  }
  export function searchTableDataFour() {
    var input, filter, table, tr, td, i, t;
    input = document.getElementById("SearchTableDataInputFour");
    filter = input.value.toUpperCase();
    table = document.getElementById("DataTableBodyFour");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      var filtered = false;
      var tds = tr[i].getElementsByTagName("td");
      for(t=0; t<tds.length; t++) {
          var td = tds[t];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              filtered = true;
            }
          }     
      }
      if(filtered===true) {
          tr[i].style.display = '';
      }
      else {
          tr[i].style.display = 'none';
      }
    }
  }
  export function searchTableDataInternalUser() {
    var input, filter, table, tr, td, i, t;
    input = document.getElementById("SearchTableDataInputInternalUser");
    filter = input.value.toUpperCase();
    table = document.getElementById("DataTableBodyInternalUser");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      var filtered = false;
      var tds = tr[i].getElementsByTagName("td");
      for(t=0; t<tds.length; t++) {
          var td = tds[t];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              filtered = true;
            }
          }     
      }
      if(filtered===true) {
          tr[i].style.display = '';
      }
      else {
          tr[i].style.display = 'none';
      }
    }
  }