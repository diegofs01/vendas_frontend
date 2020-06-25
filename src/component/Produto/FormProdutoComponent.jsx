import React, { Component } from "react"
import ProdutoDataService from "../../service/ProdutoDataService"
import { TextField, Button, Typography } from "@material-ui/core";

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
                this.setState({produto: response.data});
            });
        }
   
    }

    handleSubmit(event) {
        event.preventDefault();
        ProdutoDataService.novoProduto(this.state.produto)
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
                <Typography variant="h3">
                    {this.novoProduto ? 'Novo Produto' : 'Editar Produto'}
                </Typography>
                <div>
                    <form onSubmit={this.handleSubmit}>
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
                        <br />
                        <TextField name="nome" 
                            label="Nome"
                            value={this.state.produto.nome} 
                            onChange={this.handleChange} 
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <br />
                        <TextField name="unidade" 
                            label="Unidade"  
                            value={this.state.produto.unidade} 
                            onChange={this.handleChange}  
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />  
                        <TextField name="valor" 
                            label="Valor"  
                            type="number"
                            value={this.state.produto.valor} 
                            onChange={this.handleChange}  
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        /> 
                        
                        <br />
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormProdutoComponent