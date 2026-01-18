import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    translateText: (text: string, src_lang?: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const translateText = async (text: string, src_lang: string = 'en') => {
        if (language === src_lang) return text;

        try {
            const response = await fetch('http://localhost:8000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    src_lang,
                    target_lang: language,
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            return data.translated_text;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translateText }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
