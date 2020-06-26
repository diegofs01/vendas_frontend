import React from 'react';
import { Dialog, DialogTitle, DialogContent, 
         DialogActions, Button, TextField,
         Typography, Select, MenuItem } from '@material-ui/core';

export default function DialogAdicionarItem(props) {

    const [produtos, setProdutos] = React.useState([]);
    const [selecionado, setSelecionado] = React.useState('');
    const [quantidade, setQuantidade] = React.useState(0);
    let onClose = props.onClose;
    let open = props.open;

    const handleOnEntering = () => {
        setProdutos(props.produtos);
    }

    const handleClose = () => {
        onClose(undefined, 0);
    };

    const handleCloseConfirm = () => {
        onClose(selecionado, quantidade);
        setSelecionado('');
        setQuantidade(0);
    };

    const handleChange = (event) => {
        if(event.target.name === "selecionado")
            setSelecionado(event.target.value);

        if(event.target.name === "quantidade")
            setQuantidade(Number.parseInt(event.target.value));
    }

    return (
        <Dialog onClose={handleClose} onEntering={handleOnEntering} open={open}>
            <DialogTitle>Adicionar Produto</DialogTitle>
            <DialogContent>
                {
                    produtos.length === 0
                ?
                    <p>Carregando dados, por favor aguarde!</p>   
                :
                    <div>
                        <Typography variant="overline">
                            Disponíveis:
                        </Typography>
                        <br/>
                        <Select
                            name="selecionado"
                            value={selecionado}
                            onChange={handleChange}
                        >
                            {produtos.map((produto) => (
                                <MenuItem key={produto.codigo} value={produto}>{produto.nome}, ${produto.valor}</MenuItem>
                            ))}
                        </Select>
                        <br/>
                        <TextField name="quantidade" 
                            label="quantidade"  
                            type="number"
                            value={quantidade} 
                            onChange={handleChange}  
                            InputLabelProps={{ shrink: true }}
                        /> 
                    </div>
                }
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleCloseConfirm}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}