@echo off
color 0A
echo ===============================================
echo        OdontoFlow - Sistema Odontologico
echo             Powered by N8N
echo ===============================================
echo.
echo [INFO] Verificando configuracoes...
echo [INFO] Iniciando sistema de automacao...
echo.

set NODE_ENV=production
npx n8n start

echo.
echo [SUCESSO] OdontoFlow iniciado!
echo [INFO] Acesse: http://localhost:5678
echo [INFO] Usuario: clinica_admin
echo.
pause