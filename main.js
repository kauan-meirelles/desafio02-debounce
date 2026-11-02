// Desafio técnico #02 — Campo de busca com debounce (JavaScript)
const campo = document.querySelector('#busca');
const situacao = document.querySelector('#situacao');
const lista = document.querySelector('#resultados');

function debounce(funcao, espera = 300) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcao(...args), espera);
  };
}

const API = 'https://dummyjson.com/products/search';
let controlador;

async function buscarProdutos(termo) {
  controlador?.abort();
  controlador = new AbortController();
  const url = `${API}?q=${encodeURIComponent(termo)}`;
  const resposta = await fetch(url, { signal: controlador.signal });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  const dados = await resposta.json();
  return dados.products.map((produto) => produto.title);
}

function criarItem(nome) {
  const item = document.createElement('li');
  item.textContent = nome;
  return item;
}

async function aoDigitar() {
  const termo = campo.value.trim();
  if (termo.length < 2) {
    lista.replaceChildren();
    situacao.textContent = 'Digite pelo menos 2 letras';
    return;
  }
  situacao.textContent = 'Buscando...';
  try {
    const nomes = await buscarProdutos(termo);
    lista.replaceChildren(...nomes.map(criarItem));
    situacao.textContent = nomes.length ? `${nomes.length} resultado(s)` : 'Nada encontrado';
  } catch (erro) {
    if (erro.name === 'AbortError') return;
    situacao.textContent = 'Falha na busca. Tente de novo.';
  }
}

campo.addEventListener('input', debounce(aoDigitar, 300));
