import * as THREE from "three";
var OrbitControls = require('three-orbit-controls')(THREE);
import Block from "./block";


class DigitalPopup {

    constructor(options) {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
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
        this.camera.position.set( 0, 0, 10 );

        // create a geometry
        const geometry = new THREE.BoxBufferGeometry( 2, 4, 2 );
    

        this.addRandomBlocks();

        // create a Mesh containing the geometry and material
        var meshFloor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 100, 100 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) );

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

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    }

    addRandomBlocks() {
        for(var i = 0; i < 100; i++) {
            let height = this.random( 1, 11);
            let base = this.random( 2, 3);
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

    animate() {

        // call animate recursively
        requestAnimationFrame( this.animate );
        
        this.controls.update();
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