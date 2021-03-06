import React, {
  createContext,
  useEffect,
  useState
} from 'react'
import _ from 'lodash'
import { THEMES, DEFAULT_LANGUAGE } from '../constants'

const lang = localStorage.getItem('i18nextLng') || DEFAULT_LANGUAGE

const defaultSettings = {
  // direction: lang === 'ar' ? 'rtl' : 'ltr',
  direction: 'ltr', //
  responsiveFontSizes: false,
  theme: THEMES.ONE_DARK,
  lang
}

export const restoreSettings = () => {
  let settings = null

  try {
    const storedData = window.localStorage.getItem('settings')

    if (storedData) {
      settings = JSON.parse(storedData)
    }
  } catch (err) {
    console.error(err)
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings
}

export const storeSettings = (settings?: any): void => {
  window.localStorage.setItem('settings', JSON.stringify(settings))
}

const SettingsContext = createContext({
  settings: defaultSettings,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveSettings: () => { }
})

export const SettingsProvider = ({ settings, children }
  : { settings?: any, children?: any }) => {
  const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings)

  const handleSaveSettings = (update = {}) => {
    const mergedSettings = _.merge({}, currentSettings, update)

    setCurrentSettings(mergedSettings)
    storeSettings(mergedSettings)
  }

  useEffect(() => {
    const restoredSettings = restoreSettings()

    if (restoredSettings) {
      setCurrentSettings(restoredSettings)
    }
  }, [])

  useEffect(() => {
    document.dir = currentSettings.direction
  }, [currentSettings])

  return (
    <SettingsContext.Provider
      value={{
        settings: currentSettings,
        saveSettings: handleSaveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const SettingsConsumer = SettingsContext.Consumer

export default SettingsContext
