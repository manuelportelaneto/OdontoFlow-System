# Integração Completa: OdontoFlow

## 1. Componentes do Sistema

### 1.1 Agendamentos
- Formulário Web
- Validação de dados
- Verificação de disponibilidade
- Registro no Google Sheets

### 1.2 MCP (Master Control Program)
- Processamento de linguagem natural
- Respostas automáticas
- Auxílio em agendamentos
- Consulta de informações

### 1.3 Google Calendar
- Sincronização de agenda
- Notificações automáticas
- Gestão de conflitos
- Visualização de horários

## 2. Workflow de Integração

### 2.1 Webhook Principal (/agendamento-clinica)
```
[Formulário Web] → [Validação] → [Disponibilidade] → [IF]
                                                     ├─ [True] → [Google Sheets]
                                                     │           [Google Calendar]
                                                     │           [Response Success]
                                                     └─ [False] → [Response Error]
```

### 2.2 Webhook MCP (/mcp-assistant)
```
[Chat Interface] → [MCP Agent] → [Switch Intent]
                                 ├─ [agendar] → [Workflow Agendamento]
                                 ├─ [consultar] → [Google Calendar Query]
                                 ├─ [reagendar] → [Workflow Reagendamento]
                                 └─ [outros] → [Resposta Direta]
```

## 3. Configuração no N8N

### 3.1 Novo Workflow "MCP Assistant"
1. Webhook
   - Method: POST
   - Path: /mcp-assistant
   - Response Mode: Last Node

2. Code (MCP Agent)
   - Usar código de: mcp-agent.js
   - Processa a mensagem do usuário

3. Switch
   - Value: $json.processamento.intencao_identificada
   - Cases:
     - agendar: → Sub-workflow Agendamento
     - consultar: → Google Calendar Query
     - reagendar: → Sub-workflow Reagendamento
     - Default: → Resposta Direta

4. Google Calendar Query (quando necessário)
   - Usar configuração de: google-calendar-config.js
   - Consulta eventos/disponibilidade

5. Respond to Webhook
   ```json
   {
     "success": true,
     "response": {
       "message": "={{$json.resposta.resposta}}",
       "details": "={{$json.resposta.detalhes}}",
       "suggestions": "={{$json.resposta.sugestoes}}",
       "calendar": "={{$json.calendario || null}}"
     }
   }
   ```

## 4. Integrações Adicionais

### 4.1 Notificações
- Email para paciente
- WhatsApp para confirmação
- Lembretes automáticos

### 4.2 Google Calendar
- Cores por tipo de procedimento
- Descrições detalhadas
- Convites automáticos

### 4.3 Respostas do MCP
- Personalizadas por contexto
- Sugestões inteligentes
- Histórico de interações

## 5. Testes de Integração

### 5.1 Cenários de Teste
1. Agendamento via MCP
2. Consulta de horários
3. Reagendamento
4. Cancelamento
5. Perguntas frequentes

### 5.2 Verificações
- Sincronização Calendar/Sheets
- Respostas do MCP
- Notificações
- Conflitos de horário

## 6. Manutenção

### 6.1 Monitoramento
- Logs do N8N
- Erros do MCP
- Sincronização Calendar
- Performance geral

### 6.2 Backup
- Workflows N8N
- Dados Google Sheets
- Configurações MCP
- Eventos Calendar

## 7. Próximos Passos

1. Implementar machine learning para melhorar respostas do MCP
2. Adicionar análise de sentimento
3. Expandir base de conhecimento
4. Implementar chatbot visual
5. Adicionar mais integrações (ex: prontuário eletrônico)
