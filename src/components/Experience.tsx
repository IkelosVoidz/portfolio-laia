import { Environment } from '@react-three/drei'
import { Book } from './Book'
import { Vector3 } from 'three'

export const Experience = () => {
    return (
        <>
            <Book position={new Vector3(-0.64 * 4, .1, 0)} opened={true} />
            <Book position={new Vector3(-0.64, .1, 0)} opened={true} />
            <Book position={new Vector3(-0.64 * -2, .1, 0)} opened={true} />

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
