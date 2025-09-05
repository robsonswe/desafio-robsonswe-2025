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
    const animaisAvaliados = ordemAnimais.split(",");
    const animaisValidos = animaisAvaliados.filter(animal => animal in this.animais);

    if (animaisValidos.length === 0) {
      return { erro: "Animal inválido" };
    }

    const listaBrinquedos1 = brinquedosPessoa1.split(",");
    const listaBrinquedos2 = brinquedosPessoa2.split(",");

    const adocao = animaisValidos.map(nomeAnimal => 
      this.avaliarAdocaoAnimal(nomeAnimal, listaBrinquedos1, listaBrinquedos2)
    );

    return { lista: adocao.sort() };
  }

  avaliarAdocaoAnimal(nome, brinquedosPessoa1, brinquedosPessoa2) {
    const animal = this.animais[nome];
    
    const pessoa1Compativel = this.brinquedosNaOrdem(animal.brinquedos, brinquedosPessoa1);
    const pessoa2Compativel = this.brinquedosNaOrdem(animal.brinquedos, brinquedosPessoa2);

    if (pessoa1Compativel && !pessoa2Compativel) {
      return `${nome} - pessoa 1`;
    }
    
    if (pessoa2Compativel && !pessoa1Compativel) {
      return `${nome} - pessoa 2`;
    } 
    
    return `${nome} - abrigo`;
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
}

export { AbrigoAnimais as AbrigoAnimais };
