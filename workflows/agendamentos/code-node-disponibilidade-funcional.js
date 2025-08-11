// Verificação de disponibilidade funcional (baseado no código que está funcionando)

const inputData = $input.first().json;
const dados = inputData.dados_validados;

console.log("=== DEBUG DISPONIBILIDADE ===");
console.log("Dados de entrada completos:", JSON.stringify(inputData, null, 2));
console.log("Dados validados:", JSON.stringify(dados, null, 2));

// Verificar se temos os dados necessários
if (!dados) {
  console.log("❌ ERRO: dados_validados não encontrados!");
  return [{
    json: {
      ...inputData,
      verificacao_disponibilidade: {
        disponivel: false,
        motivo: "Erro: dados não encontrados",
        debug: "dados_validados está undefined"
      }
    }
  }];
}

const dataHora = `${dados.data_agendamento} ${dados.horario}`;
console.log("Data/Hora para verificar:", dataHora);

// Horários já ocupados (simulação - em produção consultaria banco de dados)
const horariosOcupados = [
  "2024-12-20 09:00",
  "2024-12-20 14:00", // Este está ocupado para teste
  "2024-12-21 10:00"
];

console.log("Horários ocupados:", horariosOcupados);

// Horários de funcionamento da clínica
const horarioFuncionamento = {
  inicio: "08:00",
  fim: "18:00",
  almoco_inicio: "12:00",
  almoco_fim: "13:00"
};

console.log("Horário de funcionamento:", horarioFuncionamento);

// Verificações detalhadas
console.log("=== VERIFICAÇÕES ===");

// 1. Verificar se horário está ocupado
const horarioOcupado = horariosOcupados.includes(dataHora);
console.log("1. Horário ocupado?", horarioOcupado, "| Buscando:", dataHora);

// 2. Verificar se está dentro do horário de funcionamento
const horario = dados.horario;
console.log("2. Horário do agendamento:", horario);

const dentroHorario = horario >= horarioFuncionamento.inicio && 
                     horario <= horarioFuncionamento.fim;
console.log("3. Dentro do horário de funcionamento?", dentroHorario);
console.log("   Comparação:", horario, ">=", horarioFuncionamento.inicio, "&&", horario, "<=", horarioFuncionamento.fim);

// 3. Verificar se não é horário de almoço
const naoEAlmoco = !(horario >= horarioFuncionamento.almoco_inicio && 
                    horario < horarioFuncionamento.almoco_fim);
console.log("4. Não é horário de almoço?", naoEAlmoco);
console.log("   Comparação almoço:", horario, ">=", horarioFuncionamento.almoco_inicio, "&&", horario, "<", horarioFuncionamento.almoco_fim);

// Verificar dia da semana (segunda a sexta)
const dataAgendamento = new Date(dados.data_agendamento);
const diaSemana = dataAgendamento.getDay(); // 0=domingo, 1=segunda, etc.
const diaUtil = diaSemana >= 1 && diaSemana <= 5;
console.log("5. Data:", dados.data_agendamento, "| Dia da semana:", diaSemana, "| É dia útil?", diaUtil);

// Resultado final
const disponivel = !horarioOcupado && dentroHorario && naoEAlmoco && diaUtil;

console.log("=== RESULTADO FINAL ===");
console.log("Disponível:", disponivel);
console.log("Motivos:");
console.log("  - Não ocupado:", !horarioOcupado);
console.log("  - Dentro do horário:", dentroHorario);
console.log("  - Não é almoço:", naoEAlmoco);
console.log("  - É dia útil:", diaUtil);

// Determinar motivo se não disponível
let motivo = "Disponível";
if (!disponivel) {
  if (horarioOcupado) {
    motivo = "Horário já ocupado";
  } else if (!dentroHorario) {
    motivo = "Fora do horário de funcionamento (08:00-18:00)";
  } else if (!naoEAlmoco) {
    motivo = "Horário de almoço (12:00-13:00)";
  } else if (!diaUtil) {
    motivo = "Não atendemos aos finais de semana";
  } else {
    motivo = "Indisponível por motivo desconhecido";
  }
}

console.log("Motivo:", motivo);

const resultado = {
  ...inputData,
  verificacao_disponibilidade: {
    disponivel: disponivel,
    motivo: motivo,
    data_verificacao: new Date().toISOString(),
    debug: {
      dataHora_consultada: dataHora,
      horario_ocupado: horarioOcupado,
      dentro_horario: dentroHorario,
      nao_e_almoco: naoEAlmoco,
      dia_util: diaUtil,
      dia_semana: diaSemana,
      horarios_ocupados: horariosOcupados,
      funcionamento: horarioFuncionamento
    }
  }
};

console.log("=== RETORNANDO ===");
console.log("Resultado completo:", JSON.stringify(resultado, null, 2));

return [{ json: resultado }];
