import React, { Component } from "react";

export default class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        return(<>
            <footer class="custom-footer">
                <div class="footer-copyright text-right text-white px-3 py-3">
                    Our Website:&nbsp;<a href="alkyl.com">alkyl.com</a>
                </div>
            </footer>
        </>);
    };
}