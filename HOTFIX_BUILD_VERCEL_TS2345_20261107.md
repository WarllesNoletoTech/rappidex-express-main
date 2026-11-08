# HOTFIX VERCEL — TS2345 — 07/11/2026

Problema: No build da Vercel do frontend, `permission` tem tipo `string | null`, mas
`Array.includes()` exige `string`. Isso causava TS2345 em:
- `src/pages/Neighborhoods/index.tsx`, linha 16
- `src/pages/Ranking/index.tsx`, linha 13

Correção: usar verificações diretas e seguras para `null`:
`const admin = permission === 'admin' || permission === 'superadmin';`

O controle de acesso continua permitindo os perfis admin e superadmin; nulo,
lojista e motoboy não são considerados administradores. Não foram alterados
endpoints, regras financeiras, banco ou rankeamento.

## Para publicar o frontend
1. Na branch `main` do repositório `rappidexexpress-front`, substitua os dois arquivos
   informados acima pelos arquivos deste hotfix, mantendo os respectivos caminhos.
2. Faça commit e push.
3. Aguarde o deploy automático da Vercel e confira `npm run build`.
4. Não substitua a versão do backend apenas por causa deste erro do frontend.

## Validação efetuada
- Confirmada a definição de `permission: string | null` no DeliveryContext.
- Verificações de tipo isoladas com TypeScript 5.8.3: aprovadas.
- Análise sintática (transpileModule) das duas páginas: nenhum erro.
- Testados valores nulo, admin, superadmin e outros perfis.
- Build completo NÃO pôde ser executado aqui: `npm ci` apresentou erro de execução
  do npm no ambiente. O deploy da Vercel é a validação definitiva.

O aviso `EBADENGINE` da Vercel sobre o npm não causou os erros TS2345.
