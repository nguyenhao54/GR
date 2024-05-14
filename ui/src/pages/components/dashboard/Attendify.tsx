import * as faceapi from "face-api.js";
import React, { useEffect } from "react";
import { AppState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../../redux/dialog.reducer";
import { DotFlashing } from "../../../common";
import { createAttendance, updateAttendance } from "../../../api/attendance";
import { getCookie } from "./AttendanceCard";
import { addSevenHours } from "../../../utils";
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';

function minutesDiff(dateTimeValue2: any, dateTimeValue1: any) {
  var differenceValue =
    (new Date(dateTimeValue2).getTime() - new Date(dateTimeValue1).getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}

function Attendify({ attendance, setAttendance, lesson }: any) {
  const user = useSelector((appState: AppState) => appState.user.user)
  const dispatch = useDispatch();
 
  const [modelsLoaded, setModelsLoaded] = React.useState<boolean>(false);
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
        if (canvasRef?.current) {
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
            let refFaceData = await faceapi.detectAllFaces(refFace, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            try {

              const detections = await faceapi
                .detectAllFaces(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceDescriptors()

              if (!detections || !videoRef.current) { return }
              const resizedDetections = faceapi.resizeResults(
                detections,
                videoRef.current
              );

              let faceMatcher = new faceapi.FaceMatcher(refFaceData)
              resizedDetections.forEach(async face => {
                const { detection, descriptor } = face;
                let label = faceMatcher.findBestMatch(descriptor).toString();
                if (label.includes("unknown")) {
                  return
                } else {
                  clearInterval(myInterval)

                  let options = { label: user.name };
                  const drawBox = new faceapi.draw.DrawBox(detection.box, options)
                  canvasRef.current
                    .getContext("2d")
                    .clearRect(0, 0, videoWidth, videoHeight);
                  let pausePromise = videoRef.current?.pause();
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

                  videoRef.current?.srcObject?.getTracks()[0].stop();
                  drawBox.draw(canvasRef.current);

                  dispatch(showTopLoading())
                  setTimeout(() => {
                    closeWebcam();
                    dispatch(setDialog({
                      open: false
                    }))
                    const token = getCookie("token")
                    const dateTimeNow = addSevenHours((new Date()).toISOString())
                    if (!attendance?.checkInTime)
                      createAttendance(token, lesson._id, dateTimeNow, user._id).then(res =>
                        setAttendance({ checkInTime: dateTimeNow })
                      ).catch(err => console.log(err))
                    else {
                      const duration = minutesDiff(attendance.checkInTime, dateTimeNow)
                      updateAttendance(token, attendance._id, dateTimeNow, duration >= lesson.duration)
                      setAttendance({ ...attendance, checkOutTime: dateTimeNow });
                    }
                    dispatch(closeTopLoading())
                  }, 3500)
                }
              }
              )
            }
            catch (e) {
              throw new Error("Something went wrong")
              // console.log(e)
            }
          }

        }
      }, 1500);
    };
  }

  const closeWebcam = () => {

    // navigator.mediaDevices.getUserMedia().
    let pausePromise = videoRef.current?.pause();
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
    <div className="flex items-center justify-center">
      {captureVideo ? (
        modelsLoaded ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="flex justify-center items-center w-full h-full"
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
