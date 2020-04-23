import * as THREE from "three";
var OrbitControls = require('three-orbit-controls')(THREE);


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
        const far = 100;

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set( 0, 0, 10 );

        // create a geometry
        const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

        // create the floor
        const floor = new THREE.PlaneGeometry( 20, 20, 20, 20 );
        
        // create a Mesh containing the geometry and material
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) );

        mesh.position.y = 1;
        // add the mesh to the scene object
        mesh.receiveShadow = true;
	    mesh.castShadow = true;
        this.scene.add( mesh );

        // create a Mesh containing the geometry and material
        var meshFloor = new THREE.Mesh( floor, new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) );

        // add the mesh to the scene object
        this.scene.add( mesh );


        meshFloor.rotation.x -= Math.PI / 2;
	   // Floor can have shadows cast onto it
	    meshFloor.receiveShadow = true;
        // add the mesh to the scene object
        this.scene.add( meshFloor );
        

        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.9);
        // remember to add the light to the scene
        this.scene.add( ambientLight );

        // Create a directional light
        const light = new THREE.PointLight( 0xffffff, 0.1, 20 );
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 25;

        // move the light back and up a bit
        light.position.set( -6, 6, -6 );

        // remember to add the light to the scene
        this.scene.add( light );

        // create a WebGLRenderer and set its width and height
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( container.clientWidth, container.clientHeight );

        // Enable Shadows in the Renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        this.renderer.setPixelRatio( window.devicePixelRatio );

        // add the automatically created <canvas> element to the page
        container.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
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

}

export default DigitalPopup;