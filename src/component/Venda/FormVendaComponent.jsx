import React, { Component } from "react"
import VendaDataService from "../../service/VendaDataService"
import ProdutoDataService from "../../service/ProdutoDataService"
import ClienteDataService from "../../service/ClienteDataService"
import { TextField, Button, Typography, 
         TableContainer, Table, TableBody, 
         TableCell, TableHead, TableRow, 
         Paper, IconButton, Grid
        } from "@material-ui/core"
import { Add, Delete, Edit } from '@material-ui/icons'
import DialogEditarQuantidade from './DialogEditarQuantidade'
import DialogAdicionarItem from './DialogAdicionarItem'
import NumberFormat from "react-number-format"
import InputMask from "react-input-mask"

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
            dialogEditarQuantidade: false,
            dialogAdicionarItem: false,
            itemSelecionado: [],
            produtos: [],
            clientes: [{
                cpf: '', nome: 'Nulo'
            }]
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.voltar = this.voltar.bind(this);
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
                let tempDate = new Date(response.data.dataVenda);
                tempDate.setHours(tempDate.getHours() - 3);
                response.data.dataVenda = tempDate.toISOString().replace("Z", "");
                
                this.setState({venda: response.data});
            });
        }
        ProdutoDataService.listarProdutos()
        .then(response => {
            this.setState({produtos: response.data});
        });
        ClienteDataService.listarClientesAtivos()
        .then(response => {
            console.log(response.data);
            this.setState({clientes: response.data});
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        VendaDataService.novoVenda(this.state.venda)
        .then(() => this.voltar());
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
            dialogEditarQuantidade: false,
            venda: {
                ...prevState.venda,
                valorTotal: tempValorTotal
            }
        }));
    };

    dialogEditarQuantidadeHandleClickOpen(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogEditarQuantidade: true
        }));
    };

    dialogAdicionarItemHandleClose(selecionado, quantidade) {
        if(selecionado !== '' && quantidade > 0) {
            let index = -1;
            let tempItens = this.state.venda.itens;
            let tempItem;

            tempItens.forEach(item => {
                if(item.produto.codigo === selecionado.codigo) {
                    index = tempItens.indexOf(item);
                    tempItem = item;
                }
            });

            if(index === -1) {
                tempItem = {
                    idVenda: this.state.venda.id,
                    produto: selecionado,
                    quantidade: quantidade
                };
                tempItens.push(tempItem);
            } else {
                tempItem.quantidade += quantidade;
            }

            let tempValorTotal = this.state.venda.valorTotal + (tempItem.produto.valor * quantidade);

            this.setState(prevState => ({
                venda: {
                    ...prevState.venda,
                    itens: tempItens,
                    valorTotal: tempValorTotal
                }
            }))
        }

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
                    <Paper elevation={1}>
                    <Grid container direction="column" justify="center" alignItems="center">
                        <Grid item>
                            <TextField disabled name="id" 
                                label="Id" 
                                type="number"
                                value={this.state.venda.id} 
                                margin="dense" 
                                variant="outlined" 
                                InputLabelProps={{ shrink: true }}
                            />                        
                        </Grid>
                        <Grid item>
                            <InputMask name="cpfCliente"
                                mask={"999.999.999-99"} 
                                value={this.state.venda.cpfCliente} 
                                onChange={this.handleChange} 
                            >
                                {(inputProps) => <TextField {...inputProps} label="Cliente" margin="dense" variant="outlined"/>}
                            </InputMask>
                        </Grid>
                        <Grid item>
                            <TextField name="dataVenda" 
                                label="Data de Venda"  
                                type="datetime-local"
                                value={this.state.venda.dataVenda} 
                                onChange={this.handleChange}  
                                margin="dense" 
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            /> 
                        </Grid>
                        <Grid item>  
                            <NumberFormat name="valorTotal"
                                value={this.state.venda.valorTotal}  
                                onChange={this.handleChange}  
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                customInput={TextField}
                                label="Valor Total"
                                margin="dense"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
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
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" type="submit">Salvar</Button>
                            <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                        </Grid>
                    </Grid>
                    </Paper>
                    </form>
                </div>
                <DialogEditarQuantidade item={this.state.itemSelecionado} open={this.state.dialogEditarQuantidade} onClose={this.dialogEditarQuantidadeHandleClose} />
                <DialogAdicionarItem open={this.state.dialogAdicionarItem} produtos={this.state.produtos} onClose={this.dialogAdicionarItemHandleClose}/>
            </div>
        );
    }
}

export default FormVendaComponent