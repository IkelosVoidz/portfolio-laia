import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { OrbitControls } from '@react-three/drei';
import { Experience } from './components/Experience';
import Spinner from "./components/Spinner";
import UI from "./components/UI";
import {
    ACESFilmicToneMapping,
} from "three";


function App() {
    return (
        <>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 10,
            }}>
                <UI />
            </div>
            <Canvas shadows camera={{ position: [0, 2.5, .2], fov: 80 }} gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.6 }}  >
                {import.meta.env.MODE === "development" && (
                    <>
                        <OrbitControls enableDamping={false} />
                        <axesHelper />
                        <gridHelper />
                    </>
                )}
                <Suspense fallback={<Spinner />}>
                    <Experience />
                </Suspense>
            </Canvas>
        </>)
}

export default App


