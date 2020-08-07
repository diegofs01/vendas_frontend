import React, { Component } from "react"
import ClienteDataService from "../../service/ClienteDataService"
import { TextField, Switch, Button, 
         Grid, Typography, Paper, 
         Radio, RadioGroup, FormControlLabel, 
         Select, MenuItem, InputLabel, FormLabel } from "@material-ui/core"
import InputMask from "react-input-mask"
import NumberFormat from "react-number-format"

class FormClienteComponent extends Component {

    novoCliente = true;
    ufList = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

    constructor(props) {
        super(props);

        this.state = {
            erros: [],
            cliente: {
                cpf: '',
                nome: '',
                dataNascimento: new Date().toISOString().substring(0,10),
                sexo: '',
                cep: '',
                logradouro: '',
                numero: 0,
                complemento: '',
                bairro: '',
                cidade: '',
                uf: '',
                saldo: 0.0,
                ativo: true
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        
        this.voltar = this.voltar.bind(this);
    }

    componentDidMount() {

        if (this.props.match.params.id === undefined) 
            this.novoCliente = true;
        else
            this.novoCliente = false;
        
        if(!this.novoCliente) {
            ClienteDataService.buscarCliente(this.props.match.params.id)
            .then(response => {
                if(response.data === null) {
                    this.voltar();
                } else {
                    if(response.data.dataNascimento === null)
                        response.data.dataNascimento = new Date().toISOString().substring(0,10);
                    if(response.data.uf === null)
                        response.data.uf = '';

                    this.setState({cliente: response.data});
                }
            });
        }
    }

    validate(values) {
        let valido = true;
        let listaErros = [];
        let soma, digito;

        values.cpf = values.cpf.replace(/[-.]/g, "");

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
        this.props.history.push('/cliente/');
    }

    handleSubmit(event) {

        event.preventDefault();

        if(this.validate(this.state.cliente)) {
            ClienteDataService.novoCliente(this.state.cliente)
            .then(async res => {
                console.log(res);
                let status = await res.data;
                if(status === 'CREATED' || status === 'OK') {
                    this.voltar();
                } 
                if(status === 'CONFLICT') {
                    alert('CPF ja existente no sistema');
                }
                if(status === 'BAD_REQUEST') {
                    alert('Cliente inválido');
                }
            });
        }
    }

    handleChange(event) {
        let tempVar1 = event.target.name;
        let tempVar2;

        if(tempVar1 === "ativo") {
            tempVar2 = event.target.checked;
        } else {
            if(event.target.type === "number") {
                tempVar2 = Number.parseInt(event.target.value);
            } else {
                tempVar2 = event.target.value;
            }
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
                <Typography variant="h6" align="right">
                    {this.novoCliente ? 'Novo Cliente' : 'Editar Cliente'}
                </Typography>
                <div>
                    <ul>
                        {this.state.erros.map(erro => (
                            <li key={erro}>{erro}</li>
                        ))}
                    </ul>
                    
                    <form onSubmit={this.handleSubmit}>
                    <Paper elevation={1}>
                        <Grid container direction="column" justify="center" alignItems="center">
                            { 
                                this.novoCliente
                            ?
                                <InputMask name="cpf"
                                mask={"999.999.999-99"} 
                                value={this.state.cliente.cpf} 
                                onChange={this.handleChange} 
                                >
                                    {(inputProps) => <TextField {...inputProps} label="CPF" margin="dense" variant="outlined"/>}
                                </InputMask>
                            :
                                <InputMask disabled name="cpf"
                                    mask={"999.999.999-99"} 
                                    value={this.state.cliente.cpf} 
                                    onChange={this.handleChange} 
                                >
                                    {(inputProps) => <TextField {...inputProps} label="CPF" margin="dense" variant="outlined"/>}
                                </InputMask>
                            }

                            <TextField name="nome" 
                                label="Nome"
                                value={this.state.cliente.nome} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />   

                            <TextField name="dataNascimento" 
                                label="Data de Nascimento"
                                type="date"
                                value={this.state.cliente.dataNascimento} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />
                        </Grid>
                        <Grid container direction="row" justify="center" alignItems="center">    
                            <FormLabel>Sexo</FormLabel>
                            <RadioGroup row name="sexo" value={this.state.cliente.sexo} onChange={this.handleChange}>
                                <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                <FormControlLabel value="Feminino" control={<Radio />} label="Feminino" />
                            </RadioGroup>
                        </Grid>

                        <Grid container direction="row" justify="center" alignItems="center">
                            <InputMask name="cep"
                                mask={"99999-999"} 
                                value={this.state.cliente.cep} 
                                onChange={this.handleChange}  
                            >
                                {(inputProps) => <TextField {...inputProps} label="CEP" margin="dense" variant="outlined"/>}
                            </InputMask>

                            <TextField name="logradouro" 
                                label="Logradouro"
                                value={this.state.cliente.logradouro} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />
                        </Grid>

                        <Grid container direction="row" justify="center" alignItems="center">
                            <TextField name="numero" 
                                label="Numero" 
                                type="number" 
                                value={this.state.cliente.numero}  
                                onChange={this.handleChange}  
                                margin="dense" 
                                variant="outlined"                           
                            /> 

                            <TextField name="complemento" 
                                label="Complemento"
                                value={this.state.cliente.complemento} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />
                        </Grid>

                        <Grid container direction="row" justify="center" alignItems="center">
                            <TextField name="bairro" 
                                label="Bairro"
                                value={this.state.cliente.bairro} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />

                            <TextField name="cidade" 
                                label="Cidade"
                                value={this.state.cliente.cidade} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                            />
                        </Grid>
                        
                        <Grid container direction="row" justify="center" alignItems="center">
                            <InputLabel id="uf">UF</InputLabel>
                            <Select name="uf"
                                labelId="uf"
                                value={this.state.cliente.uf}
                                onChange={this.handleChange}>
                                {this.ufList.map((uf) => (
                                    <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid container direction="column" justify="flex-start" alignItems="center">
                            <NumberFormat name="saldo"
                                value={this.state.cliente.saldo}  
                                onChange={this.handleChange}  
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                customInput={TextField}
                                label="Saldo"
                                margin="dense"
                                variant="outlined"
                            />
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                            <Grid item>Ativo?</Grid>
                            <Grid item>
                                <Switch checked={this.state.cliente.ativo} onChange={this.handleChange} name="ativo"/>
                            </Grid>
                            <Grid item>{this.state.cliente.ativo ? 'Sim' : 'Não'}</Grid>
                        </Grid>
                    </Paper>

                    <Grid container justify="center" alignItems="center">
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                    </Grid>

                    </form>
                </div>
            </div>
        );
    }
}

export default FormClienteComponent