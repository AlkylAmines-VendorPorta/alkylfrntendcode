
var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";


export default function formatDate(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;
}

export function formatDateWithoutTime(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;
}
export function formatDateWithoutTimeNewDate(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;

}

export function formatDateWithoutTimeWithMonthName(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;

}

export function getDoubleDigit(value){
    var nmr = Number(value);
    var intPart = Math.floor(nmr / 10);
    if (intPart === 0) {
        return value = "0" + value;
    } else {
        return value;
    }
}

export function formatDateToISOS(longDate){
    
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
    return  dt.toISOString().replace('Z', '');
}

export function formatTime(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
  //  var dd = dt.getDate();
    //var MM = dt.getMonth() + 1;
    //var yyyy = dt.getFullYear();
    //var hh = dt.getHours();
    //var mm = dt.getMinutes();

        var HH= dt.getHours();
        var mm= dt.getMinutes();
        var ss= dt.getSeconds();

    return getDoubleDigit(HH) + ':' + getDoubleDigit(mm)+ ':' + getDoubleDigit(ss);

}

export function disablePastDate(inputDate) {
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;
  };

  export function formatDateWithoutTimeNewDate1(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;
    
}


export function formatDateWithoutTimeNewDate2(inputDate){
    // var dt;
    // if (null !== longDate && undefined !== longDate && "" !== longDate) {
    //     dt = new Date(longDate);
    // } else {
    //     return null
    // }
    // var dd = dt.getDate();
    // var MM = dt.getMonth() + 1;
    // var yyyy = dt.getFullYear();

    // // return getDoubleDigit(yyyy)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) ;
    // return   getDoubleDigit(dd) + '/' + getDoubleDigit(MM) + '/' +getDoubleDigit(yyyy) ;
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;
    
}


export function formatDate1(inputDate){
    const date = new Date(inputDate);

    if (isNaN(date)) return ""; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()); // Get last 2 digits
  
    return `${day}/${month}/${year}`;

}