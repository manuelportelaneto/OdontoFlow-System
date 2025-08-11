# Configuração do Google Sheets para OdontoFlow

## 1. Estrutura da Planilha

### Aba: Agendamentos
Colunas:
- Data/Hora
- Paciente
- Telefone
- Email
- Dentista
- Procedimento
- Convênio
- ID Convênio
- Status
- Observações
- Data Criação
- IP Cliente
- ID Agendamento

### Aba: Prontuários
(A ser configurado)

### Aba: Financeiro
(A ser configurado)

### Aba: Dentistas
(A ser configurado)

### Aba: Dashboard
(A ser configurado)

## 2. Configuração no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto: "OdontoFlow"
3. Ative a API do Google Sheets
4. Crie credenciais OAuth2
5. Configure as URIs de redirecionamento autorizadas:
   - http://localhost:5678/oauth2/callback
   - http://127.0.0.1:5678/oauth2/callback

## 3. Configuração no N8N

1. Vá em Settings > Credentials
2. Clique em "Create New Credentials"
3. Selecione "Google Sheets OAuth2 API"
4. Preencha com as credenciais do Google Cloud Console:
   - Client ID
   - Client Secret
5. Salve e autorize o acesso

## 4. IDs das Planilhas

Depois de criar a planilha no Google Sheets, copie o ID da URL:
https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit

## 5. Teste de Integração

1. Use o formulário de teste (teste-agendamento.html)
2. Verifique se os dados aparecem na planilha
3. Confirme que todas as colunas estão sendo preenchidas corretamente

## 6. Manutenção

- Faça backup regular da planilha
- Monitore o uso da API (limites do Google)
- Mantenha as credenciais seguras
