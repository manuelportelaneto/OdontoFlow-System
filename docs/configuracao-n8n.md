# Configuração do N8N - OdontoFlow

## 1. Pré-requisitos

1. N8N instalado e rodando
2. Conta Google com APIs habilitadas:
   - Google Calendar API
   - Google Sheets API
3. Credenciais OAuth2 configuradas

## 2. Workflows Necessários

### 2.1 Workflow: "Agendamento Principal"

#### Webhook
- Método: POST
- Path: /agendamento-clinica
- Response Mode: Last Node

#### Code (Validação)
- Usar código existente de validação
- Validar dados do formulário
- Gerar IDs únicos

#### Code (Disponibilidade)
- Usar código existente de disponibilidade
- Verificar horários disponíveis

#### IF
```
Condition: {{$json.verificacao_disponibilidade.disponivel}}

True:
  → Google Sheets
  → Google Calendar
  → Response Success

False:
  → Response Error
```

#### Google Sheets
```json
{
  "operation": "Append Row",
  "sheetName": "Agendamentos",
  "columns": {
    "Data/Hora": "={{$json.dados_validados.data_agendamento}} {{$json.dados_validados.horario}}",
    "Paciente": "={{$json.dados_validados.nome_paciente}}",
    "Telefone": "={{$json.dados_validados.telefone}}",
    "Email": "={{$json.dados_validados.email}}",
    "Dentista": "={{$json.dados_validados.dentista}}",
    "Procedimento": "={{$json.dados_validados.procedimento}}",
    "Convênio": "={{$json.dados_validados.convenio}}",
    "ID Convênio": "={{$json.dados_validados.id_convenio}}",
    "Status": "CONFIRMADO",
    "ID Agendamento": "={{$json.dados_validados.id_agendamento}}"
  }
}
```

#### Google Calendar
```json
{
  "operation": "Create",
  "calendar": "OdontoFlow",
  "event": {
    "summary": "={{$json.dados_validados.procedimento}} - {{$json.dados_validados.nome_paciente}}",
    "description": "Paciente: {{$json.dados_validados.nome_paciente}}\nTelefone: {{$json.dados_validados.telefone}}\nEmail: {{$json.dados_validados.email}}",
    "start": {
      "dateTime": "={{$json.dados_validados.data_agendamento}}T{{$json.dados_validados.horario}}:00",
      "timeZone": "America/Sao_Paulo"
    },
    "end": {
      "dateTime": "={{$json.dados_validados.data_agendamento}}T{{DateTime.add($json.dados_validados.horario, 1, 'hours')}}:00",
      "timeZone": "America/Sao_Paulo"
    }
  }
}
```

### 2.2 Workflow: "Verificar Disponibilidade"

#### Webhook
- Método: POST
- Path: /verificar-disponibilidade
- Response Mode: Last Node

#### Google Calendar
```json
{
  "operation": "Get Events",
  "calendar": "OdontoFlow",
  "timeMin": "={{$json.data}}T00:00:00-03:00",
  "timeMax": "={{$json.data}}T23:59:59-03:00"
}
```

#### Function
```javascript
const eventos = $input.all()[0].json.items;
const horariosOcupados = eventos.map(evento => {
  const inicio = new Date(evento.start.dateTime);
  return inicio.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
});

return {
  json: {
    data: $json.data,
    horarios_ocupados: horariosOcupados,
    eventos: eventos
  }
}
```

### 2.3 Workflow: "Eventos Calendário"

#### Webhook
- Método: GET
- Path: /eventos-calendario
- Response Mode: Last Node

#### Google Calendar
```json
{
  "operation": "Get Events",
  "calendar": "OdontoFlow",
  "timeMin": "={{DateTime.now()}}",
  "timeMax": "={{DateTime.add(DateTime.now(), 3, 'months')}}"
}
```

#### Function
```javascript
const eventos = $input.all()[0].json.items;
return {
  json: eventos.map(evento => ({
    title: evento.summary,
    start: evento.start.dateTime,
    end: evento.end.dateTime
  }))
}
```

## 3. Configuração do Formulário

1. Abrir agendamento-calendar.html
2. Verificar URLs dos webhooks:
   ```javascript
   const WEBHOOK_URLS = {
     agendamento: 'http://localhost:5678/webhook/agendamento-clinica',
     disponibilidade: 'http://localhost:5678/webhook/verificar-disponibilidade',
     calendario: 'http://localhost:5678/webhook/eventos-calendario'
   };
   ```

## 4. Testes

1. Iniciar N8N:
   ```bash
   n8n start
   ```

2. Ativar workflows:
   - Agendamento Principal
   - Verificar Disponibilidade
   - Eventos Calendário

3. Abrir formulário:
   ```bash
   open agendamento-calendar.html
   ```

4. Testar:
   - Visualização do calendário
   - Seleção de data/hora
   - Agendamento completo
   - Sincronização com Google Calendar

## 5. Manutenção

1. Monitorar logs do N8N
2. Verificar sincronização Sheets/Calendar
3. Backup regular dos workflows
4. Atualizar credenciais quando necessário

## 6. Troubleshooting

### Erro de Autenticação
1. Verificar credenciais OAuth2
2. Reautenticar no N8N
3. Verificar permissões das APIs

### Erro de Sincronização
1. Verificar logs do N8N
2. Confirmar formato dos dados
3. Verificar conectividade

### Erro no Formulário
1. Verificar Console do navegador
2. Confirmar URLs dos webhooks
3. Verificar CORS no N8N
