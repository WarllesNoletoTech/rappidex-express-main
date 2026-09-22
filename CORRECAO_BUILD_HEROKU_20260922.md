# Correção do build Heroku — 22/09/2026

O build falhava porque os arquivos da integração Menu Flow referenciavam campos e opções que não estavam tipados/persistidos nas entidades e no `DeliveryService`.

Correções aplicadas:

- `UserEntity`: adicionados `menuFlowEnabled` e `menuFlowCompanyId`.
- `DeliveryEntity`: adicionados `source` e os metadados `menuFlow*` usados pela integração e pela sincronização de status.
- `DeliveryService.createDelivery`: aceita a opção `menuFlow` e persiste os metadados do pedido.
- Atualizações de entrega preservam os campos de integração e sinalizam `menuFlowSyncPending` quando o status muda.
- Liberação, aceite atômico por motoboy e cancelamento local sinalizam sincronização para pedidos Menu Flow.
- DTOs/resultado de usuário aceitam e retornam a configuração Menu Flow.
- `DeliveryResult` expõe os metadados Menu Flow necessários ao frontend.
- `MenuFlowIntegrationModule` foi registrado no `AppModule`.
- Scripts `check:menuflow-integration` e `migrate:menuflow-integration` foram adicionados ao `package.json`.
- Também foi corrigida a preservação dos identificadores iFood no `buildPersistableDelivery`, evitando que atualizações normais removam esses campos.

Validação realizada no ambiente de correção:

- Todos os arquivos TypeScript alterados passaram por verificação de sintaxe/transpilação.
- A instalação completa das dependências para executar `npm run build` localmente não pôde ser concluída neste ambiente por indisponibilidade/timeout do registry npm. Os seis erros TypeScript exibidos no log do Heroku foram corrigidos diretamente na tipagem e persistência correspondentes.

No Heroku, basta publicar esta versão. O build executará novamente `nest build` com as dependências instaladas pelo próprio Heroku.
