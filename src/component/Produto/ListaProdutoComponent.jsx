import React, { Component } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Paper, AppBar, Toolbar, Typography } from '@material-ui/core';
import { Add, Edit, Menu, ArrowBack } from '@material-ui/icons'
import ProdutoDataService from "../../service/ProdutoDataService"

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
                        Produtos
                        </Typography>
                    </Toolbar>
                </AppBar>

                <br />

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
                                    <TableCell>{produto.unidade}</TableCell>
                                    <TableCell>{produto.valor}</TableCell>
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

                <br />

                <Button variant="contained" color="primary" startIcon={<Add />} onClick={this.novoProduto}>Adicionar</Button>

                <br />

                <Button variant="contained" color="secondary" startIcon={<ArrowBack />} onClick={this.home}>Voltar</Button>
            </div>
        )
    }
}

export default ListaProdutoComponent