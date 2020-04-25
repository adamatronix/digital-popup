import * as THREE from "three";

class Product {

    constructor(options) {
        this.options = options;
        return this.createMesh();
    }

    createMesh() {
        var material = new THREE.MeshBasicMaterial();
        var loader = new THREE.TextureLoader();
        loader.load( this.options.image, 
        function ( texture ) {    

            // The texture has loaded, so assign it to your material object. In the 
            // next render cycle, this material update will be shown on the plane 
            // geometry
            material.map = texture;
            material.needsUpdate = true;
        });
        const product = new THREE.PlaneBufferGeometry(  this.options.width, this.options.height, 5, 5 );
        var productMesh = new THREE.Mesh(product, material);
        
        return productMesh;
    }


}

export default Product;