import * as THREE from "three";

class Block {

    constructor(options) {
        this.options = options;
        return this.createMesh();
    }

    createMesh() {
        let height = 4;
        const geometry = new THREE.BoxBufferGeometry( this.options.width, this.options.height, this.options.depth, 1, 1, 1 );
        
        // create a Mesh containing the geometry and material
        let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xffffff}) );
        mesh.position.set(this.options.x, this.options.y, this.options.z );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        
        return mesh;
    }


}

export default Block;