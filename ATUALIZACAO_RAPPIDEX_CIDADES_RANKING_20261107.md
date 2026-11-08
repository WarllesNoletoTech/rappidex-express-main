# Atualização Rappidex — Cidades, taxas por bairro e ranking semanal

## Status desta entrega

**Versão de código para homologação; não foi publicada em produção.**

O projeto foi modificado no backend NestJS/MongoDB e no frontend React/Vite do ZIP recebido. Verificação sintática TypeScript foi executada (186 arquivos, 0 erros de sintaxe). Oito testes isolados verificaram datas do ranking e normalização/validação monetária. **Build completo, testes Nest/Jest, integrações iFood/Menu Flow e banco de produção não foram executados:** as dependências não puderam ser instaladas completamente no ambiente de edição.

### 1. Cidades e bairros

- Em **Cidades**, escolher `Taxa fixa` (padrão para cidades existentes) ou `Taxa por bairro`.
- Em `Taxa por bairro`, configurar **taxa adicional Rappidex** (`platformServiceFee`, por exemplo R$ 3,00), independente da taxa que cada loja coloca no bairro.
- Em **Bairros e taxas** (`/bairros`), administrador cria, edita e ativa/desativa bairros da cidade. Bairros não são duplicados quando o nome possui pequenas variações de acento e pontuação.
- **Buscar sugestões de bairros online**: consulta opcional ao OpenStreetMap (Nominatim/Overpass); o administrador revisa e confirma a lista antes de gravar. A fonte é incompleta e pode ficar indisponível. Existe importação manual em lote por linhas, vírgulas ou ponto e vírgula.
- Dentro de Bairros e taxas, administrador seleciona uma loja da cidade e configura cobertura e valores. Lojista acessa a configuração da própria loja pelo menu **Bairros e taxas** ou pelo botão no **Perfil**.
- Um novo bairro fica **desativado por padrão nas lojas**. A cidade pode desativá-lo globalmente.
- Ao criar entrega manual em cidade de taxa por bairro, é necessário selecionar um bairro habilitado para a loja.
- Pedidos iFood/Menu Flow com bairro não identificado **não são rejeitados somente por isso**: entram com tarifa pendente. Na área de bairros, o administrador pode conferir o bairro e validar a tarifa antes do fechamento.

### 2. Valores e fechamento

- Cidades em taxa fixa conservam `deliveryFeeValue` (cobrança atual) e `deliveryValue` (repasse ao entregador), sem misturar as duas operações.
- Cidades por bairro: `valor cobrado do lojista = tarifa configurada pela loja no bairro + platformServiceFee da cidade`.
- A tarifa fica registrada como **snapshot** no pedido (`neighborhoodDeliveryFee`, `platformServiceFee`, `establishmentDeliveryCharge`, `feeResolutionStatus`). Mudanças futuras em bairro ou tarifa não alteram valores de pedidos já tarifados.
- Fechamento financeiro e PDF existentes usam a soma **por pedido** quando a cidade estiver por bairro; a lista de entregas exibe a cobrança individual.
- Entregas **pendentes de tarifa** impedem o fechamento variável incorreto. É preciso regularizá-las.
- Pedidos legados anteriores à mudança de modalidade ainda podem ser calculados pela tarifa fixa antiga da cidade usando a data de ativação da modalidade. **Validar essa regra e as datas em homologação** antes de migrar cidades existentes.
- Cancelamentos não são faturados pelo fechamento de entregas finalizadas. As regras atuais de crédito iFood foram preservadas.

### 3. Ranking semanal

- Nova opção **Ranking semanal** (`/ranking`) no menu desktop e mobile.
- Somente **Top 5** visível na classificação pública, por cidade.
- Período de **terça-feira às 00h até segunda-feira às 23h59:59**, horário de Belém/PA.
- Administrador cadastra pontuação manual por entregador, associada a um critério editável, com observação opcional.
- Dez critérios iniciais cadastrados conforme regras recebidas: atividade nos fins de semana, chuva segura, feriados, pontualidade, expediente, moto regular, vestimenta, não distinção entre estabelecimentos, conservação da bag e cortesia.
- Regras podem ser **adicionadas, alteradas, ativadas/desativadas e reordenadas** por cidade. Lançamentos antigos guardam o texto original do critério.
- Pontuações da semana atual podem ser estornadas, com registro de quem fez o lançamento/estorno. Sem exclusão do histórico; semanas antigas ficam fechadas.

### 4. Backend: novas rotas

Prefixo global: `/api`, todas protegidas por JWT.

- `GET /regions/:cityId/neighborhoods`
- `GET /regions/:cityId/neighborhoods/suggestions`
- `POST /regions/:cityId/neighborhoods` — body `{ "names": ["Centro", "Bacuri"] }`
- `PUT /regions/:cityId/neighborhoods/:neighborhoodId` — body `{ "name"?: ..., "active"?: ... }`
- `GET /regions/:cityId/stores`
- `GET /regions/:cityId/stores/:storeId/rates`
- `PUT /regions/:cityId/stores/:storeId/rates` — body `{ "rates": [{ "neighborhoodId": "...", "enabled": true, "deliveryFee": 8 }] }`
- `GET /regions/:cityId/pending-fees`
- `PUT /regions/:cityId/deliveries/:deliveryId/resolve-fee` — body `{ "neighborhoodId": "..." }`
- `GET /ranking/:cityId`
- `GET /ranking/:cityId/details` (admin, detalhamento interno)
- `GET /ranking/:cityId/rules`
- `POST /ranking/:cityId/rules`
- `PUT /ranking/:cityId/rules/:ruleId`
- `GET /ranking/:cityId/drivers` (admin)
- `GET /ranking/:cityId/points` (admin)
- `POST /ranking/:cityId/points` — body `{ "motoboyId":"...", "ruleId":"...", "points":10, "note":"..." }`
- `POST /ranking/:cityId/points/:pointId/reverse` (admin)

### 5. Como homologar antes do deploy

1. Guardar backup/exportação recente do MongoDB e do código em produção. Não publicar diretamente sem testes.
2. Rodar `npm ci` e `npm run build` **separadamente** nas pastas `rappidexexpress-back` e `rappidexexpress-front`, usando Node 22.
3. No backend, rodar `npm test -- --runInBand`; verificar os novos testes de data e valor e os testes antigos de iFood.
4. Em **cidade de teste**, validar taxa fixa e depois ativar taxa por bairro, com pelo menos duas lojas e bairros/tarifas diferentes. Confirmar fórmula R$ 8 + R$ 3 = R$ 11.
5. Validar a importação online **com revisão humana** e a inclusão manual. Testar alterações e bairros desligados globalmente / por loja.
6. Criar entrega manual e importar pedidos iFood/Menu Flow (com bairro conhecido, desconhecido e com variação ortográfica). Conferir status pendente e regularização.
7. Gerar fechamento financeiro de teste, conferir valores individuais e totais, mensais, datas e histórico, sem envio real por WhatsApp.
8. Testar ranking em duas cidades, edição/ordem das regras, atribuição e estorno, Top 5 e virada de segunda para terça no fuso UTC-3.
9. Verificar interfaces e permissões no navegador com os perfis superadmin, admin da cidade, lojista e motoboy.
10. Publicar backend primeiro e frontend depois, **apenas após compilar e homologar**. Manter a modalidade das cidades atuais em **taxa fixa** até as lojas terem suas tarifas cadastradas.

### 6. Atenções operacionais

- O **serviço de busca de bairros é uma sugestão, não uma lista oficial completa**. Para cidades com cadastro oficial próprio, é melhor revisar/importar a base da prefeitura.
- Nominatim/Overpass são serviços externos comunitários sujeitos a disponibilidade e limites. A importação só grava dados após confirmação humana.
- O ranking semanal utiliza o fuso fixo UTC-3, adequado a Belém/PA. Se a plataforma expandir para regiões com fusos diferentes, tornar o fuso configurável por cidade.
- A regra de taxa por bairro **não atualiza retroativamente** valores já registrados no pedido. Validar a transição de cidades em homologação.
- O sistema não processa repasses automaticamente por bairro; o repasse ao motoboy conserva a configuração existente. Essa parte não foi alterada para evitar impactos financeiros.
- Esta entrega não modifica a base de dados nem os ambientes Vercel/Heroku por si só.
