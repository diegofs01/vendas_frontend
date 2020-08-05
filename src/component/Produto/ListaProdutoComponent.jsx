import React, { Component } from "react"
import { Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, 
         IconButton, Button, Paper, 
         Typography, Grid } from '@material-ui/core';
import { Add, Edit, ArrowBack } from '@material-ui/icons'
import ProdutoDataService from "../../service/ProdutoDataService"
import NumberFormat from "react-number-format";

class ListaProdutoComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            produtos: [],
            message: null
        };
        this.novoProduto = this.novoProduto.bind(this);
        this.atualizarListaProdutos = this.atualizarListaProdutos.bind(this);
        this.editarProduto = this.editarProduto.bind(this);
        this.home = this.home.bind(this);
    }

    componentDidMount() {
        this.atualizarListaProdutos();
    }

    atualizarListaProdutos() {
        ProdutoDataService.listarProdutos()
        .then(
            response => {
                this.setState({produtos: response.data});
            }
        );
    }

    novoProduto() {
        this.props.history.push(`/produto/novo`);
    }

    editarProduto(codigo) {
        this.props.history.push(`/produto/editar/${codigo}`);
    }

    home() {
        this.props.history.push('/index');
    }

    render() {
        return (
            <div>
                <Typography variant="h6" align="center">
                    Produtos
                </Typography>
                <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={3}>
                    <Grid item>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Código</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Unidade</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Opções</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.produtos.map((produto) => (
                                        <TableRow key={produto.codigo}>
                                            <TableCell component="th" scope="tow">{produto.codigo}</TableCell>
                                            <TableCell>{produto.nome}</TableCell>
                                            <TableCell align="center">{produto.unidade}</TableCell>
                                            <TableCell align="right">
                                                <NumberFormat name="valor"
                                                    displayType="text"
                                                    value={produto.valor}   
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => this.editarProduto(produto.codigo)}>
                                                    <Edit />                                            
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoProduto}>Adicionar</Button>
                        <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ListaProdutoComponent