# Correções Rappidex — 20/11/2026

## 1. Entrega já assumida por outro motoboy

- Motoboy que tentar assumir entrega já atribuída recebe novamente:
  **"Essa entrega já foi atribuída por outro entregador."**
- A mensagem especial não substitui a proibição de troca/cancelamento para lojistas: somente ADMIN e SUPERADMIN podem alterar entregas atribuídas.
- Continua a atribuição atômica no MongoDB para evitar que dois motoboys assumam a mesma entrega.
- Se a tela estiver desatualizada, o frontend atualiza a listagem das entregas livres após o conflito.

## 2. Motoboys não encontrados no seletor da cidade

- Atualização imediata ao trocar cidade no Dashboard do administrador/superadmin; solicitações antigas não sobrescrevem a lista nova.
- Se o carregamento falhar, a interface mostra a causa ao invés de manter silenciosamente a lista antiga.
- Cadastro legado com `cityId` armazenado como BSON `ObjectId` **ou** como string hexadecimal passa a ser considerado no filtro da cidade.
- Erro de consulta de contagem/última entrega não impede exibir os motoboys da cidade: o nome pode aparecer sem a contagem até a recuperação da consulta.
- A lista continua restrita à cidade efetiva do perfil. Motoboys registrados em outra cidade **não são** exibidos nem podem ser atribuídos por admin regional.

## Atenção aos cadastros

Se algum motoboy ainda não aparecer, confirmar em **Usuários > Motoboys** se o cadastro tem `type=motoboy` e a `cityId` correta. Não existe acesso ao banco de produção neste pacote para avaliar cadastros individuais ou corrigi-los automaticamente.

Para diagnóstico **somente leitura**, na pasta `rappidexexpress-back`, com `MONGODB_URI` já configurada:

```bash
CITY_ID=<id-da-cidade> node scripts/diagnose-motoboys-city.js
```

Opcional: `MOTOBOY_NAME=<nome-parcial>` para localizar um usuário específico. O script não modifica usuários nem entrega dados sigilosos como senha e telefone.

## Deploy

- **Backend:** publicar `rappidexexpress-back` (Heroku).
- **Frontend:** publicar `rappidexexpress-front` (Vercel).
- Publicar os dois para evitar que um frontend novo dependa de comportamento ainda não existente no backend.

## Validação

Testes de regressão adicionados a `delivery.service.spec.ts` e `user.service.spec.ts`. Sintaxe TypeScript/TSX validada estaticamente. A execução de Jest e build completo não foi possível no ambiente de preparação porque a instalação das dependências falhou; validar no pipeline de CI com `npm ci`, `npm test -- --runInBand` e `npm run build` antes do deploy.
