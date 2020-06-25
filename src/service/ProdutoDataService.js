import axios from 'axios'

const PRODUTO_API_URL = 'http://localhost:8080/api/produto'

class ProdutoDataService {

    listarProdutos() {
        return axios.get(`${PRODUTO_API_URL}/`);
    }

    buscarProduto(codigo) {
        return axios.get(`${PRODUTO_API_URL}/${codigo}`);
    }

    novoProduto(produto) {
        return axios.post(`${PRODUTO_API_URL}/novo`, produto);
    }
}

export default new ProdutoDataService()