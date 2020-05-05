import * as THREE from "three";
import p5 from "p5";

class NoiseWall {

    constructor(options) {

        this.options = options;
        this.p5 = new p5();
        this.mesh = this.createMesh();
        this.vertices = this.mesh.geometry.attributes.position.array;
        this.increment = 0;
    }

    createMesh() {
        const geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, this.options.widthDiv, this.options.heightDiv );
        // create a Mesh containing the geometry and material
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xffffff, side: THREE.DoubleSide}) );
        this.mesh.receiveShadow = true;
        return this.mesh;
    }

    update() {
        if(this.options.enabled) {
            let peak = 2;
            for (var i = 0; i <= this.vertices.length; i += 3) {
                this.vertices[i+2] = peak * this.p5.noise(
                    this.vertices[i] + this.increment, 
                    this.vertices[i+1] + this.increment
                );
            }

            this.increment += 0.007;
            this.mesh.geometry.attributes.position.needsUpdate = true;
            this.mesh.geometry.computeVertexNormals();
        }
    }


}

export default NoiseWall;