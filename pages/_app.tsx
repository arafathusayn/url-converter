import React, { useEffect, useState } from "react";
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
  colorMode: "dark",
  toggleColorMode: () => {},
} as const;

export const ColorModeContext = React.createContext<AppContext>(defaultContext);

const cache = createCache({ key: "next" });

let doneWithEffect = false;

function MyApp({ Component, pageProps }: AppProps) {
  const [colorMode, setColorMode] = useState<AppContext["colorMode"]>(
    defaultContext.colorMode,
  );

  useEffect(() => {
    if (!doneWithEffect) {
      doneWithEffect = true;

      try {
        if (!matchMedia("(prefers-color-scheme: dark)").matches) {
          setColorMode("light");
        }

        matchMedia("(prefers-color-scheme: dark)").addEventListener(
          "change",
          ({ matches }) => {
            if (matches) {
              setColorMode("dark");
            } else {
              setColorMode("light");
            }
          },
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode === "dark" ? "dark" : "light",
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
