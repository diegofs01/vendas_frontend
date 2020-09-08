import React, { Component } from "react";
import axios from "axios";
import * as emailValidator from "email-validator";
import { Typography, Paper, Grid, 
         TextField, InputLabel, MenuItem,
         Select, Button, List, ListItem, ListItemText } from "@material-ui/core";

class CriarUsuario extends Component {

  roles = ['', 'user'];

  constructor() {
    super();

    this.state = {
      user: {
        username: '',
        password: '',
        email: '',
        role: ''
      },
      erros: []
    };

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  validate() {
    let valido = true;
    let listaErros = [];

    if(this.state.user.username.length < 2) {
      valido = false;
      listaErros.push('Username precisa de pelo menos 2 caracteres');
    }

    if(this.state.user.password.length < 8) {
      valido = false;
      listaErros.push('Senha precisa de pelo menos 8 caracteres');
    }

    if(!emailValidator.validate(this.state.user.email)) {
      valido = false;
      listaErros.push('Email inválido');
    }

    if(this.state.user.role === null || 
      this.state.user.role === undefined || 
      this.state.user.role === '') {
        valido = false;
        listaErros.push("Role inválido");
    }

    this.setState({
      erros: listaErros
    });
    
    return valido;
  }

  handleSubmit(event) {
    event.preventDefault();

    const endpoint = 'http://localhost:8080/jwt/createUser';

    if(this.validate()) {
      axios.post(endpoint, this.state.user)
      .then(res => {
        if(res.status === 200 || res.data === "OK") {
          this.props.history.push("/login");
        }
      });
    }
  }

  handleChange(event) {
    let tempVar1 = event.target.name;
    let tempVar2 = event.target.value;
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [tempVar1]: tempVar2
      }
    }));
  }


  render() {
    return (
        <div>
          {
            this.state.erros.length > 0 
          ? 
            <div align="center">
            <Typography variant="overline">
              Erros
              <List dense={true} id="listaErro">
                {this.state.erros.map((erro) => (
                  <ListItem key={erro} align="center">
                    <ListItemText primary={erro}/>
                  </ListItem>
                ))}
              </List>
              /Erros
            </Typography>
            </div>
          :
            <></>
          }
          <form onSubmit={this.handleSubmit}>
            <Typography variant="h6" align="center">
              Create New User
            </Typography>
            <Paper elevation={1}>
              <Grid container direction="column" justify="center" alignItems="center">
                <TextField name="username" 
                  label="Username"
                  value={this.state.user.username} 
                  onChange={this.handleChange} 
                  margin="dense" 
                  variant="outlined"
                />

                <TextField name="password"
                  type="password" 
                  label="Password"
                  value={this.state.user.password} 
                  onChange={this.handleChange} 
                  margin="dense" 
                  variant="outlined"
                /> 

                <TextField name="email"
                  type="email" 
                  label="Email"
                  value={this.state.user.email} 
                  onChange={this.handleChange} 
                  margin="dense" 
                  variant="outlined"
                />

                <Grid container direction="row" justify="center" alignItems="center">
                  <InputLabel id="role">Role</InputLabel>
                  <Select name="role"
                      labelId="role"
                      value={this.state.user.role}
                      onChange={this.handleChange}>
                      {this.roles.map((role) => (
                          <MenuItem key={role} value={role}>{role}</MenuItem>
                      ))}
                  </Select>
                </Grid> 

                <Button variant="contained" color="primary" type="submit">Salvar</Button>
                <Button variant="contained" color="secondary" onClick={() => this.props.history.push("/login")}>Voltar</Button>
              </Grid>
            </Paper>
          </form>
        </div>
    );
  }
}
export default CriarUsuario;