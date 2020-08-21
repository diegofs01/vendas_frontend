import React, { Component } from 'react';
import { Button, Grid } from '@material-ui/core';
import { People, LocalShipping, AttachMoney } from '@material-ui/icons'

class VendasApp extends Component {

    render() {
        return (
            <div>
                <Grid container direction="row" justify="center" alignItems="center" spacing={10}>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<People />} onClick={() => this.props.history.push('/cliente/')}>Clientes</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<LocalShipping />} onClick={() => this.props.history.push('/produto/')}>Produtos</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="secondary" startIcon={<AttachMoney />} onClick={() => this.props.history.push('/venda/')}>Vendas</Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default VendasApp