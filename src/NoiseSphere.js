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
        this.circle.position.set( 0, 3, 0);
        //this.setLights();

        this.vertices = this.mesh.geometry.attributes.position.array;
        this.verticesOrig = this.vertices.slice();

        console.log(this.vertices);

    }

    createMesh() {
        
        const geometry = new THREE.IcosahedronBufferGeometry(1, 3);
        // create a Mesh containing the geometry and material
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide} ));
        //this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;

        return this.mesh;
    }

    setLights() {
        var lights = [];
        lights[0] = new THREE.DirectionalLight( 0xFF5EB7, 0.4 );
        lights[0].position.set( 10, 5, -20);
        lights[1] = new THREE.DirectionalLight( 0x11E8BB, 0.3 );
        lights[1].position.set( -10, 30, 20 );
        lights[2] = new THREE.DirectionalLight( 0x8200C9, 0.4 );
        lights[2].position.set( 0, 0, 5 );

        this.scene.add( lights[0] );
        this.scene.add( lights[1] );
        this.scene.add( lights[2] );
    }


    update() {
        for (var i = 0; i <= this.vertices.length; i += 3) {

            this.vertices[i] = this.verticesOrig[i] + (1 - (this.p5.noise(this.verticesOrig[i] + this.increment) * 2));
            this.vertices[i+1] = this.verticesOrig[i+1] + (1 - (this.p5.noise(this.verticesOrig[i+1] + this.increment) * 2));
            this.vertices[i+2] = this.verticesOrig[i+2] + (1 - (this.p5.noise(this.verticesOrig[i+2] + this.increment) * 2));

        }

        this.increment += 0.08;
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
    }


}

export default NoiseSphere;