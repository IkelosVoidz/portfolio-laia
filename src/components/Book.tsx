
import { useCursor, Text, Billboard } from "@react-three/drei";
import { FC, Suspense, useRef, useState } from "react";
import {
    BufferGeometry,
    Camera,
    Material,
    NormalBufferAttributes,
    Vector3,
} from "three";
import { useSpring, animated } from "@react-spring/three";
interface BookProps {
    title: string,
    position: Vector3,
    bookGeometry: BufferGeometry<NormalBufferAttributes>,
    materials: Material[],
    cameraRef: Camera,
    onSelected: () => void,
    selected: boolean,
}

const baseUrl = import.meta.env.BASE_URL

export const Book: FC<BookProps> = ({ position, bookGeometry, materials, cameraRef, onSelected, selected, title, ...props }) => {

    const [hovered, setHovered] = useState(false);
    const textRef = useRef<any>(); // Ref for the text object

    useCursor(hovered);

    const { position: animatedPosition, scale: animatedScale, rotation: animatedRotation } = useSpring({
        position: hovered ? [position.x, position.y + 0.2, position.z] : position.toArray(),
        rotation: [hovered ? (cameraRef.rotation.x) : (-Math.PI / 2), 0, 0],
        scale: hovered ? [1.05, 1.05, 1.05] : [1, 1, 1],
        config: { tension: 170, friction: 26 },
    });

    // Spring for fading text in/out
    const textSpring = useSpring({
        opacity: hovered ? 1 : 0, // Fade in when hovered, fade out when not
        config: { tension: 170, friction: 26 }, // Adjust for immediate disappearance
    });


    return (
        <>
            <animated.mesh
                castShadow={!selected}

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
                    <Billboard

                        follow={true}
                        lockX={false}
                        lockY={false}
                        lockZ={false}
                    >
                        <Text

                            font={`${baseUrl}fonts/Fontspring-DEMO-theseasons-reg.ttf`}
                            characters="abcdefghijklmnopqrstuvwxyz"
                            ref={textRef}
                            position={[position.x, position.y + 1.2, position.z + .3]}
                            fontSize={.2}
                            color="#fbbcad"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {title}
                            <animated.meshBasicMaterial attach="material" opacity={textSpring.opacity} />
                        </Text>
                    </Billboard>
                    )
                </Suspense>
            }
        </>


    );
};