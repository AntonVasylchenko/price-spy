import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  lang: "en" | "uk";
  changeLang: (lang: "uk" | "en") => void;
  themeMode: "dark" | "light";
  changeThemeMode: (themeMode: "dark" | "light") => void;
}

export const useStore = create<State>()(
  devtools(
        (set) => ({
            lang: "en",
            themeMode: "light",
            changeLang: (lang: "uk" | "en") =>
            set(() => ({
                lang,
            })),
            changeThemeMode: (themeMode: "dark" | "light") =>
            set(() => ({
                themeMode,
            })),
    })),
);
