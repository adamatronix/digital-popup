import * as THREE from "three";
import p5 from "p5";

class NoiseWall {

    constructor(options) {

        this.options = options;
        this.p5 = new p5();
        this.mesh = this.createMesh();
        this.vertices = this.mesh.geometry.attributes.position.array;
        this.increment = 0;
        this.violence = 0.09;
        this.peak = 2;
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
            for (var i = 0; i <= this.vertices.length; i += 3) {
                this.vertices[i+2] = this.peak * this.p5.noise(
                    this.vertices[i] + this.increment, 
                    this.vertices[i+1] + this.increment
                );
            }

            this.increment += this.violence;
            this.mesh.geometry.attributes.position.needsUpdate = true;
            this.mesh.geometry.computeVertexNormals();
        }
    }


}

export default NoiseWall;