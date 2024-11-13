import { Environment, useTexture } from '@react-three/drei'
import { Book } from './Book'
import { DoubleSide, MeshBasicMaterial, SRGBColorSpace, Vector3 } from 'three'
import { Suspense, useMemo } from 'react'
import { RoundEdgedBoxFlat, selectedBookAtom, infoPageOpenAtom } from '../utils/utils';
import { useThree } from '@react-three/fiber'
import ImageList from './ImageList';
import { useTranslation } from 'react-i18next'

import Spinner from './Spinner'
import { useAtom } from 'jotai'

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
    const [selectedBook, setSelectedBook] = useAtom(selectedBookAtom);
    const [infoPageOpen, _] = useAtom(infoPageOpenAtom);


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
                        disableControls={infoPageOpen}
                    />
                ))

            }

            <Suspense fallback={<Spinner />}>
                {(selectedBook !== null) &&
                    <>
                        <ImageList cameraRef={camera} selectedBook={selectedBook} onClose={() => setSelectedBook(null)} />
                    </>
                }
            </Suspense>



            <mesh position-y={0} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>


        </>
    )
}

