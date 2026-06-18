async function buscarUsuarioLogado() {
  try {
    const response = await fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      credentials: 'include'
    });

    console.log("STATUS:", response.status);

    const data = await response.json();

    if (response.status === 200) {
      const nomeUsuario = data.usuario.nome;
      document.querySelector("#nome_usuario").textContent = nomeUsuario == null ? "Username" : nomeUsuario;

    } else {
      console.log("Não autorizado");
    }

  } catch (error) {
    console.error(error);
  }
}

buscarUsuarioLogado();