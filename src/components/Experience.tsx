import { Environment, Html, useTexture, Loader } from '@react-three/drei'
import { Book } from './Book'
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace, Vector3 } from 'three'
import { Suspense, useMemo, useState } from 'react'
import { RoundEdgedBoxFlat } from '../utils/utils'
import { useThree } from '@react-three/fiber'
import ImageList from './ImageList';
import { useTranslation } from 'react-i18next'

import AnimatedButton from './AnimatedButton';
import Spinner from './Spinner'

const baseUrl = import.meta.env.BASE_URL;
useTexture.preload(`${baseUrl}textures/PORTADA.png`);

const BOOK_WIDTH = 1.28;
const BOOK_HEIGHT = 1.71; // 4:3 aspect ratio
const BOOK_DEPTH = 0.1;
const GAP = BOOK_WIDTH + 0.2;

export const Experience = () => {
    const { camera } = useThree();
    const { t } = useTranslation();

    const [picture] = useTexture([`${baseUrl}textures/PORTADA.png`])
    picture.colorSpace = SRGBColorSpace;
    const [selectedBook, setSelectedBook] = useState<number | null>(null);
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
            <Suspense fallback={<Html><Loader /></Html>}>
                {
                    selectedBook === null &&
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
            </Suspense>

            <Suspense fallback={<Spinner />}>
                {(selectedBook !== null) &&
                    <>
                        <ImageList cameraRef={camera} selectedBook={selectedBook} onClose={() => setSelectedBook(null)} />
                    </>
                }
            </Suspense>

            {selectedBook === null && <AnimatedButton inCanvas iconUrl={`${baseUrl}icons/STAR.svg`} buttonText={'INFO'} style={{ position: 'absolute', bottom: 20, left: 30, zIndex: 10 }} onClick={() => console.log('info')} />}
            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>


        </>
    )
}

