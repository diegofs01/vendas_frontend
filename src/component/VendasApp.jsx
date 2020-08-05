import React, { Component } from 'react';
import axios from "axios";
import { Button, Grid } from '@material-ui/core';
import { People, LocalShipping, AttachMoney } from '@material-ui/icons'

class VendasApp extends Component {

    constructor(props) {
        super(props);
        this.clienteAction = this.clienteAction.bind(this);
        this.produtoAction = this.produtoAction.bind(this);
        this.vendaAction = this.vendaAction.bind(this);
    }

    clienteAction() {
        this.props.history.push(`/cliente/`);
    }

    produtoAction() {
        this.props.history.push(`/produto/`);
    }

    vendaAction() {
        this.props.history.push(`/venda/`);
    }

    verificarToken() {
        let jwtToken = localStorage.getItem("authorization");
        console.log('token: ' + jwtToken);
        axios.post('http://localhost:8080/jwt/checkToken/', jwtToken).then(res => {
            console.log(res);
        });
    }

    render() {
        return (
            <div>
                <Grid container direction="row" justify="center" alignItems="center" spacing={10}>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<People />} onClick={this.clienteAction}>Clientes</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<LocalShipping />} onClick={this.produtoAction}>Produtos</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<AttachMoney />} onClick={this.vendaAction}>Vendas</Button>
                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" onClick={this.verificarToken}>Verificar Token</Button>
            </div>
        );
    }
}

export default VendasApp