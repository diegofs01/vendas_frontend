import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions,} from '@material-ui/core';

export default function DialogAlerta(props) {

    let onClose = props.onClose;
    let open = props.open;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle></DialogTitle>
            <DialogContent>
                
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog>
    );
}