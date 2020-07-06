import React, { Component } from "react"
import VendaDataService from "../../service/VendaDataService"
import ProdutoDataService from "../../service/ProdutoDataService"
import ClienteDataService from "../../service/ClienteDataService"
import { TextField, Button, Typography, 
         TableContainer, Table, TableBody, 
         TableCell, TableHead, TableRow, 
         Paper, IconButton, Grid, 
         InputAdornment, Select, MenuItem
        } from "@material-ui/core"
import { Add, Delete, Edit } from '@material-ui/icons'
import DialogEditarQuantidade from './DialogEditarQuantidade'
import DialogAdicionarItem from './DialogAdicionarItem'
import DialogAlerta from './DialogAlerta'
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
                dataVenda: '',
                cpfCliente: '',
                itens: [],
                valorTotal: 0
            },
            dialogEditarQuantidade: false,
            dialogAdicionarItem: false,
            dialogAlerta: false,
            itemSelecionado: [],
            produtos: [],
            clientes: [{
                cpf: '', nome: 'Nulo', saldo: 0
            }],
            itensExcluidos: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.voltar = this.voltar.bind(this);
        this.dialogAlertaHandleClose = this.dialogAlertaHandleClose.bind(this);
        this.dialogAlertaHandleClickOpen = this.dialogAlertaHandleClickOpen.bind(this);
        this.dialogEditarQuantidadeHandleClickOpen = this.dialogEditarQuantidadeHandleClickOpen.bind(this);
        this.dialogEditarQuantidadeHandleClose = this.dialogEditarQuantidadeHandleClose.bind(this);
        this.dialogAdicionarItemHandleClickOpen = this.dialogAdicionarItemHandleClickOpen.bind(this);
        this.dialogAdicionarItemHandleClose = this.dialogAdicionarItemHandleClose.bind(this);
        this.forceDialogOpenState = this.forceDialogOpenState.bind(this);
        this.adicionarItem = this.adicionarItem.bind(this);
    }

    componentDidMount() {
        if(!this.novoVenda) {
            VendaDataService.buscarVenda(this.props.match.params.id)
            .then(response => {
                let tempDate = new Date(response.data.dataVenda);
                tempDate.setHours(tempDate.getHours() - (tempDate.getTimezoneOffset() / 60));
                response.data.dataVenda = tempDate.toISOString().replace("Z", "");
                
                this.setState({venda: response.data});
            });
        } else {
            let tempDate = new Date();
            tempDate.setHours(tempDate.getHours() - (tempDate.getTimezoneOffset() / 60));
            tempDate = tempDate.toISOString().replace("Z", "");

            this.setState(prevState => ({
                venda: {
                    ...prevState.venda,
                    dataVenda: tempDate
                }
            }));
        }
        ProdutoDataService.listarProdutos()
        .then(response => {
            this.setState({produtos: response.data});
        });
        ClienteDataService.listarClientesAtivos()
        .then(response => {
            this.setState({clientes: response.data});
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        VendaDataService.novoVenda(this.state.venda)
        .then(
            this.state.itensExcluidos.forEach(item => {
                VendaDataService.excluirItem(item.idItem);
            }),
            ClienteDataService.atualizarCliente(this.state.clientes.find(c => c.cpf === this.state.venda.cpfCliente))
            .then(this.voltar())
        );
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

    dialogAlertaHandleClose(item, resposta) {
        if(resposta) {
            let tempClientes = this.state.clientes;
            let tempIndex = tempClientes.findIndex(c => c.cpf === this.state.venda.cpfCliente);

            let tempItens = this.state.venda.itens;
            let tempValorTotal = 0;            

            if(item.idItem !== undefined) {
                //VendaDataService.excluirItem(item.idItem);
                let tempItensExcluidos = this.state.itensExcluidos;
                tempItensExcluidos.push(item);
                this.setState(() => ({
                    itensExcluidos: tempItensExcluidos
                }));
            }

            tempClientes[tempIndex].saldo += item.produto.valor * item.quantidade;

            //ClienteDataService.atualizarCliente(tempClientes[tempIndex]);
            
            tempItens.splice(tempItens.indexOf(item), 1);
            this.state.venda.itens.forEach(item => {
                tempValorTotal += (item.quantidade * item.produto.valor);
            });
            this.setState(prevState => ({
                venda: {
                    ...prevState.venda,
                    itens: tempItens,
                    valorTotal: tempValorTotal
                },
                clientes: tempClientes
            }));
        }
        this.setState(() => ({
            dialogAlerta: false
        }));
    }

    dialogAlertaHandleClickOpen(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogAlerta: true
        }));
    };

    dialogEditarQuantidadeHandleClose(alterar, difference, item) {
        if(alterar && difference !== 0) {
            let tempClientes = this.state.clientes;
            let clienteIndex = tempClientes.findIndex(c => c.cpf === this.state.venda.cpfCliente);
            if(tempClientes[clienteIndex].saldo >= (difference * this.state.itemSelecionado.produto.valor)) {
                tempClientes[clienteIndex].saldo -= (difference * this.state.itemSelecionado.produto.valor);

                let tempItens = this.state.venda.itens;
                let itemIndex = tempItens.findIndex(i => i.idItem === item.idItem);
                if(itemIndex > -1) {
                    item.quantidade += difference;
                    tempItens[itemIndex] = item;
                }

                let tempValorTotal = 0;
                tempItens.forEach(i => {
                    tempValorTotal += (i.quantidade * i.produto.valor);
                });
                this.setState(prevState => ({
                    venda: {
                        ...prevState.venda,
                        itens: tempItens,
                        valorTotal: tempValorTotal
                    },
                    clientes: tempClientes
                }));
            }
        }
        this.forceDialogOpenState("dialogEditarQuantidade", false);
    };

    dialogEditarQuantidadeHandleClickOpen(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogEditarQuantidade: true
        }));
    };

    dialogAdicionarItemHandleClose(selecionado, quantidade) {
        if(selecionado !== '' && quantidade > 0) {
            if(this.state.venda.cpfCliente.replace(/[-._]/g, "").length < 11) {
                this.forceDialogOpenState("dialogAdicionarItem", false);
                return;
            }

            let tempClientes = this.state.clientes;
            let tempCliente = tempClientes.find(c => c.cpf === this.state.venda.cpfCliente);

            if(tempCliente !== undefined) {
                if(tempCliente.saldo >= (selecionado.valor * quantidade)) {
                    let tempIndex = tempClientes.indexOf(tempCliente);
                    tempCliente.saldo -= selecionado.valor * quantidade;
                    tempClientes[tempIndex] = tempCliente;

                    //ClienteDataService.atualizarCliente(tempCliente);

                    this.setState(() => ({
                        clientes: tempClientes
                    }));

                    this.adicionarItem(selecionado, quantidade);
                }
            }
        }

        this.forceDialogOpenState("dialogAdicionarItem", false);
    };

    forceDialogOpenState(dialog, open) {
        this.setState(() => ({
            [dialog]: open
        }));
    }

    adicionarItem(selecionado, quantidade) {
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

    dialogAdicionarItemHandleClickOpen() {
        this.setState(() => ({
            dialogAdicionarItem: true
        }));
    };

    render() {

        return (
            <div>
                <Typography variant="h6" align="center">
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
                                disabled={this.state.venda.itens.length > 0}
                                mask={"999.999.999-99"} 
                                value={this.state.venda.cpfCliente} 
                                onChange={this.handleChange} 
                            >
                                {(inputProps) => 
                                    <TextField {...inputProps} label="Cliente" margin="dense" variant="outlined" InputProps={{
                                        endAdornment: <InputAdornment>
                                            { 
                                                this.state.clientes.find(c => c.cpf === this.state.venda.cpfCliente.replace(/[-._]/g, "")) === undefined
                                            ?
                                                <Select name="cpfCliente" onChange={this.handleChange}>
                                                    {this.state.clientes.map((cliente) => (
                                                        <MenuItem key={cliente.cpf} value={cliente.cpf}>{cliente.cpf} {cliente.nome}</MenuItem>
                                                    ))}
                                                </Select>
                                            :
                                                <></>
                                            }
                                        </InputAdornment>
                                    }}>
                                    </TextField>
                                }
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
                            <NumberFormat disabled name="valorTotal"
                                value={this.state.venda.valorTotal}  
                                onChange={this.handleChange}  
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowNegative={false}
                                customInput={TextField}
                                label="Valor Total da Venda"
                                margin="dense"
                                variant="outlined"
                            />

                            <NumberFormat name="saldoRestante"
                                value={
                                    this.state.clientes.find(c => c.cpf === this.state.venda.cpfCliente) !== undefined
                                ? 
                                    this.state.clientes.find(c => c.cpf === this.state.venda.cpfCliente).saldo 
                                : 
                                    0.0
                                }   
                                decimalScale={2}
                                fixedDecimalScale={true}
                                customInput={TextField}
                                disabled
                                label="Saldo Restante"
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
                                            <TableCell>Valor do Item</TableCell>
                                            <TableCell>Unidade</TableCell>
                                            <TableCell>Opções</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.venda.itens.map((item) => (
                                            <TableRow key={item.idItem}>
                                                <TableCell component="th" scope="tow">{item.idItem}</TableCell>
                                                <TableCell>{item.produto.nome}</TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat name="valor"
                                                        displayType="text"
                                                        value={item.produto.valor}   
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{item.quantidade}</TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat name="valor"
                                                        displayType="text"
                                                        value={item.produto.valor * item.quantidade}   
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{item.produto.unidade}</TableCell>
                                                <TableCell>
                                                    <IconButton disabled={item.idItem === undefined} onClick={() => this.dialogEditarQuantidadeHandleClickOpen(item)}>
                                                        <Edit />                                            
                                                    </IconButton>
                                                    <IconButton onClick={() => this.dialogAlertaHandleClickOpen(item)}>
                                                        <Delete />                                            
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Typography variant="overline" display="block" gutterBottom>
                                    Quantidade de Produtos: {this.state.venda.itens.length}
                                    <IconButton color="primary" size="small" disabled={this.state.clientes.find(c => c.cpf === this.state.venda.cpfCliente.replace(/[-._]/g, "")) === undefined} onClick={() => this.dialogAdicionarItemHandleClickOpen()}>
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
                <DialogAlerta item={this.state.itemSelecionado} open={this.state.dialogAlerta} onClose={this.dialogAlertaHandleClose} />
            </div>
        );
    }
}

export default FormVendaComponent