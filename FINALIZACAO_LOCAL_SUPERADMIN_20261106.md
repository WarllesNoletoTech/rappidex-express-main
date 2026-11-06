# Finalização local de entrega iFood — SUPERADMIN

**Contexto:** Integração Rappidex via API Logistics do iFood. O pedido já foi concluído no Gestor iFood, mas a entrega está como `AGUARDANDO_CODIGO` no Rappidex.

## Comportamento

- Botão **Finalizar no Rappidex (super admin)** visível apenas ao SUPERADMIN quando a entrega iFood está em `AGUARDANDO_CODIGO`.
- O administrador confere pessoalmente a conclusão do pedido no Gestor iFood e confirma uma mensagem de alerta.
- Backend confere **SUPERADMIN no banco**, que a entrega está ativa, em `AGUARDANDO_CODIGO` e vinculada a um pedido iFood.
- Atualiza **apenas o MongoDB local**: `status = FINALIZADO`, `finishedAt`, `updatedAt` e trilha de auditoria do SUPERADMIN.
- Usa compare-and-set atômico para prevenir conclusão dupla e emite atualização WebSocket para a tela.
- **Não verifica** o status externo via API (Order, Logistics ou Events), **não verifica código** e **não envia nenhum evento ao iFood**.
- Não exige comprovantes nem justificativas adicionais; apenas confirmação visual da operação. O status do iFood é uma declaração do operador, não verificação automática.

## Publicação

Atualizar **frontend na Vercel e backend no Heroku**. Testar em homologação antes da produção, inclusive relatórios, situação do entregador e eventuais repasses. Esta alteração não é uma finalização oficial do iFood.

## Risco operacional

Use a ação exclusivamente quando houver comprovação de conclusão no Gestor iFood. A finalização no Rappidex não pode confirmar por si só o estado do iFood.
