# Rappidex — Correção da finalização SUPERADMIN (HTTP 403 do iFood)

## Por que o erro acontecia

A integração Rappidex utiliza o módulo Logistics da API iFood. A consulta de status em
`GET /order/v1.0/orders/{id}` exige permissões do módulo Order, que não integra o conjunto
de módulos da categoria Logistics. A recusa `HTTP 403` não prova que a entrega não foi concluída.

## O que muda nesta versão

1. Na função excepcional **Finalizar pelo iFood (super admin)**, o backend passa a validar
   eventos `CON` / `CONCLUDED` previamente recebidos pelo módulo Events. Não consulta a
   rota Order que responde 403.
2. Exige correspondência exata entre pedido iFood e merchant vinculados à entrega;
   bloqueia se houver um evento de cancelamento autenticado.
3. Para evitar falsificação de eventos, apenas aceita como prova registros classificados
   como **POLLING** (obtidos com token iFood) ou **WEBHOOK_VERIFIED** (webhook com assinatura
   HMAC-SHA256 validada usando os bytes exatos de entrada).
4. O webhook `/api/ifood/webhook` passa a validar `X-IFood-Signature` e retorna 401 para
   requisições inválidas. O app deve ter `IFOOD_CLIENT_SECRET` ou `IFOOD_AUTH_PROFILES`
   configurado corretamente no Heroku. A configuração `rawBody: true` é necessária.
5. Eventos conclusivos do polling são persistidos antes do ACK para evitar perda do
   comprovante caso o processamento posterior da entrega falhe.
6. Registro do ID do evento que autorizou a finalização, com controle de permissão
   exclusivamente SUPERADMIN e sem envio de finalização ao iFood.

## Limitação importante — pedidos antigos

**Não é garantido que esta versão consiga finalizar o pedido 2177.** Eventos já armazenados
antes desta versão não possuem origem autenticada (`verifiedSource`). Eventos que nunca
chegaram ao Rappidex ou que foram reconhecidos pelo iFood sem armazenamento também não
podem ser recuperados apenas modificando o código. Nesses casos, a interface exibirá
`SEM_EVENTO_CONCLUSAO_IFOOD`, impedindo finalizar sem confirmação técnica.

Para resolver pedidos antigos sem evento autenticado é necessário verificar o histórico
oficial na plataforma iFood ou solicitar ao suporte iFood confirmação de entrega. Qualquer
procedimento de regularização manual deve ser diferenciado de uma confirmação pela API,
restrito ao super admin e auditado; **não está implementado neste pacote**.

## Antes do deploy

- Fazer backup e testar em homologação com pedido de teste.
- Verificar `IFOOD_AUTH_MODE=centralized` e as credenciais do aplicativo; nunca publicar secrets.
- Verificar se o iFood envia eventos via polling e/ou webhook. Se o webhook estiver ativo,
  confirmar a autenticidade da assinatura HMAC no ambiente de teste.
- Executar `npm ci`, `npm run build` e `npm test -- --runInBand` dentro de
  `rappidexexpress-back` antes de publicar.
- O frontend não mudou nesta correção. Atualizar o backend no Heroku.

## Validação efetuada nesta entrega

- Análise dos endpoints pela documentação oficial do iFood.
- Verificação de sintaxe TypeScript dos arquivos afetados.
- Verificação do exemplo oficial de assinatura HMAC (dummysecret) em Node.js.
- Integridade do ZIP e diff em relação ao pacote de superadmin anterior.

**Não foi possível executar o build completo nem os testes Jest aqui**: o ZIP não inclui
`node_modules` e as dependências do projeto não foram instaladas neste ambiente.

## Referências

- https://developer.ifood.com.br/en-US/docs/getting-started/homologation/categories
- https://developer.ifood.com.br/en-US/docs/food/guides/modules/events/webhook-signature
- https://developer.ifood.com.br/en-US/docs/food/guides/modules/events/polling-overview
- https://developer.ifood.com.br/en-US/docs/food/guides/modules/order/events
