Guia Mestre: Implementando a Estratégia Híbrida (Tunnel + Access)

O nosso objetivo é criar uma infraestrutura onde seu n8n fica acessível através de uma URL segura e permanente, protegido por uma camada de login profissional.

Fase 1: Diagnóstico e Estabelecimento da Conexão Base (Cloudflare Tunnel)

O objetivo desta fase é fazer o status do túnel mudar de INATIVO para HEALTHY.

Passo 1.1: Desativação Temporária do Firewall do Windows (O Teste de Isolamento)

Pressione a tecla Windows e digite Firewall.

Clique em "Segurança do Windows" e depois em "Firewall e proteção de rede".

Você verá três tipos de rede: Rede do domínio, Rede privada e Rede pública.

Clique em "Rede privada". Na nova tela, encontre o botão de alternância do "Firewall do Microsoft Defender" e desative-o.

Volte e faça o mesmo para a "Rede pública".

(Importante) Desative o Antivírus de Terceiros: Se você usa um antivírus como Avast, Norton, McAfee, etc., encontre o ícone dele na bandeja do sistema (perto do relógio), clique com o botão direito e procure uma opção como "Controle de Módulos" ou "Desativar proteção temporariamente". Escolha desativar por 10 ou 15 minutos.

Passo 1.2: Reinstalação Limpa do Túnel

Garanta que você já deletou todos os túneis antigos e os registros de DNS (CNAME) relacionados no painel da Cloudflare.

Siga os passos de reinstalação do túnel que fizemos antes:

Crie um novo túnel na Cloudflare (ex: odontoflow-producao).

Copie o NOVO TOKEN.

Configure o Public Hostname para n8n.odontoflow.cloudmatrix.com.br apontando para http://host.docker.internal:5678.

Atualize a linha command: no seu docker-compose.yml com o novo token.

Atualize a WEBHOOK_URL no seu .env e as URLs no seu script.js com a nova URL https://api-odontoflow.cloudmatrix.com.br/.

Passo 1.3: Inicie o Ambiente e Verifique (O Momento da Verdade)

No seu terminal, recrie os containers: docker-compose down && docker-compose up -d.

Verifique os logs: docker-compose logs cloudflared. Os erros de context canceled devem ter desaparecido.

Verifique o painel da Cloudflare: O status do seu túnel deve mudar para HEALTHY.

Teste o acesso: Acesse https://api-odontoflow.cloudmatrix.com.br. A interface do n8n deve carregar.

Se o n8n carregar, VITÓRIA! A causa era o firewall. Agora podemos reativá-lo e criar as regras de exceção.

Fase 2: Protegendo o Acesso ao n8n (Cloudflare Access)

Agora que a "estrada" está aberta, vamos colocar o "portão de segurança".

Passo 2.1: Crie a Aplicação de Acesso

No painel Zero Trust da Cloudflare, vá para Access -> Applications.

Clique em + Add an application.

Selecione a opção Self-hosted.

Configure a aplicação:

Application name: Painel n8n OdontoFlow.

Session Duration: Deixe o padrão (ex: 24 hours).

Na seção "Application domain":

Domain: Selecione odontoflow.cloudmatrix.com.br.

Subdomain: n8n.

Role para baixo e clique em Next.

Passo 2.2: Crie a Política de Acesso (Quem Pode Entrar)

Policy name: Acesso Administrador.

Action: Allow.

Configure uma regra: Aqui definimos quem tem permissão.

Selector: Emails.

Value: Digite o seu e-mail de administrador (ex: manuelpnforce@gmail.com).

Clique em Next, depois em Add application.

Resultado Imediato: Agora, se você tentar acessar https://api-odontoflow.cloudmatrix.com.br, você não verá mais a tela do n8n. Em vez disso, você verá uma tela de login da Cloudflare. Ao inserir seu e-mail, a Cloudflare te enviará um código de acesso único. Após inseri-lo, você será redirecionado para o n8n. Seu n8n agora está protegido!

Fase 3: Permitindo o Acesso da API (Painel -> n8n)

Seu painel React agora também será bloqueado. Precisamos criar uma "chave de serviço" para que ele possa passar pelo portão sem login humano.

Passo 3.1: Crie as "Service Tokens"

No painel Zero Trust, vá para Access -> Service Auth -> Service Tokens.

Clique em Create Service Token.

Token Name: API-Painel-OdontoFlow.

Clique em Generate token.

A Cloudflare mostrará um Client ID e um Client Secret. Copie ambos e guarde-os em um local seguro. O Client Secret só é mostrado uma vez.

Passo 3.2: Crie uma Política de Acesso para a API

Volte para Access -> Applications e edite sua aplicação Painel n8n OdontoFlow.

Clique em Add a policy.

Configure a nova política:

Policy name: Acesso API do Painel.

Action: Service Auth (ou Bypass em algumas interfaces).

Configure uma regra:

Selector: Service Token.

Value: Selecione o token API-Painel-OdontoFlow que você acabou de criar.

Clique em Add policy.

Passo 3.3: Atualize o script.js para Usar a Chave

No seu código React (ou script.js), modifique suas funções fetch.

Você precisará adicionar os headers de serviço a cada chamada para o n8n.

Generated javascript
// Exemplo na função handleSubmit
const res = await fetch(AGENDAMENTO_WEBHOOK_URL, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': 'SEU_CLIENT_ID_AQUI',
        'CF-Access-Client-Secret': 'SEU_CLIENT_SECRET_AQUI'
    },
    body: JSON.stringify(data),
});


(Faça o mesmo para a chamada fetch no handleConfirmation).

Com isso, seu sistema estará completo: acessível, protegido para humanos com login e acessível para sua API com chaves de serviço. É a arquitetura mais segura e profissional possível.