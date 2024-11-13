import { animated, useSpring } from "@react-spring/web"
import { Html } from "@react-three/drei"
import { FC, Suspense, useState } from "react";


const AnimatedButton: FC<{ iconUrl?: string, buttonText: string, textSize?: string, style?: React.CSSProperties, inCanvas?: boolean, onClick: () => void, color?: String }> = ({ color, iconUrl, inCanvas, textSize, buttonText, style, onClick }) => {

    const [hovered, setHovered] = useState(false);
    const springProps = useSpring({
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
    });

    const btnContent = (
        <animated.button
            className="btn d-flex flex-row justify-content-between align-items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{ ...style, ...springProps as any, color: color ? color : '' }}
        >
            {iconUrl && (
                <img
                    src={iconUrl}
                    alt={buttonText || 'icon'}
                    width="50px"
                    height="50px"
                    className={(buttonText === "") ? "" : "me-2"}
                />
            )}
            <p className='my-auto' style={{ fontSize: textSize || '2rem' }}>{buttonText}</p>

        </animated.button>
    )

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