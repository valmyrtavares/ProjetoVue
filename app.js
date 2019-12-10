const vm = new Vue({
  el: "#app",
  data: {
    pais: "Brazil",
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoTotal: 0,
  },
  filters: {
    numeroPreco(valor) {
      // return `R$ ${valor},00`
      // return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); em REAL 
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "USD" });
    },
    maiuscula(valor) {
      return valor.toUpperCase();
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json").then(r => r.json()).then(r => {
        this.produtos = r;
      })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`).then(r => r.json()).then(r => {
        this.produto = r;
      })
    },

    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },

    fecharModal({ target, currentTarget }) {
      if (target === currentTarget)
        this.produto = false;
    },
    adicionarItem() {

      this.produto.estoque--;
      const { id, nome, preco } = this.produto
      this.carrinho.push(id, nome, preco)
    },
    removerItem() {
      this.carrinho.splice(0, 1)
    }
  },

  created() {
    this.fetchProdutos();
  }
})

