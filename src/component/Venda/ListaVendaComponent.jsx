import React, { Component } from "react"
import { Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, 
         IconButton, Button, Paper, 
         Typography, Grid} from '@material-ui/core';
import { Add, Edit, ArrowBack } from '@material-ui/icons'
import VendaDataService from "../../service/VendaDataService"
import NumberFormat from "react-number-format";

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
        this.props.history.push('/index');
    }

    render() {
        return (
            <div>
                <Typography variant="h6" align="center">
                    Vendas
                </Typography>
                <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={3}>
                    <Grid item>
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
                                            <TableCell>{venda.cliente.cpf}</TableCell>
                                            <TableCell>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</TableCell>
                                            <TableCell align="center">{venda.itens.length}</TableCell>
                                            <TableCell align="right">
                                                <NumberFormat name="valor"
                                                    displayType="text"
                                                    value={venda.valorTotal}   
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                />
                                            </TableCell>
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
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoVenda}>Nova Venda</Button>
                        <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ListaVendaComponent