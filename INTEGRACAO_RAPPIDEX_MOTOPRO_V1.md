# MotoPRO + Rappidex — Integração de ganhos (piloto)

## O que foi implementado

- O motoboy logado no **Rappidex > Perfil** gera um código temporário de 48 caracteres (192 bits), válido por 10 minutos e para uso único.
- No **MotoPRO > Integrações**, ele informa o código. Os servidores validam o vínculo e guardam apenas o ID da conta vinculada. **Nenhuma senha do Rappidex é enviada ou armazenada no MotoPRO.**
- O MotoPRO consulta no backend do Rappidex **somente entregas `FINALIZADO` e repasses registrados em `motoboyDeliveryFee`**, separados pelo ID do próprio motoboy. Não transfere nome/endereço/telefone do cliente ou faturamento do lojista.
- Ganhos importados aparecem em **Lançamentos**, **Visão geral**, **gráfico semanal** e **Metas** como receitas `source=integration`, `provider=rappidex`.
- Ao abrir a Visão geral, o MotoPRO tenta sincronizar os **últimos 30 dias**, respeitando intervalo mínimo de **10 minutos** entre sincronizações automáticas bem-sucedidas. A sincronização também pode ser acionada manualmente.
- A aba Integrações inclui importação histórica por intervalos de até **31 dias**, repetindo para meses anteriores quando desejado.
- Duplicações são evitadas por índice único `(userId,provider,externalId)` e upsert. A sincronização completa do período corrige o valor registrado e remove do total importações da janela que foram canceladas/removidas na origem.
- Sem repasse congelado no pedido, valores `0` e casos com `feeResolutionStatus=PENDING` ficam fora do total e são informados como pendências. **Não substitua esse campo por `delivery.value`**, que pode ser preço cobrado da loja.
- Desconexão revoga o vínculo no Rappidex. Os lançamentos históricos já importados permanecem no MotoPRO; o usuário pode solicitar exclusão de seus dados por meios próprios disponíveis na plataforma.
- Não altera o Pix de R$ 9,99, Webhook Mercado Pago ou cobrança Premium.

## Configuração obrigatória — backends Heroku

Gere **uma única chave longa e aleatória**, sem espaços, de 32 caracteres ou mais. Configure exatamente o **mesmo valor** nos dois projetos, mas **nunca** no frontend, em repositórios Git, prints ou neste arquivo.

**Heroku do Rappidex → Settings → Config Vars**

```
MOTOPRO_INTEGRATION_SECRET=<chave_secreta_aleatoria>
```

**Heroku do MotoPRO → Settings → Config Vars**

```
RAPPIDEX_INTEGRATION_SECRET=<a_mesma_chave_secreta_aleatoria>
RAPPIDEX_API_URL=https://SEU_BACKEND_RAPPIDEX.herokuapp.com
```

`RAPPIDEX_API_URL` deve ser a URL **real do backend** (HTTPS), sem `/api` no final. O código acrescenta `/api/motopro/...` automaticamente. Não altere `MP_PIX_ACCESS_TOKEN`, `MP_PIX_WEBHOOK_SECRET`, `MP_BILLING_ENABLED` ou o funcionamento do Premium.

## Ordem de implantação

1. Faça backup dos dois repositórios e das configurações de implantação. Não substitua a pasta `.git`.
2. Implante **Rappidex backend** atualizado no Heroku; configure a chave `MOTOPRO_INTEGRATION_SECRET`.
3. Implante **MotoPRO backend** atualizado no Heroku; configure `RAPPIDEX_API_URL` e `RAPPIDEX_INTEGRATION_SECRET`.
4. Implante os **dois frontends** atualizados no Vercel. Mantenha os Root Directories e as URLs atuais de API dos projetos.
5. Acesse com uma conta **motoboy** no Rappidex → Perfil → **Gerar código de conexão**. Copie o código.
6. No MotoPRO, na conta do **mesmo motoboy**, acesse **Integrações**, cole o código, conecte e clique **Sincronizar ganhos agora**.
7. Confira três entregas concluídas com repasse registrado no Rappidex e os valores na aba **Lançamentos**. Volte à **Visão geral** para verificar os totais.
8. Sincronize de novo: não deverá criar ganhos adicionais para as mesmas entregas. Teste revogação em um usuário de homologação e confira que a importação futura é bloqueada.

## Cuidado com lançamentos anteriores

Caso o motoboy já tenha lançado **manualmente** as mesmas entregas no MotoPRO, os lançamentos manuais **não são apagados nem alterados** automaticamente. Ele deverá revisar registros manuais duplicados para não somar duas vezes. A prevenção de duplicidade automática se aplica às importações do Rappidex identificadas pelo ID da entrega.

## Notas técnicas

- Endpoints do Rappidex protegidos por sessão JWT do próprio entregador: `GET /api/motopro/status`, `POST /api/motopro/link-code`, `DELETE /api/motopro/link`.
- Endpoints privados **backend → backend**, com Bearer key própria: `POST /api/motopro/connect`, `POST /api/motopro/disconnect`, `GET /api/motopro/earnings`.
- Endpoints do MotoPRO: `GET /api/integrations`, `POST /api/integrations/rappidex/link`, `POST /api/integrations/rappidex/sync`, `DELETE /api/integrations/rappidex/link`.
- O MotoPRO não recebe dados de cliente/loja; apenas ID da entrega, repasse em centavos e dia de conclusão.
- No código atual do Rappidex, `finishedAt` já é gravado com ajuste de **menos três horas**; por isso a integração usa o dia presente no timestamp armazenado, sem descontar fuso uma segunda vez.
- O valor importado é **repasse previsto**, não confirmação de que o motoboy já recebeu o pagamento. Sem snapshot financeiro confiável, não somar valores arbitrários.
- A reconciliação de cancelamentos é feita na janela sincronizada; períodos antigos fora da janela precisam ser sincronizados novamente se houver correção retroativa.
- A sincronização **automática acontece quando o entregador abre o painel**. Não existe tarefa cron contínua em segundo plano.
- Para contas com assinatura vencida, a API permite consultar e desconectar o vínculo, mas conectar e sincronizar requer acesso Premium ativo. A remoção por iniciativa do usuário também pode ser feita no próprio Rappidex.

## Validação executada antes de entregar o ZIP

- Análise de sintaxe dos novos arquivos TypeScript e TSX sem erros.
- Testes isolados da regra de repasse (entrega finalizada, cancelamento, tarifa pendente/ausente/zero e dia codificado do Rappidex).

**Pendente de homologação:** compilação completa dos quatro projetos com dependências instaladas, implantação real, autenticação entre Herokus, vinculação e importação reais de um motoboy. Esse ambiente de teste não tinha dependências npm instaladas nem acesso às credenciais dos dois serviços. Não declare a integração como implantada antes desses passos.
