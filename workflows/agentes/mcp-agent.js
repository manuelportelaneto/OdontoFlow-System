// Agente MCP (Master Control Program) - Assistente Virtual OdontoFlow
const inputData = $input.first().json;

console.log("=== MCP AGENT ===");
console.log("Dados recebidos:", JSON.stringify(inputData, null, 2));

// Configurações do agente
const MCP = {
    nome: "MCP - Assistente Virtual OdontoFlow",
    versao: "1.0.0",
    comandos: [
        "agendar", "consultar", "reagendar", "cancelar",
        "horarios", "convenios", "dentistas", "procedimentos"
    ],
    respostas_padrao: {
        saudacao: "Olá! Sou o MCP, assistente virtual da OdontoFlow. Como posso ajudar?",
        despedida: "Estou à disposição para ajudar novamente quando precisar!",
        nao_entendi: "Desculpe, não entendi sua solicitação. Pode reformular?"
    }
};

// Funções de processamento de linguagem natural
function identificarIntencao(mensagem) {
    const mensagemLower = mensagem.toLowerCase();
    
    // Mapeamento de intenções
    const intencoes = {
        agendar: ["agendar", "marcar", "consulta", "horário"],
        consultar: ["consultar", "verificar", "ver", "agenda"],
        reagendar: ["reagendar", "remarcar", "mudar", "alterar"],
        cancelar: ["cancelar", "desmarcar", "excluir"],
        horarios: ["horário", "disponível", "agenda", "quando"],
        convenios: ["convênio", "plano", "particular", "aceita"],
        dentistas: ["dentista", "doutor", "doutora", "profissional"],
        procedimentos: ["procedimento", "tratamento", "serviço"]
    };

    // Identificar intenção principal
    for (const [intencao, palavrasChave] of Object.entries(intencoes)) {
        if (palavrasChave.some(palavra => mensagemLower.includes(palavra))) {
            return intencao;
        }
    }

    return "desconhecida";
}

function gerarResposta(intencao, mensagem) {
    const respostas = {
        agendar: {
            resposta: "Para agendar uma consulta, preciso de algumas informações:",
            perguntas: [
                "Qual o nome do paciente?",
                "Qual a melhor data para você?",
                "Qual horário você prefere?",
                "Possui convênio?"
            ]
        },
        consultar: {
            resposta: "Vou verificar sua agenda. Por favor, me informe:",
            perguntas: [
                "Você já tem uma consulta agendada?",
                "Em qual data?"
            ]
        },
        reagendar: {
            resposta: "Para reagendar sua consulta, preciso confirmar:",
            perguntas: [
                "Qual a data da sua consulta atual?",
                "Para qual data você gostaria de reagendar?"
            ]
        },
        cancelar: {
            resposta: "Para cancelar sua consulta, preciso de:",
            perguntas: [
                "Qual a data da consulta que deseja cancelar?",
                "Pode me informar o motivo do cancelamento?"
            ]
        },
        horarios: {
            resposta: "Nosso horário de atendimento é:",
            detalhes: [
                "Segunda a Sexta: 08:00 às 18:00",
                "Sábado: 08:00 às 12:00",
                "Horário de almoço: 12:00 às 13:00"
            ]
        },
        convenios: {
            resposta: "Trabalhamos com os seguintes convênios:",
            lista: [
                "Unimed", "Bradesco Saúde", "SulAmérica",
                "Amil", "Golden Cross", "NotreDame",
                "Também atendemos particular"
            ]
        },
        dentistas: {
            resposta: "Nossa equipe de profissionais:",
            lista: [
                "Dra. Maria Santos - Clínica Geral e Ortodontia",
                "Dr. João Oliveira - Endodontia",
                "Dra. Ana Costa - Odontopediatria"
            ]
        },
        procedimentos: {
            resposta: "Realizamos os seguintes procedimentos:",
            lista: [
                "Consultas e avaliações",
                "Limpeza e profilaxia",
                "Restaurações",
                "Tratamento de canal",
                "Extrações",
                "Ortodontia (aparelhos)",
                "Clareamento dental"
            ]
        },
        desconhecida: {
            resposta: MCP.respostas_padrao.nao_entendi,
            sugestoes: [
                "Você pode perguntar sobre:",
                "- Agendamento de consultas",
                "- Horários disponíveis",
                "- Convênios aceitos",
                "- Nossa equipe de dentistas",
                "- Procedimentos realizados"
            ]
        }
    };

    const intencaoData = respostas[intencao];
    return {
        intencao: intencao,
        mensagem_original: mensagem,
        resposta: intencaoData.resposta,
        detalhes: intencaoData.detalhes || [],
        lista: intencaoData.lista || [],
        perguntas: intencaoData.perguntas || [],
        sugestoes: intencaoData.sugestoes || []
    };
}

// Processamento da mensagem
const mensagem = inputData.mensagem || "";
const intencao = identificarIntencao(mensagem);
const resposta = gerarResposta(intencao, mensagem);

// Resultado
const resultado = {
    agent: {
        nome: MCP.nome,
        versao: MCP.versao
    },
    processamento: {
        mensagem_original: mensagem,
        intencao_identificada: intencao,
        timestamp: new Date().toISOString()
    },
    resposta: resposta
};

console.log("=== RESPOSTA MCP ===");
console.log(JSON.stringify(resultado, null, 2));

return [{ json: resultado }];
