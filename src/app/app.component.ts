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
  public obj3DArr = [];

  ngOnInit() {
    this.init();
  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('black');

    this.camera.position.z = 5;
    this.camera.lookAt(0, 0, 0);
    this.orbControls.target.set(0, 0, 0);
    this.orbControls.update();

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

  public makeInstance(geometry, color, x, texture?) {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture ? texture : null
    });

    const obj3D = new THREE.Mesh(geometry, material);
    this.scene.add(obj3D)

    obj3D.position.x = x;
    return obj3D;
  }

  public addLight(color, intensity, ...pos) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(pos[0], pos[1], pos[2]);
    this.scene.add(light);
  }
}
