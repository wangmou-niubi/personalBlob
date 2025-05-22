import THREE from '@/vendor/three';
import F2D from '@/F2D/f2d.js'; // 请确保路径正确
export function initFluid2d(containerRef){
    let windowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);

    let renderer = new THREE.WebGLRenderer(
        {
            alpha: true, // 启用 alpha 通道
            antialias: true // 可选：启用抗锯齿
        }
    );
    renderer.autoClear = false;
    renderer.sortObjects = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowSize.x, windowSize.y);
    renderer.setClearColor(0x000000, 0.1);
    containerRef.appendChild(renderer.domElement);

    let grid = {
        size: new THREE.Vector2(512, 256),
        scale: 1,
        applyBoundaries: true
    };
    let time = {
        step: 0.5,
    };
    let displayScalar, displayVector;
    let displaySettings = {
        slab: "divergence"
    };
    let solver, gui;
    //初始化mouse事件
    let mouse = new F2D.Mouse(grid);

    function init(shaders) {
        solver = F2D.Solver.make(grid, time, windowSize, shaders);


        displayScalar = new F2D.Display(shaders.basic, shaders.displayscalar);
        displayVector = new F2D.Display(shaders.basic, shaders.displayvector);


        // we need a splat color "adapter" since we want values between 0 and
        // 1 but also since dat.GUI requires a JavaScript array over a Three.js
        // vector
        let splatSettings = {
            color: [
                solver.ink.x * 255,
                solver.ink.y * 255,
                solver.ink.z * 255
            ]
        };
        console.log(solver, 'solver')
        requestAnimationFrame(update);
    }

    function update() {
        solver.step(renderer, mouse);
        render();
        requestAnimationFrame(update);
    }

    function render() {
        let display, read;
        switch (displaySettings.slab) {
            case "velocity":
                display = displayVector;
                display.scaleNegative();
                read = solver.velocity.read;
                break;
            case "density":
                display = displayScalar;
                display.scale.copy(solver.ink);
                display.bias.set(0, 0, 0);
                read = solver.density.read;
                break;
            case "divergence":
                display = displayScalar;
                display.scaleNegative();
                read = solver.velocityDivergence.read;
                break;
            case "pressure":
                display = displayScalar;
                display.scaleNegative();
                read = solver.pressure.read;
                break;
        }
        display.render(renderer, read);
    }

    function resize() {
        windowSize.set(window.innerWidth, window.innerHeight);
        renderer.setSize(windowSize.x, windowSize.y);
    }
    window.onresize = resize;

    let loader = new F2D.FileLoader("shaders", [
        "advect.fs",
        "basic.vs",
        "gradient.fs",
        "jacobiscalar.fs",
        "jacobivector.fs",
        "displayscalar.fs",
        "displayvector.fs",
        "divergence.fs",
        "splat.fs",
        "vorticity.fs",
        "vorticityforce.fs",
        "boundary.fs"
    ]);
    loader.run(function (files) {
        // remove file extension before passing shaders to init
        let shaders = {};
        console.log(files)
        for (let name in files) {
            shaders[name.split(".")[0]] = files[name];
        }
        init(shaders);
    });
}