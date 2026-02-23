import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = 0x4f46e5;
const ACCENT_DIM = 0x2d2a6e;
const NODE_COUNT = 60;
const CONNECTION_DISTANCE = 1.6;

export default function ThreeBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;

        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);

        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100);
        camera.position.z = 6;

        
        const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: ACCENT });
        const dimMat = new THREE.MeshBasicMaterial({ color: ACCENT_DIM });

        const positions = [];
        const velocities = [];
        const meshes = [];

        for (let i = 0; i < NODE_COUNT; i++) {
            const x = (Math.random() - 0.5) * 8;
            const y = (Math.random() - 0.5) * 8;
            const z = (Math.random() - 0.5) * 4;
            positions.push(new THREE.Vector3(x, y, z));
            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.004,
                (Math.random() - 0.5) * 0.004,
                (Math.random() - 0.5) * 0.002,
            ));
            const mat = Math.random() > 0.7 ? nodeMat : dimMat;
            const mesh = new THREE.Mesh(nodeGeo, mat);
            mesh.position.copy(positions[i]);
            scene.add(mesh);
            meshes.push(mesh);
        }

        
        const lineMat = new THREE.LineBasicMaterial({
            color: ACCENT,
            transparent: true,
            opacity: 0.18,
        });

        
        const maxConnections = NODE_COUNT * 6;
        const linePositions = new Float32Array(maxConnections * 2 * 3);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lineSegments);

        
        const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: ACCENT,
            transparent: true,
            opacity: 0.015,
            side: THREE.BackSide,
        });
        scene.add(new THREE.Mesh(glowGeo, glowMat));

        
        const handleResize = () => {
            if (!el) return;
            camera.aspect = el.clientWidth / el.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        
        const mouse = new THREE.Vector2();
        const handleMouse = (e) => {
            const rect = el.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        el.addEventListener("mousemove", handleMouse);

        
        let frameId;
        const tmp = new THREE.Vector3();

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            
            for (let i = 0; i < NODE_COUNT; i++) {
                positions[i].add(velocities[i]);
                if (Math.abs(positions[i].x) > 4) velocities[i].x *= -1;
                if (Math.abs(positions[i].y) > 4) velocities[i].y *= -1;
                if (Math.abs(positions[i].z) > 2) velocities[i].z *= -1;
                meshes[i].position.copy(positions[i]);
            }

            
            let idx = 0;
            for (let i = 0; i < NODE_COUNT; i++) {
                for (let j = i + 1; j < NODE_COUNT; j++) {
                    const d = positions[i].distanceTo(positions[j]);
                    if (d < CONNECTION_DISTANCE && idx < maxConnections) {
                        linePositions[idx * 6 + 0] = positions[i].x;
                        linePositions[idx * 6 + 1] = positions[i].y;
                        linePositions[idx * 6 + 2] = positions[i].z;
                        linePositions[idx * 6 + 3] = positions[j].x;
                        linePositions[idx * 6 + 4] = positions[j].y;
                        linePositions[idx * 6 + 5] = positions[j].z;
                        idx++;
                    }
                }
            }
            
            for (let k = idx; k < maxConnections; k++) {
                linePositions.fill(0, k * 6, k * 6 + 6);
            }
            lineGeo.getAttribute("position").needsUpdate = true;
            lineGeo.setDrawRange(0, idx * 2);

            
            camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
            camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.03;
            camera.lookAt(tmp.set(0, 0, 0));

            
            scene.rotation.y += 0.0015;
            scene.rotation.x += 0.0005;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            el.removeEventListener("mousemove", handleMouse);
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        />
    );
}
