const conexao = require('../database/config');

exports.salvar = async (req, res) => {
    try {
        const { nome, pseudonimo, dataNascimento, pais, generoLiterario } = req.body;

        if (!nome) {
            return res.status(400).json({ mensagem: "Informe o nome do autor" })
        }

        if (!pseudonimo) {
            return res.status(400).json({ mensagem: "Informe o pseudônimo do autor" })
        }

        if (!dataNascimento) {
            return res.status(400).json({ mensagem: "Informe uma data válida" })
        }

        if (!pais) {
            return res.status(400).json({ mensagem: "Selecione o país" })
        }

        if (!generoLiterario) {
            return res.status(400).json({ mensagem: "Selecione o gênero literário" })
        }

        const linhasAfetadas = await conexao.query
            ("INSERT INTO autor (nm_autor, ds_pseudonimo, dt_nascimento, fk_genero_literario, fk_pais) VALUES($1, $2, $3, $4, $5)", [nome, pseudonimo, dataNascimento, generoLiterario, pais]);

        console.log(linhasAfetadas)

        if (linhasAfetadas.rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Autor não foi criado' });
        }

        return res.status(201).json({ mensagem: 'Autor criado com sucesso' });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao salvar autor' });
    }
}

exports.consultar = async (req, res) => {
    try {
        const comandoSQL =
            'SELECT * FROM autor JOIN pais ON pais.pk_pais = autor.fk_pais JOIN genero ON genero.pk_genero = autor.fk_genero_literario WHERE status = 0 ORDER BY pk_autor DESC';

        const resultado = await conexao.query(comandoSQL);

        return res.status(200).json({
            dados: resultado.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao consultar os autores"
        });
    }
}

exports.editar = async (req, res) => {
    try {
        const { id } = req.params
        const { nome, pseudonimo, dataNascimento, pais, generoLiterario } = req.body;

        if (!id) { return res.status(400).json({ mensagem: "id não informado" }) }

        const consultaAutor = await conexao.query(
            "SELECT pk_autor FROM autor WHERE pk_autor = $1 AND status = 0",
            [id]
        );

        if (consultaAutor.rowCount === 0) {
            return res.status(404).json({
                mensagem: "Autor não encontrado"
            });
        }

        if (!nome) {
            return res.status(400).json({ mensagem: "Informe o nome do autor" })
        }

        if (!pseudonimo) {
            return res.status(400).json({ mensagem: "Informe o pseudônimo do autor" })
        }

        if (!dataNascimento) {
            return res.status(400).json({ mensagem: "Informe uma data válida" })
        }

        if (!pais) {
            return res.status(400).json({ mensagem: "Selecione o país" })
        }

        if (!generoLiterario) {
            return res.status(400).json({ mensagem: "Selecione o gênero literário" })
        }

        const linhasAfetadas = await conexao.query
            ("UPDATE autor SET nm_autor = $1, ds_pseudonimo = $2, dt_nascimento = $3, fk_genero_literario = $4, fk_pais = $5 WHERE pk_autor = $6", [nome, pseudonimo, dataNascimento, generoLiterario, pais, id]);

        if (linhasAfetadas.rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Autor não foi atualizado' });
        }

        return res.status(200).json({ mensagem: 'Autor atualizado com sucesso' });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao salvar autor' });
    }
}

exports.deletar = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) { return res.status(400).json({ mensagem: "id não informado" }) }

        const consultaAutor = await conexao.query(
            "SELECT pk_autor FROM autor WHERE pk_autor = $1 AND status = 0",
            [id]
        );

        if (consultaAutor.rowCount === 0) {
            return res.status(404).json({
                mensagem: "Autor não encontrado"
            });
        }

        const linhasAfetadas = await conexao.query
            ("UPDATE autor SET status = $1 WHERE pk_autor = $2", [999, id]);

        if (linhasAfetadas.rowCount <= 0) {
            return res.status(500).json({ mensagem: 'Autor não foi deletado' });
        }

        return res.status(200).json({ mensagem: 'Autor deletado com sucesso' });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao delatar autor' });
    }
}