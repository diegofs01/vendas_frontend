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
import DialogExcluirItem from './DialogExcluirItem'
import NumberFormat from "react-number-format"
import InputMask from "react-input-mask"

class FormVendaComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            novaVenda: true,
            venda: {
                id: 0,
                dataVenda: '',
                cliente: {
                    cpf: '',
                    saldo: 0
                },
                itens: [],
                valorTotal: 0
            },
            produtos: [],
            clientes: [{
                cpf: '', nome: 'Nulo', saldo: 0
            }],
            dialogEditarQuantidade: false,
            dialogAdicionarItem: false,
            dialogExcluirItem: false,
            itemSelecionado: [],
            itensExcluidos: []
        };

        if (this.props.match.params.id !== undefined) 
            this.state.novaVenda = false;

        this.voltar = this.voltar.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.forceDialogOpenState = this.forceDialogOpenState.bind(this);
        this.abrirDialogAdicionarItem = this.abrirDialogAdicionarItem.bind(this);
        this.fecharDialogAdicionarItem = this.fecharDialogAdicionarItem.bind(this);
        this.adicionarItem = this.adicionarItem.bind(this);
        this.abrirDialogEditarQuantidade = this.abrirDialogEditarQuantidade.bind(this);
        this.fecharDialogEditarQuantidade = this.fecharDialogEditarQuantidade.bind(this);
        this.abrirDialogExcluirItem = this.abrirDialogExcluirItem.bind(this);
        this.fecharDialogExcluirItem = this.fecharDialogExcluirItem.bind(this);
    }

    componentDidMount() {
        if(!this.state.novaVenda) {
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

    voltar() {
        this.props.history.push(`/venda/`);
    }

    handleSubmit(event) {
        event.preventDefault();
        VendaDataService.novoVenda(this.state.venda)
        .then(
            this.state.itensExcluidos.forEach(item => {
                VendaDataService.excluirItem(item.idItem);
            }),
            this.state.clientes.forEach(cliente => {
                if(cliente.cpf !== this.state.venda.cliente.cpf) {
                    ClienteDataService.atualizarCliente(cliente);
                }
            }),
            this.voltar()
        );
    }

    handleChange(event) {
        let tempVar1 = event.target.name;
        let tempVar2 = event.target.value;

        if(tempVar1 === 'cliente') {
            if(typeof tempVar2 === 'string') {
                this.setState(prevState => ({
                    venda: {
                        ...prevState.venda,
                        cliente: {
                            cpf: tempVar2
                        }
                    }
                }))
            } else {
                this.setState(prevState => ({
                    venda: {
                        ...prevState.venda,
                        cliente: tempVar2
                    }
                }));
            }
        } else {
            this.setState(prevState => ({
                venda: {
                    ...prevState.venda,
                    [tempVar1]: tempVar2
                }
            }));
        }
    }

    forceDialogOpenState(dialog, open) {
        this.setState(() => ({
            [dialog]: open
        }));
    }

    abrirDialogAdicionarItem() {
        this.setState(() => ({
            dialogAdicionarItem: true
        }));
    };

    fecharDialogAdicionarItem(selecionado, quantidade) {
        if(selecionado !== '' && quantidade > 0) {
            if(this.state.venda.cliente.cpf.replace(/[-._]/g, "").length < 11) {
                this.forceDialogOpenState("dialogAdicionarItem", false);
                return;
            }

            let tempClienteIndex = this.state.clientes.findIndex(c => c.cpf === this.state.venda.cliente.cpf);

            if(tempClienteIndex > -1) {
                let tempCliente = this.state.venda.cliente;
                if(tempCliente.saldo >= (selecionado.valor * quantidade)) {
                    tempCliente.saldo -= selecionado.valor * quantidade;
                    let tempClientes = this.state.clientes;
                    tempClientes[tempClienteIndex] = tempCliente;

                    this.setState(prevState => ({
                        venda: {
                            ...prevState.venda,
                            cliente: tempCliente
                        },
                        clientes: tempClientes
                    }));

                    this.adicionarItem(selecionado, quantidade);
                }
            }
        }

        this.forceDialogOpenState("dialogAdicionarItem", false);
    };

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

    abrirDialogEditarQuantidade(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogEditarQuantidade: true
        }));
    };

    fecharDialogEditarQuantidade(alterar, difference, item) {
        if(alterar && difference !== 0) {
            let tempClientes = this.state.clientes;
            let clienteIndex = tempClientes.findIndex(c => c.cpf === this.state.venda.cliente.cpf);
            if(clienteIndex > -1) {
                let tempCliente = this.state.venda.cliente;
                if(tempCliente.saldo >= (difference * this.state.itemSelecionado.produto.valor)) {
                    tempCliente.saldo -= (difference * this.state.itemSelecionado.produto.valor);
                    tempClientes[clienteIndex] = tempCliente;

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
                            cliente: tempCliente,
                            itens: tempItens,
                            valorTotal: tempValorTotal
                        },
                        clientes: tempClientes
                    }));
                }
            }
        }
        this.forceDialogOpenState("dialogEditarQuantidade", false);
    };    

    abrirDialogExcluirItem(item) {
        this.setState(() => ({
            itemSelecionado: item,
            dialogExcluirItem: true
        }));
    };

    fecharDialogExcluirItem(item, resposta) {
        if(resposta) {
            let tempClientes = this.state.clientes;
            let tempIndex = tempClientes.findIndex(c => c.cpf === this.state.venda.cliente.cpf);
            let tempCliente = this.state.venda.cliente;
            let tempItens = this.state.venda.itens;
            let tempValorTotal = 0;            

            if(item.idItem !== undefined) {
                let tempItensExcluidos = this.state.itensExcluidos;
                tempItensExcluidos.push(item);
                this.setState(() => ({
                    itensExcluidos: tempItensExcluidos
                }));
            }

            tempCliente.saldo += item.produto.valor * item.quantidade;
            tempClientes[tempIndex] = tempCliente;
            
            tempItens.splice(tempItens.indexOf(item), 1);
            this.state.venda.itens.forEach(item => {
                tempValorTotal += (item.quantidade * item.produto.valor);
            });
            this.setState(prevState => ({
                venda: {
                    ...prevState.venda,
                    cliente: tempCliente,
                    itens: tempItens,
                    valorTotal: tempValorTotal
                },
                clientes: tempClientes
            }));
        }
        this.setState(() => ({
            dialogExcluirItem: false
        }));
    }

    render() {

        return (
            <div> 
                <Typography variant="h6" align="center">
                    {this.state.novaVenda ? 'Nova Venda' : 'Editar Venda'}
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
                        <InputMask name="cliente"
                                disabled={this.state.venda.itens.length > 0}
                                mask={"999.999.999-99"} 
                                value={this.state.venda.cliente.cpf} 
                                onChange={this.handleChange} 
                            >
                                {(inputProps) => 
                                    <TextField {...inputProps} label="Cliente" margin="dense" variant="outlined" InputProps={{
                                        endAdornment: <InputAdornment>
                                            { 
                                                (
                                                    this.state.novaVenda && this.state.clientes.find(c => c.cpf === this.state.venda.cliente.cpf.replace(/[-._]/g, "")) === undefined
                                                ) || (
                                                    !this.state.novaVenda && this.state.venda.cliente.cpf.replace(/[-._]/g, "").length !== 11
                                                ) 
                                            ?
                                                <Select name="cliente" onChange={this.handleChange}>
                                                    {this.state.clientes.map((cliente) => (
                                                        <MenuItem key={cliente.cpf} value={cliente}>{cliente.cpf} {cliente.nome}</MenuItem>
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
                                value={this.state.venda.cliente.saldo}   
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
                                            <TableCell>Unidade</TableCell>
                                            <TableCell>Quantidade</TableCell>
                                            <TableCell>Preço</TableCell>
                                            <TableCell>Valor do Item</TableCell>
                                            <TableCell>Opções</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.venda.itens.map((item) => (
                                            <TableRow key={item.idItem}>
                                                <TableCell component="th" scope="tow">{item.idItem}</TableCell>
                                                <TableCell>{item.produto.nome}</TableCell>
                                                <TableCell align="center">{item.produto.unidade}</TableCell>
                                                <TableCell align="center">{item.quantidade}</TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat name="valor"
                                                        displayType="text"
                                                        value={item.produto.valor}   
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <NumberFormat name="valor"
                                                        displayType="text"
                                                        value={item.produto.valor * item.quantidade}   
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <IconButton disabled={item.idItem === undefined || this.state.clientes.find(c => c.cpf === this.state.venda.cliente.cpf.replace(/[-._]/g, "")) === undefined} onClick={() => this.abrirDialogEditarQuantidade(item)}>
                                                        <Edit />                                            
                                                    </IconButton>
                                                    <IconButton disabled={this.state.clientes.find(c => c.cpf === this.state.venda.cliente.cpf.replace(/[-._]/g, "")) === undefined} onClick={() => this.abrirDialogExcluirItem(item)}>
                                                        <Delete />                                            
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Typography variant="overline" display="block" gutterBottom>
                                    Quantidade de Produtos: {this.state.venda.itens.length}
                                    <Button color="primary" startIcon={<Add />} size="small" disabled={this.state.clientes.find(c => c.cpf === this.state.venda.cliente.cpf.replace(/[-._]/g, "")) === undefined} onClick={() => this.abrirDialogAdicionarItem()}>
                                        Adicionar Produto
                                    </Button>
                                </Typography>
                            </TableContainer>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" type="submit" disabled={(this.state.clientes.find(c => c.cpf === this.state.venda.cliente.cpf.replace(/[-._]/g, "")) === undefined) || (this.state.venda.itens.length < 1)}>Salvar</Button>
                            <Button variant="contained" color="secondary" onClick={this.voltar}>Voltar</Button>
                        </Grid>
                    </Grid>
                    </Paper>
                    </form>
                </div>
                <DialogAdicionarItem open={this.state.dialogAdicionarItem} produtos={this.state.produtos} onClose={this.fecharDialogAdicionarItem}/>
                <DialogEditarQuantidade item={this.state.itemSelecionado} open={this.state.dialogEditarQuantidade} onClose={this.fecharDialogEditarQuantidade} />
                <DialogExcluirItem item={this.state.itemSelecionado} open={this.state.dialogExcluirItem} onClose={this.fecharDialogExcluirItem} />
            </div>
        );

    }

}
export default FormVendaComponent