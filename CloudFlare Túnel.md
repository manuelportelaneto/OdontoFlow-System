Excelente escolha! Configurar o Cloudflare Tunnel é o passo definitivo para profissionalizar a infraestrutura do seu projeto OdontoFlow.

Vamos fazer isso juntos, passo a passo. O processo parece complexo, mas é bastante lógico.

---

### **Pré-requisitos**

1.  **Conta na Cloudflare:** Você precisa de uma conta gratuita na Cloudflare. Se não tiver, crie uma em [dash.cloudflare.com](https://dash.cloudflare.com/).
2.  **Seu Domínio:** Seu domínio (`cloudmatrix.com.br`) precisa estar com os **nameservers apontados para a Cloudflare**. A Hostinger tem tutoriais fáceis sobre como fazer isso. Basicamente, você copia os nameservers que a Cloudflare te dá e cola nas configurações de DNS do seu domínio na Hostinger.

Assumindo que seu domínio já está gerenciado pela Cloudflare, vamos começar.

---

### **Fase 1: Criando o Túnel no Painel da Cloudflare**

Primeiro, vamos criar o "túnel" no painel da Cloudflare e obter a chave secreta que o conectará ao seu Docker.

1.  **Acesse o Painel da Cloudflare:** Faça login em [dash.cloudflare.com](https://dash.cloudflare.com/).
2.  No menu à esquerda, clique em **`Zero Trust`**. (Na primeira vez, ele pode pedir para você configurar um "plano", escolha o plano **Free**).
3.  Dentro do painel `Zero Trust`, no menu à esquerda, vá para **`Access` > `Tunnels`**.
4.  Clique no botão **`+ Create a tunnel`**.
5.  **Nome do Túnel:** Dê um nome para identificar a conexão. Ex: `n8n-odontoflow-local`. Clique em **`Save tunnel`**.
6.  **Instalação do Conector:** A Cloudflare mostrará várias opções (Windows, Mac, Docker). **IGNORE TODAS ELAS.** Nós vamos usar o Docker Compose, que é mais fácil. O que precisamos desta tela é o **Token do Conector**.
7.  Você verá um comando de exemplo para Docker, algo como: `docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token SEU_TOKEN_LONGO_E_SECRETO`.
8.  **AÇÃO:** **Copie apenas o token** (a sequência longa e secreta de letras e números). Guarde-o em um bloco de notas. Este é o nosso "segredo".
9.  Clique em **`Next`**.

10. **Configuração da Rota Pública:** Agora vamos dizer à Cloudflare qual subdomínio deve apontar para o nosso túnel.
    *   **Subdomain:** Digite o nome que você quer. Ex: `n8n-odontoflow`.
    *   **Domain:** Selecione seu domínio `cloudmatrix.com.br`. A URL final será `n8n-odontoflow.cloudmatrix.com.br`.
    *   **Service -> Type:** Selecione `HTTP`.
    *   **Service -> URL:** Digite `localhost:5678`.
    *   **AÇÃO CRUCIAL:** Abaixo, clique em **`+ Add a public hostname`** para adicionar mais configurações. Em **`Additional application settings` -> `TLS`**, ative a opção **`No TLS Verify`**. Isso é necessário porque nosso n8n rodando localmente não tem um certificado SSL, e esta opção diz à Cloudflare para não se preocupar com isso.
11. Clique em **`Save tunnel`**.

O seu túnel agora está criado na Cloudflare. Ele está "esperando" por uma conexão vinda do seu lado.

---

### **Fase 2: Conectando o Túnel ao seu n8n com Docker Compose**

Agora, vamos dizer ao Docker para iniciar um segundo container, o "conector" do Cloudflare, que usará o token que pegamos para estabelecer a ponte.

1.  **Abra seu arquivo `docker-compose.yml`**.
2.  Vamos adicionar um **novo serviço** chamado `cloudflared` ao arquivo.

**Copie e cole este conteúdo completo, substituindo o seu `docker-compose.yml` antigo:**

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    env_file:
      - .env
    volumes:
      - ./n8n_data:/home/node/.n8n

  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: always
    command: tunnel --no-autoupdate run --token SEU_TOKEN_LONGO_E_SECRETO
    depends_on:
      - n8n
```

**AÇÃO CRUCIAL:**
*   Substitua o texto `SEU_TOKEN_LONGO_E_SECRETO` pelo **token real** que você copiou do painel da Cloudflare no Passo 8.

**O que este novo serviço faz?**
*   `image: cloudflare/cloudflared:latest`: Puxa a imagem oficial do conector da Cloudflare.
*   `command: ...`: Executa o comando para iniciar o túnel, usando o seu token secreto.
*   `depends_on: - n8n`: Garante que o container do n8n seja iniciado **antes** do conector do túnel.

---

### **Fase 3: Atualizações Finais e Lançamento**

1.  **Atualize o Arquivo `.env`:**
    *   Abra seu arquivo `.env`.
    *   Na variável `WEBHOOK_URL`, coloque a sua **nova URL pública e permanente** da Cloudflare.
        `WEBHOOK_URL=https://n8n-odontoflow.cloudmatrix.com.br/`
    *   Na variável `N8N_CORS_ALLOWED_ORIGINS`, adicione também o seu subdomínio do n8n para permitir a comunicação.

2.  **Atualize o `script.js`:**
    *   No seu site, atualize as variáveis `AGENDAMENTO_WEBHOOK_URL` e `RECEPCIONISTA_WEBHOOK_URL` com a sua nova URL permanente da Cloudflare. Faça o upload para a Hostinger.

3.  **Inicie o Novo Ambiente:**
    *   No seu terminal, execute:
        ```bash
        docker-compose down
        docker-compose up -d
        ```

O Docker agora iniciará **dois** containers: `n8n` e `cloudflared`. O conector estabelecerá a conexão, e sua URL `https://n8n-odontoflow.cloudmatrix.com.br` estará online e apontando diretamente para o seu n8n, de forma segura e estável, sem precisar do ngrok.

**Parabéns!** Você acabou de implementar uma infraestrutura de nível profissional.