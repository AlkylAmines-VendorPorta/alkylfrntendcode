import React, { Component,PureComponent } from "react";
import PDFViewer from "pdf-viewer-reactjs";

export default class PDFViewerComponent extends PureComponent {
    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'application/pdf'});
        return blob;
    }
    onDownload = () => {
        
        const blob = this.dataURItoBlob(this.props.invoice);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    render() {
        return (
            <React.Fragment>
             <PDFViewer
                        document={{
                        //   url: "https://arxiv.org/pdf/quant-ph/0410100.pdf",
                        base64:this.props.invoice}}
                        navbarOnTop="true"
                        css="w-100 height_400px overflow_Y_scroll"
                        canvasCss="canvas_class"
                      />
                <div style={{marginTop:20,display:'flex',justifyContent:'flex-end'}}>
                <button onClick={this.onDownload}>Download</button>
                </div>
            </React.Fragment>

        );
    }

}

