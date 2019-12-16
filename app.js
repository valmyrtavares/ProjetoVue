const vm = new Vue({
  el: "#app",
  data: {
    pais: "Brazil",
    produtos: [],
    produto: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item Adicionado",
    alertaAtivo: false,

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

    cliqueForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget)
        this.carrinhoAtivo = false;
    },
    adicionarItem() {

      this.produto.estoque--;

      const { id, nome, preco } = this.produto;

      this.carrinho.push({ id, nome, preco });

      this.alerta(`${nome} Foi adicionado`)
      // this.carrinho.push({
      //   id: this.produto.id,
      //   nome: this.produto.nome,
      //   preco: this.produto.preco
      // });

    },
    removerItem(index) {
      this.carrinho.splice(0, 1)
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },

    compararEstoque() {
      const items = this.carrinho.filter(item => {
        console.log(item.id);
        if (item.id === this.produto.id) {
          return true;
        }
      })
      this.produto.estoque = this.produto.estoque - items.length


    },

    alerta(mensagem) {

      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500)
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduto(hash.replace("#", ""))
      }

    }
  },

  watch: {
    produto() {
      document.title = this.produto.nome || "techo";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.produto) {
        this.compararEstoque();
      }

    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    },

  },

  created() {
    this.fetchProdutos();
    this.router();
    this.checarLocalStorage();
  }
})

