import React from "react"
import { GlobalStyle } from "./globalStyle"
import { Loyaut } from "./component"
import { useStore } from "./store";



const App: React.FC = () => {
  const { themeMode } = useStore();
  return (
    <>
      <GlobalStyle themeName={themeMode} />
      <Loyaut />
    </>
  )
}

export default App
