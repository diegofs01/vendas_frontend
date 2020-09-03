import React, { Component } from "react"
import ProdutoDataService from "../../service/ProdutoDataService"
import { TextField, Button, Typography, 
         Paper, Grid } from "@material-ui/core";
import NumberFormat from "react-number-format";

class FormProdutoComponent extends Component {

    novoProduto = true;
    

    constructor(props) {
        super(props);

        if (this.props.match.params.codigo === undefined) 
            this.novoProduto = true;
        else
            this.novoProduto = false;

        this.state = {
            produto: {
                codigo: '',
                nome: '',
                unidade: '',
                valor: 0.0
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.voltar = this.voltar.bind(this);
    }

    componentDidMount() {

        if(!this.novoProduto) {
            ProdutoDataService.buscarProduto(this.props.match.params.codigo)
            .then(response => {
                if(response.data.length !== undefined) {
                    response.data = response.data[0];
                }
                this.setState({produto: response.data});
            });
        }
   
    }

    handleSubmit(event) {
        event.preventDefault();
        ProdutoDataService.salvarProduto(this.state.produto, this.novoProduto)
        .then(() => this.voltar());
    }


    voltar() {
        this.props.history.push(`/produto/`);
    }

    handleChange(event) {
        let tempVar1 = event.target.name;
        let tempVar2 = event.target.value;

        this.setState(prevState => ({
            produto: {
                ...prevState.produto,
                [tempVar1]: tempVar2
            }
        }));
    }

    render() {

        return (
            <div>
                <Typography variant="h6" align="center">
                    {this.novoProduto ? 'Novo Produto' : `Editar Produto ${this.state.produto.codigo} - ${this.state.produto.nome}`}
                </Typography>
                <div>
                    <form onSubmit={this.handleSubmit}>
                    <Paper elevation={1}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={5}>
                        <Grid item>
                        { 
                            this.novoProduto
                        ?
                            <TextField name="codigo" 
                                label="Codigo" 
                                value={this.state.produto.codigo} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        :
                            <TextField disabled name="codigo" 
                                label="Codigo" 
                                value={this.state.produto.codigo} 
                                margin="dense" 
                                variant="outlined" 
                                InputLabelProps={{ shrink: true }}
                            />
                        }
                        </Grid>
                        <Grid item>
                            <TextField name="nome" 
                                label="Nome"
                                value={this.state.produto.nome} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField name="unidade" 
                                label="Unidade"  
                                value={this.state.produto.unidade} 
                                onChange={this.handleChange}  
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />  
                        </Grid>
                        <Grid item>
                            <NumberFormat name="valor"
                                value={this.state.produto.valor}  
                                onChange={this.handleChange}  
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                customInput={TextField}
                                label="Valor"
                                margin="dense"
                                variant="outlined"
                            /> 
                        </Grid>
                        <Grid>
                            <Button variant="contained" color="primary" type="submit">Salvar</Button>
                            <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                        </Grid>
                    </Grid>
                    </Paper>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormProdutoComponent