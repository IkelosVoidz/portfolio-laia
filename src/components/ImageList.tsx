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
    texture: Texture
}

const ImagePage: FC<ImagePageProps> = ({ cameraXRotation, xPosition, texture }) => {
    const { width, height } = texture.image
    const aspectRatio = width / height
    const targetWidth = TARGET_HEIGHT * aspectRatio

    return (
        <a.mesh position-x={xPosition} position-y={0.6} position-z={0} rotation={[cameraXRotation, 0, 0]}>
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
        config: { mass: 1, tension: 170, friction: 26 },
    }))

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => {
                const newIndex = prev - 1
                api.start((index) => ({
                    x: xPositions[index] - xPositions[newIndex]
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
                    x: xPositions[index] - xPositions[newIndex]
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
                        texture={tex}
                    />
                ))}
            </Suspense>

            <Html fullscreen zIndexRange={[0, 999]}>
                <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 998 }}>
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <AnimatedButton
                            style={{ marginRight: 200 }}
                            iconUrl={`${baseUrl}icons/left.svg`}
                            buttonText=''
                            onClick={() => prevImage()}
                        />

                        <ImageInfo bookContent={bookConfig.content[currentIndex]} />

                        <AnimatedButton
                            style={{ marginLeft: 200 }}
                            iconUrl={`${baseUrl}icons/right.svg`}
                            buttonText=''
                            onClick={() => nextImage()}
                        />
                    </div>
                </div>
                <AnimatedButton
                    iconUrl={`${baseUrl}icons/close.svg`}
                    buttonText={t('close').toUpperCase()}
                    style={{ position: 'absolute', top: 20, left: 30, zIndex: 999 }}
                    onClick={onClose}
                />
            </Html>

        </>
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
        <aWeb.div style={styles} className='text-start fitxa-tecnica text-nowrap'>
            <h5>{bookContent.title}</h5>
            <h5>{bookContent.date}</h5>
            <h5>{bookContent.technique}</h5>
            <h5>{bookContent.size}</h5>
        </aWeb.div>
    )
}

export default ImageList