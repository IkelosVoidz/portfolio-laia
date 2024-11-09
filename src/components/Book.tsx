import { useCursor } from "@react-three/drei";
import { FC, useState } from "react";
import {
    BufferGeometry,
    Material,
    NormalBufferAttributes,
    Vector3,
} from "three";

interface BookProps {
    position: Vector3,
    opened: boolean;
    bookGeometry: BufferGeometry<NormalBufferAttributes>
    materials: Material[]
}

export const Book: FC<BookProps> = ({ position, opened, bookGeometry, materials, ...props }) => {

    const [highlighted, setHighlighted] = useState(false);
    useCursor(highlighted);

    return (
        <mesh
            castShadow
            {...props}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHighlighted(true);
            }}
            onPointerLeave={(e) => {
                e.stopPropagation();
                setHighlighted(false);
            }}
            onClick={(e) => {
                e.stopPropagation();

                setHighlighted(false);
            }}
            position={position}
            rotation={[(-Math.PI / 2), 0, 0]}
            geometry={bookGeometry}
            material={materials}
        />
    )
};