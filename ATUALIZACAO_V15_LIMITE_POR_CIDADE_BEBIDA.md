# Rappidex V15 — Limite simultâneo independente por cidade e campo Bebida

## Alterações

- **Backend (MongoDB):** adicionada a propriedade `maxConcurrentDeliveries` a `CityEntity`. Uma cidade nova começa com 2; cidades antigas sem a propriedade também adotam 2 até o administrador salvar outro valor.
- **Configuração:** `GET /api/delivery/config` passa a devolver o limite da cidade atualmente selecionada pelo administrador, e `PUT /api/delivery/edit/configs` grava o limite somente naquela cidade (sem variável global). A cidade do superadmin é lida do usuário no MongoDB, para respeitar a seleção atual da aba Cidades/dashboard mesmo quando o JWT estiver antigo.
- **Validação de entregas:** quando o motoboy tenta assumir uma entrega, o backend lê o limite da cidade da entrega antes de conferir quantas já estão ativas. Erro específico se já atingiu o limite.
- **Frontend:** em Configurações o limite é identificado como referente à cidade selecionada. Intervalo aceito: inteiro de 1 a 50.
- **Texto do pedido:** “Tem refrigerante”, “Refrigerante” e o aviso do iFood foram substituídos por “Tem bebida”, “Bebida” e “Confirmar bebida”, sem alterar o nome técnico `soda` dos dados e integrações.

## Arquivos importantes

Backend:
- `src/database/entities/city.entity.ts`
- `src/city/city.service.ts`
- `src/city/dto/city-result.dto.ts`
- `src/delivery/delivery.controller.ts`
- `src/delivery/delivery.service.ts`
- `src/delivery/delivery.service.spec.ts` (testes Jest acrescentados)

Frontend:
- `src/pages/Config/index.tsx`
- `src/pages/NewDelivery/index.tsx`
- `src/pages/EditDelivery/index.tsx`
- `src/pages/Dashboard/index.tsx`
- `src/pages/Reports/index.tsx`

## Comportamentos preservados

- O botão de **bloquear/desbloquear entregas** continua **global** (todas as cidades), como no código anterior; o botão foi rotulado para deixar isso explícito. Apenas o limite de entregas simultâneas passou a ser independente por cidade.
- A verificação de limite continua aplicada no fluxo já existente em que o **motoboy assume** uma entrega. Atribuições feitas manualmente por administradores não foram modificadas nesta versão.
- Não é necessária migração destrutiva do MongoDB: o primeiro salvamento cria `maxConcurrentDeliveries` naquela cidade. Dados antigos e pedidos existentes permanecem intactos.
- A configuração por bairro, os repasses, o ranking e as integrações com iFood/Menu Flow não foram alterados.

## Teste em homologação (obrigatório antes de produção)

1. Realizar backup do MongoDB e publicar o backend atualizado em um aplicativo Heroku de testes.
2. Publicar frontend em uma implantação de testes na Vercel.
3. Selecionar **Palmas** na aba Cidades; em Configurações, salvar máximo = 2.
4. Selecionar **Redenção**; salvar máximo = 4.
5. Voltar a Palmas e confirmar que continua 2; voltar a Redenção e confirmar que continua 4.
6. Fazer login de motoboy de cada cidade: Palmas deve bloquear a terceira entrega simultânea; Redenção deve permitir até quatro.
7. Reiniciar o backend e confirmar que os valores permanecem salvos no MongoDB.
8. Verificar “Tem bebida” na criação e “Bebida” nos detalhes, na edição e no relatório, inclusive para pedidos antigos e iFood.
9. Verificar PWA e notificações sem alterações de comportamento.

## Verificações neste ambiente

- **192 arquivos TS/TSX** analisados pelo parser do TypeScript sem erros sintáticos.
- **14 cenários isolados** das rotinas reais de configuração de limite executados com repositórios simulados (isolamento por cidade, valor padrão, troca de cidade do superadmin, validação de 1 a 50 e leitura do limite).
- Suite Jest adicionada ao backend, **não executada** aqui porque a instalação de dependências offline falhou.
- Compilação completa de frontend/backend **não realizada**, pois o cache de npm está sem pacotes (`zod`, `yocto-queue`, etc.). Execute `npm ci && npm run build` nos projetos antes de publicar em produção.

**Ordem de homologação:** primeiro backend no Heroku, depois frontend na Vercel. Evitar aplicar apenas o frontend, pois o backend antigo ainda utilizaria o limite global.
