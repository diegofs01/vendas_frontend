import React, { Component } from "react"
import { Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, 
         IconButton, Button, Paper, 
         Typography, Menu, MenuItem, Grid } from '@material-ui/core';
import { Add, Edit, ArrowBack, MoreVert, AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons'
import ClienteDataService from "../../service/ClienteDataService"
import NumberFormat from "react-number-format"

class ListaClienteComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            menuOpen: null,
            menuOpenCpfSelected: null,
            menuOpenCpfAtivo: null
        };
        this.novoCliente = this.novoCliente.bind(this);
        this.atualizarListaClientes = this.atualizarListaClientes.bind(this);
        this.home = this.home.bind(this);
        this.ativarCliente = this.ativarCliente.bind(this);
        this.desativarCliente = this.desativarCliente.bind(this);
        this.handleMenuOpen = this.handleMenuOpen.bind(this);
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

    ativarCliente(cpf) {
        ClienteDataService.ativarCliente(cpf.replace(/[-.]/g, ""))
        .then(() => {
            this.atualizarListaClientes();
            this.handleMenuClose("MenuClose");
            this.handleMenuClose("MenuExited");
        });
    }

    desativarCliente(cpf) {
        ClienteDataService.desativarCliente(cpf.replace(/[-.]/g, ""))
        .then(() => {
            this.atualizarListaClientes();
            this.handleMenuClose("MenuClose");
            this.handleMenuClose("MenuExited");
        });
    }

    home() {
        this.props.history.push('/index');
    }

    handleMenuOpen(event, cliente) {
        this.setState({
            menuOpen: event.currentTarget,
            menuOpenCpfSelected: cliente.cpf,
            menuOpenCpfAtivo: cliente.ativo
        });
    }

    handleMenuClose(action) {
        if(action === "MenuClose") {
            this.setState({
                menuOpen: null
            });
        }
        if(action === "MenuExited") {
            this.setState({
                menuOpenCpfSelected: null,
                menuOpenCpfAtivo: null
            });
        }
    }

    render() {
        return (
            <div>
                <Typography variant="h6" align="center">
                    Clientes
                </Typography>
                <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={3}>
                    <Grid item>
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
                                            <TableCell align="right">
                                                <NumberFormat name="saldo"
                                                    displayType="text"
                                                    value={cliente.saldo}   
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                />
                                            </TableCell>
                                            <TableCell>{cliente.ativo ? 'Sim' : 'Não'}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(event) => this.handleMenuOpen(event, cliente)}>
                                                    <MoreVert />
                                                </IconButton>
                                                <Menu anchorEl={this.state.menuOpen} 
                                                    open={Boolean(this.state.menuOpen)} 
                                                    keepMounted
                                                    onClose={() => this.handleMenuClose("MenuClose")}
                                                    onExited={() => this.handleMenuClose("MenuExited")}>
                                                    <MenuItem onClick={() => this.editarCliente(this.state.menuOpenCpfSelected)}>
                                                        <Edit/>
                                                        <Typography variant="inherit">Editar</Typography>
                                                    </MenuItem>
                                                    {
                                                        this.state.menuOpenCpfAtivo
                                                    ?
                                                        <div>
                                                            <MenuItem onClick={() => this.desativarCliente(this.state.menuOpenCpfSelected)}>
                                                                <RemoveCircleOutline/>
                                                                <Typography variant="inherit"> Desativar</Typography>
                                                            </MenuItem>
                                                        </div>
                                                    :
                                                        <div>
                                                            <MenuItem onClick={() => this.ativarCliente(this.state.menuOpenCpfSelected)}>
                                                                <AddCircleOutline/>
                                                                <Typography variant="inherit"> Ativar</Typography>
                                                            </MenuItem>
                                                        </div>
                                                    }
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoCliente}>Adicionar</Button>
                        <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ListaClienteComponent