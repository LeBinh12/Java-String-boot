import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React from 'react';

const Notification = {
  showMessage: (message, variant = "info") => {
    enqueueSnackbar(message, { variant });
  },
};
export const NotificationProvider = ({ children }) => (
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    {children}
  </SnackbarProvider>
);
export default Notification;
