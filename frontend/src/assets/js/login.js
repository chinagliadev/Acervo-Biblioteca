const nome = document.querySelector("#txtNome");
const email = document.querySelector("#txtEmail");
const senha = document.querySelector("#txtSenha");
const confirmarSenha = document.querySelector("#txtConfirmarSenha");
const buttonCadastrar = document.querySelector("#btnCadastrar");
const btnLogin = document.querySelector("#btnLogin");


function cadastrarUsuario() {
  const usuario = {
    name: nome.value,
    email: email.value,
    senha: senha.value,
    confirmarSenha: confirmarSenha.value
  };

  let formularioValido = true;

  if (!nome.value.trim()) {
    nome.classList.add("is-invalid");
    nome.classList.remove("is-valid");
    formularioValido = false;
  } else {
    nome.classList.remove("is-invalid");
    nome.classList.add("is-valid");
  }

  if (!email.value.trim()) {
    email.classList.add("is-invalid");
    email.classList.remove("is-valid");
    formularioValido = false;
  } else {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
  }

  if (!senha.value.trim()) {
    senha.classList.add("is-invalid");
    senha.classList.remove("is-valid");
    formularioValido = false;
  } else {
    senha.classList.remove("is-invalid");
    senha.classList.add("is-valid");
  }

  if (!confirmarSenha.value.trim()) {
    confirmarSenha.classList.add("is-invalid");
    confirmarSenha.classList.remove("is-valid");
    formularioValido = false;
  } else {
    confirmarSenha.classList.remove("is-invalid");
    confirmarSenha.classList.add("is-valid");
  }

  if (senha.value && confirmarSenha.value && senha.value !== confirmarSenha.value) {
    senha.classList.add("is-invalid");
    confirmarSenha.classList.add("is-invalid");

    senha.classList.remove("is-valid");
    confirmarSenha.classList.remove("is-valid");

    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })
    .then(response => response.json())
    .then(data => {
      if (data.mensagem === 'Usuário criado com sucesso') {
        nome.classList.add('is-valid');
        email.classList.add('is-valid');
        senha.classList.add('is-valid');
        confirmarSenha.classList.add('is-valid');

        window.location.href = '../public/index.html';

      } else if (data.mensagem === 'Email já possui cadastro') {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');

        email.nextElementSibling.textContent = data.mensagem;

      } else if (data.mensagem) {
        nome.classList.add('is-invalid');
        nome.nextElementSibling.textContent = data.mensagem;
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function login() {
  const usuario = {
    email: email.value,
    senha: senha.value,
  };

  fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(usuario)
  })
    .then(response => {
      if (response.status === 200) {
        window.location.href = '../public/home.html';
        console.log('Deu bom');
      } else {
        email.classList.add('is-invalid');
        senha.classList.add('is-invalid');
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

if (buttonCadastrar) {
  buttonCadastrar.addEventListener("click", cadastrarUsuario);
}

if (btnLogin) {
  btnLogin.addEventListener("click", login);
}