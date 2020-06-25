import React from 'react';
import { Dialog, DialogTitle, DialogContent, 
         DialogActions, TableContainer, Table,
         TableHead, TableRow, TableCell,
         TableBody, Paper, Button } from '@material-ui/core';
import { Add, Remove, Restore } from '@material-ui/icons'
import ProdutoDataService from '../../service/ProdutoDataService';

export default function DialogAdicionarItem(props) {

    const [produtos, setProdutos] = React.useState([]);
    let onClose = props.onClose;
    let open = props.open;

    const handleOnEntering = () => {
        ProdutoDataService.listarProdutos()
        .then(response => {
            console.log(response.data);
            setProdutos(response.data);
        })
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} onEnter={handleOnEntering} open={open}>
            <DialogTitle>Adicionar Produto</DialogTitle>
            <DialogContent>
                {
                    produtos.length === 0
                ?
                    <p>Carregando dados, por favor aguarde!</p>   
                :
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Unidade</TableCell>
                                    <TableCell>Valor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {produtos.map((produto) => (
                                    <TableRow key={produto.codigo}>
                                        <TableCell component="th" scope="tow">{produto.codigo}</TableCell>
                                        <TableCell>{produto.nome}</TableCell>
                                        <TableCell>{produto.unidade}</TableCell>
                                        <TableCell>{produto.valor}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}