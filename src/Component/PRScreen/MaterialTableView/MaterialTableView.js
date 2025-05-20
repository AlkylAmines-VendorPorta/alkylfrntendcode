import React, { Component } from "react";
import StickyHeader from "react-sticky-table-thead";
import formatDate, { formatDateWithoutTime } from "../../../Util/DateUtil";
// import { getItemBidDto, getPrLineDto } from "../../../Util/CommonUtil";
class MaterialTableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadItemBidList:false,
            itemBidList:[]
        }
    }

    // componentDidMount(){
    //     this.setState({
    //         loadItemBidList:true
    //     })
    // }

    // componentWillReceiveProps = props => {
    //     if(this.state.loadItemBidList && !isEmpty(props.itemBidList)){
    //         this.setItemBid(props);
    //     }
    // }
    
    // setItemBid=(props)=>{
    //     let itemBidList = [];
    //     props.itemBidList.map((itemBid)=>{
    //         itemBidList.push(this.getItemBidFromObj(itemBid));
    //     });
    //     this.setState({
    //         itemBidList : itemBidList,
    //         loadItemBidList: false
    //     });
    // }
    
    // getItemBidFromObj=(itemBid)=>{
    //     let itemBid= getItemBidDto(itemBid);
    //     let prLine=getPrLineDto(itemBid.prLine);
    //     return {
    //      ...itemBid, ...prLine
    //     }
    // }

    render() {
        return (
            <>
                <div className="row px-4 py-2">
                    <div className="col-sm-12 mt-2">
                        <div>
                            <StickyHeader height={430} className="table-responsive">
                                <table className="my-table">
                                    <thead>
                                        <tr>
                                            <th className="w-6per"> Line No.</th>
                                            <th className="w-4per"> A</th>
                                            <th className="w-4per"> I</th>
                                            <th className="w-40per"> Material Description </th>
                                            <th className="text-right w-7per"> Req. Qty </th>
                                            <th> UOM </th>
                                            <th className="text-right w-8per">Val. Price</th>
                                            <th className="w-10per">Plant</th>
                                            <th className="w-10per"> Delivery Date </th>
                                            {/*<th className="w-10per"> Required Date </th>*/}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.itemBidList.map((el,i)=>
                                            <tr>
                                                <td>{el.prLine.lineNumber}</td>
                                                <td>{el.prLine.a}</td>
                                                <td>{el.prLine.i}</td>
                                                <td>{el.prLine.materialDesc}</td>
                                                <td className="text-right">{el.prLine.quantity}</td>
                                                <td>{el.prLine.uom}</td>
                                                <td className="text-right">{el.prLine.price}</td>
                                                <td>{el.prLine.plant}</td>
                                                <td>{formatDate(el.prLine.deliverDate)}</td>
                                                {/*<td>{formatDateWithoutTime(el.prLine.requiredDate)}</td>*/}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </StickyHeader>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default MaterialTableView;