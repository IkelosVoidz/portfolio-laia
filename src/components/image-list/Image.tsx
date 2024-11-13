import { FC, useState } from "react"
import { SpringValue, useSpring, a } from "@react-spring/three"
import { Texture } from "three"
import { useCursor } from "@react-three/drei"

interface ImageProps {
    cameraXRotation: number
    onClick: () => void
    selected: boolean
    texture: Texture
    targetHeight: number
    xPosition: SpringValue<number>
    yPosition?: SpringValue<number>
}

const Image: FC<ImageProps> = ({ cameraXRotation, xPosition, texture, selected, onClick, targetHeight }) => {

    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    useCursor(hovered);

    const { width, height } = texture.image
    const aspectRatio = width / height
    const targetWidth = targetHeight * aspectRatio

    const { scale, yPosition } = useSpring({
        scale: clicked ? 1.5 : 1,
        yPosition: (selected && !clicked) ? -0.2 : 0,
        config: { mass: 1, tension: 170, friction: 26 },
    })

    return (
        <a.mesh
            castShadow={true}
            scale={scale}
            onPointerEnter={(e) => {
                if (!selected) return
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerLeave={(e) => {
                if (!selected) return
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={(e) => {
                if (!selected) return
                e.stopPropagation();
                setClicked(!clicked);
                onClick();
            }}

            position-x={xPosition}
            position-y={0.6}
            position-z={yPosition}
            rotation={[cameraXRotation, 0, 0]}
        >
            <boxGeometry args={[targetWidth, targetHeight, 0.01]} />
            <meshBasicMaterial map={texture} />
        </a.mesh>
    )
}

export default Image