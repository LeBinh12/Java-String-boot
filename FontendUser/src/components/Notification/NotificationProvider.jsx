import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React from 'react';

const Notification = {
    showMessage: (message, variant = "info") => {
        enqueueSnackbar(message, { variant });
    },
};
export const NotificationProvider = ({ children }) => (
    { children }
);
export default Notification;
