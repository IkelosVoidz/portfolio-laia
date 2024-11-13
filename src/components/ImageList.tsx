import { a as aWeb, useSpring } from '@react-spring/web'
import { a, SpringValue, useSprings } from '@react-spring/three'
import { Book, BookContent } from '../utils/interfaces'
import { Camera, SRGBColorSpace, Texture } from 'three'
import { FC, Suspense, useMemo, useState, useRef } from 'react'
import { Html, useCursor, useTexture } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import AnimatedButton from './AnimatedButton'
import Backdrop from './Backdrop'
import Spinner from './Spinner'

const baseUrl = import.meta.env.BASE_URL
const TARGET_HEIGHT = 1.8
const GAP = 0.6

interface ImagePageProps {
    cameraXRotation: number
    onClick: () => void
    selected: boolean
    texture: Texture
    xPosition: SpringValue<number>
    yPosition?: SpringValue<number>
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
    cameraRef: Camera
    onClose: () => void
    selectedBook: number
}

const ImageList: FC<ImageListProps> = ({ selectedBook, onClose, cameraRef }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [selectedImage, setSelectedImage] = useState<boolean>(false)
    const { t, i18n } = useTranslation()
    const imagePaths = useRef<string[]>([])

    const bookConfig = useMemo(() => {

        const config = t(`books.${selectedBook}`, { returnObjects: true }) as Book
        const imgPaths = config.content
            .map((image) => image.imagePath ? `${baseUrl}images/${image.imagePath}.jpg` : null)
            .filter((path) => path !== null) as string[];
        imagePaths.current = imgPaths
        return config;
    }, [i18n.language, selectedBook])

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

    const textures = useTexture(imagePaths.current)
    textures.forEach((texture) => {
        texture.colorSpace = SRGBColorSpace;
    })
    const xPositions = useMemo(() => calculatePositions(textures), [textures, currentIndex])

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

                {textures.length === 0 ? (
                    <Html
                        fullscreen
                        style={{
                            margin: 'auto',
                            pointerEvents: 'none',
                            textAlign: 'center',
                            fontSize: '2rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}
                    >
                        <p>
                            <strong>SORRY</strong>
                            <br />
                            No artworks in this category are available
                            <strong> YET</strong>
                            <br />
                            <p>Come back at another time</p>
                        </p>



                    </Html>
                ) : (
                    textures.map((tex, index) => (
                        <ImagePage
                            key={index}
                            cameraXRotation={cameraRef.rotation.x}
                            selected={index === currentIndex}
                            xPosition={springs[index].x}
                            texture={tex}
                            onClick={() => setSelectedImage(!selectedImage)}
                        />
                    ))
                )}

            </Suspense >

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

interface ImagePageControlsProps {
    bookContent: BookContent,
    disableControls: boolean
    nextImage: () => void,
    onClose: () => void,
    prevImage: () => void,
}

const ImagePageControls: FC<ImagePageControlsProps> = ({ disableControls, bookContent, nextImage, prevImage, onClose }) => {


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

interface ImageInfoProps {
    bookContent: BookContent,
    disabledControls: boolean
}

const ImageInfo: FC<ImageInfoProps> = ({ bookContent, disabledControls }) => {
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