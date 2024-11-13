import { a as aWeb, useSpring } from '@react-spring/web'
import { Book, BookContent } from '../../utils/interfaces'
import { Camera, SRGBColorSpace, Texture } from 'three'
import { FC, Suspense, useMemo, useState, useRef } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useSprings } from '@react-spring/three'
import { useTranslation } from 'react-i18next'
import Backdrop from '../shared/Backdrop'
import Image from './Image'
import ImageListControls from './ImageListControls'
import Spinner from '../shared/Spinner'

const baseUrl = import.meta.env.BASE_URL
const TARGET_HEIGHT = 1.8
const GAP = 0.6

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
                    <EmptyPlaceholder />
                ) : (
                    textures.map((tex, index) => (
                        <Image
                            cameraXRotation={cameraRef.rotation.x}
                            key={index}
                            onClick={() => setSelectedImage(!selectedImage)}
                            selected={index === currentIndex}
                            targetHeight={TARGET_HEIGHT}
                            texture={tex}
                            xPosition={springs[index].x}
                        />
                    ))
                )}

            </Suspense >

            <ImageListControls
                nextImage={nextImage}
                prevImage={prevImage}
                onClose={onClose}
                disableControls={selectedImage}
            >
                <ImageInfo bookContent={bookConfig.content[currentIndex]} disabledControls={selectedImage} />
            </ImageListControls>
        </>
    )
}

const ImageInfo: FC<{ bookContent: BookContent, disabledControls: boolean }> = ({ bookContent, disabledControls }) => {

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

const EmptyPlaceholder: FC = () => (
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
)

export default ImageList