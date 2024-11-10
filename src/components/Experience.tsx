import { Environment, useFont, useTexture } from '@react-three/drei'
import { Book } from './Book'
import { DoubleSide, MathUtils, MeshBasicMaterial, SRGBColorSpace, Vector3 } from 'three'
import { useMemo, useRef, useState } from 'react'
import { RoundEdgedBoxFlat } from '../utils/utils'
import { useFrame, useThree } from '@react-three/fiber'
import ImageList from './ImageList';
import { useTranslation } from 'react-i18next'

import AnimatedButton from './AnimatedButton';

const baseUrl = import.meta.env.BASE_URL;
useTexture.preload(`${baseUrl}textures/PORTADA.png`);
useFont.preload(`${baseUrl}fonts/Fontspring-DEMO-theseasons-reg.ttf`);
[...Array(6).keys()].forEach((i) => useTexture.preload(`${baseUrl}images/collage/${i}.png`));
[...Array(18).keys()].forEach((i) => useTexture.preload(`${baseUrl}images/dibuix/${i}.png`));
[...Array(7).keys()].forEach((i) => useTexture.preload(`${baseUrl}images/digital/${i}.png`));
[...Array(10).keys()].forEach((i) => useTexture.preload(`${baseUrl}images/foto/${i}.png`));
[...Array(13).keys()].forEach((i) => useTexture.preload(`${baseUrl}images/pintura/${i}.png`));


const BOOK_WIDTH = 1.28;
const BOOK_HEIGHT = 1.71; // 4:3 aspect ratio
const BOOK_DEPTH = 0.1;
const GAP = BOOK_WIDTH + 0.2;

export const Experience = () => {
    const { camera } = useThree();
    const { t } = useTranslation();

    const [picture] = useTexture([`${baseUrl}textures/PORTADA.png`])
    const bookOpacity = useRef<number>(1)
    picture.colorSpace = SRGBColorSpace;
    const [selectedBook, setSelectedBook] = useState<number | null>(null);

    const [bookFadeOutComplete, setBookFadeOutComplete] = useState(false);
    // const [pageFadeOutComplete, setPageFadeOutComplete] = useState(true);

    const bookGeometry = useMemo(() => RoundEdgedBoxFlat(BOOK_WIDTH, BOOK_HEIGHT, BOOK_DEPTH, .1, 10), []);
    const materials = useMemo(() => [
        new MeshBasicMaterial({
            side: DoubleSide,
            map: picture,
            toneMapped: false,

        }),
        new MeshBasicMaterial({
            color: 0x444444,
            side: DoubleSide,

        }),
        new MeshBasicMaterial({
            color: 0xffbbcad,

        })
    ], []);


    useFrame(() => {
        const targetOpacity = selectedBook === null ? 1 : 0;
        bookOpacity.current = MathUtils.lerp(bookOpacity.current, targetOpacity, 0.2);

        materials.forEach(material => {
            material.transparent = true;
            material.opacity = bookOpacity.current;
        });
        if (Math.abs(bookOpacity.current - 0) < 0.01 && !bookFadeOutComplete) {
            setBookFadeOutComplete(true)
        } else if (bookOpacity.current > 0.01 && bookFadeOutComplete) {
            setBookFadeOutComplete(false)
        }
    });
    return (
        <>
            <Environment preset="studio" />
            <directionalLight
                position={[0, 5, -5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />
            {
                !bookFadeOutComplete &&
                [...Array(5)].map((_, i) => (
                    <Book
                        key={i}
                        title={t(`books.${i}.title`)}
                        position={new Vector3(-GAP * 2 + i * GAP, .1, 0)}
                        bookGeometry={bookGeometry}
                        materials={materials}
                        cameraRef={camera}
                        onSelected={() => setSelectedBook(i)}
                        selected={selectedBook !== null}
                    />
                ))

            }

            {(selectedBook !== null) &&
                <ImageList cameraRef={camera} selectedBook={selectedBook} onClose={() => setSelectedBook(null)} />
            }

            {selectedBook === null &&
                <AnimatedButton inCanvas iconUrl={`${baseUrl}icons/STAR.svg`} buttonText={'INFO'} style={{ position: 'absolute', bottom: 20, left: 30, zIndex: 10 }} onClick={() => console.log('info')
                } />}

            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
        </>
    )
}
