import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton} from '@material-ui/core';
import { Add, Remove, Restore } from '@material-ui/icons'

export default function DialogEditarQuantidade(props) {

    const [quantidade, setQuantidade] = React.useState(props.item.quantidade);
    let onClose = props.onClose;
    let open = props.open;

    const handleOnEntering = () => {
        setQuantidade(props.item.quantidade);
    }

    const handleOnChange = (event) => {
        setQuantidade(Number.parseInt(event.target.value));
    }

    const handleClose = () => {
        props.item.quantidade = quantidade;
        console.log(props.item);
        onClose(props.item);
    };

    return (
        <Dialog onClose={handleClose} onEntering={handleOnEntering} open={open}>
            <DialogTitle>Quantidade do Item</DialogTitle>
            <DialogContent>
                <TextField name="quantidade" 
                    label="Quantidade do Produto" 
                    type="number"
                    value={quantidade}
                    onChange={handleOnChange}
                    margin="dense" 
                    variant="outlined" 
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <IconButton onClick={() => setQuantidade(props.item.quantidade)}>
                    <Restore/>
                </IconButton>
                <IconButton onClick={() => setQuantidade(prevQuantidade => prevQuantidade + 1)}>
                    <Add/>
                </IconButton>
                <IconButton onClick={() => setQuantidade(prevQuantidade => prevQuantidade - 1)}>
                    <Remove/>
                </IconButton>
            </DialogActions>
        </Dialog>
    );
}