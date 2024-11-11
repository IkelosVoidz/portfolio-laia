import { FC, Suspense, useMemo, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { Camera, Texture } from 'three'
import AnimatedButton from './AnimatedButton'
import { useTranslation } from 'react-i18next'
import { Book } from '../utils/interfaces'
import Spinner from './Spinner'
import Backdrop from './Backdrop'

const baseUrl = import.meta.env.BASE_URL
const TARGET_HEIGHT = 1.8;
const GAP = 0.6;

interface ImagePageProps {
    index: number,
    cameraXRotation: number,
    xPosition: number,
    texture: Texture,
}

const ImagePage: FC<ImagePageProps> = ({ cameraXRotation, xPosition, texture }) => {
    const { width, height } = texture.image;
    const aspectRatio = width / height;
    const targetWidth = TARGET_HEIGHT * aspectRatio;

    return (
        <mesh position={[xPosition, .6, 0]} rotation={[cameraXRotation, 0, 0]}>
            <boxGeometry args={[targetWidth, TARGET_HEIGHT, 0.01]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

interface ImageListProps {
    selectedBook: number
    onClose: () => void
    cameraRef: Camera
}

const ImageList: FC<ImageListProps> = ({ selectedBook, onClose, cameraRef }) => {


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

        return textures.map((tex, index) => {
            const aspectRatio = tex.image.width / tex.image.height;

            const targetWidth = TARGET_HEIGHT * aspectRatio;
            const position = index === 0 ? 0 : accPosition + targetWidth / 2;

            accPosition += (targetWidth * ((index === 0) ? .5 : 1)) + GAP;

            return position;
        });
    };

    return (
        <>

            <Backdrop />
            <Suspense fallback={<Spinner />}>
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
