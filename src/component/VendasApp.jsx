import React, { Component } from 'react';
import { Button, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu } from "@material-ui/icons";

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

                <Button variant="contained" color="secondary" onClick={this.clienteAction}>Clientes</Button>
                
                <br />
                <br />
                <br />

                <Button variant="contained" color="secondary" onClick={this.produtoAction}>Produtos</Button>

                <br />
                <br />
                <br />

                <Button variant="contained" color="secondary" onClick={this.vendaAction}>Vendas</Button>
            </div>
        );
    }
}

export default VendasApp