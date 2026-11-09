RAPPIDEX V17 — GERENCIAR BAIRROS RESPONSIVO (FRONTEND)

Objetivo
- Melhorar o uso da tela Cidades > Gerenciar bairros nos celulares Android.
- Manter o tema escuro/amarelo Rappidex e preservar a lógica da V16.

Mudanças
- Bairros apresentados em cartões adaptáveis com nome, situação e ações claras.
- Botões de editar, ativar/desativar e excluir com área de toque maior.
- Editor de nome do bairro com ações de salvar/cancelar adaptáveis.
- Importação CSV e cadastro manual com controles ocupando a largura útil no celular.
- Busca por nome no cadastro central de bairros.
- Na configuração de cada loja, tabela de taxa integral e repasse do motoboy em cartões.
- Campos 'Entrega R$' e 'Motoboy R$' lado a lado no celular; busca por nome do bairro.
- Registros de outras lojas e bairros não são modificados; filtro só muda a visualização.
- Pedidos pendentes de tarifa também usam controles responsivos.

Como instalar — opção hotfix
1. Faça backup do frontend da V16 (ou versão corrente confirmada).
2. Copie os quatro arquivos da correção mantendo os caminhos no repositório rappidexexpress-front.
3. Faça commit e execute o build na Vercel.
4. Teste com usuário admin/superadmin nos celulares antes de liberar.

Não precisa alterar o backend do Heroku.

Testes locais feitos
- Transpilação sintática isolada dos dois TSX: aprovada.
- Parse das duas folhas CSS: sem erros.
- Simulação estática de layout em Chromium: 320, 360, 390, 768 e 1280 px, sem overflow horizontal.

Não realizado
- npm ci / npm run build completo (dependências do projeto indisponíveis no ambiente).
- Navegação autenticada no sistema real, com MongoDB, celulares Android ou Vercel.

Roteiro de homologação
1. Em Cidades > Gerenciar bairros, testar 1 e 70+ bairros.
2. Buscar bairro, renomear, ativar/desativar e cancelar edição.
3. Importar CSV com nomes; garantir que não altera taxas de outra loja.
4. Selecionar loja, filtrar bairro, mudar entrega/repasse e salvar.
5. Recarregar para confirmar persistência de alterações e ausência de mudanças indevidas.
6. Testar resoluções de 320 a 430 px e desktop.

Esta versão é para homologação, não foi validada em produção.
