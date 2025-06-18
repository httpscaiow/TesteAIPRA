const form = document.getElementById('formulario');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const botao = form.querySelector('button');
  botao.disabled = true;
  botao.innerText = 'Enviando...';

  const dados = Object.fromEntries(new FormData(form));

  try {
    const resposta = await fetch('/api/enviar-formulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    console.log('Status da resposta:', resposta.status);
    console.log('Resposta.ok?', resposta.ok);
    console.log('Resultado:', resultado);

    if (resposta.ok) {
      console.log('Formulário enviado com sucesso. Redirecionando...');
      window.location.href = '/sucesso.html'; 
    } else {
      alert(resultado.erro || 'Erro ao enviar');
      botao.disabled = false;
      botao.innerText = 'Enviar';
    }
  } catch (erro) {
    alert('Erro ao enviar o formulário.');
    console.error('Erro:', erro);
    botao.disabled = false;
    botao.innerText = 'Enviar';
  }

  setTimeout(() => {
    botao.disabled = false;
    botao.innerText = 'Enviar';
  }, 30000);
});
