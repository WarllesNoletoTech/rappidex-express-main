# Rappidex — revisão de homologação (07/11/2026)

## Resultado desta revisão

Foi continuado o trabalho sobre a versão `Rappidex_Atualizado_Cidades_Bairros_Ranking_HOMOLOGACAO.zip`, sem alterar os ambientes de produção.

**Status: versão aprimorada para HOMOLOGAÇÃO. Não publicar diretamente em produção.**

### Ajustes adicionais realizados

1. **Registro das entidades do ranking:** `RankingRuleEntity` e `RankingPointEntity` adicionadas explicitamente na configuração do TypeORM/MongoDB. Antes, o glob de entidades apontava para `database/` e não encontrava as entidades em `ranking/`.
2. **Cidades / histórico:** quando se altera novamente de taxa fixa para taxa por bairro, o marco da transição é atualizado. Alterações apenas no valor adicional não alteram essa data.
3. **Taxa adicional:** validação de valores não negativos e de até duas casas decimais para a cobrança do Rappidex.
4. **Tarifas pendentes:** regularização só permite atualizar pedidos efetivamente `PENDING` e protege contra gravações simultâneas. O adicional da plataforma é registrado até nos pedidos que aguardam identificação do bairro.
5. **Mudança de modalidade com pendências:** pedidos originados por bairro e ainda sem tarifa não passam a usar silenciosamente o valor fixo caso a cidade volte ao modo anterior. Continuam visíveis para o administrador e precisam de regularização antes do fechamento.
6. **Fechamento / painel:** o fechamento impede a cobrança de pedidos `PENDING` em qualquer modalidade. A totalização do painel considera os valores registrados em cada pedido, inclusive após mudanças posteriores do tipo de taxa.
7. **Estorno do ranking:** verificação adicional da operação para não apresentar sucesso quando outro administrador já estornou o mesmo lançamento.
8. **Navegação conforme solicitação:** o administrador entra em **Cidades → Gerenciar bairros**, inclusive para preparar bairros antes de ativar a modalidade. O lojista acessa as tarifas de sua loja pelo perfil/menu.
9. **Nova entrega:** se as tarifas da loja não carregarem, o formulário bloqueia o envio. Consultas de lojas anteriormente selecionadas são descartadas para não misturar bairros de lojas diferentes.

### Verificações efetivamente executadas

- **15 testes isolados aprovados** via `node --test scripts/qa-offline.cjs` na pasta do backend; serviços reais foram executados com repositórios de dados simulados, sem banco nem rede. Incluem:
  - Cobrança bairro (R$ 8,00) + adicional Rappidex (R$ 3,00) = R$ 11,00;
  - Normalização e não duplicação de bairros;
  - Segurança de acesso por cidade e loja;
  - Bairro desativado e regularização de tarifas;
  - Semana do ranking terça a segunda, critérios editáveis, pontuação, Top 5, proteção de dados e estorno;
  - Fechamento financeiro somando snapshots por pedido;
  - Mudanças de modalidade e preservação de pedidos anteriores;
  - Pendências de tarifa após retorno ao modo fixo.
- **186 arquivos TS/TSX inspecionados sintaticamente; 381 imports relativos conferidos**: nenhum erro de análise sintática ou caminho local faltante encontrado.

### Verificações ainda pendentes (não executadas)

1. `npm ci` do backend e frontend (registro `registry.npmjs.org` inacessível neste ambiente; falha DNS `EAI_AGAIN`).
2. Builds completos `npm run build` de backend e frontend com dependências instaladas.
3. Testes Jest existentes e testes de integração com MongoDB real em base de homologação.
4. Testes completos dos fluxos iFood e Menu Flow com pedidos de teste; conferir bairro ausente e regularização.
5. Testes em navegador: cada perfil, validação de formulários, relatórios e cálculo de taxas.
6. Geração e conferência visual de PDFs de fechamento em homologação.
7. Execução de um piloto com uma cidade teste, duas lojas e uma semana de ranking.

**Esses itens são obrigatórios antes de implantar esta versão.** Não foram realizados testes ou alterações em Vercel, Heroku, MongoDB de produção ou contas de iFood.

## Comandos para homologar no computador/CI (Node 22)

Backend:

```bash
cd rappidexexpress-back
npm ci
npm run build
npm run test:qa-offline
npm test -- --runInBand
```

Frontend:

```bash
cd rappidexexpress-front
npm ci
npm run build
```

> `npm run test:qa-offline` usa TypeScript instalado via `npm ci`, mas substitui temporariamente serviços externos por mocks. Não substitui banco e integração real.

## Sequência recomendada no ambiente de teste

1. Faça backup do código e da base MongoDB existente. Nunca use a base real como ambiente de teste.
2. Inicie backend e frontend com variáveis de ambiente da homologação, sem credenciais de produção.
3. Teste uma cidade em **taxa fixa**. Cadastre os bairros em **Cidades → Gerenciar bairros**.
4. Configure as tarifas para duas lojas; verifique bairro desativado na cidade e em uma loja.
5. Mude a cidade para **taxa por bairro**; teste R$ 8,00 de bairro + R$ 3,00 de plataforma e confira os dois componentes no pedido.
6. Simule pedido externo sem bairro e valide a regularização antes do fechamento.
7. Retorne a modalidade para fixa com um pedido pendente e com outros já tarifados; confira que históricos são preservados.
8. Teste relatórios, fechamento por período, mensalidade, cancelamento e exibição no dashboard.
9. Teste o ranking com seis entregadores, alterações nas regras, Top 5 público, lançamentos/estornos e passagem de segunda para terça-feira.
10. Só após validação, publicar primeiro o backend e em seguida o frontend, monitorando logs e métricas.

## Cuidados conhecidos

- A pesquisa de bairros usa OpenStreetMap para **sugestões**, não garante a lista oficial completa da cidade. É necessária revisão humana.
- A mudança de taxa foi projetada para preservar pedidos com cobrança registrada, mas precisa ser validada com o histórico real do seu banco.
- Para pedidos antigos `PENDING` que foram criados antes de registrar o adicional no snapshot, a regularização poderá depender do valor atualmente configurado. Revise esses casos manualmente antes de faturar.
- Repasse ao motoboy não foi alterado: continua sob as regras financeiras existentes.
- Ainda não foi implementado tratamento de fusos distintos do horário de Belém/PA. Se a operação alcançar cidades em fusos diferentes, parametrizar o fuso antes da expansão.
