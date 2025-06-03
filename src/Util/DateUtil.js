
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


export default function formatDate(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();
    var hh = dt.getHours();
    var mm = dt.getMinutes();

    //    var HH= dt.getHours();
    //    var mm= dt.getMinutes();
    //    var ss= dt.getSeconds();

    return getDoubleDigit(yyyy) + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) + ' '+getDoubleDigit(hh) + ':' + getDoubleDigit(mm);

}
export function formatDateWithoutTime(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();

    return getDoubleDigit(yyyy)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) ;
    //return getDoubleDigit(dd)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(yyyy) ;
}
export function formatDateWithoutTimeNewDate(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        return null
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();

    return getDoubleDigit(yyyy)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) ;

}

export function formatDateWithoutTimeWithMonthName(longDate){
    
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
    var dd = dt.getDate();
    var MM = dt.getMonth();
    var yyyy = dt.getFullYear();

    return  getDoubleDigit(dd) + '-' + month[MM] + '-' + getDoubleDigit(yyyy);
  //return  getDoubleDigit(yyyy) + '-' + month[MM] + '-' + getDoubleDigit(dd) ;

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

export function disablePastDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  export function formatDateWithoutTimeNewDate1(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        return null
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();

    // return getDoubleDigit(yyyy)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) ;
    return   getDoubleDigit(dd) + '-' + getDoubleDigit(MM) + '-' +getDoubleDigit(yyyy) ;
    
}


export function formatDateWithoutTimeNewDate2(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        return null
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();

    // return getDoubleDigit(yyyy)  + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) ;
    return   getDoubleDigit(dd) + '/' + getDoubleDigit(MM) + '/' +getDoubleDigit(yyyy) ;
    
}


export function formatDate1(longDate){
    var dt;
    if (null !== longDate && undefined !== longDate && "" !== longDate) {
        dt = new Date(longDate);
    } else {
        dt = new Date();
    }
    var dd = dt.getDate();
    var MM = dt.getMonth() + 1;
    var yyyy = dt.getFullYear();
    var hh = dt.getHours();
    var mm = dt.getMinutes();
    var ss= dt.getSeconds();

    //    var HH= dt.getHours();
    //    var mm= dt.getMinutes();
    //    var ss= dt.getSeconds();

    return getDoubleDigit(yyyy) + '-' + getDoubleDigit(MM) + '-' + getDoubleDigit(dd) + ' '+getDoubleDigit(hh) + ':' + getDoubleDigit(mm)+ ':' + getDoubleDigit(ss);

}