import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
        zIndex: theme => theme.zIndex.modal + 1,
        backgroundColor: theme => theme.palette.background.default,
        color: theme => theme.palette.text.primary,
        flexDirection: "column",
        gap: 3,
        px: 3,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logotipo Consultora Industrial"
        sx={{
          height: { xs: 96, sm: 112 },
          width: "auto",
          filter: "drop-shadow(0px 15px 40px rgba(0, 0, 0, 0.45))",
        }}
      />
      <Stack spacing={1.5} alignItems="center">
        <Typography
          variant="overline"
          sx={{
            letterSpacing: ".7em",
            color: theme => theme.palette.text.secondary,
          }}
        >
          Cargando
        </Typography>
        <CircularProgress color="primary" size={36} thickness={4} />
      </Stack>
    </Backdrop>
  );
};

export default SplashScreen;
