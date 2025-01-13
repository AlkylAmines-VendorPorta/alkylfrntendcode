export function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

export function isEmptyDeep(val){
    return (val === undefined || val == null || val.length <= 0 || (val && Object.keys(val).length === 0 && val.constructor === Object)) ? true : false;
}

// keypress event for alphanumeric with space
export  function alphaNumericWithSpace(event){
    let k= (event.which) ? event.which : event.keyCode;
    let  ok = ((k >= 48 && k <= 57) || k===127 || k===8 ||  (k >= 65 && k <= 90) ||  (k >= 97 && k <= 122) || k===127 || k===9 || k===32); 
       if (!ok) {
         event.preventDefault();
        event.target.title='Cannot Enter Special Characters.';
      }
}
// keypress event for alphanumeric
export  function alphaNumeric(event){
    let k= (event.which) ? event.which : event.keyCode;
    let  ok = ((k >= 48 && k <= 57) || k===127 || k===8 ||  (k >= 65 && k <= 90) ||  (k >= 97 && k <= 122) || k===127 || k===9); 
       if (!ok) {
         event.preventDefault();
        event.target.title='Cannot Enter Special Characters.';
      }
}

// Restrict to enter letters in Number field
export function onlyNumber(event){
        var k = (event.which) ? event.which : event.keyCode;
        var ok = ((k >= 48 && k <= 57) || k===127 || k===8 || k===9); 
     
        if (!ok){
            event.preventDefault();
            event.target.title='Enter only Number.';
        }
}
    
// decimal number allowed 
export function decimalNumber(event){
        var k = (event.which) ? event.which : event.keyCode;
        var ok = ((k >= 48 && k <= 57) || k===127 || k===8 || k===46 || k===9); 
     
        if (!ok){
            event.preventDefault();
            event.target.title='Can enter Decimal Number.';
        }
}
	
// Restrict to enter number in Alphabet field
export function requiredalphabetics(event){
        var k = (event.which) ? event.which : event.keyCode;
        var ok = ((k >= 65 && k <= 90) ||  (k >= 97 && k <= 122) || k===127 || k===8 || k===9); 
     
        if (!ok){
            event.preventDefault();
            event.target.title='Cannot enter numbers';
        }
}
	
// Restrict to enter number in Alphabet and space field
export function requiredalphabeticsWithSpace(event){
        var k = (event.which) ? event.which : event.keyCode;
        var ok = ((k >= 65 && k <= 90) || (k >= 97 && k <= 122) || k===127 || k===8 || k===32 || k===9); 
     
        if (!ok){
            event.preventDefault();
            event.target.title='Cannot enter numbers';
        }
} 

 