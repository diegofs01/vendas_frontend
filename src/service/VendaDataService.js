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
        console.log("novoVenda");
        console.log(venda);
        //return axios.post(`${VENDA_API_URL}/novo`, venda);
    }

    atualizarVenda(venda) {
        console.log("atualizarVenda");
        console.log(venda);
        //return axios.put(`${VENDA_API_URL}/editar`, venda);
    }
}

export default new VendaDataService()