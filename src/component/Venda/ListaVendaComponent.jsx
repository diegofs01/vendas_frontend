import React, { Component } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Paper, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Add, Edit, Menu, ArrowBack } from '@material-ui/icons'
import VendaDataService from "../../service/VendaDataService"

class ListaVendaComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vendas: [],
            message: null
        };
        this.novoVenda = this.novoVenda.bind(this);
        this.atualizarListaVendas = this.atualizarListaVendas.bind(this);
        this.home = this.home.bind(this);
    }

    componentDidMount() {
        this.atualizarListaVendas();
    }

    atualizarListaVendas() {
        VendaDataService.listarVendas()
        .then(
            response => {
                response.data.forEach(venda => {
                    console.log(venda);
                });
                this.setState({vendas: response.data});
            }
        );
    }

    novoVenda() {
        this.props.history.push(`/venda/novo`);
    }

    editarVenda(id) {
        this.props.history.push(`/venda/editar/${id}`);
    }

    home() {
        this.props.history.push(`/`);
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                        </IconButton>
                        <Typography variant="h6">
                        Vendas
                        </Typography>
                    </Toolbar>
                </AppBar>

                <br />

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Data da Venda</TableCell>
                                <TableCell>Itens</TableCell>
                                <TableCell>Valor Total</TableCell>
                                <TableCell>Opções</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.vendas.map((venda) => (
                                <TableRow key={venda.id}>
                                    <TableCell component="th" scope="tow">{venda.id}</TableCell>
                                    <TableCell>{venda.cpfCliente}</TableCell>
                                    <TableCell>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</TableCell>
                                    <TableCell>{venda.itens.length}</TableCell>
                                    <TableCell>{venda.valorTotal}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => this.editarVenda(venda.id)}>
                                            <Edit />                                            
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <br />

                <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoVenda}>Nova Venda</Button>

                <br />

                <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
            </div>
        )
    }
}

export default ListaVendaComponent