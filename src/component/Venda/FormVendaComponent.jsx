import React, { Component } from "react"
import VendaDataService from "../../service/VendaDataService"
import { TextField, Button, Typography, 
         TableContainer, Table, TableBody, 
         TableCell, TableHead, TableRow, 
         Paper, IconButton
        } from "@material-ui/core"
import { Add, Delete, Edit } from '@material-ui/icons'
import DialogEditarQuantidade from './DialogEditarQuantidade'
import DialogAdicionarItem from './DialogAdicionarItem'

class FormVendaComponent extends Component {

    novoVenda = true;

    constructor(props) {
        super(props);

        if (this.props.match.params.id === undefined) 
            this.novoVenda = true;
        else
            this.novoVenda = false;

        this.state = {
            venda: {
                id: 0,
                dataVenda: new Date(),
                cpfCliente: '',
                itens: [],
                valorTotal: 0
            },
            dialogEditarProduto: false,
            dialogAdicionarItem: false,
            itemSelecionado: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.voltar = this.voltar.bind(this);
        this.adicionarItem = this.adicionarItem.bind(this);
        this.removerItem = this.removerItem.bind(this);
        this.dialogEditarQuantidadeHandleClickOpen = this.dialogEditarQuantidadeHandleClickOpen.bind(this);
        this.dialogEditarQuantidadeHandleClose = this.dialogEditarQuantidadeHandleClose.bind(this);
        this.dialogAdicionarItemHandleClickOpen = this.dialogAdicionarItemHandleClickOpen.bind(this);
        this.dialogAdicionarItemHandleClose = this.dialogAdicionarItemHandleClose.bind(this);
    }

    componentDidMount() {
        if(!this.novoVenda) {
            VendaDataService.buscarVenda(this.props.match.params.id)
            .then(response => {
                response.data.dataVenda = new Date(response.data.dataVenda).toISOString().replace("Z", "");
                this.setState({venda: response.data});
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        VendaDataService.novoVenda(this.state.venda);
        //.then(() => this.voltar());
    }

    voltar() {
        this.props.history.push(`/venda/`);
    }

    handleChange(event) {
        let tempVar1 = event.target.name;
        let tempVar2 = event.target.value;
        this.setState(prevState => ({
            venda: {
                ...prevState.venda,
                [tempVar1]: tempVar2
            }
        }));
    }

    adicionarItem() {
        console.log("In Work");
    }

    removerItem(item) {
        let tempItens = this.state.venda.itens;
        let tempValorTotal = 0;
        tempItens.splice(tempItens.indexOf(item), 1);        
        this.state.venda.itens.forEach(item => {
            tempValorTotal += (item.quantidade * item.produto.valor);
        });
        this.setState(prevState => ({
            venda: {
                ...prevState.venda,
                itens: tempItens,
                valorTotal: tempValorTotal
            }
        }));
    }

    dialogEditarQuantidadeHandleClose(value) {
        let tempValorTotal = 0;
        this.state.venda.itens.forEach(item => {
            tempValorTotal += (item.quantidade * item.produto.valor);
        });
        this.setState(prevState => ({
            dialogEditarProduto: false,
            venda: {
                ...prevState.venda,
                valorTotal: tempValorTotal
            }
        }));
    };

    dialogEditarQuantidadeHandleClickOpen(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogEditarProduto: true
        }));
    };

    dialogAdicionarItemHandleClose() {
        this.setState(() => ({
            dialogAdicionarItem: false
        }));
    };

    dialogAdicionarItemHandleClickOpen() {
        this.setState(() => ({
            dialogAdicionarItem: true
        }));
    };

    render() {

        return (
            <div>
                <Typography variant="h3">
                    {this.novoVenda ? 'Nova Venda' : 'Editar Venda'}
                </Typography>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        { 
                            this.novoVenda
                        ?
                            <TextField name="id" 
                                label="Id"
                                type="number"
                                value={this.state.venda.id} 
                                onChange={this.handleChange} 
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                        :
                            <TextField disabled name="id" 
                                label="Id" 
                                type="number"
                                value={this.state.venda.id} 
                                margin="dense" 
                                variant="outlined" 
                                InputLabelProps={{ shrink: true }}
                            />
                        }
                        
                        <TextField name="cpfCliente" 
                            label="CPF Cliente"
                            value={this.state.venda.cpfCliente} 
                            onChange={this.handleChange} 
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <br />

                        <TextField name="dataVenda" 
                            label="Data de Venda"  
                            type="datetime-local"
                            value={this.state.venda.dataVenda} 
                            onChange={this.handleChange}  
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        /> 
                        
                        <TextField name="valorTotal" 
                            label="valorTotal"  
                            type="number"
                            value={this.state.venda.valorTotal} 
                            onChange={this.handleChange}  
                            margin="dense" 
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        /> 
                        
                        <br />

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>IdItem</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Preço</TableCell>
                                        <TableCell>Quantidade</TableCell>
                                        <TableCell>Unidade</TableCell>
                                        <TableCell>Opções</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.venda.itens.map((item) => (
                                        <TableRow key={item.idItem}>
                                            <TableCell component="th" scope="tow">{item.idItem}</TableCell>
                                            <TableCell>{item.produto.nome}</TableCell>
                                            <TableCell>{item.produto.valor}</TableCell>
                                            <TableCell>{item.quantidade}</TableCell>
                                            <TableCell>{item.produto.unidade}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => this.dialogEditarQuantidadeHandleClickOpen(item)}>
                                                    <Edit />                                            
                                                </IconButton>
                                                <IconButton onClick={() => this.removerItem(item)}>
                                                    <Delete />                                            
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Typography variant="overline" display="block" gutterBottom>
                                Quantidade de Produtos: {this.state.venda.itens.length}
                                <IconButton size="small" onClick={() => this.dialogAdicionarItemHandleClickOpen()}>
                                    <Add />                                            
                                </IconButton>
                            </Typography>
                        </TableContainer>
                                    
                        <br />
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                    </form>
                </div>
                <DialogEditarQuantidade item={this.state.itemSelecionado} open={this.state.dialogEditarProduto} onClose={this.dialogEditarQuantidadeHandleClose} />
                <DialogAdicionarItem open={this.state.dialogAdicionarItem} onClose={this.dialogAdicionarItemHandleClose}/>
            </div>
        );
    }
}

export default FormVendaComponent