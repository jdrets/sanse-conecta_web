import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { ErrorOutline, RefreshOutlined } from "@mui/icons-material";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            padding: 3,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                textAlign: "center",
                borderTop: "4px solid",
                borderColor: "error.main",
              }}
            >
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  marginBottom: 2,
                }}
              />
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ¡Oops! Algo salió mal
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Lo sentimos, ha ocurrido un error inesperado en la aplicación.
              </Typography>

              {(process.env.NODE_ENV === "development" ||
                !!localStorage.getItem("isDev")) &&
                this.state.error && (
                  <Box
                    sx={{
                      marginTop: 3,
                      marginBottom: 3,
                      padding: 2,

                      borderRadius: 1,
                      textAlign: "left",
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="error"
                      gutterBottom
                    >
                      Error:
                    </Typography>
                    <Typography
                      variant="body2"
                      component="pre"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {this.state.error.toString()}
                    </Typography>
                    {this.state.errorInfo && (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          color="error"
                          sx={{ marginTop: 2 }}
                          gutterBottom
                        >
                          Stack trace:
                        </Typography>
                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {this.state.errorInfo.componentStack}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RefreshOutlined />}
                  onClick={this.handleReload}
                >
                  Recargar página
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleGoHome}
                >
                  Ir al inicio
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
