
import { useCursor } from "@react-three/drei";
import { FC, useState } from "react";
import {
    BufferGeometry,
    Camera,
    Material,
    NormalBufferAttributes,
    Vector3,
} from "three";
import { useSpring, animated } from "@react-spring/three";

interface BookProps {
    position: Vector3,
    opened: boolean;
    bookGeometry: BufferGeometry<NormalBufferAttributes>,
    materials: Material[],
    cameraRef: Camera,
}

export const Book: FC<BookProps> = ({ position, opened, bookGeometry, materials, cameraRef, ...props }) => {

    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    const { position: animatedPosition, scale: animatedScale, rotation: animatedRotation } = useSpring({
        position: hovered ? [position.x, position.y + 0.2, position.z] : position.toArray(),
        rotation: [hovered ? (cameraRef.rotation.x) : (-Math.PI / 2), 0, 0],
        scale: hovered ? [1.05, 1.05, 1.05] : [1, 1, 1],
        config: { tension: 170, friction: 26 },
    });

    return (
        <animated.mesh
            castShadow
            {...props}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerLeave={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                setHovered(false);
            }}
            position={animatedPosition as any}
            scale={animatedScale as any}
            rotation={animatedRotation as any}
            geometry={bookGeometry}
            material={materials}

        >

        </animated.mesh>
    );
};