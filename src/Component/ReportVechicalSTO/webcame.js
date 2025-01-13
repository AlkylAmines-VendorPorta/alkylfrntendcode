import React, { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";

const Webcame = (props) => {

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [driverImg, setDriverImg] = useState(null);
  const [docImg, setDocImg] = useState(null);
  const [pValue, setpValue] = useState('');

  const capture = React.useCallback(() => {
    
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("image Src data sdf-->", pValue);
    if (pValue === 'Driver') {
      setImgSrc(imageSrc);
    }
    if (pValue === 'Document') {
      setDocImg(imageSrc);
    }

  }, [webcamRef, setImgSrc, setDocImg, pValue]);

  const handleSetImage = () => {
    setImgSrc(null);
  }

  const handleSetDocImage = () => {
    setDocImg(null);
  }

  function handleSave() {
    
    if (pValue === 'Driver') {
      setImgSrc(imgSrc);
      props.setImage(pValue, imgSrc);
    }
    if (pValue === 'Document') {
      setDocImg(docImg);
      props.setImage(pValue, docImg);
    }
  }


  useEffect(() => {
    {
      
      // console.log("propsuseEefect",props.value);
      setpValue(props.value);

    }
  }, [props])

  // useEffect(() => {
  //   if (pValue === 'Driver') {
  //     console.log("driverimageset");
  //     setDriverImg(imgSrc);
  //     // props.setImage("Driver",imgSrc);
  //   }
  //   
  //   if (pValue === 'Document') {
  //     console.log("doc-imageset");
  //     setDocImg(docImg);
  //     // props.setImage("Document",imgSrc);
  //   }
  // }, [props, imgSrc, docImg])


  // console.log("imagesrc value",imgSrc)
  // console.log("props",props.value)
  // console.log("value ",pValue);
  return (

    <>
      {/* {props.value
      
      
      !== ''  ? setpValue(props.value) : null} */}
      {/* <div>
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <button className="btn btn-primary" onClick={capture}>Capture photo</button>
      </div> */}



      {imgSrc !== null && pValue === 'Driver' ?
        <>
          <img
            src={imgSrc}
          />
          <button className="btn btn-primary m-2" onClick={handleSetImage}>Resetdriver</button>
          <button className="btn btn-primary m-2" onClick={handleSave}>Savedriver</button>
        </>
        : docImg !== null && pValue === 'Document' ? <>
          <img src={docImg} />
          <button className="btn btn-primary m-2" onClick={handleSetDocImage}>Resetdoc</button>
          <button className="btn btn-primary m-2" onClick={handleSave}>Savedoc</button>
        </> :

          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <button className="btn btn-primary" onClick={capture}>Capture photo</button>

          </>
      }





      {/* {imgSrc !== 'null' && <img src={imgSrc}  /> } */}
      {/* <div>
     <img
         src={imgSrc}
       /> */}
      {/* <button className="btn btn-primary" onClick={setImgSrc('null')}>Reset</button> */}
      {/* </div> */}

      {/* <div>
      <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <button className="btn btn-primary" onClick={capture}>Capture photo</button>
      </div>
     */}
      {/* {imgSrc !== 'null' && (
        <img
          src={imgSrc}
        />
      )} */}
    </>
  );
};

export default Webcame;

















// import React from 'react';
// import Webcam from "react-webcam";


// export default function WebCame (){

// const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "user"
//   };

//   // const WebcamCapture = () => {
//   //   const webcamRef = React.useRef(null);

//   //   const capture = React.useCallback(
//   //     () => {
//   //       const imageSrc = webcamRef.current.getScreenshot();

//   //     },
//   //     [webcamRef]
//   //   );
//   //   };

//     const webcamRef = React.useRef(null);
//     const [imgSrc, setImgSrc] = React.useState(null);
//     const capture = React.useCallback(
//       () => {
//         const imageSrc = webcamRef.current.getScreenshot();
//         console.log("imgScr--->",imageSrc)
//         setImgSrc(imgSrc)
//         console.log("inagesrc ---",imgSrc)
//       },
//       [webcamRef]
//     );
//     return (
//       <>

//        <Webcam
//           audio={false}
//           height={720}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           width={1280}
//           videoConstraints={videoConstraints}
//         />
//         <button onClick={capture}>Capture photo</button>
//         {imgSrc && (
//         <img
//           src={imgSrc}
//         />
//       )}


//       </>
//     );
//   };



