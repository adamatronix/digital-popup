import * as THREE from "three";
import {
	Euler,
	EventDispatcher,
	Vector3
} from "three/build/three.module";
import p5 from "p5";

class NaturalMovementControls {

    constructor(object, domElement) {

        if ( domElement === undefined ) {
            console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
            this.domElement = document.body;
    
        }

        this.object = object;
        this.euler = new Euler( 0, 0, 0, 'YXZ' );
        this.PI_2 = Math.PI / 2;
        this.isLocked = false; 

        this.lockEvent = { type: 'lock' };
	    this.unlockEvent = { type: 'unlock' };

        this.clock = new THREE.Clock();
        this.movementSpeed = 1.0;
        this.viewHalfX = 0;
	    this.viewHalfY = 0;

        var _onPointerlockChange = this.onPointerlockChange.bind( this );
        var _onMouseMove = this.onMouseMove.bind( this );
        var _onKeyDown = this.onKeyDown.bind( this );
        var _onKeyUp= this.onKeyUp.bind( this );

        this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
        window.addEventListener( 'keydown', _onKeyDown, false );
        window.addEventListener( 'keyup', _onKeyUp, false );
        document.addEventListener( 'pointerlockchange', _onPointerlockChange, false );

    }

    onMouseMove( event ) {

		if ( this.isLocked === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		this.euler.setFromQuaternion( this.object.quaternion );

		this.euler.y -= movementX * 0.002;
		this.euler.x -= movementY * 0.002;

		this.euler.x = Math.max( - this.PI_2, Math.min( this.PI_2, this.euler.x ) );
		this.object.quaternion.setFromEuler( this.euler );
    }

    onPointerlockChange() {
        console.log("yo");

		if ( document.pointerLockElement === this.domElement ) {

			this.dispatchEvent( this.lockEvent );

			this.isLocked = true;

		} else {

			this.dispatchEvent( this.unlockEvent );

			this.isLocked = false;

		}

	}
    
    lock() {
        this.domElement.requestPointerLock();
	}

	unlock() {
		document.exitPointerLock();
	}

    onKeyDown( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

		}
	}

	onKeyUp( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

    }
    
    update() {
       /* let delta = this.clock.getDelta();
        let actualMoveSpeed = delta * this.movementSpeed;

        console.log(this.mouseX);

        if ( this.moveForward ) this.object.translateZ( - ( actualMoveSpeed ) );
        if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

        if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
        if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

        if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
        if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
        */
    }

}

Object.assign( NaturalMovementControls.prototype, EventDispatcher.prototype );
export default NaturalMovementControls;