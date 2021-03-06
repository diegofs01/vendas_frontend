import axios from 'axios'

const CLIENTE_API_URL = 'http://localhost:8080/api/cliente'

class ClienteDataService {

    listarClientes() {
        return axios.get(`${CLIENTE_API_URL}/`);
    }

    buscarCliente(cpf) {
        return axios.get(`${CLIENTE_API_URL}/${cpf}`);
    }

    salvarCliente(cliente, novo) {
        cliente.cpf = cliente.cpf.replace(/[-.]/g, "");
        cliente.cep = cliente.cep.replace(/[-]/g, "");
        if(novo) {
            return axios.post(`${CLIENTE_API_URL}/novo`, cliente);
        } else {
            return axios.put(`${CLIENTE_API_URL}/editar`, cliente);
        }
    }

    ativarCliente(cpf) {
        cpf = cpf.replace(/[-.]/g, "");
        return axios.post(`${CLIENTE_API_URL}/ativar/${cpf}`);
    }

    desativarCliente(cpf) {
        cpf = cpf.replace(/[-.]/g, "");
        return axios.post(`${CLIENTE_API_URL}/desativar/${cpf}`);
    }

    listarClientesAtivos() {
        return axios.get(`${CLIENTE_API_URL}/ativos`);
    }

    consultarSaldo(cpf) {
        return axios.get(`${CLIENTE_API_URL}/saldo/${cpf}`);
    }

    atualizarCliente(cliente) {
        return axios.put(`${CLIENTE_API_URL}/editar`, cliente);
    }
}

export default new ClienteDataService()