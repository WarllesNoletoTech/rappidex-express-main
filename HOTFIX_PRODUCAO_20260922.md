# Hotfix de produção - 22/09/2026

Este pacote contém o projeto completo com o hotfix aplicado no backend.

Principais correções:
- remove N+1 de `/api/user/motoboys`;
- reduz saturação do pool PostgreSQL;
- mantém a lista de motoboys disponível se a consulta de estatísticas falhar;
- aceita `includeTotal=false` enviado pelo frontend atual;
- evita `COUNT(*)` pesado quando o total não é necessário;
- limita paginação de entregas a 500 itens;
- inclui índices PostgreSQL idempotentes para consultas de motoboys.

Arquivos alterados no backend:
- `src/database/postgres-compat.repository.ts`
- `src/user/user.service.ts`
- `src/delivery/delivery.service.ts`
- `src/delivery/dto/list-deliverys-query.ts`
- `scripts/postgres-schema.sql`

Observação: os índices extras estão no schema, mas para restaurar o serviço primeiro faça o deploy do código. Rode `npm run db:schema` depois, em janela de menor movimento.
