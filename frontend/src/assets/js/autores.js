const buttonSalvar = document.querySelector("#btnSalvarAutor");
const modalCadastroAutor = document.querySelector("#modalCadastroAutor")
document.getElementById('txtDataNascimento').max = new Date().toISOString().split('T')[0];
let autorEditando = null;

function salvarAutores() {

    try {
        const autores =
        {
            nome: document.getElementById("txtNomeAutor").value,
            pseudonimo: document.getElementById("txtPseudonimoAutor").value,
            dataNascimento: document.getElementById("txtDataNascimento").value,
            pais: document.getElementById("selPaisAutor").value,
            generoLiterario: document.getElementById("selGeneroLiterario").value,
        }

        if (!autores) {
            throw new Error("Erro ao criar objeto autores.");
        }

        fetch('http://localhost:3000/autor',
            {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(autores)
            }
        ).then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || "Erro ao cadastrar");
            }

            mensagemSucesso(data.mensagem, 1);
            bootstrap.Modal.getInstance(modalCadastroAutor).hide();
            buscarAutores();
        }
        )

    }
    catch (error) {
        console.error(error)
    }
}

async function buscarAutores() {
    try {
        const response = await fetch('http://localhost:3000/autor', { method: 'GET' });

        if (!response.ok) { throw new Error(`Erro HTTP: ${response.status}`) }

        const dados = await response.json();

        montarTabela(dados.dados);

    }
    catch (error) {
        console.log(error);
    }
}

function montarTabela(autores) {
    if (!autores) {
        return;
    }

    const tabelaAutores = document.getElementById("corpo_tabela_autor");

    if (!tabelaAutores) {
        return;
    }

    tabelaAutores.innerHTML = "";

    if (!autores || autores.length === 0) {
        tabelaAutores.innerHTML = `
        <tr>
            <td colspan="5" class="text-center text-muted py-4">
                Nenhum autor cadastrado.
            </td>
        </tr>
    `;
        return;
    }

    autores.forEach(autor => {
        const linha = document.createElement('tr');

        let bagde = (autor.status == 0 ? 'ativo' : "removido");
        let classeOcultarAcoes = (autor.status === 999 ? 'd-none' : '');

        linha.innerHTML = `
        <td>${autor.nm_autor} / ${autor.ds_pseudonimo}</td>
        <td>${autor.sg_pais} - ${autor.ds_pais}</td>
        <td>${autor.ds_genero}</td>
        <td>${new Date(autor.dt_nascimento).toLocaleDateString('pt-BR')}</td>
        <td>
            <span class="bagde-${bagde}">${bagde}</span>
        </td>
        <td>
            <div class='acoes-tabela'>
                <button
                    class="btn btn-secondary btn-sm ${classeOcultarAcoes}"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCadastroAutor"
                    data-bs-pkAutor="${autor.pk_autor}"
                    data-bs-nomeautor="${autor.nm_autor}"
                    data-bs-pseudonimo="${autor.ds_pseudonimo}"
                    data-bs-pais="${autor.pk_pais}"
                    data-bs-genero="${autor.pk_genero}"
                    data-bs-nascimento="${autor.dt_nascimento}">
                    
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    class="btn btn-secondary btn-sm ${classeOcultarAcoes}"
                    data-bs-toggle="modal"
                    data-bs-target="#modalRemoverAutor"
                    data-bs-pkautor-remover="${autor.pk_autor}"
                    data-bs-nomeautor-remover="${autor.nm_autor}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    `;

        tabelaAutores.appendChild(linha);
    });
}

buttonSalvar.addEventListener("click", () => {

    const form = document.getElementById('formAutor')

    if (!form.checkValidity()) {
        form.classList.add('was-validated')
        return
    }

    form.classList.add('was-validated')

    if (autorEditando) {
        editarAutores(autorEditando);
    } else {
        salvarAutores();
    }
})


modalCadastroAutor.addEventListener("hidden.bs.modal", () => {
    const form = modalCadastroAutor.querySelector("form");

    form.reset();
    form.classList.remove('was-validated');

    autorEditando = null;

    buttonSalvar.textContent = 'Salvar';
    buttonSalvar.classList.remove('button-acervo-editar');
    buttonSalvar.classList.add('button-acervo');
});

function mensagemSucesso(mensagem, tipo) {
    if (!mensagem || !tipo) { return };

    const toastLiveExample = document.getElementById('liveToast');

    if (tipo === 1) {
        toastLiveExample.style.backgroundColor = '#BCFB86';
        toastLiveExample.style.border = '1px solid #91ee3f';
        toastLiveExample.style.color = '#2e6300'
    } else if (tipo === 2) {
        toastLiveExample.style.backgroundColor = 'rgb(72, 72, 235)';
        toastLiveExample.style.border = '1px solid rgb(37, 37, 231)';
        toastLiveExample.style.color = '#fff'
    } else if (tipo === 3) {
        toastLiveExample.style.backgroundColor = 'rgb(250, 131, 131)';
        toastLiveExample.style.border = '1px solid rgb(219, 13, 13)';
        toastLiveExample.style.color = '#770000'
    }

    document.getElementById('mensagem').textContent = mensagem;

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
}
buscarAutores();

if (modalCadastroAutor) {
    modalCadastroAutor.addEventListener('show.bs.modal', event => {
        const botaoModal = event.relatedTarget;
        buttonSalvar.classList.add('button-acervo');
        const idAutor = botaoModal.getAttribute('data-bs-pkAutor');
        const isEditar = (idAutor > 0 ? true : false);

        if (isEditar) {
            autorEditando = idAutor;

            const nomeAutor = botaoModal.getAttribute('data-bs-nomeautor');
            const pseudonimo = botaoModal.getAttribute('data-bs-pseudonimo');
            const pais = botaoModal.getAttribute('data-bs-pais');
            const genero = botaoModal.getAttribute('data-bs-genero');
            const nascimento = botaoModal.getAttribute('data-bs-nascimento');

            document.getElementById("txtNomeAutor").value = nomeAutor,
                document.getElementById("txtPseudonimoAutor").value = pseudonimo,
                document.getElementById('txtDataNascimento').value = new Date(nascimento).toISOString().split('T')[0];
            document.getElementById("selPaisAutor").value = pais,
                document.getElementById("selGeneroLiterario").value = genero

            buttonSalvar.classList.remove('button-acervo');
            buttonSalvar.classList.add('button-acervo-editar');
            buttonSalvar.textContent = 'Editar';
            return;
        }
    })
}

function editarAutores(pkAutor) {

    try {

        if (!pkAutor) { throw new Error('Autor não existe') }

        const autores =
        {
            nome: document.getElementById("txtNomeAutor").value,
            pseudonimo: document.getElementById("txtPseudonimoAutor").value,
            dataNascimento: document.getElementById("txtDataNascimento").value,
            pais: document.getElementById("selPaisAutor").value,
            generoLiterario: document.getElementById("selGeneroLiterario").value,
        }

        fetch(`http://localhost:3000/autor/${pkAutor}`,
            {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(autores)
            }
        ).then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || "Erro ao editar");
            }

            mensagemSucesso(data.mensagem, 2);
            bootstrap.Modal.getInstance(modalCadastroAutor).hide();
            buscarAutores();
        }
        )

    }
    catch (error) {
        console.error(error)
    }
}

const modalRemoverAutor = document.querySelector("#modalRemoverAutor");
const btnConfirmarRemocao = document.querySelector("#btnConfirmarRemocao");
let autorRemovendo = null;

if (modalRemoverAutor) {
    modalRemoverAutor.addEventListener('show.bs.modal', event => {
        const botaoModal = event.relatedTarget;

        autorRemovendo = botaoModal.getAttribute('data-bs-pkautor-remover');
        const nomeAutor = botaoModal.getAttribute('data-bs-nomeautor-remover');

        document.getElementById('nomeAutorRemover').textContent = nomeAutor;
    });

    modalRemoverAutor.addEventListener('hidden.bs.modal', () => {
        autorRemovendo = null;
    });
}

btnConfirmarRemocao.addEventListener('click', () => {
    if (!autorRemovendo) return;

    removerAutor(autorRemovendo);
});

function removerAutor(pkAutor) {
    fetch(`http://localhost:3000/autor/${pkAutor}`, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || "Erro ao remover autor");
            }

            mensagemSucesso(data.mensagem, 3);
            bootstrap.Modal.getInstance(modalRemoverAutor).hide();
            buscarAutores();
        })
        .catch(error => {
            console.error(error);
            mensagemSucesso(error.message, 3);
        });
}