# Rappidex V12 — Resumo financeiro administrativo

## Alterações

No painel inicial de **admin/superadmin**, o cartão financeiro apresenta apenas três indicadores para a cidade e o intervalo selecionados:

1. **Valor a receber:** soma da taxa integral de entrega das entregas concluídas.
2. **Repasse aos motoboys:** soma dos repasses previstos para essas entregas.
3. **Saldo da administração:** valor a receber menos repasses previstos; **não** é lucro líquido, nem confirmação de pagamento ou de recebimento.

Foram removidos desse cartão os indicadores de quantidade de entregas, tarifa unitária e cidade (a cidade continua disponível no filtro). O layout permanece no padrão visual do Rappidex.

## Cálculo — taxa fixa e taxa por bairro

- **Taxa fixa:** usa o valor de cobrança da entrega e o repasse fixo configurados na cidade. Quando um pedido possui valores históricos registrados, eles têm prioridade sobre os valores atuais.
- **Por bairro:** usa exclusivamente a taxa e o repasse registrados no pedido da loja, sem cobrar taxa administrativa separada.
- Entregas concluídas com tarifa pendente não entram na soma e são sinalizadas no painel.
- Se o valor do repasse não puder ser determinado, ele **não é inventado**: o resumo indica o número de pedidos com repasse indefinido, e o saldo é marcado como parcial.
- Para pedidos antigos de taxa fixa **sem snapshot** de repasse, o sistema usa o valor fixo atualmente configurado na cidade como aproximação histórica. Para conferência contábil, confirme os valores dos períodos antigos.
- A mudança não atualiza pedidos antigos no MongoDB nem recalcula snapshots salvos.

## Arquivos alterados

- `rappidexexpress-back/src/delivery/delivery.service.ts`
- `rappidexexpress-front/src/pages/Dashboard/index.tsx`
- `rappidexexpress-back/scripts/qa-financial-dashboard-v12.cjs` (teste offline adicionado)

## Testes

Executar na pasta `rappidexexpress-back`:

```bash
node scripts/qa-financial-dashboard-v12.cjs
```

Foram aprovados 11 testes de regressão com agregação MongoDB simulada, para tarifas fixas e por bairro, snapshots históricos, repasses indefinidos e três indicadores de interface. Isso **não** substitui uma execução real com MongoDB.

## Implantação segura

1. Faça backup do banco MongoDB e verifique a versão em uso.
2. Atualize o **backend de homologação do Heroku** antes do frontend.
3. Atualize o **frontend de homologação da Vercel**.
4. Verifique o painel com duas ou mais entregas concluídas em uma cidade de taxa fixa e outra por bairro, incluindo valores de loja e repasse diferentes.
5. Compare manualmente os totais com as entregas do período, inclusive pedidos antigos, cancelados e casos sem motoboy.
6. Rode os builds completos (`npm ci && npm run build` em cada repositório) em ambiente com as dependências disponíveis. Não utilize os ZIPs diretamente em produção antes da homologação.

**Observação:** o painel mostra previsão de saldo por entregas concluídas, não conciliação bancária. A contagem de pagamentos efetuados aos entregadores deve ser tratada separadamente, caso o projeto implemente baixa de repasses.
