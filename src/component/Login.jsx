import React, { Component } from "react";
import axios from "axios";
import { Paper, Button, Grid, TextField, Typography } from "@material-ui/core";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: "admin",
      password: "admin"
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    let jwtToken = localStorage.getItem("authorization");
    console.log(jwtToken);
  }

  handleFormSubmit = event => {
    event.preventDefault();

    const endpoint = "http://localhost:8080/jwt/login";

    //const username = this.state.username;
    //const password = this.state.password;

    const user_object = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post(endpoint, user_object).then(res => {
      localStorage.setItem("authorization", res.data.token);
      return this.handleDashboard();
    });
  };

  handleDashboard() {
    axios.get("http://localhost:8080/api/produto/").then(res => {
      if (res.status === 200) {
        this.props.history.push("/index");
      } else {
        alert("Authentication failure");
      }
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
            <Typography variant="h6" align="right">
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