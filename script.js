import * as SPLAT from "https://cdn.jsdelivr.net/npm/gsplat@latest";

const canvas = document.getElementById("canvas");
const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

async function main() {

    const url = "https://huggingface.co/datasets/anita945/newModel/resolve/main/robotVid.splat";
    await SPLAT.Loader.LoadAsync(url, scene, null);


    const handleResize = () => {

        const width = window.innerWidth * 0.8;
        const height = window.innerHeight * 0.6; 
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width * window.devicePixelRatio; 
        canvas.height = height * window.devicePixelRatio;

 
        renderer.setSize(width, height);
    };


    const frame = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame); 
    };


    handleResize();
    window.addEventListener("resize", handleResize);

 
    requestAnimationFrame(frame);
}


main();
