import { FC, useRef, useState } from "react"
import { useFrame, type Vector3 } from "@react-three/fiber"
import { Mesh } from "three"


const Box: FC<{ position: Vector3, name: string, wireframe?: boolean }> = ({ position, name, wireframe }) => {

    const ref = useRef<Mesh>(null!)

    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)

    useFrame((_, delta) => {
        if (clicked) {
            ref.current.rotation.x += 1 * delta;
            ref.current.rotation.y += .5 * delta;
        }
    })

    return (
        <mesh
            position={position}
            name={name} ref={ref}
            scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
            onClick={() => setClicked(!clicked)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry />
            <meshBasicMaterial color={hovered ? 0xff0000 : 0x00ff00} wireframe={wireframe} />
        </mesh >
    )
}
export default Box