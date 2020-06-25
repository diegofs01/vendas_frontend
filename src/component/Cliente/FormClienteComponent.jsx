import React, { Component } from "react"
import ClienteDataService from "../../service/ClienteDataService"
import { TextField, Switch, Button, Grid, Typography } from "@material-ui/core"

class FormClienteComponent extends Component {

    novoCliente = true;

    constructor(props) {
        super(props);

        this.state = {
            erros: [],
            cliente: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        
        this.voltar = this.voltar.bind(this);
    }

    componentWillMount() {

        if (this.props.match.params.id === undefined) 
            this.novoCliente = true;
        else
            this.novoCliente = false;
        
        if(this.novoCliente) {
            this.setState({cliente: {
                cpf: '',
                nome: '',
                saldo: 0.0,
                ativo: true
            }
            });
        } else {
            ClienteDataService.buscarCliente(this.props.match.params.id)
            .then(response => {
                this.setState({cliente: response.data});
            });
        }
        
    }

    validate(values) {
        let valido = true;
        let listaErros = [];
        let soma, digito;

        values.cpf = values.cpf.replace(/[^0-9]/g, '');

        //comprimento
        if(values.cpf.length !== 11) {            
            listaErros.push('CPF requer 11 números');
            valido = false;
        }

        //todos numeros iguais
        if(values.cpf.values === "00000000000" || 
            values.cpf.values === "11111111111" || 
            values.cpf.values === "22222222222" || 
            values.cpf.values === "33333333333" || 
            values.cpf.values === "44444444444" || 
            values.cpf.values === "55555555555" || 
            values.cpf.values === "66666666666" || 
            values.cpf.values === "77777777777" || 
            values.cpf.values === "88888888888" || 
            values.cpf.values === "99999999999") {
                listaErros.push('CPF inválido (Todos os números iguais)');
                valido = false;
        }
        
        //1º digito
        soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(values.cpf.charAt(i)) * (10 - i);
        }
        digito = 11 - (soma % 11);
        if(digito === 10 || digito === 11) {
            digito = 0;
        }
        if(digito !== parseInt(values.cpf.charAt(9))) {
            listaErros.push('CPF inválido (1º Digito Verificador)');
            valido = false;
        }

        //2º digito
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(values.cpf.charAt(i)) * (11 - i);
        }
        digito = 11 - (soma % 11);
        if(digito === 10 || digito === 11) {
            digito = 0;
        }
        if(digito !== parseInt(values.cpf.charAt((10)))) {
            listaErros.push('CPF inválido (2º Digito Verificador)');
            valido = false;
        }

        if (values.nome === '' || values.nome.length === 0) {
            listaErros.push('Nome Obrigatório');
            valido = false;
        }

        if(values.saldo <= 0) {
            listaErros.push('Saldo nao pode ser zero ou negativo');
            valido = false;
        }

        this.setState({
            erros: listaErros
        });

        return valido;
    }

    voltar() {
        this.props.history.push(`/cliente/`);
    }

    handleSubmit(event) {

        event.preventDefault();

        if(this.validate(this.state.cliente)) {
            ClienteDataService.novoCliente(this.state.cliente)
            .then(() => this.voltar());
        }
    }

    handleChange(event) {
        let tempVar1 = event.target.name;
        let tempVar2;

        if(tempVar1 === "ativo") {
            tempVar2 = event.target.checked;
        } else {
            tempVar2 = event.target.value;
        }

        this.setState(prevState => ({
            cliente: {
                ...prevState.cliente,
                [tempVar1]: tempVar2
            }
        }));
    }

    render() {

        return (
            <div>
                <Typography variant="h3">
                    {this.novoCliente ? 'Novo Cliente' : 'Editar Cliente'}
                </Typography>
                <div>
                    <ul>
                        {this.state.erros.map(erro => (
                            <li key={erro}>{erro}</li>
                        ))}
                    </ul>
                    
                    <form onSubmit={this.handleSubmit}>
                        { 
                            this.novoCliente
                        ?
                            <TextField name="cpf" 
                                label="CPF" 
                                value={this.state.cliente.cpf} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        :
                            <TextField disabled name="cpf" 
                                label="CPF" 
                                value={this.state.cliente.cpf} 
                                margin="dense" 
                                variant="outlined" 
                                InputLabelProps={{ shrink: true }}
                            />
                        }
                        <br />
                        <TextField name="nome" 
                            label="Nome"
                            value={this.state.cliente.nome} 
                            onChange={this.handleChange} 
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <br /> 
                        <TextField name="saldo" 
                            label="Saldo" 
                            type="number" 
                            value={this.state.cliente.saldo}  
                            onChange={this.handleChange}  
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}                            
                        /> 
                        <Grid container alignItems="center">
                            <Grid item>Ativo?</Grid>
                            <Grid item>
                                <Switch checked={this.state.cliente.ativo} onChange={this.handleChange} name="ativo"/>
                            </Grid>
                            <Grid item>{this.state.cliente.ativo ? 'Sim' : 'Não'}</Grid>
                        </Grid>
                        
                        <br />
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormClienteComponent