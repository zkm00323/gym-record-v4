import { supabase } from "../../lib/supabase";

interface Translation {
    key: string;
    value: string;
    lang_code: string;
}

class LangHelper {
    private static instance: LangHelper;
    private translations: Map<string, string> = new Map();
    private currentLang: string = 'zh-TW';
    private isLoaded: boolean = false;

    private constructor() { }

    public static getInstance(): LangHelper {
        if (!LangHelper.instance) {
            LangHelper.instance = new LangHelper();
        }
        return LangHelper.instance;
    }

    public async initialize(lang: string = 'zh-TW'): Promise<void> {
        if (this.isLoaded && this.currentLang === lang) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from('translation')
                .select('*')
                .eq('lang_code', lang);

            if (error) throw error;

            this.translations.clear();
            if (data) {
                data.forEach((item: Translation) => {
                    this.translations.set(item.key, item.value);
                });
            }

            this.currentLang = lang;
            this.isLoaded = true;
            console.log('語言資料已載入:', lang);
        } catch (error) {
            console.error('獲取翻譯時發生錯誤:', error);
            throw error;
        }
    }

    public getLang(key: string): string {
        if (!this.isLoaded) {
            console.warn('語言資料尚未載入');
            return key;
        }
        return this.translations.get(key) || key;
    }

    public async reloadTranslations(): Promise<void> {
        this.isLoaded = false;
        await this.initialize(this.currentLang);
    }

    public getCurrentLang(): string {
        return this.currentLang;
    }
}

export const Lang = LangHelper.getInstance(); 