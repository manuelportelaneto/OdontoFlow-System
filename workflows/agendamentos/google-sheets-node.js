// Configuração do Google Sheets Node

// Operation: Append
// Sheet: Agendamentos

// Mapeamento das colunas
{
    "Data/Hora": "={{$json.data_agendamento}} {{$json.horario}}",
    "Paciente": "={{$json.nome_paciente}}",
    "Telefone": "={{$json.telefone}}",
    "Email": "={{$json.email}}",
    "Dentista": "={{$json.dentista}}",
    "Procedimento": "={{$json.procedimento}}",
    "Convênio": "={{$json.convenio}}",
    "ID Convênio": "={{$json.id_convenio}}",
    "Status": "={{$json.status}}",
    "Observações": "={{$json.observacoes}}",
    "Data Criação": "={{$json.data_criacao}}",
    "IP Cliente": "={{$json.ip_cliente}}",
    "ID Agendamento": "={{$json.id_agendamento}}"
}

// Configuração de Resposta
{
    "agendamento": {
        "id": "={{$json.id_agendamento}}",
        "status": "CONFIRMADO",
        "mensagem": "Agendamento realizado com sucesso!",
        "detalhes": {
            "paciente": "={{$json.nome_paciente}}",
            "data": "={{$json.data_agendamento}}",
            "hora": "={{$json.horario}}",
            "dentista": "={{$json.dentista}}",
            "procedimento": "={{$json.procedimento}}"
        }
    }
}
