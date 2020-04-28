import * as THREE from "three";
import p5 from "p5";
import { Water } from 'three/examples/jsm/objects/Water2';
import NaturalMovementControls from './NaturalMovementControls';
import Block from "./block";
import waterMap1 from "./Water_1_M_Normal.jpg";
import waterMap2 from "./Water_2_M_Normal.jpg";
import image1 from "./image1.jpg";
import image2 from "./image2.jpg";
import Product from "./product";


class DigitalPopup {

    constructor(options) {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.p5 = new p5();
        this.cameraXIncrement = 0;
        this.cameraYIncrement = 1000;
        this.cameraZIncrement = 2000;
        this.animate = this.animate.bind(this);
        this.init();
        this.animate();
    }

    init() {
        var USE_WIREFRAME = false;
        // Get a reference to the container element that will hold our scene
        var container = document.querySelector( '#scene-container' );
        // create a Scene
        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color( 0xFFFFFF );

        // set up the options for a perspective camera
        const fov = 35; // fov = Field Of View
        const aspect = container.clientWidth / container.clientHeight;
        const near = 0.1;
        const far = 300;

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set( 0, 20, 0 );
        this.camera.lookAt(new THREE.Vector3(0,20,-40));

        this.camControls = new NaturalMovementControls(this.camera);
        this.camControls.movementSpeed = 6;
        this.addRandomBlocks();

        var productMesh = new Product({
            width: 20,
            height: 20,
            image: image1
        });
        productMesh.position.y = 10;
        productMesh.position.z = -49.9;

        this.scene.add(productMesh);

        var productMesh1 = new Product({
            width: 20,
            height: 20,
            image: image2
        });
        productMesh1.position.y = 10;
        productMesh1.position.x = -49.9;
        productMesh1.position.z = 0;
        productMesh1.rotation.y += Math.PI / 2;
        this.scene.add(productMesh1);

        // water

        var waterGeometry = new THREE.PlaneBufferGeometry(  100, 100, 10, 10 );
        var textureLoader = new THREE.TextureLoader();

        var water = new Water( waterGeometry, {
            color: "#FFEFE5",
            scale: 1,
            flowDirection: new THREE.Vector2( 1, 1 ),
            normalMap0: textureLoader.load( waterMap1 ),
            normalMap1: textureLoader.load( waterMap2 )
        } );

        

        water.position.y = 0.5;
        water.rotation.x = Math.PI * - 0.5;
        this.scene.add( water );

        // create a Mesh containing the geometry and material
        var meshFloor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 10, 10 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) );

        meshFloor.rotation.x -= Math.PI / 2;
	   // Floor can have shadows cast onto it
	    meshFloor.receiveShadow = true;
        // add the mesh to the scene object
        this.scene.add( meshFloor );
    
        var meshWall1 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 40, 20, 20 ), new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide, wireframe:USE_WIREFRAME}) );
        meshWall1.position.z = -50;
        meshWall1.position.y = 20;
	    meshWall1.receiveShadow = true;
        this.scene.add( meshWall1 );

        var meshWall2 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 40, 20, 20 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME, side: THREE.DoubleSide}) );
        meshWall2.position.z = 50;
        meshWall2.position.y = 20;
	    meshWall2.receiveShadow = true;
        this.scene.add( meshWall2 );

        var meshWall3 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 40, 20, 20 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME, side: THREE.DoubleSide}) );
        meshWall3.rotation.y -= Math.PI / 2;
        meshWall3.position.x = -50;
        meshWall3.position.y = 20;
	    meshWall3.receiveShadow = true;
        this.scene.add( meshWall3 );

        var meshWall4 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 40, 20, 20 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME, side: THREE.DoubleSide}) );
        meshWall4.rotation.y -= Math.PI / 2;
        meshWall4.position.x = 50;
        meshWall4.position.y = 20;
	    meshWall4.receiveShadow = true;
        this.scene.add( meshWall4 );

        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.85);
        // remember to add the light to the scene
        this.scene.add( ambientLight );

        // Create a directional light
        const light = new THREE.PointLight( 0xffffff, 0.15, 120 );
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 300;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        // move the light back and up a bit
        light.position.set( 0, 60, -10 );

        // remember to add the light to the scene
        this.scene.add( light );

        // create a WebGLRenderer and set its width and height
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( container.clientWidth, container.clientHeight );

        // Enable Shadows in the Renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.setPixelRatio( window.devicePixelRatio );

        // add the automatically created <canvas> element to the page
        container.appendChild( this.renderer.domElement );

        //this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    }

    addRandomBlocks() {
        for(var i = 0; i < 80; i++) {
            let height = this.random( 1, 14);
            let base = this.random( 2, 5);
            var mesh = new Block({
                width: base,
                height: height,
                depth: base,
                x: this.random( -40, 40),
                y: height/2,
                z: this.random( -40, 40)
            });
            this.scene.add( mesh );
        }
        
    }

    getNoiseValues() {
        let xNoise = this.p5.noise(this.cameraXIncrement);
        let yNoise = this.p5.noise(this.cameraYIncrement);
        let zNoise = this.p5.noise(this.cameraZIncrement);

        this.cameraXIncrement += 0.002;
        this.cameraYIncrement += 0.002;
        this.cameraZIncrement += 0.002;

        return {
            x: xNoise,
            y: yNoise,
            z: zNoise
        }
    }

    updateCamera() {
        let noise = this.getNoiseValues();
        this.camera.lookAt(new THREE.Vector3((noise.x - 0.5) * (20*2),noise.y*20,(noise.z * 0.5) * -100 ));
    }

    animate() {

        // call animate recursively
        requestAnimationFrame( this.animate );
        //this.updateCamera();
        this.camControls.update();
        
        // render, or 'create a still image', of the scene
        // this will create one still image / frame each time the animate
        // function calls itself
        this.renderer.render( this.scene, this.camera );
      
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

}

export default DigitalPopup;