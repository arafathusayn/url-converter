import React, { useState } from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "../styles/globals.css";
interface AppContext {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

const defaultContext = {
  colorMode: "light",
  toggleColorMode: () => {},
} as const;

export const ColorModeContext = React.createContext<AppContext>(defaultContext);

const cache = createCache({ key: "next" });

function MyApp({ Component, pageProps }: AppProps) {
  const [colorMode, setColorMode] = useState<AppContext["colorMode"]>(
    defaultContext.colorMode,
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode],
  );

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ColorModeContext.Provider
        value={{
          colorMode,
          toggleColorMode,
        }}
      >
        <CacheProvider value={cache}>
          <Component {...pageProps} />
        </CacheProvider>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
