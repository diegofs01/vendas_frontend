import axios from 'axios'

const CLIENTE_API_URL = 'http://localhost:8080/api/cliente'

class ClienteDataService {

    listarClientes() {
        return axios.get(`${CLIENTE_API_URL}/`);
    }

    buscarCliente(cpf) {
        return axios.get(`${CLIENTE_API_URL}/${cpf}`);
    }

    novoCliente(cliente) {
        cliente.cpf = cliente.cpf.replace(/[-.]/g, "");
        cliente.cep = cliente.cep.replace(/[-]/g, "");
        return axios.post(`${CLIENTE_API_URL}/novo`, cliente);
    }

    ativarCliente(cpf) {
        cpf = cpf.replace(/[-.]/g, "");
        return axios.post(`${CLIENTE_API_URL}/ativar/${cpf}`);
    }

    desativarCliente(cpf) {
        cpf = cpf.replace(/[-.]/g, "");
        return axios.post(`${CLIENTE_API_URL}/desativar/${cpf}`);
    }
}

export default new ClienteDataService()