class AbrigoAnimais {
  constructor() {
    this.animais = {
      Rex:  { raça: "cão",    brinquedos: ["RATO", "BOLA"] },
      Mimi: { raça: "gato",   brinquedos: ["BOLA", "LASER"] },
      Fofo: { raça: "gato",   brinquedos: ["BOLA", "RATO", "LASER"] },
      Zero: { raça: "gato",   brinquedos: ["RATO", "BOLA"] },
      Bola: { raça: "cão",    brinquedos: ["CAIXA", "NOVELO"] },
      Bebe: { raça: "cão",    brinquedos: ["LASER", "RATO", "BOLA"] },
      Loco: { raça: "jabuti", brinquedos: ["SKATE", "RATO"] }
    };
  }

encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      const animaisAvaliados = this.validarAnimais(ordemAnimais);
      const [listaBrinquedos1, listaBrinquedos2] = this.validarBrinquedos(brinquedosPessoa1, brinquedosPessoa2);

      let avaliacoes = animaisAvaliados.map(nomeAnimal =>
        this.avaliacaoInicial(nomeAnimal, listaBrinquedos1, listaBrinquedos2)
      );

      avaliacoes = this.avaliarGatos(avaliacoes);

      if (animaisAvaliados.includes("Loco")) {
        avaliacoes = this.avaliarLoco(avaliacoes, listaBrinquedos1, listaBrinquedos2);
      }

      const adocao = avaliacoes.map(this.avaliacaoFinal);

      return { lista: adocao.sort() };
    } catch (erro) {
      return { erro: erro.message };
    }
  }

  listaDuplicada(lista) {
    return new Set(lista).size !== lista.length;
  }

  avaliacaoInicial(nome, brinquedosPessoa1, brinquedosPessoa2) {
      const animal = this.animais[nome];

      if (nome === "Loco") {
          return {
              nome,
              raça: animal.raça,
              brinquedos: animal.brinquedos,
              pessoa1: this.temTodosBrinquedos(animal.brinquedos, brinquedosPessoa1),
              pessoa2: this.temTodosBrinquedos(animal.brinquedos, brinquedosPessoa2)
          };
      }

      return {
          nome,
          raça: animal.raça,
          brinquedos: animal.brinquedos,
          pessoa1: this.brinquedosNaOrdem(animal.brinquedos, brinquedosPessoa1),
          pessoa2: this.brinquedosNaOrdem(animal.brinquedos, brinquedosPessoa2)
      };
  }

  avaliarGatos(avaliacoes) {
    // Para cada pessoa
    ["pessoa1", "pessoa2"].forEach(pessoa => {
      // Filtra os gatos adotados por esta pessoa
      const gatos = avaliacoes.filter(a => a.raça === "gato" && a[pessoa]);
      
      // Filtra todos os outros animais adotados por esta pessoa
      const outros = avaliacoes.filter(a => a.raça !== "gato" && a[pessoa]);

      // Para cada gato, verifica se há outros com mesmo brinquedo
      gatos.forEach(gato => {
        const conflito = outros.some(animal => 
          animal.brinquedos.some(b => gato.brinquedos.includes(b))
        );
        if (conflito) {
          gato[pessoa] = false; // pessoa se torna incompatível com o gato caso haja conflito com outros animais
        }
      });
    });

    return avaliacoes;
  }

  avaliarLoco(avaliacoes, brinquedosPessoa1, brinquedosPessoa2) {
    const avaliacaoLoco = avaliacoes.find(a => a.nome === "Loco");
    
    // Para cada pessoa
    ["pessoa1", "pessoa2"].forEach(pessoa => {
        // Avalia se há outros animais, além de Loco
        const companhia = avaliacoes.filter(a => a.nome !== "Loco" && a[pessoa]);
        // Caso não  haja outros animais, realiza nova avaliação de compatibilidade considerando ordem dos brinquedos
        if (companhia.length === 0) {
          const brinquedosPessoa = pessoa === "pessoa1" ? brinquedosPessoa1 : brinquedosPessoa2;
          avaliacaoLoco[pessoa] = this.brinquedosNaOrdem(avaliacaoLoco.brinquedos, brinquedosPessoa);
        }
      });

    return avaliacoes;
  }

  avaliacaoFinal(avaliacao) {
    const { nome, pessoa1, pessoa2 } = avaliacao;

    if (pessoa1 && !pessoa2) {
      return `${nome} - pessoa 1`;
    }
    if (pessoa2 && !pessoa1) {
      return `${nome} - pessoa 2`;
    }
    return `${nome} - abrigo`;
  }

  validarAnimais(ordemAnimais) {
    const animaisAvaliados = ordemAnimais.trim() === '' ? [] : ordemAnimais.split(",");

    if (this.listaDuplicada(animaisAvaliados)) {
      throw new Error("Animal inválido");
    }

    const animaisValidos = animaisAvaliados.filter(animal => animal in this.animais);

    if (animaisValidos.length === 0) {
      throw new Error("Animal inválido");
    }

    return animaisValidos;
  }

  validarBrinquedos(brinquedosPessoa1, brinquedosPessoa2) {
    const lista1 = brinquedosPessoa1.trim() === '' ? [] : brinquedosPessoa1.split(",");
    const lista2 = brinquedosPessoa2.trim() === '' ? [] : brinquedosPessoa2.split(",");

    if (lista1.length === 0 && lista2.length === 0) {
      throw new Error("Brinquedo inválido");
    }

    if (this.listaDuplicada(lista1) || this.listaDuplicada(lista2)) {
      throw new Error("Brinquedo inválido");
    }

    const brinquedosAbrigo = new Set(
      Object.values(this.animais).flatMap(animal => animal.brinquedos)
    );

    const todosBrinquedos = [...lista1, ...lista2];
    for (const brinquedo of todosBrinquedos) {
      if (!brinquedosAbrigo.has(brinquedo)) {
        throw new Error("Brinquedo inválido");
      }
    }

    return [lista1, lista2];
  }

  brinquedosNaOrdem(animalBrinquedos, pessoaBrinquedos) {
    let indice = 0;

    for (const brinquedo of animalBrinquedos) {
      indice = pessoaBrinquedos.indexOf(brinquedo, indice);
      if (indice === -1) return false;
      indice++;
    }

    return true;
  }

  temTodosBrinquedos(animalBrinquedos, pessoaBrinquedos) {
    return animalBrinquedos.every(b => pessoaBrinquedos.includes(b));
  }

}

export { AbrigoAnimais as AbrigoAnimais };
