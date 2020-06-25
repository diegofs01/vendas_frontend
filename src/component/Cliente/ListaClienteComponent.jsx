import React, { Component } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Paper, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Add, Edit, Menu, ArrowBack } from '@material-ui/icons'
import ClienteDataService from "../../service/ClienteDataService"

class ListaClienteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            message: null
        };
        this.novoCliente = this.novoCliente.bind(this);
        this.atualizarListaClientes = this.atualizarListaClientes.bind(this);
        this.home = this.home.bind(this);
    }

    componentDidMount() {
        this.atualizarListaClientes();
    }

    atualizarListaClientes() {
        ClienteDataService.listarClientes()
        .then(
            response => {
                this.setState({clientes: response.data});
            }
        );
    }

    novoCliente() {
        this.props.history.push(`/cliente/novo`);
    }

    editarCliente(cpf) {
        this.props.history.push(`/cliente/editar/${cpf}`);
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
                        Clientes
                        </Typography>
                    </Toolbar>
                </AppBar>

                <br />

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>CPF</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Saldo</TableCell>
                                <TableCell>Ativo</TableCell>
                                <TableCell>Opções</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.clientes.map((cliente) => (
                                <TableRow key={cliente.cpf}>
                                    <TableCell component="th" scope="tow">{cliente.cpf}</TableCell>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.saldo}</TableCell>
                                    <TableCell>{cliente.ativo ? 'Sim' : 'Não'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => this.editarCliente(cliente.cpf)}>
                                            <Edit />                                            
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <br />

                <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoCliente}>Adicionar</Button>

                <br />

                <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
            </div>
        )
    }
}

export default ListaClienteComponent