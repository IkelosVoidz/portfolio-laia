import { useCursor, useTexture } from "@react-three/drei";
import { useAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import {
    BoxGeometry,
    Color,
    MeshStandardMaterial,
    SRGBColorSpace,
    Vector3,
} from "three";
import { pageAtom, pages } from "./UI";


const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;

const baseUrl = import.meta.env.BASE_URL;

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
    new MeshStandardMaterial({
        color: whiteColor,
    }),
    new MeshStandardMaterial({
        color: "#111",
    }),
    new MeshStandardMaterial({
        color: whiteColor,
    }),
    new MeshStandardMaterial({
        color: whiteColor,
    }),
];

pages.forEach((page) => {
    useTexture.preload(`${baseUrl}textures/${page.front}.jpg`);
    useTexture.preload(`${baseUrl}textures/${page.back}.jpg`);
    useTexture.preload(`${baseUrl}textures/book-cover-roughness.jpg`);
});

interface PageProps {
    number: number;
    front: string;
    back: string;
    page: number;
    opened: boolean;
    bookClosed: boolean;
}

const Page: FC<PageProps> = ({ number, front, back, page, opened, bookClosed, ...props }) => {
    const [picture, picture2, pictureRoughness] = useTexture([
        `${baseUrl}textures/${front}.jpg`,
        `${baseUrl}textures/${back}.jpg`,
        ...(number === 0 || number === pages.length - 1
            ? [`${baseUrl}textures/book-cover-roughness.jpg`]
            : []),
    ]);
    picture.colorSpace = picture2.colorSpace = SRGBColorSpace;


    const materials = [
        ...pageMaterials,
        new MeshStandardMaterial({
            color: whiteColor,
            map: picture,
            ...(number === 0
                ? {
                    roughnessMap: pictureRoughness,
                }
                : {
                    roughness: 0.1,
                }),
            emissive: emissiveColor,
            emissiveIntensity: 0,
        }),
        new MeshStandardMaterial({
            color: whiteColor,
            map: picture2,
            ...(number === pages.length - 1
                ? {
                    roughnessMap: pictureRoughness,
                }
                : {
                    roughness: 0.1,
                }),
            emissive: emissiveColor,
            emissiveIntensity: 0,
        }),
    ];

    const [_, setPage] = useAtom(pageAtom);
    const [highlighted, setHighlighted] = useState(false);
    useCursor(highlighted);

    return (
        <group
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
                setPage(opened ? number : number + 1);
                setHighlighted(false);
            }}
        >
            <mesh
                geometry={pageGeometry}
                material={materials}
                position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
            />
        </group>
    );
};

interface BookProps {
    position: Vector3,
    opened: boolean;
}

export const Book: FC<BookProps> = ({ position, opened, ...props }) => {
    const [page] = useAtom(pageAtom);
    const [delayedPage, setDelayedPage] = useState(page);

    useEffect(() => {
        let timeout: number;
        const goToPage = () => {
            setDelayedPage((delayedPage) => {
                if (page === delayedPage) {
                    return delayedPage; // Safely return delayedPage as a number
                }

                // Set the timeout outside of the return statement
                timeout = setTimeout(() => {
                    goToPage();
                }, Math.abs(page - delayedPage) > 2 ? 50 : 150);

                // Adjust delayedPage based on the direction to avoid undefined
                return page > delayedPage ? delayedPage + 1 : delayedPage - 1;
            });

        };
        goToPage();
        return () => {
            clearTimeout(timeout);
        };
    }, [page]);

    return (
        <group {...props} position={position} rotation={[-Math.PI / 2, 0, 0]}>
            {[...pages].map((pageData, index) => (
                <Page
                    key={index}
                    page={delayedPage}
                    number={index}
                    opened={delayedPage > index}
                    bookClosed={delayedPage === 0 || delayedPage === pages.length}
                    {...pageData}
                />
            ))}
        </group>
    );
};