# Hotfix produção PostgreSQL - 22/09/2026 (v2)

Correções aplicadas para o incidente de saturação do pool PostgreSQL:

- `/api/user/motoboys` agora retorna somente `id` e `name` (dados realmente usados nos selects), eliminando leituras do histórico de entregas a cada 30s por dashboard.
- `/api/delivery/counts` passou de quatro `COUNT(*)` paralelos para uma única agregação SQL com `FILTER`, seguida de uma leitura pequena da cidade.
- Falha temporária no contador não derruba o Dashboard com HTTP 500; retorna contadores zerados e mantém a operação disponível.
- Mantido suporte a `includeTotal=false` e limite de paginação de 500.
- Adicionados índices idempotentes adicionais para cidade/status/data.
- Não altera iFood, Menu Flow, autenticação, status nem dados existentes.

Em emergência, publicar primeiro o código. Depois de estabilizar, executar `npm run db:schema` em janela de menor movimento para garantir os novos índices.
