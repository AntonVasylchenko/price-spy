import React from 'react'
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { Selector } from '../../UI';
import { globalValues } from '../../const';
import { SettingsDiv } from './styled';


const Settings: React.FC = () => {
  const { changeThemeMode, themeMode, changeLang, lang } = useStore();
  const { listLang, colorMode } = globalValues;
  const { i18n, t } = useTranslation();

  const handleGlobalTheme = React.useCallback((value: string): void => {
    if (value === "light" || value === "dark") {
      changeThemeMode(value)
    }
  }, [changeThemeMode, themeMode]);

  const handleLanguage = React.useCallback((value: string): void => {
    i18n.changeLanguage(value);
    if (value === "en" || value === "uk") {
      changeLang(value);
    }
  }, [changeLang, lang, i18n.changeLanguage]);

  return (
    <SettingsDiv>
      <Selector
        label={t('settings.color')}
        options={colorMode}
        selectedOption={themeMode}
        handleGlobalState={handleGlobalTheme}
      />
      <Selector
        label={t('settings.lang')}
        options={listLang}
        selectedOption={lang}
        handleGlobalState={handleLanguage}
      />
    </SettingsDiv>
  )
}

export default Settings