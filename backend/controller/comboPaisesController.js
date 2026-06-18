const conexao = require('../database/config');

exports.getPaises =  async(req, res) =>
    {
        try {
            
            const comandoSQL = 'SELECT sg_pais AS sigla, ds_pais AS pais FROM pais;';

            const resultado = await conexao.query(comandoSQL);

            if(resultado.rowCount === 0)
            {
                return res.status(404).json({messagem:"Nenhum país encontrado"});
            }


            return res.status(200).json({messagem:"Consulta feita com sucesso", dados:resultado.rows})

        } catch (error) {
            console.log(error);
            return res.status(500).json({ mensagem: "Erro interno do servidor" });
        }
    } 