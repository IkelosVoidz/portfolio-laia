import { useSpring, a } from "@react-spring/web";
import { Html } from "@react-three/drei";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import AnimatedButton from "../shared/AnimatedButton";

const baseUrl = import.meta.env.BASE_URL

interface ImageListControls {
    disableControls: boolean
    nextImage: () => void,
    onClose: () => void,
    prevImage: () => void,
}

const ImageListControls: FC<PropsWithChildren<ImageListControls>> = ({ disableControls, nextImage, prevImage, onClose, children }) => {


    const { opacity } = useSpring({
        opacity: disableControls ? 0 : 1,
        config: { mass: 1, tension: 170, friction: 26 },
    });

    const { t } = useTranslation();
    return (
        <Html fullscreen zIndexRange={[0, 10000]} style={{ pointerEvents: 'none' }} >
            <a.div className="container-fluid h-100" style={{ opacity: opacity }}>
                <div className="row g-0 h-100 align-items-end">
                    <div className="col-12 mb-3">
                        <div className='row align-items-end justify-content-center'>
                            <div className="col align-self-center">
                                <AnimatedButton
                                    style={{ pointerEvents: disableControls ? 'none' : 'auto', marginLeft: 'auto' }}
                                    iconUrl={`${baseUrl}icons/left.svg`}
                                    buttonText=''
                                    onClick={() => prevImage()}
                                    disabled={disableControls}
                                />
                            </div>
                            <div className="col-6 align-self-end">
                                {children}
                            </div>
                            <div className="col align-self-center">
                                <AnimatedButton
                                    style={{ pointerEvents: disableControls ? 'none' : 'auto', marginRight: 'auto' }}
                                    iconUrl={`${baseUrl}icons/right.svg`}
                                    buttonText=''
                                    onClick={() => nextImage()}
                                    disabled={disableControls}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', top: 20, left: 30, zIndex: 999 }}>
                        <AnimatedButton
                            iconUrl={`${baseUrl}icons/close.svg`}
                            buttonText={t('close').toUpperCase()}
                            onClick={onClose}
                            style={{ pointerEvents: 'auto' }}
                        />
                    </div>
                </div>
            </a.div>
        </Html>
    )
}

export default ImageListControls