import { MeshBasicMaterial } from "three"
import { Plane } from "@react-three/drei"
import { useMemo } from "react"

const Backdrop = () => {
    const material = useMemo(() => new MeshBasicMaterial({
        color: 'black',
        transparent: true,
        opacity: 0.6,
    }), [])

    return (
        <Plane
            args={[100, 100]}
            material={material}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.5, 0]}
        />
    )
}

export default Backdrop