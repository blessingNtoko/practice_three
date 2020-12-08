import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  public orbControls = new OrbitControls(this.camera, this.renderer.domElement);
  public textureLoad = new THREE.TextureLoader();
  public roomObjArr = [];

  ngOnInit() {
    this.init();
  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.physicallyCorrectLights = true;
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('grey');

    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 10, 0);
    this.orbControls.target.set(0, 0, 0);
    this.orbControls.update();

    this.addLight('white', 1, 0, 10, 0);

    {
      const texture = this.textureLoad.load('../assets/textures/stars.jpg');
      const cubeSize = 10;
      const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMesh = this.makeInstance(cubeGeo, 'white', null, THREE.BackSide);
      cubeMesh.position.set(0, cubeSize / 2 + .01, 0);
    }

    {
      const mainTable = new THREE.Object3D();
      const size = 4;
      const tableGeo = new THREE.BoxBufferGeometry(size - 1, size / 16, size / 2.75);
      const tableTop = this.makeInstance(tableGeo, 'black');
      const tableLegGeo = new THREE.BoxBufferGeometry(size / 20, 1.3, size / 2.75);
      const tableLeg1 = this.makeInstance(tableLegGeo, 'black');
      const tableLeg2 = this.makeInstance(tableLegGeo, 'black');
      mainTable.add(tableTop);
      mainTable.add(tableLeg1);
      mainTable.add(tableLeg2);
      tableLeg1.position.set(size / 2.85, -.75, 0);
      tableLeg2.position.set(-size / 2.85, -.75, 0);
      mainTable.position.set(0, 1.4, -4.3);
      this.scene.add(mainTable);
      this.roomObjArr.push(mainTable);
    }

    {
      const sideTable = new THREE.Object3D();
      const size = 4;
      const tableGeo = new THREE.BoxBufferGeometry(size / 3 + .5, size / 20, size / 2.85);
      const tableTop = this.makeInstance(tableGeo, 'grey');
      const tableLegGeo = new THREE.BoxBufferGeometry(size / 50, 1.25, size / 3);
      const tableLeg1 = this.makeInstance(tableLegGeo, 'grey');
      const tableLeg2 = this.makeInstance(tableLegGeo, 'grey');
      sideTable.add(tableTop);
      sideTable.add(tableLeg1);
      sideTable.add(tableLeg2);
      tableLeg1.position.set(2 / 1.85, -.75, 0);
      tableLeg2.position.set(-2 / 1.85, -.75, 0);
      sideTable.rotation.y = Math.PI * -.5;
      sideTable.position.set(-size + 1.75, 1.4, -4.3);
      this.scene.add(sideTable);
    }

    // {
    //   const planeSize = 40;
    //   const texture = this.textureLoad.load('../assets/textures/checker.png');
    //   texture.wrapS = THREE.RepeatWrapping;
    //   texture.wrapT = THREE.RepeatWrapping;
    //   texture.magFilter = THREE.NearestFilter;
    //   const repeats = planeSize / 2;
    //   texture.repeat.set(repeats, repeats);

    //   const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    //   const planeMesh = this.makeInstance(planeGeo, 'white', texture, THREE.DoubleSide);
    //   console.log('Plane Mesh ->', planeMesh);

    //   planeMesh.rotation.x = Math.PI * -.5;
    // }

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    const animate = (time) => {
      time *= .001;

      this.orbControls.update();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

  }

  public makeInstance(geometry, color?, texture?, side?) {
    try {

      const material = new THREE.MeshStandardMaterial({
        color: color ? color : 'white',
        map: texture ? texture : null,
        side: side ? side : null
      });

      const obj3D = new THREE.Mesh(geometry, material);
      this.scene.add(obj3D);

      return obj3D;
    } catch (error) {
      console.error('Error when making instance ->', error);
    }
  }

  public addLight(color, intensity, ...pos) {
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(pos[0], pos[1], pos[2]);
    this.scene.add(light);

    if (this.renderer.physicallyCorrectLights) {
      light.power = 800;
      light.decay = 2;
      light.distance = Infinity;
    }
  }
}
