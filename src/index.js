import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import "react-stepzilla/src/css/main.css";
import './css/style.css';
import './css/raleway-font.css';
import './css/shortcodes.css';
import './css/bulma_new.css';
import './css/width.css';
import './css/height.css';
import './css/mediaQueries_extraSmall.css';
import './css/mediaQueries_Small.css';
import './css/mediaQueries_Medium.css';
import './css/mediaQueries_Large.css';
import './css/mediaQueries_extraLarge.css';
import './css/mediaQueries_Print.css';
import App from './App';
import './css/Responsive.css';
//import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk'; 
import rootReducer from './Reducers/rootReducer';

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
export const store = createStore(rootReducer, applyMiddleware(thunk));
// document.onkeypress=(e)=>{
//     
//     console.log(e);
// };
document.onkeydown=(e)=>{
    // if (e.keyCode === 13 ) {
    //     e.preventDefault();
    //     e.stopImmediatePropagation();
    // }
    
    if (e.keyCode=== 8) {
        if(!(e.target.tagName==="INPUT" || e.target.tagName==="TEXTAREA")){
           
            
            e.preventDefault();
            e.stopImmediatePropagation();
        }      
    }
    
    if(e.target.className.indexOf("readonly")>-1 && e.target.className.indexOf("Noreadonly")==-1 && e.keyCode!=9){
        
        
        e.preventDefault();
    }
    
    if((e.target.className.indexOf("numberOnly")>-1 && (!(e.keyCode < 69 || e.keyCode > 90)))){
        
        e.preventDefault();
        
    }
    
};

    
   


    
   


ReactDOM.render(<Provider store = {store}><App /></Provider>, document.getElementById('root')); 
