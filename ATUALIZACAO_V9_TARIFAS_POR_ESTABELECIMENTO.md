# Rappidex V9 — Tarifas e repasses específicos por estabelecimento

## Regra final

- A cidade controla apenas: modalidade (taxa fixa ou por bairro), nome e status dos bairros.
- Cada estabelecimento controla **uma tabela própria de taxas e repasses**, definida EXCLUSIVAMENTE por ADMIN e SUPERADMIN.
- Cada bairro/loja tem dois campos independentes:
  - **Taxa de entrega integral:** valor devido pelo estabelecimento ao Rappidex.
  - **Repasse ao motoboy:** valor devido ao entregador.
- Não existe adicional automático de taxa administrativa. A diferença entre o valor integral e o repasse é somente um indicador operacional, sem cobrança extra.
- Lojas diferentes podem ter valores diferentes para o mesmo bairro.
- Lojista pode CONSULTAR, mas não editar os valores; permissões são verificadas também na API.
- Nova loja inicia com bairros sem atendimento e sem tarifa até o administrador configurar.
- Pedidos já emitidos mantêm o snapshot dos valores originais.
- Cidade no modo FIXO segue o comportamento existente, independente das tabelas por loja.

## Exemplo

| Loja | Bairro | Taxa integral | Motoboy | Diferença |
|------|--------|---------------|---------|-----------|
| Hamburgueria A | Centro | R$ 10,00 | R$ 7,00 | R$ 3,00 |
| Pizzaria B | Centro | R$ 14,00 | R$ 10,00 | R$ 4,00 |

## Gerenciamento

1. Em `Cidades → Gerenciar bairros`, adicione os bairros manualmente ou importe CSV `bairro;ativo`.
2. Selecione o estabelecimento na parte **Taxas e repasses por estabelecimento**.
3. Ative os bairros atendidos e informe **taxa integral** e **repasse do motoboy**.
4. Clique **Salvar taxas desta loja**.
5. É possível baixar um CSV preenchido com os bairros da loja, alterar as colunas `bairro;taxa_entrega;repasse_motoboy;atender`, importar no perfil da loja e **salvar**. A importação apenas preenche o formulário; não grava diretamente.
6. Na aba criar usuário, salve a loja primeiro; depois abra a **edição da loja** ou a aba Cidades para configurar valores.
7. Lojistas visualizam somente os próprios valores na página Perfil, sem permissão de alteração.

## Modelo MongoDB

- `CityEntity.neighborhoods`: catálogo de ID, nome, status e aliases da cidade.
- `UserEntity.neighborhoodRates`: `[{ neighborhoodId, enabled, deliveryFee, motoboyFee }]` — associado ao ID de cada loja.
- `DeliveryEntity`: snapshot do valor total e repasse aplicados quando o pedido foi criado.
- Campos antigos de valores no catálogo municipal permanecem no banco para compatibilidade histórica, **mas são ignorados** para novos pedidos em cidade por bairro.
- Não migrar automaticamente as tarifas municipais antigas para as lojas: podem ser valores diferentes. Preencher na homologação.

## API

- `GET /regions/:cityId/neighborhoods` — lista catálogo municipal.
- `POST /regions/:cityId/neighborhoods` — cria bairros (ADMIN/SUPERADMIN).
- `PUT /regions/:cityId/neighborhoods/:neighborhoodId` — edita nome/status (ADMIN/SUPERADMIN).
- `DELETE /regions/:cityId/neighborhoods/:neighborhoodId` — exclui bairro do catálogo (ADMIN/SUPERADMIN).
- `GET /regions/:cityId/stores` — lista lojas da cidade (ADMIN/SUPERADMIN).
- `GET /regions/:cityId/stores/:storeId/rates` — retorna tabela **somente da loja selecionada** (administradores ou a própria loja).
- `PUT /regions/:cityId/stores/:storeId/rates` — salva taxas da loja (ADMIN/SUPERADMIN); exige `rates:[{neighborhoodId,enabled,deliveryFee,motoboyFee}]`.

## Checklist antes de produção

- [ ] Backup do MongoDB.
- [ ] Validar `npm ci && npm run build` no BACKEND (Heroku) em ambiente de homologação.
- [ ] Validar `npm ci && npm run build` no FRONTEND (Vercel) em ambiente de homologação.
- [ ] Checar que a lista de bairros não exibe tarifas globais antigas.
- [ ] Criar duas lojas na mesma cidade com tarifas diferentes para o mesmo bairro, gerar pedidos e conferir valores.
- [ ] Validar via API que lojista não consegue alterar os valores e não lê valores de outra loja.
- [ ] Importar CSV com bairros e depois CSV de valores em uma loja, sem afetar outra.
- [ ] Testar alterações de bairro cadastrado, inativo e excluído; novas entregas não podem ser feitas sem tarifa válida.
- [ ] Testar pedido iFood e Menu Flow sem bairro identificado: deve ficar PENDING para regularização, sem cobrança automática.
- [ ] Validar relatório do motoboy, extrato do lojista, fechamento de múltiplas lojas e preservação dos pedidos antigos.
- [ ] Validar ranking semanal de terça a segunda não afetado pelas mudanças.

## Verificação realizada neste ambiente

- 19 cenários isolados do backend e importação de bairros passaram.
- 4 testes isolados de importação de tarifas por CSV de loja passaram.
- 189 arquivos TS/TSX analisados sintaticamente sem erros de parse.
- **NÃO** foram realizados build completo, conexão MongoDB real, teste de pagamentos ou teste de ponta a ponta. O arquivo é para homologação.

**Ordem de atualização recomendada:** backend de homologação (Heroku) primeiro, depois frontend de homologação (Vercel). Não atualizar a produção sem testar os fluxos financeiros e de integração.
