import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Loader, Stats, OrbitControls, Preload } from '@react-three/drei';
import { Experience } from './components/Experience';
import AnimatedButton from './components/AnimatedButton';
import { useTranslation } from "react-i18next";
function App() {

    const { i18n } = useTranslation();

    return (
        <>
            <div className="d-flex flex-row justify-content-between align-items-center" style={{ position: 'absolute', top: 20, right: 20, zIndex: 999 }}>
                <AnimatedButton buttonText="EN" onClick={() => { i18n.changeLanguage('en') }} />
                <AnimatedButton buttonText="ES" onClick={() => { i18n.changeLanguage('es') }} />
                <AnimatedButton buttonText="CAT" onClick={() => { i18n.changeLanguage('ca') }} />
                <AnimatedButton buttonText="PT" onClick={() => { i18n.changeLanguage('pt') }} />
            </div>
            <Canvas shadows camera={{ position: [0, 2.5, .2], fov: 80 }}>
                {import.meta.env.MODE === "development" && (
                    <>
                        <OrbitControls enableDamping={false} />
                        <axesHelper />
                        <gridHelper />
                        <Stats />
                    </>
                )}
                <Suspense>
                    <Experience />
                    <Preload all />
                </Suspense>
            </Canvas>
            <Loader />
        </>)
}

export default App


