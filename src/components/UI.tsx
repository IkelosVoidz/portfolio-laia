import { infoPageOpenAtom, selectedBookAtom } from "../utils/utils";
import { useAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedButton from "./shared/AnimatedButton";
import InfoPage from "./InfoPage";

const languages = [
    { code: 'ca', label: 'CAT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
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
                                buttonText={'STATEMENT'}
                                style={{ pointerEvents: 'auto', margin: '10px' }}
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
                <InfoPage
                    isOpen={infoPageOpen}
                    onClose={() => {
                        setInfoPageAnimating(true);
                        setInfoPageOpen(false);
                    }}
                    onCloseAnimEnd={() => setInfoPageAnimating(false)} />

            }
        </>
    )
}

export default UI