# Rappidex / MotoPRO — correção da liberação de pedidos iFood (10/11/2026)

## Causa
O bloqueio de troca/cancelamento após atribuição passou a tratar a ação **Liberar produto** como uma mudança proibida em qualquer entrega atribuída. Na integração iFood, porém, o fluxo é: AGUARDANDO_LIBERACAO -> selecionar motoboy -> Salvar (a entrega continua AGUARDANDO_LIBERACAO) -> Liberar produto -> ACAMINHO.

## Ajustes
- **Frontend** `rappidexexpress-front/src/pages/Dashboard/index.tsx`: o lojista com integração autorizada consegue clicar em **Liberar produto** quando o status ainda é AGUARDANDO_LIBERACAO, mesmo após salvar um motoboy. Não pode reabrir seleção, trocar motoboy nem cancelar uma entrega já atribuída. A liberação de uma entrega já atribuída não reenvia ID do seletor, evitando trocar o entregador por estado local desatualizado. A ação tem tratamento de erro e indicador de atualização.
- **Backend** `rappidexexpress-back/src/delivery/delivery.service.ts`: `releaseDelivery` aceita a liberação de uma entrega AGUARDANDO_LIBERACAO atribuída para **o mesmo motoboy**. Solicitar outro `motoboyId` por um lojista ou lojistaadmin retorna 403. A condição da alteração no MongoDB verifica o estado e o ID já gravado, impedindo reatribuição ou liberação concorrente. A entrega é atualizada para ACAMINHO, transmite o evento ao painel do motoboy e mantém a integração de status iFood.
- Primeira atribuição via `PUT /delivery/:id` permanece permitida enquanto não houver motoboy, inclusive para AGUARDANDO_LIBERACAO, com condição atômica para evitar atribuição concorrente.
- **Testes de regressão** adicionados a `rappidexexpress-back/src/delivery/delivery.service.spec.ts`.

## Regras mantidas
| Ação | Lojista / lojistaadmin | Admin / superadmin |
|---|---|---|
| Cancelar pedido sem motoboy | Sim | Sim |
| Selecionar motoboy em AGUARDANDO_LIBERACAO sem atribuição | Sim | Sim |
| Liberar AGUARDANDO_LIBERACAO com o mesmo motoboy já salvo | Sim | Sim |
| Trocar motoboy já atribuído | Não | Sim |
| Cancelar entrega atribuída | Não | Sim |
| Alterar status depois da liberação | Não, exceto fluxo próprio do motoboy | Sim |

## Verificações feitas
- 14/14 cenários comportamentais do método `releaseDelivery` executados com repositório e integrações simulados, incluindo presença/falha da integração iFood.
- 6/6 cenários de exibição/permissões da interface avaliados a partir das expressões reais do componente.
- Transpilação sintática de TypeScript/TSX dos arquivos alterados verificada.
- **Não** foi feito deploy, build completo das aplicações, teste Jest completo nem teste contra MongoDB/iFood de produção.

## Aplicação
1. Fazer backup/guardar a versão anterior.
2. Atualizar e publicar **backend no Heroku**.
3. Atualizar e publicar **frontend na Vercel**.
4. Entrar em uma loja integrada ao iFood, abrir entrega em AGUARDANDO_LIBERACAO, selecionar motoboy, Salvar e Liberar produto. Confirmar que mudou para ACAMINHO e apareceu na conta do motoboy.
5. Validar que o lojista não consegue trocar nem cancelar após a atribuição, inclusive por chamada direta à API; administrador e superadministrador continuam autorizados.

Nenhuma migração de banco de dados foi adicionada.
