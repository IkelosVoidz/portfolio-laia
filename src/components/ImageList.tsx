import { FC, Suspense, useEffect, useMemo, useRef } from 'react'
import { Html, Plane, useTexture } from '@react-three/drei'
import { Camera, MeshBasicMaterial } from 'three'
import AnimatedButton from './AnimatedButton'
import { useTranslation } from 'react-i18next'
import { Book } from '../utils/interfaces'

const baseUrl = import.meta.env.BASE_URL

interface ImagePageProps {
    url: string,
    index: number,
    cameraXRotation: number,
    onCreate: (width: number) => void,
    previousWidths: number[]
}

const ImagePage: FC<ImagePageProps> = ({ url, index, cameraXRotation, previousWidths, onCreate }) => {
    const texture = useTexture(url);
    const { width, height } = texture.image;

    // Define a target height and calculate the width based on the aspect ratio
    const targetHeight = 1.5;
    const aspectRatio = width / height;
    const targetWidth = targetHeight * aspectRatio;


    const xPosition = useMemo(() => {
        return previousWidths.reduce((acc, width) => acc + width, 0) + (.1 * index);
    }, []);
    debugger;

    onCreate(targetWidth)

    return (
        <mesh position={[xPosition, .6, 0]} rotation={[cameraXRotation, 0, 0]}>
            <boxGeometry args={[targetWidth, targetHeight, 0.01]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

const Loader = () => (
    <Html center>
        <div className="spinner-border" style={{ width: '50px', height: '50px' }} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </Html>
);

interface ImageListProps {
    selectedBook: number
    onClose: () => void
    cameraRef: Camera
}

const ImageList: FC<ImageListProps> = ({ selectedBook, onClose, cameraRef }) => {
    const material = useMemo(() => new MeshBasicMaterial({
        color: 'black',
        transparent: true,
        opacity: 0.6,
    }), [])

    const { t, i18n } = useTranslation()

    const bookConfig = useMemo(() => {
        return t(`books.${selectedBook}`, { returnObjects: true }) as Book
    }, [i18n.language])

    const imagePathsRef = useRef<string[]>([]);
    useEffect(() => {
        if (bookConfig && imagePathsRef.current.length === 0) {
            imagePathsRef.current = bookConfig.content.map((image) => `${baseUrl}images/${image.imagePath}.png`);
        }
        debugger;
    }, [bookConfig]);

    const imageWidthsRef = useRef<number[]>([]);

    return (
        <>
            <Plane
                args={[100, 100]} // Large size to cover the background
                material={material}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.5, 0]}
            />

            {imagePathsRef.current.length === 0 && (
                <Loader />
            )}

            <Suspense fallback={<Loader />}>
                {imagePathsRef.current.map((url, index) => (
                    <ImagePage
                        cameraXRotation={cameraRef.rotation.x}
                        index={index}
                        key={index}
                        url={url}
                        previousWidths={imageWidthsRef.current}
                        onCreate={(width) => {
                            imageWidthsRef.current.push(width);
                        }}
                    />
                ))}
            </Suspense>

            <AnimatedButton
                inCanvas
                iconUrl={`${baseUrl}icons/close.svg`}
                buttonText={t('close').toUpperCase()}
                style={{ position: 'absolute', top: 20, left: 30, zIndex: 999 }}
                onClick={onClose}
            />
        </>
    )
}

export default ImageList
