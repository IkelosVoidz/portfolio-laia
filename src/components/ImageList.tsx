import { FC, useMemo, } from 'react'
import { Plane } from '@react-three/drei'
import { MeshBasicMaterial } from 'three'
import AnimatedButton from './AnimatedButton'
import { useTranslation } from 'react-i18next'

const baseUrl = import.meta.env.BASE_URL

interface ImageListProps {
    bookSelected: number
    onClose: () => void
}

const ImageList: FC<ImageListProps> = ({ onClose }) => {
    // Create a dark transparent material
    const material = useMemo(() => new MeshBasicMaterial({
        color: 'black',
        transparent: true,
        opacity: 0.6,
    }), [])

    const { t } = useTranslation();

    console.log('renders');


    return (
        <>
            <Plane
                args={[100, 100]} // Large size to cover the background
                material={material}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, .5, 0]}
            />

            <AnimatedButton inCanvas iconUrl={`${baseUrl}icons/close.svg`} buttonText={t('close').toUpperCase()} style={{ position: 'absolute', top: 20, left: 30 }} onClick={onClose} />
        </>
    )
}

export default ImageList