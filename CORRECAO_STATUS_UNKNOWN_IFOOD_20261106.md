# Correção do `UNKNOWN` na finalização iFood exclusiva do SUPER ADMIN

## Causa provável

Na versão anterior, o botão `Finalizar pelo iFood (super admin)` consultava
`GET /logistics/v1.0/orders/{id}`, que serve aos dados logísticos e não
garante um campo `status` para a verificação de conclusão. Assim, uma resposta
válida sem esse campo poderia ser interpretada como `UNKNOWN`.

## Correção

- Para a **finalização administrativa**, a consulta passou a usar apenas
  `GET /order/v1.0/orders/{id}` (API de pedidos do iFood).
- Acesso continua limitado ao `SUPERADMIN`, com verificação também no banco.
- Só permite a finalização com status externo de conclusão conhecido e exato;
  `DISPATCHED`, `CANCELLED`, status desconhecido e erros HTTP não autorizam.
- Erro HTTP vira diagnóstico visível, por exemplo `ERRO_HTTP_403`, e o backend
  registra o motivo sem expor o token iFood.
- Quando a resposta não tiver status, mostra `SEM_STATUS_NA_API_PEDIDOS`.
- Não envia conclusão, código de entrega, cancelamento ou outros eventos ao iFood.
- A API original de logística para importação e movimentações **não foi alterada**.

## Implantação

A correção desta rodada altera **apenas o backend** (Heroku). O frontend Vercel
pode continuar igual ao do pacote anterior, desde que já exiba o botão para o
SUPER ADMIN. Faça backup e execute os testes antes de publicar.

Se aparecer `ERRO_HTTP_401` ou `ERRO_HTTP_403`: verifique credenciais e escopos
de acesso à API de Pedidos do iFood para o `merchantId` correspondente.
Se aparecer `ERRO_HTTP_404`: confira o ID real do pedido, vínculo merchant e
a janela de disponibilidade da API.
Se aparecer `SEM_STATUS_NA_API_PEDIDOS`: consulte os logs do Heroku e confira
o contrato de resposta e o histórico de eventos `CONCLUDED`.

A correção **não garante** finalizar o pedido 2177. A API precisa responder
com uma confirmação verificável; caso contrário o sistema bloqueia.

## Verificações locais

- Parse/sintaxe TypeScript dos quatro arquivos modificados: OK.
- Testes adicionais criados para `CONCLUDED`, `DISPATCHED`, payload sem status,
  HTTP 403, status `NOT_CONCLUDED` e autorização de SUPER ADMIN.
- Build completo e execução Jest: **não realizados** (dependências não
  instaladas neste ambiente).
- Nenhuma ação executada no backend de produção, MongoDB ou API do iFood.
