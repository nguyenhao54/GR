import * as faceapi from "face-api.js";
import React, { useEffect } from "react";
import { AppState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FaHeartPulse } from "react-icons/fa6";
import { setDialog } from "../../../redux/dialog.reducer";
import { DotFlashing } from "../../../common";
import { createAttendance, updateAttendance } from "../../../api/attendance";
import { getCookie } from "./AttendanceCard";
import { addSevenHours, minusSevenHours } from "../../../utils";

function minutesDiff(dateTimeValue2: any, dateTimeValue1: any) {
  var differenceValue =
    (new Date(dateTimeValue2).getTime() - new Date(dateTimeValue1).getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}

function Attendify({ attendance, setAttendance, lesson }: any) {
  const user = useSelector((appState: AppState) => appState.user.user)
  console.log(user)
  const [modelsLoaded, setModelsLoaded] = React.useState<boolean>(false);
  // const [verified, setVerified] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const [captureVideo, setCaptureVideo] = React.useState<boolean>(true);

  const videoRef = React.useRef<any>();
  const videoHeight = 420;
  const videoWidth = 540;
  const canvasRef = React.useRef<any>();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    loadModels();
  }, []);

  useEffect(() => {
    // setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream

          // Show loading animation.
          var playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then((res: any) => {
              // Automatic playback started!
              // Show playing UI.
            })
              .catch((e: any) => {
                // Auto-play was prevented
                // Show paused UI.
              });
          }

        }
      })
      .catch((err) => {
        console.error("error:", err);
      });

    return videoRef.current?.srcObject?.getTracks().forEach((track: any) => track.stop())
  })


  const handleVideoOnPlay = () => {
    if (videoRef.current && captureVideo) {
      let myInterval = setInterval(async () => {
        if (canvasRef && canvasRef.current) {
          canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
            videoRef.current
          );
          const displaySize = {
            width: videoWidth - 40,
            height: videoHeight - 40,
          };

          faceapi.matchDimensions(canvasRef.current, displaySize);
          if (user?.photo) {
            const refFace = await faceapi.fetchImage(user.photo);
            // console.log(refFace)
            let refFaceData = await faceapi.detectAllFaces(refFace, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            try {

              const detections = await faceapi
                .detectAllFaces(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceDescriptors()
              // .withFaceExpressions();

              if (!detections || !videoRef.current) { return }
              const resizedDetections = faceapi.resizeResults(
                detections,
                videoRef.current
              );

              let faceMatcher = new faceapi.FaceMatcher(refFaceData)
              resizedDetections.forEach(async face => {
                // console.log(face)
                const { detection, descriptor } = face;
                let label = faceMatcher.findBestMatch(descriptor).toString();
                console.log(label)
                if (label.includes("unknown")) {
                  return
                } else {
                  clearInterval(myInterval)

                  let options = { label: user.name };
                  const drawBox = new faceapi.draw.DrawBox(detection.box, options)
                  canvasRef.current
                    .getContext("2d")
                    .clearRect(0, 0, videoWidth, videoHeight);
                  var pausePromise = videoRef.current?.pause();
                  if (pausePromise !== undefined) {
                    pausePromise.then((res: any) => {

                      // Automatic playback started!
                      // Show playing UI.
                    })
                      .catch((e: any) => {
                        // Auto-play was prevented
                        // Show paused UI.
                      });
                  }

                  // videoRef.current?.pause();
                  videoRef.current?.srcObject?.getTracks()[0].stop();
                  drawBox.draw(canvasRef.current);

                  // dispatch(setDialog({loading: true}))
                  setTimeout(() => {
                    closeWebcam();
                    dispatch(setDialog({
                      open: false
                    }))
                    const token = getCookie("token")
                    const dateTimeNow= addSevenHours((new Date()).toISOString())
                    if (!attendance?.checkInTime)
                      createAttendance(token, lesson._id, dateTimeNow, user._id).then(res =>
                        setAttendance({ checkInTime:  dateTimeNow  })
                      ).catch(err=> console.log(err))
                    else {
                      const duration = minutesDiff(attendance.checkInTime, dateTimeNow)
                      updateAttendance(token, attendance._id, dateTimeNow ,  duration>= lesson.duration )
                      setAttendance({ ...attendance, checkOutTime: dateTimeNow });
                    }
                  }, 100)


                  // videoRef.current?.srcObject?.getTracks()[0].stop();

                  return;
                  //             setCaptureVideo(false);
                  //           }, 7000);
                }

                // alert(label) 
              }

              )

              // canvasRef &&
              //   canvasRef.current &&
              //   canvasRef.current
              //     .getContext("2d")
              //     .clearRect(0, 0, videoWidth, videoHeight);
              // canvasRef &&
              //   canvasRef.current &&
              //   faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
              // canvasRef &&
              //   canvasRef.current &&
              //   faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
              // canvasRef &&
              //   canvasRef.current &&
              //   faceapi.draw.drawFaceExpressions(
              //     canvasRef.current,
              //     resizedDetections
              //   );
            }

            // closeWebcam()
            catch (e) {
              console.log(e)

            }
          }

        }
      }, 1000);
    };
  }

  const closeWebcam = () => {

    // navigator.mediaDevices.getUserMedia().
    var pausePromise = videoRef.current?.pause();
    if (pausePromise !== undefined) {
      pausePromise.then((res: any) => {

        // Automatic playback started!
        // Show playing UI.
      })
        .catch((e: any) => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    // videoRef.current?.pause();
    videoRef.current?.srcObject?.getTracks().forEach((track: any) => track.stop())
    setCaptureVideo(false);

  };

  return (
    <div className="w-[90%] h-[90%] flex items-center justify-center">
      {/* <div style={{ textAlign: "center", padding: "10px" }}> */}
      {/* {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Open Webcam
          </button>
        )} */}
      {/* </div> */}
      {captureVideo ? (
        modelsLoaded ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="flex justify-center items-center w-full h-full p-8"
            >
              <video
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: "10px", position: "absolute" }}
              />
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#00000007]"><DotFlashing></DotFlashing></div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export default Attendify;
