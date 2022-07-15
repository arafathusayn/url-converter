import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Head from "next/head";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import CopyAll from "@mui/icons-material/CopyAll";
import OutboxOutlined from "@mui/icons-material/OutboxOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";

import { convertGDViewLinkToDownloadLink } from "../lib/google-drive";
import { ColorModeContext } from "./_app";
import { convertShortLinkToFull } from "../lib/short-link";

const tabs = [
  {
    label: "Google Drive",
    value: "gd",
  },
  {
    label: "Short Link",
    value: "sl",
  },
] as const;

const Home: NextPage = () => {
  const [convertedUrl, setConvertedUrl] = useState("");
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [copiedDialogOpen, setCopiedDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] =
    useState<typeof tabs[number]["value"]>("gd");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash.includes("tab=gd")) {
        setCurrentTab("gd");
      } else if (window.location.hash.includes("tab=sl")) {
        setCurrentTab("sl");
      }
    }
  }, []);

  const handleCopiedDialogClose = () => {
    setCopiedDialogOpen(false);
  };

  const handleGoogleDriveLinkChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const url = event.target.value;

    // handle google drive view link
    if (url.startsWith("https://drive.google.com")) {
      const converted = convertGDViewLinkToDownloadLink(url);

      if (converted && converted !== url) {
        setConvertedUrl(converted);
      }
    }
  };

  const handleShortLinkChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
    setLoading(true);

    if (
      typeof event.target.value === "string" &&
      (event.target.value.startsWith("https://") ||
        event.target.value.startsWith("http://"))
    ) {
      const converted = await convertShortLinkToFull(event.target.value);

      if (converted) {
        setConvertedUrl(converted);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="HandheldFriendly" content="true" />
        <title>URL Converter</title>
      </Head>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, lineHeight: "16px" }}
            >
              URL Converter
              <br />
              <span style={{ fontSize: "12px" }}>Made by Arafat Husayn</span>
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                borderRadius: 1,
              }}
            >
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container
        sx={{
          height: "100vh",
          padding: "10px 0px 0px 0px",
          color: "text.primary",
          backgroundColor: "background.default",
        }}
      >
        <Box m="10px">
          <p style={{ fontSize: "12px", color: "grey" }}>
            Convert Google Drive view links to direct download links, a short
            link (bit.ly, tinyurl etc.) to its redirected full link etc. Other
            URL conversions are coming soon.
          </p>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={(
                _event: React.SyntheticEvent,
                newValue: typeof tabs[number]["value"],
              ) => {
                setCurrentTab(newValue);

                if (typeof window !== "undefined") {
                  window.location.hash = `tab=${newValue}`;
                }
              }}
              aria-label="tabs"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>

          <Box mt="20px">
            {currentTab === "gd" && (
              <TextField
                variant="outlined"
                focused
                fullWidth
                required
                label="Google Drive File View Link"
                defaultValue=""
                placeholder="Paste link here"
                onChange={handleGoogleDriveLinkChange}
                type="url"
              />
            )}

            {currentTab === "sl" && (
              <TextField
                variant="outlined"
                focused
                fullWidth
                required
                label="Short Link (eg. Bit.ly, Tinyurl)"
                defaultValue=""
                placeholder="Paste link here"
                onChange={handleShortLinkChange}
                type="url"
              />
            )}
          </Box>

          {loading && (
            <Stack
              mt="20px"
              direction="row"
              position="absolute"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <CircularProgress />
            </Stack>
          )}

          {convertedUrl && (
            <Stack mt="40px">
              <TextField
                focused
                variant="outlined"
                fullWidth
                label="Converted Link"
                value={convertedUrl}
                onFocus={(event) => {
                  event.target.select();
                }}
              />

              <Stack direction="row" spacing={2} mt="20px">
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    navigator.clipboard.writeText(convertedUrl);
                    setCopiedDialogOpen(true);
                  }}
                  variant="contained"
                  startIcon={<CopyAll />}
                  fullWidth
                >
                  Copy Link
                </Button>

                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    window.open(convertedUrl, "_self");
                  }}
                  variant="outlined"
                  endIcon={<OutboxOutlined />}
                  fullWidth
                >
                  Open Link
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>

        <Dialog
          open={copiedDialogOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCopiedDialogClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Copied to your clipboard"}</DialogTitle>

          <DialogActions>
            <Button onClick={handleCopiedDialogClose}>Done</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default Home;
