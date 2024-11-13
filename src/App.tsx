// import { ACESFilmicToneMapping } from "three";
import { Canvas } from "@react-three/fiber"
import { Controls } from "./utils/interfaces";
import { Experience } from './components/Experience';
import { OrbitControls, KeyboardControls, type KeyboardControlsEntry } from '@react-three/drei';
import { Suspense, useMemo } from "react"
import Spinner from "./components/shared/Spinner";
import UI from "./components/UI";

function App() {

    const map = useMemo<KeyboardControlsEntry<Controls>[]>(() => [
        { name: Controls.previous, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.next, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.escape, keys: ['Escape'] },
    ], [])

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
            <Canvas shadows camera={{ position: [0, 2.5, .2], fov: 80 }} >
                {import.meta.env.MODE === "development" && (
                    <>
                        <OrbitControls enableDamping={false} />
                        <axesHelper />
                        <gridHelper />
                    </>
                )}
                <Suspense fallback={<Spinner />}>
                    <KeyboardControls map={map}>
                        <Experience />
                    </KeyboardControls>
                </Suspense>
            </Canvas >
        </>)
}

export default App


// gl = {{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.6 }}