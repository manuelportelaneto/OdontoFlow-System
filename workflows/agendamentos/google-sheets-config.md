# Configuração do Google Sheets Node

## 1. Configurações Básicas
- Operação: Append
- Planilha: OdontoFlow - Sistema de Gestão
- Aba: Agendamentos
- Opções: Create New Row

## 2. Mapeamento das Colunas
Copie e cole no campo "Columns to Send":
```json
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
```

## 3. Configuração da Resposta
Copie e cole no campo "Options > Response Data":
```json
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
```

## 4. Passos para Configuração

1. No N8N, adicione um novo node "Google Sheets"
2. Configure a autenticação com sua conta Google
3. Selecione a operação "Append"
4. Escolha a planilha "OdontoFlow - Sistema de Gestão"
5. Selecione a aba "Agendamentos"
6. Cole o mapeamento das colunas no campo apropriado
7. Em Options, marque "Create New Row"
8. Cole a configuração da resposta no campo "Response Data"
9. Salve e teste o node

## 5. Dicas de Debug

- Verifique se todos os campos estão sendo preenchidos corretamente
- Confirme se o status está sendo atualizado baseado na disponibilidade
- Verifique se o ID do agendamento está sendo gerado corretamente
- Monitore a resposta para garantir que está no formato esperado

## 6. Tratamento de Erros

O node deve ser configurado para:
- Continuar em caso de erro
- Tentar novamente em caso de falha de rede
- Registrar erros no log do N8N
