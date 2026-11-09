# Correção — permissões de entregas atribuídas (Rappidex/MotoPRO)

**Regra:** depois que uma entrega tem motoboy atribuído, apenas usuários cujo `type` no banco seja `admin` ou `superadmin` podem trocar o motoboy ou cancelar a entrega manualmente.

## Comportamento

| Perfil | Atribuir motoboy em entrega livre | Trocar motoboy após atribuição | Cancelar entrega atribuída | Avançar status normal |
|---|---|---|---|---|
| Lojista (`shopkeeper` / `shopkeeperadmin`) | Permitido, conforme fluxo existente | **Bloqueado** | **Bloqueado** | Bloqueado após atribuição |
| Motoboy | Permitido conforme fluxo normal | **Bloqueado** | **Bloqueado** | Permitido nas etapas da própria entrega |
| Admin (`admin`) | Permitido | Permitido | Permitido | Permitido |
| Superadmin (`superadmin`) | Permitido | Permitido | Permitido | Permitido |

### Mudanças no backend

- `PUT /api/delivery/:deliveryId`: verificação explícita da presença de `motoboyId` em entrega já atribuída, inclusive sem mudança de `status`; cancelamentos em entregas atribuídas não são aceitos de lojista ou motoboy.
- `DELETE /api/delivery/:deliveryId`: impede que lojista cancele entrega com motoboy atribuído.
- `PUT /api/delivery/:deliveryId/release`: bloqueia tentativa de reatribuição/liberação de entrega já atribuída por lojista.
- `POST /api/delivery/cleanup/ifood-stale`: limpeza manual pelo lojista não cancela entregas já atribuídas.
- Verifica se a entrega pertence ao estabelecimento do lojista nas rotas de atualização e liberação.
- Perfis `admin` e `superadmin` são determinados pelo `type` real do usuário. A flag de permissão `master` em lojista não libera reatribuição nem cancelamento após atribuição.
- Atualizações de status e liberação feitas por lojistas usam filtros de atualização atômica no MongoDB para barrar alterações em caso de atribuição concorrente.
- A sincronização automática de cancelamentos originados pelo iFood continua funcionando, pois não é um cancelamento manual solicitado pelo lojista.

### Mudanças no frontend

- Esconde controles de seleção/troca de motoboy, cancelamento e avanço de status do lojista quando a entrega já está atribuída.
- Mantém os controles de administrador e superadministrador.
- Mantém o avanço do fluxo operacional do motoboy.

### Testes e validação

- Código TypeScript do serviço, seus testes Jest e tela de Dashboard validado quanto à sintaxe.
- 9 cenários de execução simulada do serviço aprovados, abrangendo lojista, motoboy, admin e superadmin, sem conexão com MongoDB.
- Testes de regressão foram adicionados a `rappidexexpress-back/src/delivery/delivery.service.spec.ts` para execução no projeto com dependências instaladas.
- **Limitação:** não houve execução do build completo `npm run build` / suíte Jest completa nem teste no servidor de produção. Execute antes do deploy.

### Publicação

1. Faça backup/versionamento da versão em produção.
2. Publicar o backend atualizado no Heroku e o frontend atualizado na Vercel; ambos precisam ser implantados para a proteção completa e os controles da tela refletirem a regra.
3. Executar os testes e validar em homologação os quatro perfis (lojista, motoboy, admin, superadmin) em pedidos livres e atribuídos.
4. O bloqueio definitivo está no backend; atualizar somente o frontend não protege a API.
