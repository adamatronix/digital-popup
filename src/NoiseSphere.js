import * as THREE from "three";
import p5 from "p5";

class NoiseSphere {

    constructor(options) {

        this.options = options;
        this.scene = this.options.scene;
        this.p5 = new p5();
        this.mesh = this.createMesh();
        this.increment = 0;
        this.circle = new THREE.Object3D();
        this.circle.add(this.mesh);
        this.scene.add(this.circle);
        this.circle.position.set( 0, 20, 0);
        //this.setLights();

        this.vertices = this.mesh.geometry.vertices;

    }

    createMesh() {
        
        const geometry = new THREE.IcosahedronGeometry(5, 1);
        // create a Mesh containing the geometry and material
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading} ));
        this.mesh.receiveShadow = true;

        return this.mesh;
    }

    setLights() {
        var lights = [];
        lights[0] = new THREE.DirectionalLight( 0x7EFF99, 1 );
        lights[0].position.set( 10, 5, -20);
        lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
        lights[1].position.set( 30, 10, 30 );
        lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
        lights[2].position.set( -20, 30, 30 );

        this.scene.add( lights[0] );
        this.scene.add( lights[1] );
        this.scene.add( lights[2] );
    }


}

export default NoiseSphere;