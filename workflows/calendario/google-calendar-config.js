// Configuração do Google Calendar Node

/*
Operação: Create Calendar Event
Calendário: OdontoFlow - Agenda
*/

// Mapeamento para criação de eventos
{
    "title": "={{$json.dados_validados.procedimento}} - {{$json.dados_validados.nome_paciente}}",
    "description": `
Agendamento OdontoFlow

Paciente: {{$json.dados_validados.nome_paciente}}
Telefone: {{$json.dados_validados.telefone}}
Email: {{$json.dados_validados.email}}
Procedimento: {{$json.dados_validados.procedimento}}
Convênio: {{$json.dados_validados.convenio}}
ID Convênio: {{$json.dados_validados.id_convenio}}
Observações: {{$json.dados_validados.observacoes}}

ID Agendamento: {{$json.dados_validados.id_agendamento}}
    `,
    "start": {
        "date": "={{$json.dados_validados.data_agendamento}}",
        "time": "={{$json.dados_validados.horario}}",
        "timezone": "America/Sao_Paulo"
    },
    "end": {
        "date": "={{$json.dados_validados.data_agendamento}}",
        "time": "={{
            // Calcular horário de término baseado no procedimento
            const horarioInicio = $json.dados_validados.horario;
            const [hora, minuto] = horarioInicio.split(':').map(Number);
            
            // Duração em minutos por procedimento
            const duracoes = {
                'Consulta': 30,
                'Limpeza': 60,
                'Obturação': 60,
                'Extração': 45,
                'Canal': 90,
                'Ortodontia': 45
            };
            
            // Pegar duração do procedimento ou 30 minutos como padrão
            const duracao = duracoes[$json.dados_validados.procedimento] || 30;
            
            // Calcular horário de término
            let novoMinuto = minuto + duracao;
            let novaHora = hora + Math.floor(novoMinuto / 60);
            novoMinuto = novoMinuto % 60;
            
            // Formatar horário
            return `${String(novaHora).padStart(2, '0')}:${String(novoMinuto).padStart(2, '0')}`;
        }}",
        "timezone": "America/Sao_Paulo"
    },
    "location": "Clínica OdontoFlow",
    "attendees": [
        {
            "email": "={{$json.dados_validados.email}}",
            "comment": "Paciente"
        },
        {
            // Email do dentista baseado no nome
            "email": "={{
                const dentistas = {
                    'Dr. Maria Santos': 'maria.santos@odontoflow.com.br',
                    'Dr. João Oliveira': 'joao.oliveira@odontoflow.com.br',
                    'Dra. Ana Costa': 'ana.costa@odontoflow.com.br'
                };
                return dentistas[$json.dados_validados.dentista] || 'admin@odontoflow.com.br';
            }}",
            "comment": "Dentista"
        }
    ],
    "reminders": {
        "useDefault": false,
        "overrides": [
            {
                "method": "email",
                "minutes": 1440  // 24 horas antes
            },
            {
                "method": "popup",
                "minutes": 60    // 1 hora antes
            }
        ]
    },
    "colorId": "={{
        // Cores diferentes para cada tipo de procedimento
        const cores = {
            'Consulta': '1',     // Azul
            'Limpeza': '2',      // Verde
            'Obturação': '3',    // Roxo
            'Extração': '4',     // Vermelho
            'Canal': '5',        // Amarelo
            'Ortodontia': '6'    // Laranja
        };
        return cores[$json.dados_validados.procedimento] || '1';
    }}"
}

// Configuração de Resposta
{
    "calendario": {
        "evento_id": "={{$json.id}}",
        "link": "={{$json.htmlLink}}",
        "status": "={{$json.status}}",
        "detalhes": {
            "inicio": "={{$json.start.dateTime}}",
            "fim": "={{$json.end.dateTime}}",
            "participantes": "={{$json.attendees.length}}"
        }
    }
}
