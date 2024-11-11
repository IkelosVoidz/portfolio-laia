import { FC, Suspense, useMemo, useState } from 'react'
import { Html, Plane, useTexture } from '@react-three/drei'
import { Camera, MeshBasicMaterial, Texture } from 'three'
import AnimatedButton from './AnimatedButton'
import { useTranslation } from 'react-i18next'
import { Book } from '../utils/interfaces'

const baseUrl = import.meta.env.BASE_URL

interface ImagePageProps {
    index: number,
    cameraXRotation: number,
    xPosition: number,
    texture: Texture,
}

const ImagePage: FC<ImagePageProps> = ({ cameraXRotation, xPosition, texture }) => {
    const { width, height } = texture.image;
    const targetHeight = 1.5;
    const aspectRatio = width / height;
    const targetWidth = targetHeight * aspectRatio;

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
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    useMemo(() => {
        const config = t(`books.${selectedBook}`, { returnObjects: true }) as Book
        const imgPaths = config.content.map((image) => `${baseUrl}images/${image.imagePath}.png`);
        setImagePaths(imgPaths);
        return config;
    }, [i18n.language])


    const calculatePositions = (textures: Texture[]): number[] => {
        let accPosition = 0;
        const gap = 0.4;

        return textures.map((tex, index) => {
            const aspectRatio = tex.image.width / tex.image.height;
            const targetHeight = 1.5;
            const targetWidth = targetHeight * aspectRatio;
            const position = index === 0 ? 0 : accPosition + targetWidth / 2;

            accPosition += (targetWidth * ((index === 0) ? .5 : 1)) + gap;

            return position;
        });
    };

    return (
        <>
            <Plane
                args={[100, 100]} // Large size to cover the background
                material={material}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.5, 0]}
            />

            <Suspense fallback={<Loader />}>
                {(() => {
                    const textures = useTexture(imagePaths);
                    const xPositions = calculatePositions(textures);
                    return textures.map((tex, index) => (
                        <ImagePage
                            cameraXRotation={cameraRef.rotation.x}
                            index={index}
                            key={index}
                            xPosition={xPositions[index]}
                            texture={tex}
                        />
                    ));
                })()}
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
