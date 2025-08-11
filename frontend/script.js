document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO DAS SUAS CHAVES E URLs ---
    
    // Cole as suas chaves de serviço da Cloudflare aqui
    const CF_CLIENT_ID = 'e58a227147709a2487e87f470f73b844.access';
    const CF_CLIENT_SECRET = '2aa65d08336c268a0b0865c48c3adf8b1126166606f226cd3ceef372992dd5b0';

    // URLs permanentes do seu n8n
    const AGENDAMENTO_WEBHOOK_URL = 'https://api-odontoflow.cloudmatrix.com.br/webhook/agendamento-clinica';
    const RECEPCIONISTA_WEBHOOK_URL = 'https://api-odontoflow.cloudmatrix.com.br/webhook/confirmacao';


    const agendamentoForm = document.getElementById('agendamentoForm');
    const confirmationArea = document.getElementById('confirmation-area');
    const responseMessageDiv = document.getElementById('responseMessage');
    const loaderOverlay = document.getElementById('loader-overlay');

    const showLoader = () => { if (loaderOverlay) loaderOverlay.style.display = 'flex'; };
    const hideLoader = () => { if (loaderOverlay) loaderOverlay.style.display = 'none'; };

    // Lógica para a página de agendamento (index.html)
    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoader();
            responseMessageDiv.textContent = '';
            try {
                const formData = new FormData(agendamentoForm);
                const data = Object.fromEntries(formData.entries());
                
                const response = await fetch(AGENDAMENTO_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        // CORREÇÃO: Usando as chaves diretamente
                        'CF-Access-Client-Id': CF_CLIENT_ID,
                        'CF-Access-Client-Secret': CF_CLIENT_SECRET
                    },
                    body: JSON.stringify(data),
                 });

                if (!response.ok) throw new Error('Falha no servidor.');

                responseMessageDiv.textContent = 'Agendamento realizado com sucesso!';
                responseMessageDiv.className = 'success';
                agendamentoForm.reset();

            } catch (error) { 
                responseMessageDiv.textContent = 'Erro ao agendar. Tente novamente.';
                responseMessageDiv.className = 'error';
            } finally {
                hideLoader();
            }
        });
    }

    // Lógica para a página de confirmação (confirmacao.html)
    if (confirmationArea) {
        const params = new URLSearchParams(window.location.search);
        const idAgendamento = params.get('id_agendamento');

        if (!idAgendamento) {
            confirmationArea.innerHTML = '<h1>Erro</h1><p>ID de agendamento não encontrado.</p>';
            return;
        }

        const confirmBtn = document.querySelector('.button.confirm');
        const cancelBtn = document.querySelector('.button.cancel');

        confirmBtn.addEventListener('click', () => handleConfirmation('confirmar', idAgendamento));
        cancelBtn.addEventListener('click', () => handleConfirmation('cancelar', idAgendamento));
    }

    async function handleConfirmation(acao, id) {
        const fullUrl = `${RECEPCIONISTA_WEBHOOK_URL}?acao=${acao}&id_agendamento=${id}`;
        
        showLoader();

        try {
            const response = await fetch(fullUrl, { 
                method: 'GET',
                // CORREÇÃO: Adicionando os cabeçalhos de serviço
                headers: {
                    'CF-Access-Client-Id': CF_CLIENT_ID,
                    'CF-Access-Client-Secret': CF_CLIENT_SECRET
                }
            });
            
            if (!response.ok) {
                console.error('Erro do servidor n8n:', response.status, await response.text());
                throw new Error(`O servidor respondeu com um erro: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'confirmado') {
                window.location.href = 'sucesso.html';
            } else if (data.status === 'cancelado') {
                window.location.href = 'cancelado.html';
            } else {
                throw new Error('Resposta inesperada do servidor n8n.');
            }

        } catch (error) {
            hideLoader();
            console.error('Falha na requisição ou processamento:', error);
            document.querySelector('.container').innerHTML = '<h1>Erro de Comunicação</h1><p>Não foi possível processar sua solicitação. Por favor, verifique sua conexão ou contate a clínica.</p>';
        }
    }
});