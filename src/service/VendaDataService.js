import axios from 'axios'

const VENDA_API_URL = 'http://localhost:8080/api/venda'

class VendaDataService {

    listarVendas() {
        return axios.get(`${VENDA_API_URL}/`);
    }

    buscarVenda(id) {
        return axios.get(`${VENDA_API_URL}/${id}`);
    }

    salvarVenda(venda) {
        venda.dataVenda = new Date(venda.dataVenda).toISOString();
        if(venda.id === -1) {
            return axios.post(`${VENDA_API_URL}/novo`, venda);
        } else {
            return axios.put(`${VENDA_API_URL}/editar`, venda);
        }
    }

    excluirItem(idItem) {
        return axios.delete(`${VENDA_API_URL}/excluirItem/${idItem}`);
    }
}

export default new VendaDataService()