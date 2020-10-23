import ImagePixelFilter from './image-pixel-filter';
import vertexShader from '../shaders/vertexshader.vert';
import fragmentShader from '../shaders/fragmentshader.frag';

export default class Mesh {
    constructor(stage) {
        this.stage = stage;
        this.img = [];
        this.imgData = [];
        this.count = 0;
        this.duration = 3.0;
        this.ease = 'power1.out';
        this.distortionRange = 3000;
    }

    init() {
        this._getImageData().then(() => this._setMesh());
    }

    _getImageData() {
        return new Promise((resolve) => {
            for (let i = 0; i < 4; i++) {
                this.img[i] = new Image();
                this.img[i].width = 950;
                this.img[i].height = 950;
                this.img[i].crossOrigin = "anonymous";
            }
            this.img[0].src = 'https://hisamikurita.github.io/threejs-image-pixel/dist/images/pokemon01.png';
            this.img[1].src = 'https://hisamikurita.github.io/threejs-image-pixel/dist/images/pokemon02.png';
            this.img[2].src = 'https://hisamikurita.github.io/threejs-image-pixel/dist/images/pokemon03.png';
            this.img[3].src = 'https://hisamikurita.github.io/threejs-image-pixel/dist/images/pokemon04.png';

            for (let i = 0; i < 4; i++) {
                this.img[i].addEventListener('load', () => {
                    this.imgData[i] = new ImagePixelFilter(this.img[i], this.img[i].width, this.img[i].height, 5);
                    this.count++;
                    if (this.count >= 4) {
                        resolve();
                    }
                });
            }
        });
    }

    _setMesh() {
        const position = this.imgData[0].getPosition();
        const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
        const color_1 = this.imgData[0].getColor();
        const colors_1 = new THREE.BufferAttribute(new Float32Array(color_1), 3);
        const color_2 = this.imgData[1].getColor();
        const colors_2 = new THREE.BufferAttribute(new Float32Array(color_2), 3);
        const color_3 = this.imgData[2].getColor();
        const colors_3 = new THREE.BufferAttribute(new Float32Array(color_3), 3);
        const color_4 = this.imgData[3].getColor();
        const colors_4 = new THREE.BufferAttribute(new Float32Array(color_4), 3);
        // const noise = [];
        // for (let i = 0; i < position.length; i++) {
        //     const x = Math.random() - 0.5;
        //     const y = Math.random() - 0.5;
        //     const z = 0;
        //     noise.push(x, y, z);
        // }
        // const noises = new THREE.BufferAttribute(new Float32Array(noise), 3);
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', positions);
        this.geometry.setAttribute('color_1', colors_1);
        this.geometry.setAttribute('color_2', colors_2);
        this.geometry.setAttribute('color_3', colors_3);
        this.geometry.setAttribute('color_4', colors_4);
        // this.geometry.setAttribute('noise', noises);

        this.material = new THREE.RawShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: false,
            depthTest: true,
            uniforms: {
                noise: { type: 'v3', value: new THREE.Vector3(0.001) },
                colorLevel_1: { type: 'f', value: 0.0 },
                colorLevel_2: { type: 'f', value: 0.0 },
                colorLevel_3: { type: 'f', value: 0.0 },
                colorLevel_4: { type: 'f', value: 0.0 },
                distortionLevel: { type: 'f', value: 0.0 },
                distortionRange: { type: 'f', value: this.distortionRange },
            }
        });

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.rotation.set(THREE.Math.degToRad(180), 0, 0);
        this.stage.scene.add(this.mesh);
    }

    _diffuseConverge(number) {
        gsap.to(this.mesh.material.uniforms.distortionLevel, {
            duration: 3.0,
            ease: 'power2.inOut',
            value: 1.0,
        }).eventCallback('onComplete', () => {
            this._nextColor(number);
            gsap.to(this.mesh.material.uniforms.distortionLevel, {
                duration: 3.0,
                ease: 'power2.inOut',
                value: 0.0,
            })
        });
    }

    _nextColor(number) {
        switch (number) {
            case 0:
                gsap.to(this.mesh.material.uniforms.colorLevel_4, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 0.0,
                });
                gsap.to(this.mesh.material.uniforms.colorLevel_1, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 1.0,
                });
                break;
            case 1:
                gsap.to(this.mesh.material.uniforms.colorLevel_1, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 0.0,
                });
                gsap.to(this.mesh.material.uniforms.colorLevel_2, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 1.0,
                });
                break;
            case 2:
                gsap.to(this.mesh.material.uniforms.colorLevel_2, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 0.0,
                });
                gsap.to(this.mesh.material.uniforms.colorLevel_3, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 1.0,
                });
                break;
            case 3:
                gsap.to(this.mesh.material.uniforms.colorLevel_3, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 0.0,
                });
                gsap.to(this.mesh.material.uniforms.colorLevel_4, {
                    duration: this.duration,
                    ease: this.ease,
                    value: 1.0,
                });
                break;
        }
    }

    _render() {

    }

    onRaf() {
        this._render();
    }
}