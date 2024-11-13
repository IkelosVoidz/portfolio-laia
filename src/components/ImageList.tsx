import { FC, Suspense, useMemo, useState, useRef } from 'react'
import { Html, useCursor, useTexture } from '@react-three/drei'
import { Camera, Texture } from 'three'
import AnimatedButton from './AnimatedButton'
import { useTranslation } from 'react-i18next'
import { Book, BookContent } from '../utils/interfaces'
import Spinner from './Spinner'
import Backdrop from './Backdrop'
import { a, SpringValue, useSprings } from '@react-spring/three'
import { a as aWeb, useSpring } from '@react-spring/web'


const baseUrl = import.meta.env.BASE_URL
const TARGET_HEIGHT = 1.8
const GAP = 0.6

interface ImagePageProps {
    selected: boolean
    cameraXRotation: number
    xPosition: SpringValue<number>
    yPosition?: SpringValue<number>
    texture: Texture
    onClick: () => void
}

const ImagePage: FC<ImagePageProps> = ({ cameraXRotation, xPosition, texture, selected, onClick }) => {

    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    useCursor(hovered);

    const { width, height } = texture.image
    const aspectRatio = width / height
    const targetWidth = TARGET_HEIGHT * aspectRatio

    const { scale, yPosition } = useSpring({
        scale: clicked ? 1.5 : 1,
        yPosition: (selected && !clicked) ? -0.2 : 0,
        config: { mass: 1, tension: 170, friction: 26 },
    })


    return (
        <a.mesh
            castShadow={true}
            scale={scale}
            onPointerEnter={(e) => {
                if (!selected) return
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerLeave={(e) => {
                if (!selected) return
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={(e) => {
                if (!selected) return
                e.stopPropagation();
                setClicked(!clicked);
                onClick();
            }}

            position-x={xPosition}
            position-y={0.6}
            position-z={yPosition}
            rotation={[cameraXRotation, 0, 0]}
        >
            <boxGeometry args={[targetWidth, TARGET_HEIGHT, 0.01]} />
            <meshBasicMaterial map={texture} />
        </a.mesh>
    )
}

interface ImageListProps {
    selectedBook: number
    onClose: () => void
    cameraRef: Camera
}

const ImageList: FC<ImageListProps> = ({ selectedBook, onClose, cameraRef }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [selectedImage, setSelectedImage] = useState<boolean>(false)
    const { t, i18n } = useTranslation()
    const imagePaths = useRef<string[]>([])


    // Load image paths on language change
    const bookConfig = useMemo(() => {
        const config = t(`books.${selectedBook}`, { returnObjects: true }) as Book
        const imgPaths = config.content.map((image) => `${baseUrl}images/${image.imagePath}.jpg`)
        imagePaths.current = imgPaths
        return config;
    }, [i18n.language, selectedBook])

    // Calculate positions for all images
    const calculatePositions = (textures: Texture[]): number[] => {
        let accPosition = 0

        return textures.map((tex, index) => {
            const aspectRatio = tex.image.width / tex.image.height
            const targetWidth = TARGET_HEIGHT * aspectRatio
            const position = index === 0 ? 0 : accPosition + targetWidth / 2
            accPosition += (targetWidth * (index === 0 ? 0.5 : 1)) + GAP
            return position
        })
    }

    // Load textures only once
    const textures = useTexture(imagePaths.current)
    const xPositions = useMemo(() => calculatePositions(textures), [textures, currentIndex])

    // Define springs for animated positions
    const [springs, api] = useSprings(textures.length, (index) => ({
        x: xPositions[index] - xPositions[currentIndex],
        config: { mass: 1, tension: 170, friction: 26 },
    }))

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => {
                const newIndex = prev - 1
                api.start((index) => ({
                    x: xPositions[index] - xPositions[newIndex],
                }))
                return newIndex
            })
        }
    }

    const nextImage = () => {
        if (currentIndex < textures.length - 1) {
            setCurrentIndex((prev) => {
                const newIndex = prev + 1
                api.start((index) => ({
                    x: xPositions[index] - xPositions[newIndex],
                }))
                return newIndex
            })
        }
    }


    return (
        <>
            <Backdrop />
            <Suspense fallback={<Spinner />}>
                {textures.map((tex, index) => (
                    <ImagePage
                        key={index}
                        cameraXRotation={cameraRef.rotation.x}
                        selected={index === currentIndex}
                        xPosition={springs[index].x}
                        texture={tex}
                        onClick={() => setSelectedImage(!selectedImage)}
                    />
                ))}
            </Suspense>

            <ImagePageControls
                bookContent={bookConfig.content[currentIndex]}
                nextImage={nextImage}
                prevImage={prevImage}
                onClose={onClose}
                disableControls={selectedImage}
            />
        </>
    )
}

const ImagePageControls: FC<{ bookContent: BookContent, nextImage: () => void, prevImage: () => void, onClose: () => void, disableControls: boolean }> = ({ disableControls, bookContent, nextImage, prevImage, onClose }) => {


    const { opacity } = useSpring({
        opacity: disableControls ? 0 : 1,
        config: { mass: 1, tension: 170, friction: 26 },
    });

    const { t } = useTranslation();
    return (
        <Html fullscreen zIndexRange={[0, 10000]} style={{ pointerEvents: 'none' }} >
            <aWeb.div className="container-fluid h-100" style={{ opacity: opacity }}>
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
                                <ImageInfo bookContent={bookContent} disabledControls={disableControls} />
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
            </aWeb.div>
        </Html>
    )

}


const ImageInfo: FC<{ bookContent: BookContent, disabledControls: boolean }> = ({ bookContent, disabledControls }) => {
    // Animation directly in useSpring
    const styles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { tension: 120, friction: 14 },
        reset: true
    })

    return (
        <aWeb.div style={disabledControls ? {} : styles} className='text-center fitxa-tecnica text-nowrap'>
            <h5>{bookContent.title}</h5>
            <h5>{bookContent.date}</h5>
            <h5>{bookContent.technique}</h5>
            <h5>{bookContent.size}</h5>
        </aWeb.div>
    )
}

export default ImageList
