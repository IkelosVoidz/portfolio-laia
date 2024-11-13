import { animated, config, useSpring } from '@react-spring/web';
import { FC } from 'react'
import { useTranslation } from 'react-i18next';
import AnimatedButton from './shared/AnimatedButton';

const baseUrl = import.meta.env.BASE_URL;

const InfoPage: FC<{ isOpen: boolean, onClose: () => void, onCloseAnimEnd: () => void }> = ({ isOpen, onClose, onCloseAnimEnd }) => {
    const { t } = useTranslation();

    const styles = useSpring({
        from: { transform: 'translateY(100%)' },
        to: { transform: isOpen ? 'translateY(0%)' : 'translateY(100%)' },
        config: config.stiff,
        onRest: () => {
            if (!isOpen) onCloseAnimEnd()
        }
    })

    return (
        <animated.div style={{
            ...styles,
            backgroundColor: '#fbbcad',
            color: '#292830',
            zIndex: 10000000,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'calc(100% + 50px)'
        }}>

            <AnimatedButton
                iconUrl={`${baseUrl}icons/darkStar.svg`}
                buttonText={''}
                style={{ pointerEvents: 'auto', marginTop: 30, marginLeft: 30 }}
                onClick={onClose}
                color={'#292830'}
            />
            <div className="container">
                <div className="row h-100 w-100 justify-content-center">
                    <div className='col-10'>
                        <h1 className="mb-4 fw-bold">Statement</h1>
                        <p style={{ fontSize: '2rem', textAlign: 'justify', fontWeight: 'bold' }}>
                            {t("text1")}
                            <br />
                            <br />
                            {t("text2")}
                        </p>
                    </div >
                </div>
            </div>

        </animated.div>
    )
}

export default InfoPage

