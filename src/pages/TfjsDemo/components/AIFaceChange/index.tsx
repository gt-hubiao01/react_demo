// 导入所需的依赖包
const tf = require('@tensorflow/tfjs-node')
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection')

// 加载面部关键点检测模型
const loadModel = async () => {
  const model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
    { shouldLoadIrisModel: false }
  )
  return model
}

export default function AIFaceChange() {

}
