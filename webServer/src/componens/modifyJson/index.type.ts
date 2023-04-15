

export interface TranslationText {
    textKey: string;
    zhCN: string;
    enUS: string;
    zhTW: string;
    comment:string;
}

export interface TranslationTexts {
    [key: string]: TranslationText;
}

export interface TranslationTextsGroup {
    [key: string]: TranslationTexts;
}

export interface sendTranslationTextType {
    groupKey: string;
    translationText: TranslationText;
} 

