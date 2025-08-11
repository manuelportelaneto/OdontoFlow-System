// Verificação de disponibilidade com DEBUG detalhado e validação de horário
const dados = $json.dados_validados;

console.log("=== DEBUG VERIFICAÇÃO DE DISPONIBILIDADE ===");
console.log("Dados recebidos:", JSON.stringify(dados, null, 2));

// Configurações da clínica
const configuracoes = {
    horarios: {
        inicio: "08:00",
        fim: "18:00",
        almoco_inicio: "12:00",
        almoco_fim: "13:00"
    },
    duracao: {
        consulta: 30,
        limpeza: 60,
        obturacao: 60,
        extracao: 45,
        canal: 90,
        ortodontia: 45
    },
    diasFuncionamento: [1, 2, 3, 4, 5, 6] // Segunda a Sábado (0 = Domingo)
};

// Simulação de horários já ocupados
const horariosOcupados = [
    "2024-12-20 09:00",
    "2024-12-20 14:00",
    "2024-12-21 10:00"
];

// Simulação de feriados
const feriados = [
    "2024-12-25", // Natal
    "2024-12-31", // Ano Novo
    "2024-01-01"
];

// Funções auxiliares
function formatarData(data) {
    return new Date(data).toISOString().split('T')[0];
}

// Função para converter horário em minutos desde meia-noite
function horarioParaMinutos(horario) {
    if (typeof horario !== 'string') {
        console.log("horarioParaMinutos: valor inválido para horário:", horario);
        throw new Error("Horário inválido: não é string");
    }
    const partes = horario.split(':');
    if (partes.length !== 2) {
        console.log("horarioParaMinutos: formato inválido para horário:", horario);
        throw new Error("Horário inválido: formato incorreto");
    }
    const [horas, minutos] = partes.map(Number);
    if (isNaN(horas) || isNaN(minutos)) {
        console.log("horarioParaMinutos: partes não numéricas:", partes);
        throw new Error("Horário inválido: partes não numéricas");
    }
    return horas * 60 + minutos;
}

function ehFeriado(data) {
    const dataFormatada = formatarData(data);
    const ehFeriado = feriados.includes(dataFormatada);
    console.log(`Verificando feriado para ${dataFormatada}:`, ehFeriado ? "É feriado" : "Não é feriado");
    return ehFeriado;
}

function ehDiaUtil(data) {
    const dia = new Date(data).getDay();
    const ehUtil = configuracoes.diasFuncionamento.includes(dia);
    console.log(`Verificando dia útil para ${formatarData(data)}:`, ehUtil ? "É dia útil" : "Não é dia útil");
    return ehUtil;
}

function ehHorarioAlmoco(horario) {
    try {
        const minutosHorario = horarioParaMinutos(horario);
        const minutosAlmocoInicio = horarioParaMinutos(configuracoes.horarios.almoco_inicio);
        const minutosAlmocoFim = horarioParaMinutos(configuracoes.horarios.almoco_fim);
        const almoco = minutosHorario >= minutosAlmocoInicio && minutosHorario < minutosAlmocoFim;
        console.log(`Verificando horário de almoço ${horario}:`, almoco ? "É horário de almoço" : "Não é horário de almoço");
        return almoco;
    } catch (error) {
        console.log("Erro ao verificar horário de almoço:", error.message);
        return false;
    }
}

function ehHorarioFuncionamento(horario) {
    try {
        const minutosHorario = horarioParaMinutos(horario);
        const minutosInicio = horarioParaMinutos(configuracoes.horarios.inicio);
        const minutosFim = horarioParaMinutos(configuracoes.horarios.fim);
        const funcionamento = minutosHorario >= minutosInicio && minutosHorario <= minutosFim;
        console.log(`Verificando horário de funcionamento ${horario}:`, funcionamento ? "Dentro do horário" : "Fora do horário");
        return funcionamento;
    } catch (error) {
        console.log("Erro ao verificar horário de funcionamento:", error.message);
        return false;
    }
}

function getDuracaoProcedimento(procedimento) {
    const duracao = configuracoes.duracao[procedimento.toLowerCase()] || 30;
    console.log(`Duração do procedimento ${procedimento}:`, duracao, "minutos");
    return duracao;
}

// Verificações principais
console.log("\n=== INICIANDO VERIFICAÇÕES ===");

const dataHora = `${dados.data_agendamento} ${dados.horario}`;
console.log("Data/Hora solicitada:", dataHora);

// 1. Verificar se é dia útil
const diaUtil = ehDiaUtil(dados.data_agendamento);

// 2. Verificar se é feriado
const feriado = ehFeriado(dados.data_agendamento);

// 3. Verificar horário de funcionamento
const horarioValido = ehHorarioFuncionamento(dados.horario);

// 4. Verificar horário de almoço
const naoEhAlmoco = !ehHorarioAlmoco(dados.horario);

// 5. Verificar disponibilidade
const horarioOcupado = horariosOcupados.includes(dataHora);
console.log("Horário já ocupado?", horarioOcupado ? "Sim" : "Não");

// Resultado da verificação
const disponivel = diaUtil && !feriado && horarioValido && naoEhAlmoco && !horarioOcupado;

// Determinar motivo se indisponível
let motivo = "Disponível";
if (!disponivel) {
    if (!diaUtil) motivo = "Não é dia útil";
    else if (feriado) motivo = "Feriado";
    else if (!horarioValido) motivo = "Fora do horário de funcionamento";
    else if (!naoEhAlmoco) motivo = "Horário de almoço";
    else if (horarioOcupado) motivo = "Horário já ocupado";
}

console.log("\n=== RESULTADO FINAL ===");
console.log("Disponível:", disponivel);
console.log("Motivo:", motivo);

// Dados processados com resultado da verificação
const resultado = {
    ...dados,
    verificacao_disponibilidade: {
        disponivel: disponivel,
        motivo: motivo,
        data_verificacao: new Date().toISOString(),
        duracao_consulta: getDuracaoProcedimento(dados.procedimento),
        detalhes: {
            dia_util: diaUtil,
            feriado: feriado,
            horario_valido: horarioValido,
            horario_almoco: !naoEhAlmoco,
            horario_ocupado: horarioOcupado
        },
        horario_clinica: {
            funcionamento: `${configuracoes.horarios.inicio} às ${configuracoes.horarios.fim}`,
            almoco: `${configuracoes.horarios.almoco_inicio} às ${configuracoes.horarios.almoco_fim}`,
            dias: "Segunda a Sábado"
        }
    }
};

console.log("\n=== RETORNANDO ===");
console.log("Resultado completo:", JSON.stringify(resultado, null, 2));

return [{ json: resultado }];
