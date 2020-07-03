import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,} from '@material-ui/core';

export default function DialogAlerta(props) {

    let onClose = props.onClose;
    let open = props.open;
    let item = props.item;

    const handleClose = () => {
        onClose(item, false);
    };

    const handleCloseConfirm = () => {
        onClose(item, true);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Atenção</DialogTitle>
            <DialogContent>
                <Typography>
                    Deseja realmente excluir o item da venda?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleCloseConfirm}>
                    Sim
                </Button>
                <Button variant="contained" color="secondary" onClick={handleClose}>
                    Não
                </Button>
            </DialogActions>
        </Dialog>
    );
}