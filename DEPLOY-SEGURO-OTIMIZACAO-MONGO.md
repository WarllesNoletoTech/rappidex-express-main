# Deploy seguro - otimização MongoDB

Esta versão foi preparada para melhorar desempenho sem alterar regras de negócio.

## Escopo

- Frontend: **nenhuma alteração**.
- iFood/Menu Flow: fluxos, status, webhooks e regras mantidos.
- Motoboys: mesmo formato de resposta; foi reduzida a quantidade de consultas para contar entregas ativas.
- Segurança adicional: se a agregação otimizada de motoboys falhar, o backend usa automaticamente a consulta legada.
- Índices recomendados pelo Atlas são garantidos no startup; como já existem no cluster, a operação é idempotente.

## Antes do deploy

1. Guarde o release atual do Heroku para rollback.
2. Não altere `MONGODB_URI` nem outras variáveis.
3. Não faça deploy do frontend; ele não mudou.
4. Prefira horário de menor movimento.

## Depois do deploy

Acompanhe os logs do backend e confirme:

- aplicação iniciou normalmente;
- conexão MongoDB estabelecida;
- índices foram reconhecidos/criados sem erro crítico;
- `/user/motoboys` responde normalmente;
- Dashboard continua exibindo as mesmas abas/contagens/status;
- iFood e Menu Flow continuam recebendo/sincronizando eventos.

Se aparecer o log `Agregação otimizada de motoboys falhou`, o próprio backend passa para o caminho legado; o painel não deve depender da otimização para funcionar.

## Rollback Heroku

Se houver qualquer comportamento inesperado, volte para o release anterior do Heroku. Exemplo:

```bash
heroku releases -a rappidex-api
heroku rollback vNUMERO_DO_RELEASE_ANTERIOR -a rappidex-api
```

