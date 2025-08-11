# Workflow Completo: Sistema de Agendamentos OdontoFlow

## Estrutura do Workflow

1. Webhook (Entrada)
   - Method: POST
   - Path: /agendamento-clinica
   - Response Mode: Last Node

2. Code (Validação)
   - Usar código de: code-node-validacao-debug-fix.js
   - Valida dados e gera IDs

3. Code (Verificação de Disponibilidade)
   - Usar código de: code-node-disponibilidade-funcional.js
   - Verifica horários disponíveis

4. IF (Disponibilidade)
   - Condition: $json.verificacao_disponibilidade.disponivel
   
   True (Disponível):
   → Google Sheets (Salvar)
   → Respond to Webhook (Sucesso)
   
   False (Indisponível):
   → Respond to Webhook (Erro)

5. Google Sheets (Salvar Agendamento)
   - Usar configuração de: google-sheets-config.md
   - Salva dados na planilha

6. Respond to Webhook
   - Success Response (200):
   ```json
   {
     "success": true,
     "agendamento": {
       "id": "={{$json.dados_validados.id_agendamento}}",
       "status": "CONFIRMADO",
       "mensagem": "Agendamento realizado com sucesso!",
       "detalhes": "={{$json.agendamento.detalhes}}"
     }
   }
   ```
   
   - Error Response (400):
   ```json
   {
     "success": false,
     "error": {
       "message": "={{$json.verificacao_disponibilidade.motivo}}",
       "details": {
         "status": "INDISPONÍVEL",
         "motivo": "={{$json.verificacao_disponibilidade.motivo}}",
         "horarios_disponiveis": "={{$json.verificacao_disponibilidade.debug.funcionamento}}"
       }
     }
   }
   ```

## Fluxo de Dados

```
[Webhook] → [Validação] → [Verificação] → [IF]
                                          ├─ [True] → [Google Sheets] → [Response Success]
                                          └─ [False] → [Response Error]
```

## Configuração do Workflow

1. Criar novo workflow no N8N
2. Adicionar e configurar cada node conforme descrito
3. Conectar os nodes seguindo o fluxo
4. Ativar o workflow
5. Testar com o formulário HTML

## Testes Recomendados

1. Agendamento em horário disponível
2. Agendamento em horário ocupado
3. Agendamento fora do horário
4. Agendamento no horário de almoço
5. Agendamento com convênio
6. Agendamento particular

## Monitoramento

- Verificar logs do N8N
- Monitorar planilha do Google Sheets
- Verificar respostas do webhook
