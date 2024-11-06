import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI.tsx';
function App() {

    return (
        <>
            <UI />
            <Loader />
            <div className="flex-grow-1">
                <Canvas shadows camera={{ position: [0, 2.5, .5] }}>
                    {/* <OrbitControls />
                    <axesHelper />
                    <gridHelper /> */}
                    {/* <Stats /> */}
                    <group position-y={0}>
                        <Suspense fallback={null}>
                            <Experience />
                        </Suspense>
                    </group>
                </Canvas>
            </div>
        </>)
}

export default App


