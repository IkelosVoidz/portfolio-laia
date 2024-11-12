import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Stats, OrbitControls } from '@react-three/drei';
import { Experience } from './components/Experience';
import AnimatedButton from './components/AnimatedButton';
import { useTranslation } from "react-i18next";
import Spinner from "./components/Spinner";

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'ca', label: 'CAT' },
    { code: 'pt', label: 'PT' }
];

function App() {

    const { i18n } = useTranslation();
    const currentLanguage = i18n.language

    return (
        <>
            <div className="d-flex flex-row justify-content-between align-items-center" style={{ position: 'absolute', top: 20, right: 20, zIndex: 999 }}>
                {languages.map(lang => (
                    <AnimatedButton
                        key={lang.code}
                        buttonText={lang.label}
                        onClick={() => { i18n.changeLanguage(lang.code) }}
                        style={{
                            borderBottom: currentLanguage === lang.code ? '3px solid #fbbcad' : 'none'
                        }}
                    />
                ))}
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
                <Suspense fallback={<Spinner />}>
                    <Experience />
                </Suspense>
            </Canvas>
        </>)
}

export default App


