import { Environment, useTexture } from '@react-three/drei'
import { Book } from './Book'
import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace, Vector3 } from 'three'
import { useMemo } from 'react'
import { RoundEdgedBoxFlat } from '../utils/utils'
// import { Text } from '@react-three/drei';

const baseUrl = import.meta.env.BASE_URL;
useTexture.preload(`${baseUrl}textures/PORTADA.png`);
useTexture.preload(`${baseUrl}textures/PORTADA_ROUGHNESS.png`);

const BOOK_WIDTH = 1.28;
const BOOK_HEIGHT = 1.71; // 4:3 aspect ratio
const BOOK_DEPTH = 0.1;
const GAP = BOOK_WIDTH + 0.1;

export const Experience = () => {
    const [picture, _] = useTexture([`${baseUrl}textures/PORTADA.png`, `${baseUrl}textures/PORTADA_ROUGHNESS.png`]);
    picture.colorSpace = SRGBColorSpace;

    const bookGeometry = useMemo(() => RoundEdgedBoxFlat(BOOK_WIDTH, BOOK_HEIGHT, BOOK_DEPTH, .1, 10), []);
    const materials = useMemo(() => [
        new MeshBasicMaterial({
            side: DoubleSide, // Front face with texture
            map: picture,

            toneMapped: false,
        }),    // Front face with image
        new MeshStandardMaterial({
            color: 0x444444,
            side: DoubleSide, // Back face (dark color) with double-sided rendering
            roughness: 0.9
        }),      // Dark back face
        new MeshStandardMaterial({
            color: 0xFFFFFF, // Rim is single-sided
            roughness: .9
        })       // White rim
    ], []);

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
            <Book position={new Vector3(-GAP * 2, .1, 0)} opened={true} bookGeometry={bookGeometry} materials={materials} />
            <Book position={new Vector3(-GAP, .1, 0)} opened={true} bookGeometry={bookGeometry} materials={materials} />
            <Book position={new Vector3(0, .1, 0)} opened={true} bookGeometry={bookGeometry} materials={materials} />
            <Book position={new Vector3(GAP, .1, 0)} opened={true} bookGeometry={bookGeometry} materials={materials} />
            <Book position={new Vector3(GAP * 2, .1, 0)} opened={true} bookGeometry={bookGeometry} materials={materials} />
            {/* <Text
                position={[0, 1.5, 0]}  // Position relative to the box
                fontSize={0.5}            // Font size
                color="black"            // Text color
                anchorX="center"         // Centering the text horizontally
                anchorY="middle"         // Centering the text vertically
            >
                Hello, 3D World!
            </Text> */}


            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
        </>
    )
}
