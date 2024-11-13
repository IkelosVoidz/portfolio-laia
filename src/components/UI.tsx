import { useTranslation } from "react-i18next";
import AnimatedButton from "./AnimatedButton";
import { useAtom } from "jotai";
import { infoPageOpenAtom, selectedBookAtom } from "../utils/utils";
import InfoPage from "./InfoPage";
import { useState } from "react";

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'ca', label: 'CAT' },
    { code: 'pt', label: 'PT' }
];

const baseUrl = import.meta.env.BASE_URL;

const darkColor = '#292830';

const UI = () => {

    const { i18n } = useTranslation();
    const currentLanguage = i18n.language
    const [selectedBook, _] = useAtom(selectedBookAtom);
    const [infoPageOpen, setInfoPageOpen] = useAtom(infoPageOpenAtom);
    const [infoPageAnimating, setInfoPageAnimating] = useState(false);


    return (
        <>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="d-flex flex-row justify-content-betweens py-2">

                        <div className="align-self-end"> {selectedBook === null &&
                            <AnimatedButton
                                iconUrl={`${baseUrl}icons/STAR.svg`}
                                buttonText={'INFO'}
                                style={{ pointerEvents: 'auto' }}
                                onClick={() => setInfoPageOpen(true)}
                            />}
                        </div>
                        <div className="flex-grow-1" />
                        <div className="d-flex flex-row justify-content-between align-items-center align-self-start" style={{ zIndex: 100000000000 }}>
                            {languages.map(lang => (
                                <AnimatedButton
                                    key={lang.code}
                                    buttonText={lang.label}
                                    onClick={() => { i18n.changeLanguage(lang.code) }}
                                    style={{

                                        borderBottom: currentLanguage === lang.code ? `3px solid ${infoPageOpen ? darkColor : ''}` : 'none',
                                        pointerEvents: 'auto'
                                    }}
                                    color={infoPageOpen ? darkColor : ''}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {(infoPageOpen || infoPageAnimating) &&
                <div className="position-absolute top-0 start-0 w-100" style={{ height: 'calc(100% + 50px)' }}>
                    <InfoPage
                        isOpen={infoPageOpen}
                        onClose={() => {
                            setInfoPageAnimating(true);
                            setInfoPageOpen(false);
                        }}
                        onCloseAnimEnd={() => setInfoPageAnimating(false)} />
                </div>
            }
        </>
    )
}

export default UI