import axios from 'axios'

const VENDA_API_URL = 'http://localhost:8080/api/venda'

class VendaDataService {

    listarVendas() {
        return axios.get(`${VENDA_API_URL}/`);
    }

    buscarVenda(id) {
        return axios.get(`${VENDA_API_URL}/${id}`);
    }

    novoVenda(venda) {
        venda.dataVenda = new Date(venda.dataVenda).toISOString();
        return axios.post(`${VENDA_API_URL}/novo`, venda);
    }
}

export default new VendaDataService()