import type { NextPage } from "next";
import React, { useContext, useState } from "react";
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
import { ColorModeContext } from "./_app";

const convert = (inputUrl: string): string => {
  if (!inputUrl.includes("drive.google.com")) {
    return "";
  }

  try {
    const match = inputUrl.match(/\/d\/(?<id>.+)\/view/gi);
    const id =
      match && match[0] && match[0].replace("/d/", "").replace("/view", "");

    if (id) {
      return `https://drive.google.com/uc?id=${id}&export=download`;
    } else {
      throw new Error("failed to convert");
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};

const Home: NextPage = () => {
  const [convertedUrl, setConvertedUrl] = useState("");
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [copiedDialogOpen, setCopiedDialogOpen] = useState(false);

  const handleCopiedDialogClose = () => {
    setCopiedDialogOpen(false);
  };

  const handleChange = (event: any) => {
    const url = event.target.value;

    if (url.startsWith("https://")) {
      const converted = convert(url);

      if (converted && converted !== url) {
        setConvertedUrl(converted);
      }
    }
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
            Convert Google Drive view links to direct download links.
          </p>
          <p style={{ fontSize: "12px", color: "grey" }}>
            Other URL conversions are coming soon.
          </p>

          <Box mt="40px">
            <TextField
              variant="outlined"
              focused
              fullWidth
              required
              label="Google Drive"
              defaultValue=""
              placeholder="Paste link here"
              onChange={handleChange}
              type="url"
            />
          </Box>

          {convertedUrl && (
            <Stack mt="40px">
              <TextField
                focused
                variant="outlined"
                fullWidth
                label="Direct Link"
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
