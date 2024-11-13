import {
    BufferGeometry,
    Camera,
    Material,
    NormalBufferAttributes,
    Vector3,
} from "three";
import { useCursor, Text, Billboard } from "@react-three/drei";
import { FC, Suspense, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";

const baseUrl = import.meta.env.BASE_URL

interface BookProps {
    bookGeometry: BufferGeometry<NormalBufferAttributes>,
    cameraRef: Camera,
    disableControls: boolean
    materials: Material[],
    onSelected: () => void,
    position: Vector3,
    selected: boolean,
    title: string,
}

export const Book: FC<BookProps> = ({ position, bookGeometry, materials, cameraRef, onSelected, selected, title, disableControls, ...props }) => {

    const textRef = useRef<any>();
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    const { position: animatedPosition, scale: animatedScale, rotation: animatedRotation } = useSpring({
        position: hovered ? [position.x, position.y + 0.2, position.z] : position.toArray(),
        rotation: [hovered ? (cameraRef.rotation.x) : (-Math.PI / 2), 0, 0],
        scale: hovered ? [1.05, 1.05, 1.05] : [1, 1, 1],
        config: { tension: 170, friction: 26 },
    });

    const textSpring = useSpring({
        opacity: hovered ? 1 : 0,
        config: { tension: 170, friction: 26 },
    });

    return (
        <>
            <animated.mesh
                castShadow={!selected}
                {...props}
                onPointerEnter={(e) => {

                    if (disableControls) return;

                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerLeave={(e) => {

                    if (disableControls) return;

                    e.stopPropagation();
                    setHovered(false);
                }}
                onClick={(e) => {
                    if (disableControls) return;

                    e.stopPropagation();
                    setHovered(false);
                    onSelected();
                }}
                position={animatedPosition as any}
                scale={animatedScale as any}
                rotation={animatedRotation as any}
                geometry={bookGeometry}
                material={materials}
            />
            {
                <Suspense fallback={null}>
                    hovered && (
                    <Billboard>
                        <Text
                            font={`${baseUrl}fonts/Belleza-Regular.ttf`}
                            characters="abcdefghijklmnopqrstuvwxyz"
                            ref={textRef}
                            position={[position.x, position.y + 1.2, position.z + .3]}
                            fontSize={.2}
                            color="#fbbcad"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {title}
                            <animated.meshBasicMaterial toneMapped={false} attach="material" opacity={textSpring.opacity} />
                        </Text>
                    </Billboard>
                    )
                </Suspense>
            }
        </>
    );
};