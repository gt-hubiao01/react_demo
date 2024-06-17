import * as Three from 'three'

export function createWorld() {
  initRender() //创建渲染器
  initCamera() //创建相机
  initLight() //创建光源
  initObject() //创建物体
  initScene() //创建场景
  render() //渲染
}

let renderer: Three.WebGLRenderer // 渲染器
let width: number
let height: number

export function initRender() {
  width = window.innerWidth
  height = window.innerHeight
  renderer = new Three.WebGLRenderer({
    antialias: true, //抗锯齿开启
  })
  renderer.setSize(width, height) //设置渲染器宽度和高度
  renderer.setClearColor('#fff', 1.0) //设置背景颜色
  renderer.setPixelRatio(window.devicePixelRatio) //设置设备像素比
  document.getElementById('retina')?.appendChild(renderer.domElement) //把渲染器放置到页面中
}

let camera: Three.Camera
const originPoint = new Three.Vector3(0, 0, 0)

export function initCamera() {
  camera = new Three.PerspectiveCamera(45, width / height, 1, 1000)
  camera.position.set(200, 400, 600) //设置相机位置
  camera.up.set(0, 1, 0) // 设置相机正方向
  camera.lookAt(originPoint) //设置相机视点
}

let pointLight: Three.Object3D<Three.Object3DEventMap>
let ambientLight: Three.Object3D<Three.Object3DEventMap>

export function initLight() {
  // 电光源
  pointLight = new Three.PointLight('#fff', 1, 2000)
  pointLight.position.set(70, 112, 98)
  // 环境光
  ambientLight = new Three.AmbientLight('#fff')
}

let cube: Three.Object3D<Three.Object3DEventMap>

export function initObject() {
  const geometry = new Three.BoxGeometry(100, 100, 100)
  const material = new Three.MeshLambertMaterial({ color: '#ff0000' })
  cube = new Three.Mesh(geometry, material)
  cube.position.set(0, 0, 0)
}

let scene: Three.Object3D<Three.Object3DEventMap>

export function initScene() {
  scene = new Three.Scene()
  scene.add(pointLight)
  scene.add(ambientLight)
  scene.add(cube)
}

export function render() {
  renderer.clear()
  renderer.render(scene, camera)
  cube.rotation.x += 0.005
  cube.rotation.y += 0.005
  requestAnimationFrame(render)
}
