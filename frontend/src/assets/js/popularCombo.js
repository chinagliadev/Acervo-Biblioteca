
const COMBO_TIPO = {
    PAISES: 'paises',
    IDIOMAS: 'idiomas',
    GENEROS: 'generos'
}

async function buscarDadosCombo(tipo) 
{
    try 
    {
        if (!tipo)
        {
            throw new Error('Informe um tipo para selecionar o tipo do combo');
        }

        switch (tipo)
        {
            case COMBO_TIPO.PAISES:
            {
                const response = await fetch('http://localhost:3000/combos/selectPaises');

                if (!response.ok)
                {
                    throw new Error("Erro ao buscar países");
                }

                const resposta = await response.json();
                return resposta.dados;
            }

            default:
                throw new Error(`Tipo de combo não tratado: ${tipo}`);
        }
    }
    catch (error) 
    {
        console.error(error);
        return null; 
    }
}

async function popularComboPaises() 
{
    try 
    {
        const dadosPaises = await buscarDadosCombo(COMBO_TIPO.PAISES);

        if (!dadosPaises)
        {
            console.error('Não foi possível carregar os países');
            return;
        }

        const selectPaises = document.getElementById('selPaisAutor');

        if (!selectPaises)
        {
            console.error('Elemento select de países não encontrado');
            return;
        }

        dadosPaises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.sigla;
            option.text = pais.pais;


            selectPaises.appendChild(option);
        });
     
    }
    catch (error) 
    {
        console.error(error);
    }
}

popularComboPaises();