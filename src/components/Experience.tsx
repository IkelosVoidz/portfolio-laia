import { Environment } from '@react-three/drei'
import { Book } from './Book'
import { Color, DoubleSide, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from 'three'
import { useMemo } from 'react'
import { RoundEdgedBoxFlat } from '../utils/utils'
import { BackSide } from 'three'

const whiteColor = new Color("white");

export const Experience = () => {

    const bookGeometry = useMemo(() => RoundEdgedBoxFlat(1.28, 1.71, .1, .3, 10), []);
    const bookMaterials = useMemo(() => [
        new MeshBasicMaterial({
            side: DoubleSide,
            color: whiteColor,
        }),
        new MeshBasicMaterial({
            side: DoubleSide,
            color: "#111",
        }),
        new MeshBasicMaterial({
            color: whiteColor,
        }),
    ], []);

    return (
        <>
            <Book position={new Vector3(0, .1, 0)} opened={true} />
            <Book position={new Vector3(0, .1, 0)} opened={true} />
            <Book position={new Vector3(0, .1, 0)} opened={true} />

            <mesh geometry={bookGeometry} material={bookMaterials} position={[0, 0.05, 0]}>

            </mesh >

            <Environment preset="studio" />
            <directionalLight
                position={[0, 5, -5]}
                intensity={2.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />
            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
            {/* <Box position={[-0.75, 0, 0]} name="A" wireframe />
            <Box position={[0.75, 0, 0]} name="B" /> */}
        </>
    )
}
