# Guia de Teste: MCP e Google Calendar

## 1. Preparação do Ambiente

### 1.1 N8N
1. Inicie o N8N
2. Crie dois novos workflows:
   - mcp-assistant
   - calendar-sync

### 1.2 Google Calendar
1. Configure as credenciais no Google Cloud Console
2. Crie um calendário "OdontoFlow - Agenda"
3. Configure as permissões de acesso

## 2. Configuração do MCP

### 2.1 Webhook
1. Adicione um Webhook node
   - Method: POST
   - Path: /mcp-assistant
   - Response Mode: Last Node

### 2.2 MCP Agent
1. Adicione um Code node
2. Cole o código de `workflows/agentes/mcp-agent.js`
3. Conecte ao Webhook

### 2.3 Teste do MCP
1. Abra `teste-mcp.html` no navegador
2. Cole a URL do webhook
3. Teste as interações:
   - Agendamento
   - Consulta de horários
   - Perguntas sobre convênios
   - Informações sobre dentistas

## 3. Configuração do Google Calendar

### 3.1 Calendar Node
1. Adicione um Google Calendar node
2. Configure a autenticação OAuth2
3. Cole a configuração de `workflows/calendario/google-calendar-config.js`

### 3.2 Teste do Calendário
1. Faça um agendamento via MCP
2. Verifique a criação do evento
3. Teste as notificações
4. Verifique conflitos de horário

## 4. Cenários de Teste

### 4.1 Agendamento Completo
1. Inicie conversa com MCP
2. Solicite agendamento
3. Forneça informações necessárias
4. Verifique:
   - Evento no Calendar
   - Notificações enviadas
   - Resposta do MCP

### 4.2 Consulta de Disponibilidade
1. Pergunte sobre horários disponíveis
2. Verifique:
   - Consulta ao Calendar
   - Formatação da resposta
   - Sugestões de horários

### 4.3 Reagendamento
1. Solicite mudança de horário
2. Verifique:
   - Atualização no Calendar
   - Notificações
   - Confirmação do MCP

## 5. Verificações de Qualidade

### 5.1 Respostas do MCP
- Naturalidade do diálogo
- Precisão das informações
- Tratamento de erros
- Sugestões contextuais

### 5.2 Integração Calendar
- Precisão dos eventos
- Detalhes corretos
- Notificações funcionando
- Sem conflitos de horário

### 5.3 Performance
- Tempo de resposta do MCP
- Sincronização do Calendar
- Carregamento da interface

## 6. Resolução de Problemas

### 6.1 MCP não responde
1. Verifique N8N rodando
2. Confirme URL do webhook
3. Verifique logs do Code node

### 6.2 Erro no Calendar
1. Verifique credenciais
2. Confirme permissões
3. Verifique formato dos dados

### 6.3 Problemas de Sincronização
1. Verifique conexão internet
2. Confirme tokens OAuth
3. Verifique limites da API

## 7. Próximos Passos

1. Ajustar respostas do MCP
2. Melhorar tratamento de erros
3. Adicionar mais funcionalidades
4. Expandir base de conhecimento
5. Implementar análise de satisfação
