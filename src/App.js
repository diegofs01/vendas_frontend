import React from 'react';
import './App.css';
import interceptors from './interceptors';
import VendasApp from './component/VendasApp';
import Login from './component/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ListaClienteComponent from './component/Cliente/ListaClienteComponent';
import FormClienteComponent from './component/Cliente/FormClienteComponent';
import ListaProdutoComponent from './component/Produto/ListaProdutoComponent';
import FormProdutoComponent from './component/Produto/FormProdutoComponent';
import ListaVendaComponent from './component/Venda/ListaVendaComponent';
import FormVendaComponent from './component/Venda/FormVendaComponent';
import { AppBar, Toolbar, IconButton, Typography, Grid } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
            <Grid container direction="row" justify="center" alignItems="center" spacing={10}>
              <Grid item>
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <Menu /> 
                  <Typography variant="inherit">Menu</Typography>
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  Vendas
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {localStorage.getItem("user")}
                </Typography>
              </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
      <Router>
          <Switch>
              <Route path="/" exact component={Login}/>
              <Route path="/index" exact component={VendasApp}/>
              <Route path="/cliente/" exact component={ListaClienteComponent} />
              <Route path="/cliente/novo" exact component={FormClienteComponent} />
              <Route path="/cliente/editar/:id" component={FormClienteComponent} />
              <Route path="/produto/" exact component={ListaProdutoComponent} />
              <Route path="/produto/novo" exact component={FormProdutoComponent} />
              <Route path="/produto/editar/:codigo" component={FormProdutoComponent} />
              <Route path="/venda/" exact component={ListaVendaComponent} />
              <Route path="/venda/novo" exact component={FormVendaComponent} />
              <Route path="/venda/editar/:id" component={FormVendaComponent} />
          </Switch>
      </Router>
    </>
  );
}

export default App;
