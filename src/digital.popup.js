import * as THREE from "three";
import p5 from "p5";
import { Water } from 'three/examples/jsm/objects/Water2';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import NaturalMovementControls from './NaturalMovementControls';
import Block from "./block";
import NoiseWall from './NoiseWall';
import NoiseSphere from './NoiseSphere';
import waterMap1 from "./Water_1_M_Normal.jpg";
import waterMap2 from "./Water_2_M_Normal.jpg";
import shirt from "./Tshirt_obj.obj";
import raptor from "./raptor_01.obj";
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
        this.blocks = [];
        this.PLAYERCOLLISIONDISTANCE = 10;
        this.cameraXIncrement = 0;
        this.cameraYIncrement = 1000;
        this.cameraZIncrement = 2000;
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onInstructionsClick = this.onInstructionsClick.bind(this);
        this.onInstructionsLock = this.onInstructionsLock.bind(this);
        this.onInstructionsUnlock = this.onInstructionsUnlock.bind(this);
        this.animate = this.animate.bind(this);
        this.init();
        this.animate();
    }

    init() {
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );

        var USE_WIREFRAME = false;
        this.mouse = new THREE.Vector2();
        this.direction = new THREE.Vector3();
        this.INTERSECTED = null;
        // Get a reference to the container element that will hold our scene
        var container = document.querySelector( '#scene-container' );
        this.instructions = document.querySelector( '#instructions' );
        this.instructions.addEventListener("click", this.onInstructionsClick);
        // create a Scene
        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color( 0xFFFFFF );

        // set up the options for a perspective camera
        const fov = 35; // fov = Field Of View
        const aspect = container.clientWidth / container.clientHeight;
        const near = 0.1;
        const far = 300;

        this.loader = new OBJLoader();

        var self = this;

        var shirtMat = new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide});
        // load a resource  
        this.loader.load(
            // resource URL
            shirt,
            // called when resource is loaded
            function ( object ) {
                object.scale.set(0.09,0.09,0.09);
                object.position.set(0,1,-30);
                object.traverse(function(child){child.castShadow = true; child.material = shirtMat});
                self.scene.add( object );

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

        this.loader2 = new OBJLoader();
        this.loader2.load(
            // resource URL
            raptor,
            // called when resource is loaded
            function ( object ) {
                object.scale.set(20,20,20);
                object.position.set(-30,0,-20);
                object.traverse(function(child){child.castShadow = true; child.material = shirtMat});
                self.scene.add( object );

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

        this.raycaster = new THREE.Raycaster();
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set( 0, 20, 0 );
        this.camera.lookAt(new THREE.Vector3(0,20,-40));

        this.camControls = new NaturalMovementControls(this.camera);
        this.camControls.movementSpeed = 6;

        this.camControls.addEventListener( 'lock', this.onInstructionsLock );

        this.camControls.addEventListener( 'unlock', this.onInstructionsUnlock);
        this.addRandomBlocks();
        this.addPillars();


        var ceilLight = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 4, 4 ), new THREE.MeshStandardMaterial({
            emissive: 0xffffff,
            emissiveIntensity: 1,
            side: THREE.DoubleSide,
            color: 0xE83100
          }) );
        ceilLight.position.y = 39;
        ceilLight.rotation.x += Math.PI / 2;
        this.scene.add(ceilLight);

        var productMesh = new Product({
            width: 20,
            height: 20,
            image: image1
        });
        productMesh.position.y = 15;
        productMesh.position.z = -48;

        this.scene.add(productMesh);

        var productMesh1 = new Product({
            width: 20,
            height: 20,
            image: image2
        });
        productMesh1.position.y = 15;
        productMesh1.position.x = -48;
        productMesh1.position.z = 0;
        productMesh1.rotation.y += Math.PI / 2;
        this.scene.add(productMesh1);

        // water

        var waterGeometry = new THREE.PlaneBufferGeometry(  100, 100, 4, 4 );
        var textureLoader = new THREE.TextureLoader();

        this.water = new Water( waterGeometry, {
            color: "#FAFCFF",
            scale: 4,
            flowDirection: new THREE.Vector2( 1, 1 ),
            normalMap0: textureLoader.load( waterMap1 ),
            normalMap1: textureLoader.load( waterMap2 )
        } );

        

        this.water.position.y = -0.5;
        this.water.rotation.x = Math.PI * - 0.5;
        this.scene.add( this.water );

        // create a Mesh containing the geometry and material
        var meshFloor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 4, 4 ), new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME}) );

        meshFloor.rotation.x -= Math.PI / 2;
	   // Floor can have shadows cast onto it
	    meshFloor.receiveShadow = true;
        // add the mesh to the scene object
        this.scene.add( meshFloor );

        var meshCeil = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100, 4, 4 ), new THREE.MeshPhongMaterial({color:0xffffff}) );

        meshCeil.rotation.x += Math.PI / 2;

        meshCeil.position.y = 40;
	   // Floor can have shadows cast onto it
	    meshCeil.receiveShadow = true;
        // add the mesh to the scene object
        this.scene.add( meshCeil );

        this.meshWall1 = new NoiseWall({
            width: 100,
            height: 40,
            widthDiv: 50,
            heightDiv: 50,
            enabled: true
        });
    
        this.meshWall1.mesh.position.z = -50;
        this.meshWall1.mesh.position.y = 20;
        this.scene.add( this.meshWall1.mesh );

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

        const ambientLight = new THREE.AmbientLight( 0xffffff, 0.92);
        // remember to add the light to the scene
        this.scene.add( ambientLight );

        // Create a directional light
        this.light = new THREE.PointLight( 0xffffff, 0.2, 120 );
        this.light.castShadow = true;
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 300;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        // move the light back and up a bit
        this.light.position.set( 0, 60, -30 );

        // remember to add the light to the scene
        this.scene.add( this.light );

        // create a WebGLRenderer and set its width and height
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( container.clientWidth, container.clientHeight );

        // Enable Shadows in the Renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //this.renderer.setPixelRatio( window.devicePixelRatio );

        // add the automatically created <canvas> element to the page
        container.appendChild( this.renderer.domElement );

        //this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    }

    onInstructionsClick() {
        this.camControls.lock();
    }

    onInstructionsLock() {
        this.instructions.style.display = "none";
    }

    onInstructionsUnlock() {
        this.instructions.style.display = "block";
    }

    onDocumentMouseMove( event ) {

        event.preventDefault();

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    addRandomBlocks() {
        for(var i = 0; i < 50; i++) {
            let height = this.random( 1, 10);
            let base = this.random( 2, 5);
            var mesh = new Block({
                width: base,
                height: height,
                depth: base,
                x: this.random( -40, 40),
                y: height/2,
                z: this.random( -40, 40)
            });
            this.blocks.push(mesh);
            this.scene.add( mesh );
        }
        
    }

    addPillars() {
        var geometryCylinder = new THREE.CylinderBufferGeometry( 2, 2, 40, 32 );
        var materialCylinder = new THREE.MeshPhongMaterial( {color: 0xffffff} );
        var cylinder = new THREE.Mesh( geometryCylinder, materialCylinder );
        cylinder.receiveShadow = true;
        cylinder.castShadow = true;
        cylinder.position.y = 20;
        cylinder.position.x = 35;
        cylinder.position.z = 35;

        var cylinder2 = new THREE.Mesh( geometryCylinder, materialCylinder );
        cylinder2.receiveShadow = true;
        cylinder2.castShadow = true;
        cylinder2.position.y = 20;
        cylinder2.position.x = -35;
        cylinder2.position.z = -35;

        this.scene.add(cylinder);
        this.scene.add(cylinder2);
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

    detectPlayerCollision() {
        // The rotation matrix to apply to our direction vector
        // Undefined by default to indicate ray should coming from front
        var rotationMatrix;
        // Get direction of camera
        var cameraDirection = this.camControls.getDirection(new THREE.Vector3(0, 0, 0));
    
        // Check which direction we're moving (not looking)
        // Flip matrix to that direction so that we can reposition the ray
        if (this.camControls.moveBackward) {
            rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(this.degreesToRadians(180));
        }
        else if (this.camControls.moveLeft) {
            rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(this.degreesToRadians(90));
        }
        else if (this.camControls.moveRight) {
            rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(this.degreesToRadians(270));
        }
    
        // Player is not moving forward, apply rotation matrix needed
        if (rotationMatrix !== undefined) {
            cameraDirection.applyMatrix4(rotationMatrix);
        }
    
        // Apply ray to player camera
        var rayCaster = new THREE.Raycaster(this.camera.position, cameraDirection);
    
        // If our ray hit a collidable object, return true
        if (this.rayIntersect(rayCaster, this.PLAYERCOLLISIONDISTANCE)) {
            return true;
        } else {
            return false;
        }
    }

    rayIntersect(ray, distance) {
        var intersects = ray.intersectObjects(this.blocks);
        for (var i = 0; i < intersects.length; i++) {
            // Check if there's a collision
            if (intersects[i].distance < distance) {
                return true;
            }
        }
        return false;
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    animate() {

        // call animate recursively
        requestAnimationFrame( this.animate );
        this.stats.begin();
        this.camControls.update();
        this.meshWall1.update();
    
        //console.log(this.detectPlayerCollision());
    
        // render, or 'create a still image', of the scene
        // this will create one still image / frame each time the animate
        // function calls itself
        this.renderer.render( this.scene, this.camera );
        this.stats.end();
      
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

}

export default DigitalPopup;