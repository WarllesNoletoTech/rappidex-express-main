# Rappidex V4 — Bairros, repasse do motoboy e formulários das lojas

## Objetivo

Corrigir a experiência reportada na versão V3: cidade em modo por bairro sem bairros cadastrados, tarifa do motoboy ainda calculada pela taxa fixa da cidade, configuração ausente nos formulários de criação/edição de lojas e página separada do perfil que parecia distinta do painel.

### Regras financeiras

- Taxa do bairro cobrada ao lojista: valor configurado pela **loja** (ex.: R$ 8,00).
- Adicional Rappidex: valor configurado pelo **administrador** na cidade (ex.: R$ 3,00).
- Total de cobrança da loja, no modo por bairro: **R$ 8,00 + R$ 3,00 = R$ 11,00**.
- Repasse ao **motoboy**: valor específico daquele bairro definido **pelo administrador em Cidades → Gerenciar bairros** (ex.: R$ 6,00). Não altera a conta acima.
- Ao criar/regularizar a entrega, os valores e modalidade de cobrança são guardados no registro do pedido (`motoboyDeliveryFee`, `neighborhoodDeliveryFee`, `platformServiceFee`, `establishmentDeliveryCharge`, `feeResolutionStatus`). Mudanças de tarifas depois não recalculam pedidos já precificados.
- Modo fixo mantém os valores legados da cidade.

### O que mudou

**Backend:**

- `CityEntity.neighborhoods[].motoboyFee`: repasse opcional, administrável apenas por admin/superadmin.
- `PUT /regions/:cityId/neighborhoods/:neighborhoodId` agora aceita `motoboyFee` (número não negativo, até dois decimais; `null` limpa o valor).
- `RegionsService.calculate()` exige bairro ativo, loja atendendo e repasse de motoboy explicitamente configurado para resolver a tarifa por bairro. Sem isso, retorna `PENDING` para pedidos externos; pedidos manuais não são aceitos até a configuração.
- `DeliveryEntity`, `DeliveryResult`: novo snapshot `motoboyDeliveryFee`.
- `DeliveryService.buildPersistableDelivery()`: preserva **todos os campos financeiros** do pedido ao alterar o status. Isso corrige risco de perda de snapshots.
- `CityResult.neighborhoodCount`: quantidade de bairros para visualização no administrador.
- O fechamento já existente continua somando a cobrança real por entrega, sem cobrar taxa fixa em cima da tarifa por bairro.

**Frontend:**

- **Cidades:** quantidade de bairros cadastrados, orientação para configurar repasse do motoboy por bairro. O valor fixo do motoboy fica oculto no formulário quando a modalidade for por bairro, preservando o dado legado na base.
- **Gerenciar bairros:** mensagem explícita quando houver 0 bairros; busca de sugestões OSM (revisão e confirmação necessárias); inserção de bairros; campo “Motoboy R$” por bairro; botão que não permite salvar tarifas da loja com catálogo vazio.
- **Criar usuário e Editar usuário:** editor de bairros e taxas aparece somente para os tipos Lojista e Lojista Admin, quando a cidade usa cobrança por bairro. Ao criar a loja, salva as tarifas após o cadastro e informa erros parciais. Ao editar, salva junto das informações da loja.
- **Perfil do lojista:** editor de tarifas integrado no painel de perfil existente, com botão “Salvar bairros e taxas”; página standalone `/bairros` mantida para compatibilidade.
- **Novo pedido manual:** só permite bairros atendidos pela loja cujo repasse ao motoboy também esteja configurado.
- **Painel/relatórios do motoboy:** utiliza o valor real do snapshot da entrega. Pedidos legados sem snapshot continuam usando o valor fixo antigo como fallback; pendentes não recebem um valor inventado.

### Importação de bairros

A busca OSM fornece **sugestões**, não um cadastro exaustivo e garantido. Para uma cidade nova, o administrador entra em **Cidades → Gerenciar bairros → Buscar sugestões**; confere os nomes e clica em **Cadastrar / importar nomes revisados**. Também é possível colar lista manual de bairros. Ativar “Taxa por bairro” sozinho **não importa bairros**. Bairros adicionados à cidade ficam desativados em cada loja até habilitação pela loja.

### Ordem correta de publicação e homologação

1. **Backup** dos bancos MongoDB e da versão atual do código; homologar em ambiente de teste sem usar dados sensíveis reais.
2. Publicar **backend (Heroku)** da V4 primeiro. Rodar `npm ci` e `npm run build` em ambiente com acesso ao npm.
3. Publicar **frontend (Vercel)** da V4 depois. Rodar `npm ci` e `npm run build` em ambiente com dependências disponíveis.
4. Cidades → editar a cidade e manter/selecionar “Taxa por bairro”, configurar adicional Rappidex e salvar.
5. **Gerenciar bairros** → cadastrar/importar nomes → definir “Motoboy R$” em cada bairro ativo (editar campo e sair dele para salvar).
6. **Criar/editar uma loja** → marcar “Atender” e preencher taxa por bairro → salvar. Ou abrir Perfil do lojista e salvar taxas.
7. Realizar testes de entrega manual, iFood e Menu Flow; conferir cálculo R$ 8 + R$ 3, valor de repasse do motoboy, alterações de status, relatório do motoboy e financeiro do lojista. Testar bairro não identificado e fechamento com `PENDING`.
8. Confirmar o ranking (terça a segunda, Top 5 e regras manuais), permissões por cidade e os fluxos fixos anteriores.

### Testes realizados neste ambiente

- Backend: 17/17 testes isolados (sem DB ou rede) aprovados.
- Frontend: 17/17 testes isolados da lógica de cálculo do motoboy, calendário e relatórios aprovados.
- 189 arquivos TypeScript/TSX: 0 erros de parsing; imports locais sem arquivos faltantes.
- **NÃO FOI POSSÍVEL** realizar os builds completos, as integrações com MongoDB real, iFood/Menu Flow nem testes E2E. `npm ci --offline` falhou por dependências ausentes do cache (`zod` e outras). Versão destinada à homologação, não ao deploy direto em produção.

### Atenção aos pedidos antigos

Os pedidos emitidos em modo por bairro antes desta V4 podem possuir cobrança da loja mas não possuir `motoboyDeliveryFee`. O painel usa tarifa fixa legada nesses casos, para preservar compatibilidade. **Reconcilie e confira manualmente** a remuneração de entregas antigas que não possuem o snapshot novo. Não reescreva pagamentos anteriores com a tabela atual sem uma política explícita.

### Arquivos alterados principalmente

- `rappidexexpress-back/src/regions/{regions.service.ts,regions.controller.ts}`
- `rappidexexpress-back/src/database/entities/{city.entity.ts,delivery.entity.ts}`
- `rappidexexpress-back/src/delivery/{delivery.service.ts,dto/delivery-result.dto.ts}`
- `rappidexexpress-back/src/city/dto/city-result.dto.ts`
- `rappidexexpress-back/scripts/qa-offline.cjs`
- `rappidexexpress-front/src/pages/{Cities,Neighborhoods,NewUser,NewDelivery,Profile}`
- `rappidexexpress-front/src/components/StoreRatesEditor/index.tsx`
- `rappidexexpress-front/src/pages/regional-admin.css`
- `rappidexexpress-front/src/shared/{interfaces/{city.interface.ts,report.interface.ts},utils/deliveryPerformance.ts}`
- `rappidexexpress-front/src/shared/utils/__tests__/deliveryPerformance.test.ts`
