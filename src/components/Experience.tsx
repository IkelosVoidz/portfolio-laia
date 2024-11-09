import { Environment, useTexture } from '@react-three/drei'
import { Book } from './Book'
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace, Vector3 } from 'three'
import { useMemo, useRef, useState } from 'react'
import { RoundEdgedBoxFlat } from '../utils/utils'
import { useFrame, useThree } from '@react-three/fiber'

const baseUrl = import.meta.env.BASE_URL;
useTexture.preload(`${baseUrl}textures/PORTADA.png`);
useTexture.preload(`${baseUrl}textures/PORTADA_ROUGHNESS.png`);

const BOOK_WIDTH = 1.28;
const BOOK_HEIGHT = 1.71; // 4:3 aspect ratio
const BOOK_DEPTH = 0.1;
const GAP = BOOK_WIDTH + 0.2;

export const Experience = () => {
    const { camera } = useThree();

    const [picture, _] = useTexture([`${baseUrl}textures/PORTADA.png`, `${baseUrl}textures/PORTADA_ROUGHNESS.png`]);
    const bookOpacity = useRef<number>(1)
    picture.colorSpace = SRGBColorSpace;
    const [selectedBook, setSelectedBook] = useState<number | null>(null);

    const [bookFadeOutComplete, setBookFadeOutComplete] = useState(false);
    // const [pageFadeOutComplete, setPageFadeOutComplete] = useState(true);

    const bookGeometry = useMemo(() => RoundEdgedBoxFlat(BOOK_WIDTH, BOOK_HEIGHT, BOOK_DEPTH, .1, 10), []);
    const materials = useMemo(() => [
        new MeshBasicMaterial({
            side: DoubleSide, // Front face with texture
            map: picture,
            toneMapped: false,

        }),    // Front face with image
        new MeshBasicMaterial({
            color: 0x444444,
            side: DoubleSide, // Back face (dark color) with double-sided rendering

        }),      // Dark back face
        new MeshBasicMaterial({
            color: 0xffbbcad, // Rim is single-sided

        })       // White rim
    ], [bookOpacity]);

    // Update opacity on each frame
    useFrame(() => {
        // Interpolate opacity based on selectedBook
        if (selectedBook === null) {
            bookOpacity.current = Math.min(1, bookOpacity.current + 0.05) // Fade in
        } else {
            bookOpacity.current = Math.max(0, bookOpacity.current - 0.05) // Fade out
        }

        // Apply the updated opacity to the materials
        materials.forEach(material => {
            material.transparent = true // Make sure transparency is enabled
            material.opacity = bookOpacity.current
        })


        if (bookOpacity.current <= 0 && !bookFadeOutComplete) {
            setBookFadeOutComplete(true)
        } else if (bookOpacity.current > 0 && bookFadeOutComplete) {
            setBookFadeOutComplete(false)
        }
    })
    return (
        <>
            <Environment preset="studio" />
            <directionalLight
                position={[0, 5, -5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />

            {
                !bookFadeOutComplete &&
                [...Array(5)].map((_, i) => (
                    <Book
                        key={i}
                        position={new Vector3(-GAP * 2 + i * GAP, .1, 0)}
                        bookGeometry={bookGeometry}
                        materials={materials}
                        cameraRef={camera}
                        onSelected={() => setSelectedBook(i)}
                        selected={selectedBook !== null}
                    />
                ))
            }


            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
        </>
    )
}
