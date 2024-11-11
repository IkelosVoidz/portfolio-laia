import { animated, useSpring } from "@react-spring/web"
import { Html } from "@react-three/drei"
import { FC, Suspense, useMemo, useState } from "react";


const AnimatedButton: FC<{ iconUrl?: string, buttonText: string, textSize?: string, style?: React.CSSProperties, inCanvas?: boolean, onClick: () => void }> = ({ iconUrl, inCanvas, textSize, buttonText, style, onClick }) => {

    const [hovered, setHovered] = useState(false);
    const springProps = useSpring({
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
    });

    const btnContent = useMemo(
        () => (
            <div style={{ ...style }}>
                <animated.button
                    className="btn d-flex flex-row justify-content-between align-items-center"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={onClick}
                    style={springProps as any}

                >
                    {iconUrl && (
                        <img
                            src={iconUrl}
                            alt={buttonText}
                            width="50px"
                            height="50px"
                            className="img-fluid me-2"
                        />
                    )}
                    <p className='my-auto' style={{ fontSize: textSize || '2rem' }}>{buttonText}</p>

                </animated.button>
            </div >
        ),
        [buttonText],
    );

    return (
        <>
            <Suspense fallback={null}>
                {!inCanvas ? (
                    btnContent
                ) : (
                    <Html zIndexRange={[999, 0]} fullscreen>
                        {btnContent}
                    </Html>
                )}
            </Suspense>
        </>
    )
}

export default AnimatedButton
