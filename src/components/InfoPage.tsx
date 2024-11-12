import { FC } from 'react'
import { animated, config, useSpring } from '@react-spring/web';

const InfoPage: FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    // Slide-in animation for the popup
    const styles = useSpring({
        from: { transform: 'translateY(100%)' },
        to: { transform: isOpen ? 'translateY(0%)' : 'translateY(100%)' },
        config: config.stiff,
        onRest: () => {
            if (!isOpen) onClose()
        }
    })

    {/* #333f59 */ }
    {/* #292830 */ }



    return (
        <animated.div style={{ ...styles, width: '100%', height: '100%', backgroundColor: '#fbbcad', color: '#292830', zIndex: 10000000 }}>

            <div className="container">
                <div className="row h-100 w-100 py-5">
                    <h1 className="mb-4 fw-bold">My Portfolio</h1>
                    <p style={{ textAlign: 'justify', fontWeight: 'bold' }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae explicabo,
                        voluptatem ut ab laborum veritatis accusantium quidem impedit excepturi possimus.
                        Illum unde expedita soluta id commodi corporis a neque ipsa! Maxime sunt molestiae dolores fuga,
                        consequuntur voluptatibus facere debitis aliquid magni! Perferendis, illum vitae, magni nihil
                        accusantium deserunt eveniet cumque dolorem sequi iusto repellendus ad? Ullam ipsum unde r
                        eiciendis consequuntur animi odit aut maxime adipisci recusandae laudantium officiis rerum s
                        ed repellat dolore quae, debitis itaque molestias suscipit non! Facere dolor, sunt corrupti
                        accusantium architecto voluptas deleniti ut iste numquam labore quidem necessitatibus illo voluptatum maxime soluta fuga, illum, vel saepe?
                    </p>
                    <p style={{ textAlign: 'justify', fontWeight: 'bold' }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae explicabo,
                        voluptatem ut ab laborum veritatis accusantium quidem impedit excepturi possimus.
                        Illum unde expedita soluta id commodi corporis a neque ipsa! Maxime sunt molestiae dolores fuga,
                        consequuntur voluptatibus facere debitis aliquid magni! Perferendis, illum vitae, magni nihil
                        accusantium deserunt eveniet cumque dolorem sequi iusto repellendus ad? Ullam ipsum unde r
                        eiciendis consequuntur animi odit aut maxime adipisci recusandae laudantium officiis rerum s
                        ed repellat dolore quae, debitis itaque molestias suscipit non! Facere dolor, sunt corrupti
                        accusantium architecto voluptas deleniti ut iste numquam labore quidem necessitatibus illo voluptatum maxime soluta fuga, illum, vel saepe?
                    </p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>

        </animated.div>
    )
}

export default InfoPage

