import { FC, Suspense, useMemo, useState, useRef } from 'react'
import { Html, useTexture } from '@react-three/drei'
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
    index: number
    cameraXRotation: number
    xPosition: SpringValue<number>
    yPosition: SpringValue<number>
    texture: Texture
}

const ImagePage: FC<ImagePageProps> = ({ cameraXRotation, xPosition, yPosition, texture }) => {
    const { width, height } = texture.image
    const aspectRatio = width / height
    const targetWidth = TARGET_HEIGHT * aspectRatio

    return (
        <a.mesh position-x={xPosition} position-y={0.6} position-z={yPosition} rotation={[cameraXRotation, 0, 0]}>
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
        y: index === currentIndex ? -0.2 : 0,
        config: { mass: 1, tension: 170, friction: 26 },
    }))

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => {
                const newIndex = prev - 1
                api.start((index) => ({
                    x: xPositions[index] - xPositions[newIndex],
                    y: (index + 1) === currentIndex ? -0.2 : 0,
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
                    y: (index - 1) === currentIndex ? -0.2 : 0,
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
                        index={index}
                        xPosition={springs[index].x}
                        yPosition={springs[index].y}
                        texture={tex}
                    />
                ))}
            </Suspense>

            <ImagePageControls
                bookContent={bookConfig.content[currentIndex]}
                nextImage={nextImage}
                prevImage={prevImage}
                onClose={onClose}
            />
        </>
    )
}

const ImagePageControls: FC<{ bookContent: BookContent, nextImage: () => void, prevImage: () => void, onClose: () => void }> = ({ bookContent, nextImage, prevImage, onClose }) => {

    const { t } = useTranslation();
    return (
        <Html fullscreen zIndexRange={[0, 10000]} style={{ pointerEvents: 'none' }} >
            <div className="container-fluid h-100">
                <div className="row g-0 h-100 align-items-end">
                    <div className="col-12 mb-3">
                        <div className='row align-items-end justify-content-center'>
                            <div className="col align-self-center">
                                <AnimatedButton
                                    style={{ pointerEvents: 'auto', marginLeft: 'auto' }}
                                    iconUrl={`${baseUrl}icons/left.svg`}
                                    buttonText=''
                                    onClick={() => prevImage()}
                                />
                            </div>
                            <div className="col-6 align-self-end">
                                <ImageInfo bookContent={bookContent} />
                            </div>
                            <div className="col align-self-center">
                                <AnimatedButton
                                    style={{ pointerEvents: 'auto', marginRight: 'auto' }}
                                    iconUrl={`${baseUrl}icons/right.svg`}
                                    buttonText=''
                                    onClick={() => nextImage()}
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
            </div>
        </Html>
    )

}


const ImageInfo: FC<{ bookContent: BookContent }> = ({ bookContent }) => {
    // Animation directly in useSpring
    const styles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        reset: true, // Ensures it replays each time bookContent changes
        config: { tension: 120, friction: 14 },
    })

    return (
        <aWeb.div style={styles} className='text-center fitxa-tecnica text-nowrap'>
            <h5>{bookContent.title}</h5>
            <h5>{bookContent.date}</h5>
            <h5>{bookContent.technique}</h5>
            <h5>{bookContent.size}</h5>
        </aWeb.div>
    )
}

export default ImageList
