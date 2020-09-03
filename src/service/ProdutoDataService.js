import axios from 'axios'

const PRODUTO_API_URL = 'http://localhost:8080/api/produto'

class ProdutoDataService {

    listarProdutos() {
        return axios.get(`${PRODUTO_API_URL}/`);
    }

    buscarProduto(codigo) {
        return axios.get(`${PRODUTO_API_URL}/${codigo}`);
    }

    salvarProduto(produto, novo) {
        if(novo) {
            return axios.post(`${PRODUTO_API_URL}/novo`, produto);
        } else {
            return axios.put(`${PRODUTO_API_URL}/editar`, produto);
        }
    }
}

export default new ProdutoDataService()