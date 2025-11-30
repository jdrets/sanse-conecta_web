import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import logo from "@/assets/logo.png";

const TRANSITION_MS = 400;

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hide = () => setIsVisible(false);
    let frameId: number | null = null;

    if (document.readyState === "complete") {
      frameId = window.requestAnimationFrame(hide);
    } else {
      window.addEventListener("load", hide, { once: true });
    }

    const fallbackId = window.setTimeout(hide, 2000);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("load", hide);
      window.clearTimeout(fallbackId);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setShouldRender(false),
      TRANSITION_MS
    );

    return () => window.clearTimeout(timeoutId);
  }, [isVisible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Backdrop
      open={isVisible}
      transitionDuration={TRANSITION_MS}
      sx={{
        zIndex: 10,
        backgroundColor: theme => theme.palette.primary.main,
        flexDirection: "column",
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Box
          component="img"
          src={logo}
          alt="Logotipo Consultora Industrial"
          sx={{
            height: { xs: 96, sm: 112 },
            width: "auto",
          }}
        />
        <CircularProgress color="secondary" size={36} thickness={4} />
      </Stack>
    </Backdrop>
  );
};

export default SplashScreen;
