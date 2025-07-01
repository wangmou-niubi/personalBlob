"use client"
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';

function Three3D(props) {
    const containerRef = useRef(null);

    useEffect(() => {
        // 创建场景
        const scene = new THREE.Scene();

        // 创建相机
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100000);
        camera.position.z = 50;
        camera.position.y = 50;
        camera.position.x = 50;
        camera.lookAt(0, 0, 0);

        const pointLight = new THREE.PointLight(0xffffff, 1000.0);
        //环境光:没有特定方向，整体改变场景的光照明暗
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        const PointLightHelper = new THREE.PointLightHelper(pointLight, 50);
        pointLight.decay = 0.0;//设置光源不随距离衰减
        //点光源位置
        pointLight.position.set(400, 10, 0);//点光源放在x轴上
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
        controls.addEventListener('change', function () {
            renderer.render(scene, camera); //执行渲染操作
        });//监听鼠标、键盘事件
        
        // 创建几何体和材质
        const geometry = new THREE.BoxGeometry(50, 50, 50);
        const material = new THREE.MeshLambertMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide, // 修正属性名
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.userData = { name: '黄色立方体', description: '这是场景中的主要立方体' };
        scene.add(cube);
        
        // AxesHelper：辅助观察的坐标系
        const axesHelper = new THREE.AxesHelper(150);
        scene.add(axesHelper);
        scene.add(pointLight); //点光源添加到场景中
        scene.add(PointLightHelper); //点光源添加到场景中
        scene.add(ambient);
        
        //创建一个长方体几何对象Geometry
        const geometrys = new THREE.BoxGeometry(100, 100, 100);
        //材质对象Material
        const materials = new THREE.MeshLambertMaterial({
            color: 0x00ffff, //设置材质颜色
            transparent: true,//开启透明
            opacity: 0.5,//设置透明度
            side: THREE.DoubleSide, // 修正属性名
        });
        
        // 创建用于存储所有网格和信息面板的数组
        const meshes = [];
        const infoLabels = {};
        
        // 创建文本纹理的函数
        function createTextTexture(text, width = 200, height = 100, bgColor = 'rgba(0,0,0,0.7)', textColor = '#ffffff') {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            
            // 绘制背景
            context.fillStyle = bgColor;
            context.fillRect(0, 0, width, height);
            
            // 绘制文本
            context.fillStyle = textColor;
            context.font = '14px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            // 处理多行文本
            const lines = text.split('\n');
            const lineHeight = 18;
            const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
            
            lines.forEach((line, index) => {
                context.fillText(line, width / 2, startY + index * lineHeight);
            });
            
            return new THREE.CanvasTexture(canvas);
        }
        
        // 创建信息面板的函数
        function createInfoPanel(text, width = 80, height = 40) {
            const texture = createTextTexture(text, width * 5, height * 5);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const geometry = new THREE.PlaneGeometry(width, height);
            const panel = new THREE.Mesh(geometry, material);
            panel.visible = false; // 初始不可见
            
            return panel;
        }
        
        // 为主立方体创建信息面板
        const cubeInfoPanel = createInfoPanel(`${cube.userData.name}\n${cube.userData.description}`);
        cubeInfoPanel.position.set(0, 60, 0); // 放在立方体上方
        cube.add(cubeInfoPanel); // 将面板添加为立方体的子对象
        infoLabels[cube.id] = cubeInfoPanel;
        
        // 创建网格和对应的信息面板
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const mesh = new THREE.Mesh(geometrys, materials); //网格模型对象Mesh
                // 在XOZ平面上分布
                mesh.position.set(i * 200, 0, j * 200);
                // 为每个mesh添加用户数据
                mesh.userData = { 
                    name: `网格 ${i}-${j}`, 
                    position: `位置: X=${i * 200}, Y=0, Z=${j * 200}`,
                    description: `这是第 ${i*10+j+1} 个网格对象`
                };
                
                // 创建信息面板并添加为mesh的子对象
                const infoText = `${mesh.userData.name}\n${mesh.userData.position}\n${mesh.userData.description}`;
                const infoPanel = createInfoPanel(infoText);
                infoPanel.position.set(0, 80, 0); // 放在网格上方
                mesh.add(infoPanel); // 将面板添加为网格的子对象
                
                // 存储引用
                infoLabels[mesh.id] = infoPanel;
                meshes.push(mesh);
                scene.add(mesh); //网格模型添加到场景中  
            }
        }

        // 创建射线投射器
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // 鼠标移动事件处理
        function onMouseMove(event) {
            // 计算鼠标在归一化设备坐标中的位置
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            // 更新射线投射器
            raycaster.setFromCamera(mouse, camera);
            
            // 计算与射线相交的对象
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            // 重置鼠标样式
            renderer.domElement.style.cursor = 'default';
            
            // 隐藏所有信息面板
            Object.values(infoLabels).forEach(panel => {
                panel.visible = false;
            });
            
            if (intersects.length > 0) {
                // 获取第一个相交的对象
                let object = intersects[0].object;
                
                // 如果点击的是信息面板，则获取其父对象
                if (Object.values(infoLabels).includes(object)) {
                    return; // 忽略对信息面板本身的交互
                }
                
                // 向上查找到顶层网格对象（如果点击的是子对象）
                while (object.parent && object.parent !== scene) {
                    object = object.parent;
                }
                
                // 检查对象是否有对应的信息面板
                if (infoLabels[object.id]) {
                    // 更改鼠标样式
                    renderer.domElement.style.cursor = 'pointer';
                    
                    // 显示对应的信息面板
                    infoLabels[object.id].visible = true;
                    
                    // 确保信息面板始终面向相机
                    infoLabels[object.id].lookAt(camera.position);
                }
            }
        }
        
        // 添加鼠标移动事件监听
        window.addEventListener('mousemove', onMouseMove, false);

        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.02;
            
            // 确保所有可见的信息面板始终面向相机
            Object.values(infoLabels).forEach(panel => {
                if (panel.visible) {
                    panel.lookAt(camera.position);
                }
            });
            
            renderer.render(scene, camera);
        };

        animate();

        // 清理函数
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            // containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div id={'blob-container'}>
            <div ref={containerRef} className={'canvas-container'}></div>
        </div>
    );
}

export default Three3D;
