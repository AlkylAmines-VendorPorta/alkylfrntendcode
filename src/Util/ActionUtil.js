import {
        submitForm,
        submitToURL,
        submitToSAPURL,
        // getVechicleRegDropDown,
        getVehicleRegDropDown,
        uploadFile
        } from "../Util/APIUtils";
import serialize from "form-serialize";
import { isEmpty } from "./validationUtil";
import swal from 'sweetalert';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { home_url } from "./urlUtil";

// CommonJS
const SwalNew = require('sweetalert2')


var evt;

// common Submit with FormConstraintValidation
export function commonSubmitForm(event,component,responseAction,url,formRef){
    ;
    event.preventDefault();    
    const form = event.currentTarget;
    if(!isEmpty(formRef)){
        let formIsValid = "";
        component[formRef].validateForm().then(fields => {
            formIsValid = fields.every(field => field.isValid())
            if (formIsValid) {
                const data = getSerializedForm(form);
               //component.props.changeLoaderState(true); 
                submitForm(data,url).then(response => {
                    //component.props.changeLoaderState(false);
                    !isEmpty(responseAction) && component.props[responseAction](response,component,event);
                });
            }
        });
    }else{
        const data = getSerializedForm(form);
        component.props.changeLoaderState(true);
        submitForm(data,url).then(response => {
            component.props.changeLoaderState(false);
            // commonSetState(component,"isLoading",false);
            component.props[responseAction](response,component,event);
        });
    }
}

export function commonSubmitFormValidation(event,  component,responseAction,url,formRef){ 
    //event.preventDefault();    
    const form = event.currentTarget.form;

    if(!isEmpty(formRef)){
        let formIsValid = "";
        component[formRef].validateForm().then(fields => {
            formIsValid = fields.every(field => field.isValid())
            if (formIsValid) {
                const data = getSerializedForm(form);
                component.props.changeLoaderState(true)
                // console.log("fo,da",data)
                debugger
                // submitForm(data,url).then(response => {
                //     component.props.changeLoaderState(false)
                //     component.props[responseAction](response);
                // });
            }
        });
    }else{
        const data = getSerializedForm(form);
        // return console.log('data',data)
        commonSetState(component,"isLoading",true);
        // console.log("ELSE DATA COMON SUBMIT",data)
        debugger
        submitForm(data,url).then(response => {
            commonSetState(component,"isLoading",false);
            component.props[responseAction](response);
        })
    }
}
export function commonSubmitWithoutEvent(form,component,responseAction,url,formRef){

    if(!isEmpty(formRef)){
        let formIsValid = "";
        component[formRef].validateForm().then(fields => {
        
            formIsValid = fields.every(field => field.isValid())
            if (formIsValid) {
                const data = getSerializedForm(form);
                submitForm(data,url).then(response => {
                    component.props[responseAction](response);
                });
            }
        });
    }else{
        const data = getSerializedForm(form);
        submitForm(data,url).then(response => {
            commonSetState(component,"isLoading",false);
            component.props[responseAction](response);
        });
    }

}

export function commonSubmitFormNoValidation(event,  component,responseAction,url){

        event.preventDefault();
        const form = event.currentTarget.form;
        const data = getSerializedForm(form);
        submitForm(data,url).then(response => {
            commonSetState(component,"isLoading",false);
            component.props[responseAction](response);
        });

}

export function commonSubmitFormNoValidationEnquiries(event,  component,responseAction,url,enquiry){
    console.log("res",responseAction)
    event.preventDefault();    
    const form = event.currentTarget.form;
    var data = getSerializedForm(form);
    let enquiryNo={
        'enquiry': enquiry,
    }
    if(responseAction == "addBindderToEnquiry"){
        enquiryNo={
            "enquiryId": parseInt(enquiry)

        }
    }
    data = {
        ...data,
        ...enquiryNo
    };
    // const rohan=[new Set[(data)], enquiry];
    // console.log('data', rohan);

    submitForm(data,url).then(response => {
        commonSetState(component,"isLoading",false);
        component.props[responseAction](response);
    });

}


export function commonSubmitFormNoValidationWithData(data,  component,responseAction,url){
    // debugger
    // console.log("novalidationwith data ",data,url)
    submitForm(data,url).then(response => {
        commonSetState(component,"isLoading",false);
       // commonSetState(component,"isLoading",true);

        component.props[responseAction](response);
    });

}

export function commonSubmitFormNoValidationWithData2(data,  component,responseAction,url){
  
    commonSetState(component,"isLoading",true);/*added on 31-07-2024*/
    
    submitForm(data,url).then(response => {
         commonSetState(component,"isLoading",false);
        component.props[responseAction](response);
    });

}

export function commonSubmitListOfDto(data, component,responseAction,url,callback = () => null){

    //event.preventDefault();    
    //const form = event.currentTarget.form;
    //const data = getSerializedForm(form);
    const data1=[...data]
    submitForm(data1,url).then(response => {
        commonSetState(component,"isLoading",false);
        component.props[responseAction](response,callback);
    });

}

export function commonSubmitWithParam(componentProps,responseAction,url,...param){
    url = getUrl(url,param); 
    console.log(param);
    console.log(".....");
    submitToURL(url).then(response => { 
        // if(!isEmpty(componentProps) && !isEmpty(componentProps[responseAction])) {
            componentProps[responseAction](response,componentProps);
    });

}

export function commonSubmitWithParamtest(componentProps,responseAction,url,param,param2){
    url = getUrltest(url,param,param2); 
    console.log(param);
    console.log(".....");
    
    submitToURL(url).then(response => { 
        // if(!isEmpty(componentProps) && !isEmpty(componentProps[responseAction])) {
            componentProps[responseAction](response,componentProps);
        // }
        
    });

}
export function commonSubmitWithParamSapUrl(componentProps,responseAction,url,...param){
    url = getVendorApprovalMatrixUrl(url,param); 

    submitToSAPURL(url).then(response => { 
        // if(!isEmpty(componentProps) && !isEmpty(componentProps[responseAction])) {
            componentProps[responseAction](response,componentProps);
        // }
    });

}


export function getVehicleRegDD(url,...param){
    url = getUrl(url); 
    getVehicleRegDropDown(url).then(response => { 
        // if(!isEmpty(componentProps) && !isEmpty(componentProps[responseAction])) {
            // componentProps[responseAction](response,componentProps);
        // }
    });

}




export function commonSubmitWithObjectParams(componentProps,responseAction,url,param){

    submitForm(param,url).then(response => { 
            componentProps[responseAction](response,componentProps);
    });
}

export function commonSubmitWithObjectParams2(componentProps,responseAction,url,param,component){
 
    commonSetState(component,"isLoading",true);/*added on 05-08-2024*/
    submitForm(param,url).then(response => { 
        
            componentProps[responseAction](response,componentProps);
            commonSetState(component,"isLoading",false);/*added on 05-08-2024*/
          
    });
}

function getUrl(url,param){
    if(isEmpty(param)){
        return url;
    }
    param.map(value=>{
        if(!isEmpty(value)){
            url=url+'/'+value
        }
    })
    return url;
}

function getUrltest(url,param,param2){
    if(isEmpty(param)){
        return url;
    }
    param.map(value=>{
        if(!isEmpty(value)){
            url=url+'/'+value+'/'+param2
        }
    })
    return url;
}

//vendorSapCode
function getVendorApprovalMatrixUrl(url,param){
    if(isEmpty(param)){
        return url;
    }
    param.map(value=>{
        if(!isEmpty(value)){
            url=url+value
        }
    })
    return url;
}
function getSerializedForm(form){
    return serialize(form, {
        hash: true,
        empty: true
    });
}


export function commonHandleChange(event, component, statePath, formRef) {
    let stateObject = component.state;
    const path = statePath.split(".");
  
    path.forEach((key, index) => {
      if (stateObject[key] === undefined) {
        stateObject[key] = {}; // Initialize the key if it doesn't exist
      }
      if (index === path.length - 1) {
        stateObject[key] = event.target.value;
      } else {
        stateObject = stateObject[key];
      }
    });
  
    component.setState(component.state);
  
    if (formRef && component[formRef]) {
      component[formRef].validateFields(event.target);
    }
  }


// export function commonHandleChange(event,component,statePath,formRef){


//     let stateObject = component.state;
//     let path = statePath.split(".");
//     path.map((key,index)=>{
//         if(path.length===index+1){
//             stateObject[key]=event.target.value;
//         }else{            
//             stateObject=stateObject[key];
//         }
//     });
//     component.setState(component.state);
//     if(!isEmpty(formRef)){
//         component[formRef].validateFields(event.target);
//     }
// }

export function getObjectFromPath(value,statePath){
    let path = statePath.split(".");
    let stateJSON="{";
    let end="}";
    path.map((record,index)=>{
        if(path.length===index+1){
            stateJSON=stateJSON+"\""+record+"\":";
            stateJSON=stateJSON+"\""+value+"\""+end;
        }else{
            stateJSON=stateJSON+"\""+record+"\":{";
            end="}"+end;
        }
    })
    return JSON.parse(stateJSON);
}

function getFileUploadObject(component,objectJson,statePath){
    let path = statePath.split(".");
    if(!isEmpty(component) && typeof(component.state[path[0]].length)==="undefined"){
        let stateObject = getObjectFromObjectJson(objectJson,path);
        component.setState(stateObject);
    }else{
        try{
            let objList = getObjectFromObjectJsonForArray(objectJson,path);
            component.state[path[0]][path[1]]=objList[path[0]][path[1]];
            component.setState(component.state);
        }catch(e){
            let stateObject = getObjectFromObjectJson(objectJson,path);
            component.setState(stateObject);
        }

    }
}

function getFileUploadObjectInv(component,objectJson,statePath){
    let path = statePath.split(".");
    if(!isEmpty(component) && typeof(component.state[path[0]].length)==="undefined"){

        let stateObject = getObjectFromObjectJson(objectJson,path);
        component.state[path[0]][path[1]]=stateObject[path[0]][path[1]];
        component.setState(component.state);
    }else{
        try{
            let objList = getObjectFromObjectJsonForArray(objectJson,path);
            component.state[path[0]][path[1]]=objList[path[0]][path[1]];
            component.setState(component.state);
        }catch(e){
            let stateObject = getObjectFromObjectJson(objectJson,path);
            component.setState(stateObject);
        }

    }
}

function getObjectFromObjectJson(objectJson,path){
    let stateJSON="{";
    let end="}";
    path.map((record,index)=>{
        if(path.length===index+1){
            stateJSON=stateJSON+"\""+record+"\":";
            stateJSON=stateJSON+objectJson+end;
        }else{
            stateJSON=stateJSON+"\""+record+"\":{";
            end="}"+end;
        }
    })
    return JSON.parse(stateJSON);
}

function getObjectFromObjectJsonForArray(objectJson,path){
    let stateJSON="{";
    let end="}";
    path.map((record,index)=>{
        if(path.length===index+1){
            stateJSON=stateJSON+"\""+record+"\":";
            stateJSON=stateJSON+objectJson+end;
        }else{
            stateJSON=stateJSON+"\""+record+"\":{";
            end="}"+end;
        }
    })
    return JSON.parse(stateJSON);
}

export function commonHandleFileUpload(event,component,statePath,formRef){

    const data = new FormData();
    let target = event.target;
    data.append('file', event.target.files[0]);
    console.log('file upload',data)
    component.props.changeLoaderState(true);
    uploadFile(data,"/rest/addAttachment").then(response => {
        showSwalByResponseEntity(response);
        getFileUploadObject(component,JSON.stringify(response),statePath);
        component.props.changeLoaderState(false);
        if(!isEmpty(formRef)){
            component[formRef].validateFields(target);
        }
    });
}

export function commonHandleFileUploadInv(event,component,statePath,formRef){

    const data = new FormData();
    let target = event.target;
    data.append('file', event.target.files[0]);
    console.log('fileupload inv',data)
    component.props.changeLoaderState(true);
    uploadFile(data,"/rest/addAttachment").then(response => {
        showSwalByResponseEntity(response);
        getFileUploadObjectInv(component,JSON.stringify(response),statePath);
        component.props.changeLoaderState(false);

        if(!isEmpty(formRef)){
            component[formRef].validateFields(target);
        }
    });
}

export function commonHandleChangeCheckBox(event,component,statePath,formRef){

    let stateObject = component.state;
    let path = statePath.split(".");
    path.map((key,index)=>{
        if(path.length===index+1){
            stateObject[key]=event.target.checked;
        }else{            
            stateObject=stateObject[key];
        }
    });
    component.setState(component.state);
    if(!isEmpty(formRef)){
        component[formRef].validateFields(event.target);
    }
}

export function commonHandleReverseChangeCheckBox(event,component,statePath,formRef){

    let stateObject = component.state;
    let path = statePath.split(".");
    path.map((key,index)=>{
        if(path.length===index+1){
            stateObject[key]=!event.target.checked;
        }else{            
            stateObject=stateObject[key];
        }
    });
    component.setState(component.state);
    if(!isEmpty(formRef)){
        component[formRef].validateFields(event.target);
    }
}

export function showAlert(hasError,message){
    let swalTitle=hasError===true?"Wrong":"Done";
      let swalText=message;
      let swalType=hasError===true?"warning":"success";
      swal({
        title: swalTitle,
        text: swalText,
        icon: swalType,
        type: swalType
      });
}

export function showAlertAndReload(hasError,message,url = null){
    let swalTitle=hasError===true?"Wrong":"Done";
      let swalText=message;
      let swalType=hasError===true?"warning":"success";
      swal({
        title: swalTitle,
        text: swalText,
        icon: swalType,
        type: swalType
      }).then(function(isConfirm) {
        if (isConfirm) {
           if(!url) window.location.reload(true); 
           else window.location.replace(url)
        }
      });
}

export function showAlertAndReloadToHome(hasError,message){
    let swalTitle=hasError===true?"Wrong":"Done";
      let swalText=message;
      let swalType=hasError===true?"warning":"success";
      swal({
        title: swalTitle,
        text: swalText,
        icon: swalType,
        type: swalType
      }).then(function(isConfirm) {
        if (isConfirm) {
            window.location.href=home_url; 
        } 
      });
}

export function validateForm(component,formRef,target) {
component[formRef].validateFields(target);
}

export function resetForm(formRef) {
formRef.reset();
}

export function resetFormField(formRef,id){

formRef.resetField(document.getElementById("id"));
}

  export function swalPrompt(event,component,actionYES,actionNO,message,confirmText,rejectText){
      if(!isEmpty(event)){
        event.preventDefault();
      }
      let msg = "Are You Sure?";
      let cText = "YES";
      let rText = "NO";

      if(!isEmpty(message)){
        msg = message;
      }

      if(!isEmpty(confirmText)){
        cText = confirmText;
      }

      if(!isEmpty(rejectText)){
        rText = rejectText;
      }

    swal(msg, {
        buttons: {
        
          Yes: {
            text: cText,
            value: "CONFIRM",

          },
          No: {
            text: rText,
            value: "CANCEL",
          },
    
        },
      })
      .then((value) => {
        switch (value) {
    
          case "CANCEL":
            // console.log("cancle button clicked");
            if(!isEmpty(actionNO)){
                component[actionNO]();

            }
            break;
    
          case "CONFIRM":

            // console.log("submit button clicked");
            if(!isEmpty(actionYES)){
                component[actionYES]();
            }

            break;
    
          // default:
          //   swal("Got away safely!");
        }
      });
  }

export function swalWithTextBox(event,component,action){
    swal("Enter reason for rejection", {
        buttons: {
        
          Submit: {
            value: "CONFIRM",
          },
          Cancel: {
            value: "CANCLE",
          },

        },
        content: "input",
      })
      .then((value) => {
        let textBoxValue=swal.getState().actions.confirm.value;
        switch (value) {
    
            case "CANCEL":
            break;
            case "CONFIRM":
            component[action](textBoxValue);
            break;
        }
      })
}

export function swalWithDate(event,component,action,title){
    SwalNew.fire({
        // title: '',
        title: title,
        icon: 'info',
        html: ' <input type="date" name="value">',
        confirmButtonText: 'submit'
      })
      .then((result) => {
        var datetype=Swal.getContent();
        var datefromtag =datetype.getElementsByTagName("input").value.value;

        component[action](datefromtag);
    
    });

}

export function swalWithUrl(hasError,message,url){
    let swalTitle=hasError===true?"Wrong":"Done";
    let swalText=message;
    let swalType=hasError===true?"warning":"success";
    swal({
      title: swalTitle,
      text: swalText,
      icon: swalType,
      type: swalType
    }).then((isConfirm)=>{
      if (isConfirm && !isEmpty(url) && !hasError){
    //    window.location.reload(false)
        window.location.href=url;
        // window.location.reload(false);
        // console.log(url); 
      }else{
        // window.location.reload(false);
        // console.log("url not present"); 
       return{
         type : "",
         payload : ""
       }
      }
    })

}


//   export function swalPromtReturn(event,message,confirmText,rejectText){

//     if(!isEmpty(event)){
//       event.preventDefault();
//     }
//     let msg = "Are You Sure?";
//     let cText = "YES";
//     let rText = "NO";

//     if(!isEmpty(message)){
//       msg = message;
//     }

//     if(!isEmpty(confirmText)){
//       cText = confirmText;
//     }

//     if(!isEmpty(rejectText)){
//       rText = rejectText;
//     }

//   swal(msg, {
//       buttons: {
    
//         Yes: {
//           text: cText,
//           value: "CONFIRM",
//         },
//         No: {
//           text: rText,
//           value: "CANCEL",
//         },

//       },
//     })
//     .then((value) => {
//       switch (value) {

//         case "CANCEL":
//             
    
//           return false;
//           break;

//         case "CONFIRM":

//           return true;
    
//           break;

//         // default:
//         //   swal("Got away safely!");
//       }
//     });
// }

export function commonSetState(component,statePath,value){


    let stateObject = component.state;
    let path = statePath.split(".");
    path.map((key,index)=>{
        if(path.length===index+1){
            stateObject[key]=value;
        }else{        
            stateObject=stateObject[key];
        }
    });
    component.setState(component.state);
}

export function updateState(component,value){
    component.setState({...component.state,...value});
}

export function swalWithTextBoxDynamicMessage(event,component,action,message){

swal(message, {
    buttons: {
      
      Submit: {
        value: "CONFIRM",
      },
      Cancle: {
        value: "CANCLE",
      },
      
    },
    content: "input",
  })
  .then((value) => {
    let textBoxValue=swal.getState().actions.confirm.value;
    switch (value) {
   
        case "CANCEL":
        break;
        case "CONFIRM":
        component[action](textBoxValue);
        break;
    }
  });
}

function showSwalByResponseEntity(response){
if(!isEmpty(response) && !isEmpty(response.response) && response.response.hasError===true){
    showAlert(response.response.hasError,response.response.message);
}
}

export function swalWithTextBoxMessage(event,component,action,message){

    swal(message, {
        buttons: {         
          Yes: {
            value: "Yes",
          },
          No: {
            value: "No",
          },
          
        },
       // content: "input",
      })
      .then((value) => {
       // let textBoxValue=swal.getState().actions.confirm.value;
        switch (value) {
       
            case "No":
            break;
            case "Yes":
            component[action](value)
            break;
        }
      });
    }