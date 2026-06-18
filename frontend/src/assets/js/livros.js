document.getElementById('txtDataNascimento').max = new Date().toISOString().split('T')[0];
const buttonProximo = document.getElementById("btnProximoFormulario");
const sectionFormularioAutor = document.getElementById("container_formulario_autor");
const isLiberadoSectionAutor = false;

document.getElementById('formLivro').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!this.checkValidity()) {
        e.stopPropagation();
    }
    this.classList.add('was-validated');
});

document.getElementById('formAutor').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!this.checkValidity()) 
    {
        e.stopPropagation();
    }
    this.classList.add('was-validated');
});

buttonProximo.addEventListener("click", () => {
    const form = document.getElementById('formLivro');
    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const livro = {
        titulo: document.getElementById('txtTitulo').value,
        isbn: document.getElementById('txtIsbn').value,
        anoPublicacao: document.getElementById('txtAnoPublicacao').value,
        editora: document.getElementById('txtEditora').value,
        edicao: document.getElementById('txtEdicao').value,
        numeroPaginas: document.getElementById('txtNumeroPagina').value,
        idioma: document.getElementById('selIdioma').value,
        genero: document.getElementById('selGenero').value,
        capa: document.getElementById('txtArquivo').files[0]
    };

    sectionFormularioAutor.classList.remove("disabled");
});

document.getElementById('formAutor').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
    }
    this.classList.add('was-validated');

    const autor = {
        nome: document.getElementById('txtNomeAutor').value,
        pseudonimo: document.getElementById('txtPseudonimoAutor').value,
        dataNascimento: document.getElementById('txtDataNascimento').value,
        pais: document.getElementById('selPaisAutor').value,
        generoLiterario: document.getElementById('selGeneroLiterario').value,
        biografia: document.getElementById('txtBiografia').value,
    };

});
