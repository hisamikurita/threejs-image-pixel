import Stage from './stage';
import Mesh from './mesh';

export default class Slider {
    constructor() {
        this.stage = new Stage();
        this.stage.init();

        this.mesh = new Mesh(this.stage);
        this.mesh.init();

        window.addEventListener('resize', () => {
            this.stage.onResize();;
        });

        const _raf = () => {
            window.requestAnimationFrame(() => {
                this.stage.onRaf();
                this.mesh.onRaf();

                _raf();
            });
        }
        _raf();

        this.currentNum = 0;

        window.addEventListener('load', () => {
            this.mesh._nextColor(this.currentNum);
            this._autoChangeSlide();
        });
    }
    _moveChangeSlide() {
        if (this.currentNum > 2) {
            this.currentNum = 0;
        }
        else {
            this.currentNum++;
        }
    }
    _autoChangeSlide() {
        gsap.to({}, {
            ease: 'none',
            duration: 6.0,
            delay: -4.0,
            repeat: -1.0,
        }).eventCallback('onRepeat', () => {
            this._moveChangeSlide();
            this.mesh._diffuseConverge(this.currentNum);
        });
    }
}