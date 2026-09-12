# Integração Menu Flow ↔ Rappidex

## Configuração por empresa

No painel administrativo da Rappidex, abra **Empresas Cadastradas**. Cada empresa possui uma seção separada **Integração Menu Flow** com:

- `Usar integração Menu Flow`
- `ID da empresa no Menu Flow`

O ID é copiado de **Menu Flow → Administração → Integrações**.

Essa configuração é independente do iFood. Uma empresa pode ter iFood e Menu Flow ativos ao mesmo tempo.

## Configuração do backend Rappidex

```env
MENUFLOW_API_URL=https://SEU-BACKEND-MENU-FLOW
MENUFLOW_INTEGRATION_SECRET=UM_SEGREDO_FORTE_E_IGUAL_NOS_DOIS_BACKENDS
```

O mesmo segredo deve estar em `RAPPIDEX_INTEGRATION_SECRET` no backend do Menu Flow.

## Índices de produção

Antes de ativar a integração em produção, valide e aplique os índices únicos:

```bash
npm run check:menuflow-integration
npm run migrate:menuflow-integration
```

O script não apaga documentos. Se encontrar IDs duplicados, interrompe sem criar os índices.

## Fluxo

1. Menu Flow envia apenas pedidos de entrega.
2. Rappidex procura a empresa por `menuFlowCompanyId` e exige `menuFlowEnabled=true`.
3. A entrega nasce em `AGUARDANDO_LIBERACAO` com `source=MENU_FLOW`.
4. A liberação normal sem motoboy leva a `PENDENTE`.
5. Quando o motoboy assume, a Rappidex passa para `ACAMINHO` e notifica o Menu Flow.
6. Os status seguintes da Rappidex continuam sendo enviados ao Menu Flow.
7. Em `FINALIZADO`, o pedido Menu Flow é concluído.

## Card da Rappidex

Pedidos com `source=MENU_FLOW` exibem badge **MENU FLOW**, número do pedido, cliente, WhatsApp, endereço, valores, forma de pagamento e itens recebidos do Menu Flow.

## Preservação do iFood

Nenhum arquivo dentro de `src/ifood` é alterado pela integração Menu Flow. Os dados Menu Flow ficam em campos próprios (`menuFlow*` e `source`) e não usam IDs, credenciais, créditos ou webhooks do iFood.
