import axios from 'axios'

const CLIENTE_API_URL = 'http://localhost:8080/api'

class ClienteDataService {

    listarClientes() {
        return axios.get(`${CLIENTE_API_URL}/cliente/`);
    }

    buscarCliente(cpf) {
        return axios.get(`${CLIENTE_API_URL}/cliente/${cpf}`);
    }

    novoCliente(cliente) {
        cliente.cpf = cliente.cpf.replace(/[-.]/g, "");
        cliente.cep = cliente.cep.replace(/[-]/g, "");
        return axios.post(`${CLIENTE_API_URL}/cliente/novo`, cliente);
    }
}

export default new ClienteDataService()