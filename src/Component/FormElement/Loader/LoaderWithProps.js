import React, { Component } from "react";
import Loader from 'react-loader-spinner';

class LoaderWithProps extends Component {
    constructor(props){
        super(props);
        // state => {

        // }
    }

    render() {
        var loadingState = this.props.isLoading ? 'display_block' : 'display_none';
    
        // alert(loadingState);

        if (!this.props.isLoading) return null;
        return (

            <div >
                <div className={loadingState}>
                    <div className="loader-container" >
                        <div className="loader">
                            <Loader
                            type="Ball-Triangle"
                            color="#00BFFF"
                            height="100"
                            width="100"
                        />
                            <h4 className="text-center top10">Loading..</h4>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default LoaderWithProps;
