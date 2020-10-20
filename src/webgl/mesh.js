import ImagePixelFilter from './image-pixel-filter';
import vertexShader from '../shaders/vertexshader.vert';
import fragmentShader from '../shaders/fragmentshader.frag';

export default class Mesh {
    constructor(stage) {
        this.stage = stage;
        this.imgData = null;
    }

    init() {
        this._getImageData().then(() => this._setMesh());
    }

    _getImageData() {
        return new Promise((resolve) => {
            this.img = new Image();
            this.img.src = 'https://hisamikurita.github.io/JavaScript-Interaction/mouse-interaction/images/img.png';
            this.img.crossOrigin = "anonymous";
            this.img.width = 908;
            this.img.height = 428;
            this.img.addEventListener('load', () => {
                this.imgData = new ImagePixelFilter(this.img, this.img.width, this.img.height, 5);
                resolve();
            });
        });
    }

    _setMesh() {
        const position = this.imgData.getPosition();
        console.log(position);
        const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
        const color = this.imgData.getColor();
        const colors = new THREE.BufferAttribute(new Float32Array(color), 3);
        const nextPosition = [];
        for (let i = 0; i < position.length; i++) {
            const x = Math.random() - 0.5;
            const y = Math.random() - 0.5;
            const z = 0;
            nextPosition.push(x, y, z);
        }
        const nextPositions = new THREE.BufferAttribute(new Float32Array(nextPosition), 3);
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', positions);
        this.geometry.setAttribute('color', colors);
        this.geometry.setAttribute('nextPosition', nextPositions);

        this.material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: false,
            depthTest: true,
            uniforms: {
                nextPositionLevel: { type: 'f', value: 0.0 }
            }
        });

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.rotation.set(THREE.Math.degToRad(180), 0, 0);
        this.stage.scene.add(this.mesh);

        setTimeout(() => {
            gsap.to(this.mesh.material.uniforms.nextPositionLevel, {
                duration: 3.0,
                ease: 'power2.inOut',
                value: 3000,
                repeat: -1,
                yoyo: true,
            });
        }, 1000);
    }

    _render() {

    }

    onRaf() {
        this._render();
    }
}