import React, { Component } from "react";
import StickyHeader from "react-sticky-table-thead";
import {
    commonHandleFileUpload,
    commonSubmitForm,
    commonHandleChange,
    commonSubmitWithParam,
    commonHandleChangeCheckBox,
    commonSubmitFormNoValidation,
    commonHandleReverseChangeCheckBox,
    commonSetState,
    validateForm,
    resetForm,
    swalWithTextBox
} from "../../../Util/ActionUtil";
import { isEmpty } from "lodash-es";
class MaterialTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prLine: [],
            loadOnce: false,
            lineIndex: ""
        }
    }

    componentDidMount(){
        this.setState({
            loadOnce:true
        })
    }

    componentWillReceiveProps = props => {
        if (this.state.loadOnce && !isEmpty(props.prLineArray)) {
            this.setState({
                prLine: props.prLineArray,
                loadOnce: false
            });
        }
    }
    getHiddenFields = (prLine, i) => {
        return (
            <>
                <input
                    type="hidden"
                    name={"itemBidList[" + prLine.index + "][prLine][prLineId]"}
                    value={prLine.prLineId}
                    disabled={
                        !prLine.isChecked
                    }
                />
            </>
        )
    }

    changeIndex = (e, i) => {
        let ind = 0;
        if (e.target.checked === true) {
            let tempPrLine = [...this.state.prLine];

            if (this.state.lineIndex === "") {
                ind = 0;
            } else {
                ind = parseInt(this.state.lineIndex) + 1;
            }
            tempPrLine[i].index = ind;
            this.setState({
                prLine: tempPrLine,
            })
        } else if (e.target.checked === false) {
            ind = parseInt(this.state.lineIndex) - 1;
        }
        this.setState({
            lineIndex: ind
        })
    }
    render() {
        return (
            <>
                <div className="row px-4 py-2">
                    <div className="col-sm-12 mt-2">
                        <div>
                            <StickyHeader height={430} className="table-responsive">
                                <table className="table table-bordered table-header-fixed">
                                    <thead>
                                        <tr>
                                            <th>Chk</th>
                                            <th className="w-6per"> Line No.</th>
                                            <th className="w-4per"> A</th>
                                            <th className="w-4per"> I</th>
                                            <th className="w-40per"> Material Description </th>
                                            <th className="text-right w-7per"> Req. Qty </th>
                                            <th> UOM </th>
                                            <th className="text-right w-8per">Val. Price</th>
                                            <th className="w-10per">Plant</th>
                                            <th className="w-10per"> Delivery Date </th>
                                           {/* <th className="w-10per"> Required Date </th>*/}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.prLine.map((prLine, i) =>
                                            <>
                                                <tr>
                                                    <th>
                                                        <input type="checkbox"
                                                            value="Y"
                                                            checked={prLine.isChecked}
                                                            onChange={(e) => {
                                                                commonHandleChangeCheckBox(e, this, "prLine." + i + ".isChecked");
                                                                this.changeIndex(e, i);
                                                            }}
                                                            className="display_block"
                                                        />
                                                    </th>
                                                    <td>{prLine.lineNumber}</td>
                                                    <td>{prLine.a}</td>
                                                    <td>{prLine.i}</td>
                                                    <td>{prLine.materialDesc}</td>
                                                    <td className="text-right">{prLine.reqQty}</td>
                                                    <td>{prLine.uom}</td>
                                                    <td className="text-right">{prLine.price}</td>
                                                    <td>{prLine.plant}</td>
                                                    <td>{prLine.deliverDate}</td>
                                                    {/*<td>{prLine.requiredDate}</td>*/}
                                                    {this.getHiddenFields(prLine, i)}
                                                </tr>
                                            </>
                                        )
                                        }
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

export default MaterialTable;