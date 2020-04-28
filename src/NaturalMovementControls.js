import * as THREE from "three";
import p5 from "p5";

class NaturalMovementControls {

    constructor(object) {
        this.object = object;

        this.clock = new THREE.Clock();
        this.movementSpeed = 1.0;

        var _onKeyDown = this.onKeyDown.bind(this);
        var _onKeyUp= this.onKeyUp.bind(this);
        window.addEventListener( 'keydown', _onKeyDown, false );
	    window.addEventListener( 'keyup', _onKeyUp, false );

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
        let delta = this.clock.getDelta();
        let actualMoveSpeed = delta * this.movementSpeed;

        if ( this.moveForward ) this.object.translateZ( - ( actualMoveSpeed ) );
        if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

        if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
        if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

        if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
        if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
    }

}

export default NaturalMovementControls;