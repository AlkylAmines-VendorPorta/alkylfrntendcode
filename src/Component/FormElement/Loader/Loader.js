import React, { Component } from "react";
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import * as actionCreators from '../Loader/Action';

class LoaderComp extends Component {

    state = {
        load: false
    }

    componentWillReceiveProps(props) {
      
        // alert(props.isLoading);
        this.setState({
            load: props.isLoading
        });
    }

    render() {

        //alert(this.state.load)
        return (

            <div >
                {/* <div className={!this.state.load ? 'block' : 'none'}>
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
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {

    return state.loadingReducer;
};
export default connect(mapStateToProps, actionCreators)(LoaderComp);

//export default LoaderComp;