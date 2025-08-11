// Validação e processamento dos dados do agendamento
const dados = $input.first().json;

// Função para validar telefone brasileiro
function validarTelefone(telefone) {
  const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return regex.test(telefone);
}

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para validar data (não pode ser no passado)
function validarData(data) {
  const hoje = new Date();
  const dataAgendamento = new Date(data);
  return dataAgendamento >= hoje;
}

// Função para gerar IP cliente
function gerarIpCliente(nome, idConvenio) {
  return (nome + idConvenio).replace(/\s+/g, '').toUpperCase();
}

// Função para gerar ID do agendamento
function gerarIdAgendamento(data, hora) {
  const timestamp = new Date().getTime();
  const dataFormatada = data.replace(/-/g, '');
  const horaFormatada = hora.replace(/:/g, '');
  return `AGD-${dataFormatada}-${horaFormatada}-${timestamp}`;
}

// Validações
const erros = [];

if (!dados.nome_paciente || dados.nome_paciente.length < 2) {
  erros.push("Nome do paciente é obrigatório (mínimo 2 caracteres)");
}

if (!validarTelefone(dados.telefone)) {
  erros.push("Telefone deve estar no formato (11) 99999-9999");
}

if (!validarEmail(dados.email)) {
  erros.push("Email inválido");
}

if (!validarData(dados.data_agendamento)) {
  erros.push("Data do agendamento não pode ser no passado");
}

if (!dados.dentista) {
  erros.push("Dentista é obrigatório");
}

// Validação do convênio
if (dados.convenio !== 'Particular' && !dados.id_convenio) {
  erros.push("ID do convênio é obrigatório para convênios não particulares");
}

// Processamento dos dados validados
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
  ip_cliente: gerarIpCliente(dados.nome_paciente, dados.id_convenio || ''),
  id_agendamento: gerarIdAgendamento(dados.data_agendamento, dados.horario)
};

// Resultado da validação
return [{
  json: {
    dados_originais: dados,
    dados_validados: dadosProcessados,
    validacao: {
      valido: erros.length === 0,
      erros: erros,
      total_erros: erros.length
    }
  }
}];
