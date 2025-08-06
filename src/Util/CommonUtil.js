import React from "react";
// import CustomLoader from "../Component/FormElement/Loader/CustomLoader";
import { isEmpty } from "./validationUtil";
import {ACCESS_TOKEN,IS_USER_AUTHENTICATED} from '../Constants/index';
import { getStateApi } from "./APIUtils";
import { func } from "prop-types";
export function paddingZero(n) {
    if(isEmpty(n)){
        return 0;
    }
    return (n < 10) ? ("0" + n) : n;
}

export function removeLeedingZeros(n){
    if(isEmpty(n)){
        return 0;
    }
        
    return n.replace(/^0+/, '');
}

export function statusForVendor(status){
    if (isEmpty(status)) {
      return "";
    }
    let list = ["In Progress", "Approved", "Rejected", "Drafted", "Complete"];

    if (status == "IP") {
      return list[0];
    }
    if (status == "AP") {
      return list[1];
    }
    if (status == "RJ") {
      return list[2];
    }
    if (status == "DR") {
      return list[3];
    } else {
      return list[4];
    }
  };

export function statusNameChange(data){
    if(isEmpty(data)){
        return "-";
    }
    if(data==="DR"){
            return "New"; 
    }
    else if(data==="IP"){
        return "In Progress";   
    }
    else if(data==="CL"){
        return "Closed";
    }
    else if(data==="DROP"){
        return "Dropped";
    }
    else if(data==="SP"){
        return "Solution Proposed";
    }
    else if(data==="SR"){
        return "Solution Rejected";
    }
    else if(data==="CA"){
        return "Customer Action";
    }
}

export function getCommaSeperatedValue(value){
    if(isEmpty(value)){
        return 0;
    }
    value = Number(value);
    value = value.toFixed(3);
    var afterPoint = '';
    if(value.indexOf('.') > 0)
       afterPoint = value.substring(value.indexOf('.'),value.length);
    
    value = Math.floor(value);
    value = value.toString();
    var lastThree = value.substring(value.length-3);
    var otherNumbers = value.substring(0,value.length-3);
    if(otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
}

//export function addZeroes(num) {
  //  return num.toLocaleString("en", {useGrouping: false, minimumFractionDigits: 3})
 //}

 export function addZeroes(num) {
    var numberAsString = num.toString();
  
    if(numberAsString.indexOf('.') === -1) {
      num = Number(num).toFixed(3);
      numberAsString = num.toString();
    } else if (numberAsString.split(".")[1].length < 3) {
      num = Number(num).toFixed(3);
      numberAsString = num.toString();
    }
  
    return numberAsString
  };

//   export function textRestrict(e) {
//     var decimal_index = e.target.value.indexOf('.');
//    if(decimal_index > -1){
//     var decimals = e.target.value.substring(decimal_index, e.target.value.length);
//      //var decimals = e.target.value.substring(decimal_index, e.target.value.length+1);
//      if(decimals.length > 3){
//         //e.preventDefault();
//         e.target.value = e.target.value.substring(0,decimal_index) + decimals.substring(0,3);
//      }
//      //this.props.onChange();
//    }
//  }


export function textRestrict(e) {
   

    let inputVal = e.target.value;

    if (inputVal.includes('.')) {
        let parts = inputVal.split('.');
        if (parts[1].length > 0 && e.key === 'Backspace') {
            e.target.value=inputVal.slice(0, -1)
            return e.target.value;
        }
        else{
              var decimal_index = e.target.value.indexOf('.');
                if(decimal_index > -1){
                var decimals = e.target.value.substring(decimal_index, e.target.value.length);
             //var decimals = e.target.value.substring(decimal_index, e.target.value.length+1);
                if(decimals.length > 3){
                //e.preventDefault();
                e.target.value = e.target.value.substring(0,decimal_index) + decimals.substring(0,4);
             }
               return e.target.value
            //  return (e.keyCode!=13)
             //this.props.onChange();
           }
        }
    }

   if (e.key === 'Enter' && e.shiftKey === false) {
    e.preventDefault();
    // callback(submitAddress);
  }
 }

export function getDecimalUpto(value,digits){
    if(isEmpty(digits) || isNaN(digits)){
        if(isEmpty(value)){
            return 0;
        }else{
            return value;
        }
    }

    if(isEmpty(value) || isNaN(value)){
        return Number("0").toFixed(digits);
    }else{
        return Number(value).toFixed(digits);
    }
}

export function isUserAuthenticated(){
    if(!isEmpty(localStorage.getItem(ACCESS_TOKEN)) && localStorage.getItem(IS_USER_AUTHENTICATED)==="true" ){
        return true;
    }
    return false;
}
//For Scroll Horizontal Menu
const MenuItem = ({ text, selected, url,status}) => {
    if(status==="CO" && text==="Registration"){
        return (<a className="" href={url}></a>)
    }
    return (
        <a className="" href={url}>
            <div className={`menu-item ${selected ? 'active' : ''}`}>
                {text}
            </div>
        </a>
    );
};

// All items component
// Important! add unique key
export const Menu = (list, selected,status) =>
    list.map(el => {
        const { name } = el;
        return <MenuItem text={name} key={name} selected={selected} url={el.code} status={status}/>;
    });

const Arrow = ({ text, className }) => {
    return (
        <div
            className={className}
        >{text}</div>
    );
};


export const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
export const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

// export function showLoader(load){
//     if(load){
//         return (
//             <CustomLoader
//                 load={load}
//             />
//         )
//     }
//     return null;
// }

export function getUserDto(userDto){
    if(!isEmpty(userDto)){
        return {
            userId: userDto.userId,
            name: userDto.name,
            empCode: userDto.userName,
            email:userDto.email,
            purchaseGroup:userDto.purchaseGroup
        };
    }else{
      return {
          userId: "",
        
        };
    }
  }
  
export function getUser1Dto(userDto){
    if(!isEmpty(userDto)){
        return {
           // userId: userDto.userId,
           // name: userDto.name,
           vendorname: userDto[0],
          //  empCode: userDto.userName,
            empCode: userDto[1],
            //email:userDto.email
            email:userDto[2],
            districtname:userDto[3],
            regionname:userDto[4],
           // userId: userDto[6]
        };
    }else{
      return {
        //  userId: "",
          name: "",
          empCode:"",
          email:"",
          districtname:"",
          regionname:""
        };
    }
  }

  export function getUser(user){
    if(!isEmpty(user)){
        return {
            userId: user[6]
        };
    }else{
      return {
          userId: "",
        
        };
    }
  }

  export function getFileAttachmentDto(attachmentDto){
    if(!isEmpty(attachmentDto)){
      return attachmentDto;
    }else{
      return {
        attachmentId: "",
        fileName: ""
        };
    }
  }

 export function getUserDetailsDto(userDetailsDto){
    if(!isEmpty(userDetailsDto)){
      return {
        locationId:userDetailsDto.locationId,
        state:getRegionDto(userDetailsDto.region),
        district:getDistrictIdDto(userDetailsDto.district),
      };
    }else{
        return {
            locationId:"",
            state:getRegionDto(null),
            district:getDistrictIdDto(null)
        };
    }
  }

  export function getRegionDto(regionDto){
    if(!isEmpty(regionDto)){
        return regionDto;
    }else{
        return {
            regionId:"",
            name:"",
            code:""
        };
    }
  }

  export function getDistrictIdDto(districtIdDto){
    if(!isEmpty(districtIdDto)){
        return districtIdDto;
    }else{
        return {
            districtId:"",
            name:"",
            code:""
        };
    }
  }

  export function getPartnerDto(partnerDto){
    if(!isEmpty(partnerDto)){
        return partnerDto;
    }else{
        return {
            bPartnerId:"",
            name:"",
            code:""
        };
    }
  }

  export function getJsonIgnorePartnerDto(partnerDto){
    if(!isEmpty(partnerDto)){
        return {bPartnerId:partnerDto[5]};
    }else{
        return {
            bPartnerId:"",
            name:"",
            code:""
        };
    }
  }

  export function getPrDto(prDto){
    if(!isEmpty(prDto)){
        return prDto;
    }else{
        return {
            prId:"",
            name:"",
            code:"",
            prNumber:""
        };
    }
  }

  export function getBidDto(bidDto){
    if(!isEmpty(bidDto)){
        return bidDto;
    }else{
        return {
            bidderId:"",
            name:"",
            code:""
        };
    }
  }

  export function getItemBidDto(itemBidDto){
    if(!isEmpty(itemBidDto)){
        return itemBidDto;
    }else{
        return {
            itemBidId:"",
            name:"",
            code:"",
            prLine:getPrLineDto(null)
        };
    }
  }

  export function getPrLineDto(prLineDto){
    if(!isEmpty(prLineDto)){
        return prLineDto;
    }else{
        return {
            prLineId:"",
            name:"",
            code:"",
            plant:"",
            pr:getPrDto(null)
        };
    }
  }

  export function checkIsNaN(value){
    return isNaN(Number(value))?0:Number(value);
}

export function pushTiles(props){
    let listOfUrl = [];
      props.accessMasterDto.map(records => {
        if (!isEmpty(records.tile) 
            // && !isEmpty(records.tile.code) && records.tile.code!=="userdashboard" && records.tile.code!=="vendordashboard"
        ){
            listOfUrl.push(records.tile);
        }
      })
    return listOfUrl;
}

export function getDefaultSelectedDashboardList(list){
    if(!isEmpty(list)){
        for(let i=0 ; i<list.length ; i++)
        {
            if("/"+list[i].code===window.location.pathname)
            {
            return list[i].name;
            }
        }
    }
    return "";
}