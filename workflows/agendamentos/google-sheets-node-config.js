// Configuração do Google Sheets Node

/*
Operação: Append
Planilha: OdontoFlow - Sistema de Gestão
Aba: Agendamentos
*/

// Mapeamento das colunas
{
  "Data/Hora": "={{$json.dados_validados.data_agendamento}} {{$json.dados_validados.horario}}",
  "Paciente": "={{$json.dados_validados.nome_paciente}}",
  "Telefone": "={{$json.dados_validados.telefone}}",
  "Email": "={{$json.dados_validados.email}}",
  "Dentista": "={{$json.dados_validados.dentista}}",
  "Procedimento": "={{$json.dados_validados.procedimento}}",
  "Convênio": "={{$json.dados_validados.convenio}}",
  "ID Convênio": "={{$json.dados_validados.id_convenio}}",
  "Status": "={{$json.verificacao_disponibilidade.disponivel ? 'CONFIRMADO' : 'INDISPONÍVEL'}}",
  "Observações": "={{$json.dados_validados.observacoes}}",
  "Data Criação": "={{$json.dados_validados.data_criacao}}",
  "IP Cliente": "={{$json.dados_validados.ip_cliente}}",
  "ID Agendamento": "={{$json.dados_validados.id_agendamento}}",
  "Motivo Status": "={{$json.verificacao_disponibilidade.motivo}}"
}

// Configuração de Resposta
{
  "agendamento": {
    "id": "={{$json.dados_validados.id_agendamento}}",
    "status": "={{$json.verificacao_disponibilidade.disponivel ? 'CONFIRMADO' : 'INDISPONÍVEL'}}",
    "mensagem": "={{$json.verificacao_disponibilidade.disponivel ? 'Agendamento realizado com sucesso!' : 'Não foi possível realizar o agendamento: ' + $json.verificacao_disponibilidade.motivo}}",
    "detalhes": {
      "paciente": "={{$json.dados_validados.nome_paciente}}",
      "data": "={{$json.dados_validados.data_agendamento}}",
      "hora": "={{$json.dados_validados.horario}}",
      "dentista": "={{$json.dados_validados.dentista}}",
      "procedimento": "={{$json.dados_validados.procedimento}}",
      "convenio": "={{$json.dados_validados.convenio}}",
      "id_convenio": "={{$json.dados_validados.id_convenio}}"
    }
  }
}
