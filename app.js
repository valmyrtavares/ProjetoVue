const vm = new Vue({
  el: "#app",
  data: {
    pais: "Brazil",
    produtos: [],
    produto: false,
    carrinho: [],

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
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco
        })
      }
      return total;
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

      this.carrinho.push({
        id: this.produto.id,
        nome: this.produto.nome,
        preco: this.produto.preco
      });


    },
    removerItem(index) {
      this.carrinho.splice(0, 1)
    }
  },

  created() {
    this.fetchProdutos();
  }
})

