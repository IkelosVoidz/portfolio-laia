import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Loader, Stats, OrbitControls } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI.tsx';

function App() {

    return (
        <>
            <UI />
            <Loader />
            <Canvas shadows camera={{ position: [0, 2.5, .2] }}>
                {import.meta.env.MODE === "development" && (
                    <>
                        <OrbitControls enableDamping={false} />
                        <axesHelper />
                        <gridHelper />
                        <Stats />
                    </>
                )}
                <group position-y={0}>
                    <Suspense fallback={null}>
                        <Experience />
                    </Suspense>
                </group>
            </Canvas>
        </>)
}

export default App


