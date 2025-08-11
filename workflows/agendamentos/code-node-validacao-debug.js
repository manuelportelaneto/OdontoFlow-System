// Validação com DEBUG detalhado e novas funcionalidades
const dados = $input.first().json;

console.log("=== DEBUG VALIDAÇÃO ===");
console.log("Dados recebidos:", JSON.stringify(dados, null, 2));

// Função para validar telefone brasileiro
function validarTelefone(telefone) {
  if (!telefone) return false;
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  console.log("Validando telefone:", telefone, "Resultado:", regex.test(telefone));
  return regex.test(telefone);
}

// Função para validar email
function validarEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log("Validando email:", email, "Resultado:", regex.test(email));
  return regex.test(email);
}

// Função para validar data (não pode ser no passado)
function validarData(data) {
  if (!data) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar só a data
  const dataAgendamento = new Date(data);
  console.log("Validando data:", data, "Hoje:", hoje, "Data agendamento:", dataAgendamento);
  const resultado = dataAgendamento >= hoje;
  console.log("Data válida:", resultado);
  return resultado;
}

// Função para gerar IP cliente
function gerarIpCliente(nome, idConvenio) {
  const ipCliente = (nome + (idConvenio || '')).replace(/\s+/g, '').toUpperCase();
  console.log("Gerando IP Cliente:", { nome, idConvenio, resultado: ipCliente });
  return ipCliente;
}

// Função para gerar ID do agendamento
function gerarIdAgendamento(data, hora) {
  const timestamp = new Date().getTime();
  const dataFormatada = data.replace(/-/g, '');
  const horaFormatada = hora.replace(/:/g, '');
  const id = `AGD-${dataFormatada}-${horaFormatada}-${timestamp}`;
  console.log("Gerando ID Agendamento:", { data, hora, resultado: id });
  return id;
}

// Validações detalhadas
const erros = [];

console.log("=== INICIANDO VALIDAÇÕES ===");

// Validação do nome
console.log("1. Validando nome:", dados.nome_paciente);
if (!dados.nome_paciente || dados.nome_paciente.length < 2) {
  erros.push("Nome do paciente é obrigatório (mínimo 2 caracteres)");
  console.log("❌ Nome inválido");
} else {
  console.log("✅ Nome válido");
}

// Validação do telefone
console.log("2. Validando telefone:", dados.telefone);
if (!validarTelefone(dados.telefone)) {
  erros.push("Telefone deve estar no formato (11) 99999-9999");
  console.log("❌ Telefone inválido");
} else {
  console.log("✅ Telefone válido");
}

// Validação do email
console.log("3. Validando email:", dados.email);
if (!validarEmail(dados.email)) {
  erros.push("Email inválido");
  console.log("❌ Email inválido");
} else {
  console.log("✅ Email válido");
}

// Validação da data
console.log("4. Validando data:", dados.data_agendamento);
if (!validarData(dados.data_agendamento)) {
  erros.push("Data do agendamento não pode ser no passado");
  console.log("❌ Data inválida");
} else {
  console.log("✅ Data válida");
}

// Validação do dentista
console.log("5. Validando dentista:", dados.dentista);
if (!dados.dentista) {
  erros.push("Dentista é obrigatório");
  console.log("❌ Dentista inválido");
} else {
  console.log("✅ Dentista válido");
}

// Validação do convênio
console.log("6. Validando convênio:", dados.convenio);
if (dados.convenio !== 'Particular' && !dados.id_convenio) {
  erros.push("ID do convênio é obrigatório para convênios não particulares");
  console.log("❌ ID Convênio inválido");
} else {
  console.log("✅ Convênio válido");
}

console.log("=== RESULTADO FINAL ===");
console.log("Total de erros:", erros.length);
console.log("Erros encontrados:", erros);
console.log("Validação passou:", erros.length === 0);

// Gerando dados processados
const dadosProcessados = {
  nome_paciente: dados.nome_paciente?.trim().toUpperCase(),
  telefone: dados.telefone,
  email: dados.email?.toLowerCase(),
  data_agendamento: dados.data_agendamento,
  horario: dados.horario,
  dentista: dados.dentista,
  procedimento: dados.procedimento || "Consulta",
  convenio: dados.convenio,
  id_convenio: dados.convenio === 'Particular' ? 'N/A' : dados.id_convenio,
  observacoes: dados.observacoes || "",
  data_criacao: new Date().toISOString(),
  status: "PENDENTE",
  ip_cliente: gerarIpCliente(dados.nome_paciente, dados.id_convenio),
  id_agendamento: gerarIdAgendamento(dados.data_agendamento, dados.horario)
};

// Resultado da validação
const resultado = {
  dados_originais: dados,
  dados_validados: dadosProcessados,
  validacao: {
    valido: erros.length === 0,
    erros: erros,
    total_erros: erros.length
  },
  debug: {
    dados_recebidos: dados,
    timestamp: new Date().toISOString()
  }
};

console.log("=== RETORNANDO ===");
console.log("Resultado final:", JSON.stringify(resultado, null, 2));

return [{ json: resultado }];
