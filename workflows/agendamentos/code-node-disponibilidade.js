// Verificação de disponibilidade com processamento de horários
const dados = $json.dados_validados;
const dataHora = `${dados.data_agendamento} ${dados.horario}`;

// Simulação de horários já ocupados (em produção, isso viria do Google Sheets)
const horariosOcupados = [
    "2024-12-20 09:00",
    "2024-12-20 14:00",
    "2024-12-21 10:00"
];

// Configurações da clínica
const horarioFuncionamento = {
    inicio: "08:00",
    fim: "18:00",
    almoco_inicio: "12:00",
    almoco_fim: "13:00",
    duracao_padrao: 60 // duração em minutos
};

// Função para verificar se é horário de almoço
function isHorarioAlmoco(horario) {
    return horario >= horarioFuncionamento.almoco_inicio && 
           horario < horarioFuncionamento.almoco_fim;
}

// Função para verificar se está dentro do horário de funcionamento
function isDentroHorarioFuncionamento(horario) {
    return horario >= horarioFuncionamento.inicio && 
           horario <= horarioFuncionamento.fim;
}

// Verificações
const horarioOcupado = horariosOcupados.includes(dataHora);
const horario = dados.horario;
const dentroHorario = isDentroHorarioFuncionamento(horario);
const naoEAlmoco = !isHorarioAlmoco(horario);

// Resultado da verificação
const disponivel = !horarioOcupado && dentroHorario && naoEAlmoco;

// Dados processados com resultado da verificação
const dadosProcessados = {
    ...dados,
    verificacao_disponibilidade: {
        disponivel: disponivel,
        motivo: !disponivel ? 
            (horarioOcupado ? "Horário já ocupado" :
             !dentroHorario ? "Fora do horário de funcionamento" :
             !naoEAlmoco ? "Horário de almoço" : "Indisponível") : "Disponível",
        data_verificacao: new Date().toISOString(),
        duracao_consulta: horarioFuncionamento.duracao_padrao,
        horario_clinica: {
            funcionamento: `${horarioFuncionamento.inicio} às ${horarioFuncionamento.fim}`,
            almoco: `${horarioFuncionamento.almoco_inicio} às ${horarioFuncionamento.almoco_fim}`
        }
    }
};

// Retorno dos dados processados
return [{
    json: dadosProcessados
}];
