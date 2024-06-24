import * as faceapi from "face-api.js";
import React, { useEffect } from "react";
import { AppState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setDialog } from "../../../redux/dialog.reducer";
import { DotFlashing } from "../../../common";
import { createAttendance, updateAttendance } from "../../../api/attendance";
import { getCookie } from "./AttendanceCard";
import { closeTopLoading, showTopLoading } from '../../../redux/toploading.reducer';
import { setAttendify } from '../../../redux/attendifly.reducet';

const asyncIntervals: any = [];

const runAsyncInterval = async (cb: any, interval: any, intervalIndex: any) => {
  await cb();
  if (asyncIntervals[intervalIndex].run) {
    asyncIntervals[intervalIndex].id = setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval)
  }
};

const setAsyncInterval = (cb: any, interval: any) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push({ run: true, id: intervalIndex })
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error('Callback must be a function');
  }
};

const clearAsyncInterval = (intervalIndex: any) => {
  if (asyncIntervals[intervalIndex]?.run) {
    clearTimeout(asyncIntervals[intervalIndex]?.id)
    asyncIntervals[intervalIndex].run = false
  };
}

function minutesDiff(dateTimeValue2: any, dateTimeValue1: any) {
  var differenceValue =
    (new Date(dateTimeValue2).getTime() - new Date(dateTimeValue1).getTime()) / 1000;
  differenceValue /= 60;
  return Math.abs(Math.round(differenceValue));
}

function Attendify({ attendance, setAttendance, lesson }: any) {
  const user = useSelector((appState: AppState) => appState.user.user)
  const { captureVideo } = useSelector((appState: AppState) => appState.attendify.attendify || { captureVideo: false })

  const dispatch = useDispatch();
  const [modelsLoaded, setModelsLoaded] = React.useState<boolean>(false);
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
          // console.log("playyyy")

          // Show loading animation.
          var playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then((_res: any) => {
              // Automatic playback started!
              // Show playing UI.
            })
              .catch((_e: any) => {
                // Auto-play was prevented
                // Show paused UI.
              });
          }
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });

    return () => {
      // dispatch(setAttendify({ captureVideo: false }))  
      asyncIntervals.forEach((_item: any, index: number) => { clearAsyncInterval(index); })
      videoRef.current?.srcObject?.getTracks().forEach((track: any) => track.stop())
    }
  }, [captureVideo])


  const checkIsValid = async () => {
    if (user?.photo) {
      try {
        const refFace = await faceapi.fetchImage(user.photo);
        let refFaceData = await faceapi.detectAllFaces(refFace, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
        // console.log("done detection")

        if (!detections || !videoRef.current) { return }
        const resizedDetections = faceapi.resizeResults(
          detections,
          videoRef.current
        );

        let faceMatcher = new faceapi.FaceMatcher(refFaceData)
        resizedDetections.every(async face => {
          const { detection, descriptor } = face;
          let label = faceMatcher.findBestMatch(descriptor).toString();
          if (label.includes("unknown")) {
            // console.log("false")
            return true
          } else {
            // console.log("true")
            // console.log(asyncIntervals)
            // clearAsyncInterval(myInterval)
            asyncIntervals.forEach((_item: any, index: number) => { clearAsyncInterval(index); })
            // console.log(asyncIntervals)

            let options = { label: user.name };
            const drawBox = new faceapi.draw.DrawBox(detection.box, options)
            canvasRef.current
              .getContext("2d")
              .clearRect(0, 0, videoWidth, videoHeight);
            let pausePromise = videoRef.current?.pause();
            if (pausePromise !== undefined) {
              pausePromise.then((_res: any) => {

                // Automatic playback started!
                // Show playing UI.
              })
                .catch((_e: any) => {
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
              const dateTimeNow = (new Date()).toISOString()
              if (!attendance?.checkInTime)
                createAttendance(token, lesson._id, dateTimeNow, user._id).then(res => {
                  if (res?.status === "success") {
                    setAttendance({ checkInTime: dateTimeNow, ...res.data.data })
                    dispatch(setDialog({
                      title: "Check-in thành công",
                      open: true,
                      type: "info",
                      isMessagebar: true
                    }))

                  }
                }
                ).catch(err => console.log(err))
              else {
                const duration = minutesDiff(attendance.checkInTime, dateTimeNow)
                updateAttendance(token, attendance._id, dateTimeNow, duration >= lesson.duration).then((res) => {
                  console.log(res)
                  if (res?.status === "success") {
                    setAttendance({ ...attendance, checkOutTime: dateTimeNow });
                    dispatch(setDialog({
                      title: "Check-out thành công",
                      open: true,
                      type: "info",
                      isMessagebar: true
                    }))
                  }
                  else {
                    dispatch(setDialog({
                      title: "Check-out thất bại, vui lòng thử lại sau",
                      open: true,
                      type: "warning",
                      isMessagebar: true
                    }))

                  }
                })
              }
              dispatch(closeTopLoading())

            }, 500)
            return false;
          }
        }
        )
      }
      catch (e) {
        closeWebcam();
        dispatch(setDialog({
          open: false
        }))
        dispatch(setDialog({
          title: "Có lỗi sảy ra, vui lòng thử lại sau",
          open: true,
          type: "warning",
          isMessagebar: true
        }))
        throw new Error("Something went wrong")
        // console.log(e)
      }
    }
  }

  const handleVideoOnPlay = async () => {
    if (asyncIntervals.length === 0)
      setTimeout(() => {
        if (videoRef.current && captureVideo) {
          let myInterval = setAsyncInterval(async () => {
            if (canvasRef?.current) {
              try {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
                  videoRef.current
                );
                const displaySize = {
                  width: videoWidth - 40,
                  height: videoHeight - 40,
                };

                faceapi.matchDimensions(canvasRef.current, displaySize);
              } catch (e) {
                // throw new Error("cannot create canvas")
              } finally {
                await checkIsValid()
              }
            }
            else {
              await Promise.resolve();
              clearAsyncInterval(myInterval)
            }
          }, 100);
        }
      }, 100) //waiting for the media to be loaded
  }

  const closeWebcam = () => {
    // navigator.mediaDevices.getUserMedia().
    let pausePromise = videoRef.current?.pause();
    if (pausePromise !== undefined) {
      pausePromise.then((_res: any) => {

        // Automatic playback started!
        // Show playing UI.
      })
        .catch((_e: any) => {
          // Auto-play was prevented
          // Show paused UI.
        });
    }
    videoRef.current?.srcObject?.getTracks().forEach((track: any) => track.stop())
    dispatch(setAttendify({ captureVideo: false }))
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