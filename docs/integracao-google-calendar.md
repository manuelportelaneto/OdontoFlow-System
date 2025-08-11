# Integração Google Calendar - OdontoFlow

## 1. Configuração no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto: "OdontoFlow"
3. Ative as APIs:
   - Google Calendar API
   - Google Sheets API
4. Configure as credenciais OAuth2:
   - Tipo: Aplicativo Web
   - Nome: "OdontoFlow N8N"
   - URIs de redirecionamento autorizadas:
     - http://localhost:5678/oauth2/callback
     - http://127.0.0.1:5678/oauth2/callback
5. Anote o Client ID e Client Secret

## 2. Configuração no N8N

### 2.1 Workflow "Sync Agendamentos"

1. Trigger: Google Sheets
   - Operation: Watch Updates
   - Spreadsheet: OdontoFlow
   - Sheet: Agendamentos
   - Watch Field: ID Agendamento

2. Google Calendar
   - Operation: Create Calendar Event
   - Calendar: OdontoFlow
   - Event:
     ```json
     {
       "summary": "{{$node.Sheets.json.Procedimento}} - {{$node.Sheets.json.Paciente}}",
       "description": "Paciente: {{$node.Sheets.json.Paciente}}\nTelefone: {{$node.Sheets.json.Telefone}}\nEmail: {{$node.Sheets.json.Email}}\nConvênio: {{$node.Sheets.json.Convenio}}\nID Convênio: {{$node.Sheets.json['ID Convenio']}}\nObservações: {{$node.Sheets.json.Observacoes}}",
       "start": {
         "dateTime": "{{$node.Sheets.json['Data/Hora']}}",
         "timeZone": "America/Sao_Paulo"
       },
       "end": {
         "dateTime": "{{DateTime.add($node.Sheets.json['Data/Hora'], 1, 'hours')}}",
         "timeZone": "America/Sao_Paulo"
       },
       "attendees": [
         {
           "email": "{{$node.Sheets.json.Email}}"
         }
       ],
       "reminders": {
         "useDefault": false,
         "overrides": [
           {
             "method": "email",
             "minutes": 1440
           },
           {
             "method": "popup",
             "minutes": 60
           }
         ]
       }
     }
     ```

### 2.2 Workflow "Verificar Disponibilidade"

1. Trigger: Webhook
   - Method: POST
   - Path: /verificar-disponibilidade

2. Google Calendar
   - Operation: Get Events
   - Calendar: OdontoFlow
   - Options:
     - timeMin: {{$json.data}}T00:00:00-03:00
     - timeMax: {{$json.data}}T23:59:59-03:00

3. Function
   - Code:
     ```javascript
     // Processar horários ocupados
     const eventos = $input.all()[0].json.items;
     const horariosOcupados = eventos.map(evento => {
       const inicio = new Date(evento.start.dateTime);
       return inicio.toLocaleTimeString('pt-BR', {
         hour: '2-digit',
         minute: '2-digit',
         hour12: false
       });
     });

     // Retornar horários disponíveis
     return {
       json: {
         data: $json.data,
         horarios_ocupados: horariosOcupados,
         eventos: eventos
       }
     };
     ```

## 3. Prompt para Agente de IA

```
Você é o assistente virtual da clínica OdontoFlow. Suas responsabilidades são:

1. Agendamentos
- Verificar disponibilidade de horários
- Auxiliar no processo de agendamento
- Confirmar dados do paciente
- Informar sobre documentos necessários

2. Informações
- Horário de funcionamento
- Convênios aceitos
- Equipe de dentistas
- Procedimentos realizados
- Localização e contato

3. Atendimento
- Responder de forma cordial e profissional
- Usar linguagem clara e acessível
- Manter tom amigável mas formal
- Seguir protocolo da clínica

4. Regras importantes
- Horário: 8h às 18h (seg-sex), 8h às 12h (sáb)
- Intervalo almoço: 12h às 13h
- Agendamentos com 24h antecedência
- Remarcações até 4h antes
- Documentos: RG, CPF, carteirinha convênio

5. Respostas padrão
- Saudação: "Olá! Como posso ajudar?"
- Despedida: "Estou à disposição!"
- Dúvida: "Poderia esclarecer melhor?"

6. Fluxo de agendamento
- Coletar: nome, telefone, email
- Verificar: data, horário, convênio
- Confirmar: dados e disponibilidade
- Informar: protocolo e instruções

7. Tratamento de erros
- Horário indisponível: sugerir alternativas
- Dados incompletos: solicitar complemento
- Fora do horário: informar regras
- Erro sistema: encaminhar atendente

Use estas diretrizes para fornecer atendimento eficiente e profissional.
```

## 4. Próximos Passos

1. Configurar webhooks no N8N
2. Testar sincronização Sheets → Calendar
3. Implementar verificação de disponibilidade
4. Treinar agente de IA
5. Monitorar e ajustar conforme necessário
