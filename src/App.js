import React from 'react';
import './App.css';
// eslint-disable-next-line
import interceptors from './interceptors';
import { createBrowserHistory } from 'history';
import VendasApp from './component/VendasApp';
import Login from './component/Login';
import CriarUsuario from './component/CriarUsuario';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import ListaClienteComponent from './component/Cliente/ListaClienteComponent';
import FormClienteComponent from './component/Cliente/FormClienteComponent';
import ListaProdutoComponent from './component/Produto/ListaProdutoComponent';
import FormProdutoComponent from './component/Produto/FormProdutoComponent';
import ListaVendaComponent from './component/Venda/ListaVendaComponent';
import FormVendaComponent from './component/Venda/FormVendaComponent';
import { AppBar, Toolbar, IconButton, Typography, Grid } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

export const history = createBrowserHistory();

const AuthenticatedRoute = ({component: Component, ...rest}) => {
  let checkToken = true;
  if(localStorage.getItem("token") === null) {
    checkToken = false;
    alert('ERRO: Token inválido');
  }
  if(localStorage.getItem("token") === undefined) {
    checkToken = false;
    alert('ERRO: Token inválido');
  }
  if(isNaN(Date.parse(localStorage.getItem("expDate")))) {
    checkToken = false;
    alert('ERRO: Data de expiração inválido');
  }
  if(Date.parse(localStorage.getItem("expDate")) < Date.now()) {
    checkToken = false;
    alert('ERRO: Token expirado');
  }

  return (
    <Route {...rest} render={(props) => (
        checkToken
      ?
        <Component {...props} />
      :
        <>
          {localStorage.removeItem("user")}
          {localStorage.removeItem("token")}
          {localStorage.removeItem("expDate")}
          <Redirect to='/login'/>
        </>
    )} />
  )
}

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
                  {(localStorage.getItem("user") !== "null") ? localStorage.getItem("user") : <></>}
                </Typography>
              </Grid>
            </Grid>
        </Toolbar>
      </AppBar>
      <Router history={history}>
          <Switch>
              <Route path="/login" exact component={Login}/>
              <Route path="/criarUsuario" exact component={CriarUsuario}/>

              <AuthenticatedRoute path="/" exact component={VendasApp}/>
              <AuthenticatedRoute path="/index" exact component={VendasApp}/>
              <AuthenticatedRoute path="/cliente/" exact component={ListaClienteComponent} />
              <AuthenticatedRoute path="/cliente/novo" exact component={FormClienteComponent} />
              <AuthenticatedRoute path="/cliente/editar/:id" component={FormClienteComponent} />
              <AuthenticatedRoute path="/produto/" exact component={ListaProdutoComponent} />
              <AuthenticatedRoute path="/produto/novo" exact component={FormProdutoComponent} />
              <AuthenticatedRoute path="/produto/editar/:codigo" component={FormProdutoComponent} />
              <AuthenticatedRoute path="/venda/" exact component={ListaVendaComponent} />
              <AuthenticatedRoute path="/venda/novo" exact component={FormVendaComponent} />
              <AuthenticatedRoute path="/venda/editar/:id" component={FormVendaComponent} />
          </Switch>
      </Router>
    </>
  );
}

export default App;
