import React, { Component } from "react";
import axios from "axios";
import { Paper, Button, Grid, TextField, Typography } from "@material-ui/core";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleFormSubmit = event => {
    event.preventDefault();

    const endpoint = "http://localhost:8080/jwt/login";
    const user_object = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post(endpoint, user_object).then(res => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("expDate", res.data.expirationDate);
      this.handleIndex();
    });
  };

  handleIndex() {
    let jwtToken = localStorage.getItem("token");
    axios.post('http://localhost:8080/jwt/checkToken/', jwtToken).then(res => {
      if(res.status === 200 && res.data === "OK") {
        localStorage.setItem("user", this.state.username);
        this.props.history.push("/index");
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("expDate");
        alert('Falha no login, tente novamente!');
      }
    })
    .catch(res => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expDate");
    });
  }

  handleChange(event) {
    let tempEventName = event.target.name;
    let tempEventValue = event.target.value;
    this.setState(() => ({
      [tempEventName]: tempEventValue
    }));
  }

  render() {
    return (
      <div>
        <div>
          <form onSubmit={this.handleFormSubmit}>
            <Typography variant="h6" align="center">
              Please Login
            </Typography>
            <Paper elevation={1}>
              <Grid container direction="column" justify="center" alignItems="center">
                <TextField name="username" 
                  label="Username"
                  value={this.state.username} 
                  onChange={this.handleChange} 
                  margin="dense" 
                  variant="outlined"
                />
                <TextField name="password"
                  type="password" 
                  label="Password"
                  value={this.state.password} 
                  onChange={this.handleChange} 
                  margin="dense" 
                  variant="outlined"
                />  
                <Button variant="contained" color="primary" type="submit">Login</Button>
              </Grid>
            </Paper>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;