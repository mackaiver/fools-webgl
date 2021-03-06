function getRandomNumber (min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomVector (min, max) {
    var x = getRandomNumber(min,max);
    var y = getRandomNumber(min,max);
    var z = getRandomNumber(min,max);
    return new THREE.Vector3(x,y,z);
}

function getRandomXYVector (min, max) {
    var x = getRandomNumber(min,max);
    var y = getRandomNumber(min,max);
    var z = 0;
    return new THREE.Vector3(x,y,z);
}
function distanceFromCenter(thing){
    var dist = Math.pow(thing.position.x, 2) + Math.pow(thing.position.y,2) + Math.pow(thing.position.z,2);
    return Math.sqrt(dist);
}


function createPlane(width, length){
        // create the sphere's material
        var planeMaterial =
            new THREE.MeshPhongMaterial({
                color: 0xc9b0b0,
                wireframe: true
        });
        var p = new THREE.PlaneGeometry(width,length);
        var plane = new THREE.Mesh(p, planeMaterial);
        plane.overdraw = true;
        return plane;
}

function createSphere(radius, segments,  rings) {
    var geom = new THREE.SphereGeometry(radius, segments, rings);
        
    // create a new mesh with
    // sphere geometry - we will cover
    var sphere = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
    return sphere;
}

function Viewport(width, height) {
    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = width / height,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var container = document.getElementById('container');

                // create a WebGL renderer, camera
    // and a scene
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

    this.scene = new THREE.Scene();
                // add the camera to the scene
    this.scene.add(this.camera);

                // the camera starts at 0,0,0
    // so pull it back
    this.camera.position.z = 300;
    this.camera.position.y = -500;
    this.camera.lookAt( new THREE.Vector3(0,0,0));

    // start the renderer
    this.renderer.setSize(width, height);

    // attach the render-supplied DOM element
    container.appendChild(this.renderer.domElement);
    this.renderer.setClearColorHex(0xa0b0c1, 1);
    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

}

function main() {
    var v = new Viewport(800, 600);
    // set up the sphere vars
    var radius = 5, segments = 10, rings = 10, distance = 0;
    
    var s = [];
    var oldpositions = [];
    var sun = createSphere(1, 16, 16);
    v.scene.add(sun);
    var vstartx, vstarty;
    
    for (var i = 0; i < 200; i++) {
        
        s[i] = createSphere(radius, segments, rings);
        v.scene.add(s[i]);
        
        s[i].position = getRandomVector(-160, 160);
        
        oldpositions[i] = (new THREE.Vector3()).addVectors(s[i].position, getRandomVector(-0.1, 0.1) );   
    };
    
    v.scene.add(createPlane(450, 450));

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    var pointLight2 = new THREE.PointLight( 0xB0FBFB );

    // set its position
    pointLight2.position.x = -50;
    pointLight2.position.y = 40;
    pointLight2.position.z = -100;

    // add to the scene
    v.scene.add(pointLight);
    v.scene.add(pointLight2);
    controls = new THREE.TrackballControls(v.camera, v.renderer.domElement);
    
    var stepsize = 200.5;
    update();
    // animation loop
    function update() {
        requestAnimationFrame(update);
        //parent.rotation.z += 0.01;
        var G = 9;
        for (var i = s.length - 1; i >= 0; i--) {
            var currentPos = (new THREE.Vector3()).copy(s[i].position);
            var delta = (new THREE.Vector3()).subVectors(sun.position, s[i].position);
            delta.divideScalar(Math.pow(delta.length(), 3) + stepsize);   
            //delta.multiplyScalar(Math.pow(stepsize, 2));
            
            delta.multiplyScalar(G);

            delta.sub(oldpositions[i]);
            oldpositions[i] = s[i].position
            var newpos = delta.add(currentPos.multiplyScalar(2));
            s[i].position = newpos;
            //minus alte posititon
            //dv = (new THREE.Vector3()).subVectors(dv, oldpositions[i]);
            //plus 2 mal aktuelle
           //dv = (new THREE.Vector3()).addVectors(dv, s[i].position.multiplyScalar(2));
            
            
           // s[i].position.add(s[i].velocity);
            
        };
        
        // draw
        v.render();

        controls.update();              
    }
}
