# Rappidex V6 — município de origem e repasse financeiro por bairro

## O que mudou

1. **Cidades → Gerenciar bairros:** permite selecionar a cidade no cadastro Rappidex e pesquisar/selecionar explicitamente a **cidade de origem no OpenStreetMap**. A API confere o identificador do município brasileiro, exige confirmação no navegador antes da importação, vincula a origem à cidade do Rappidex e mantém o vínculo salvo para sincronizações seguintes. A sincronização é **aditiva**: preserva IDs, edições de nomes, status dos bairros, taxas de loja e pedidos anteriores. A busca online não garante cobertura completa e depende da disponibilidade dos serviços externos.
2. **Valores de entrega por bairro:** a tarifa definida na loja corresponde ao **total devido ao Rappidex**, não a um valor a que se soma a taxa administrativa.
3. **Taxa administrativa por cidade:** configurada em Cidades e **deduzida** da tarifa de cada entrega no modo por bairro. Ex.: tarifa da loja = R$ 10,00; retenção = R$ 3,00; motoboy = R$ 7,00.
4. **Novo cálculo financeiro:** `establishmentDeliveryCharge = neighborhoodDeliveryFee` e `motoboyDeliveryFee = neighborhoodDeliveryFee - platformServiceFee`; as três parcelas ficam congeladas no registro de cada pedido. Cidades com taxa fixa continuam usando seu cálculo antigo.
5. **Loja e cadastro/edição:** mostram o valor integral da taxa e a previsão do motoboy. A tarifa ativa não pode ficar abaixo da retenção administrativa. As rotas de criação de pedidos filtram bairros sem tarifa válida.
6. **Dashboard administrativo:** resumo de total cobrado das lojas, receita administrativa e repasses aos motoboys calculados sobre entregas concluídas com snapshot válido.

## Atenção ao financeiro

O sistema **calcula, registra e exibe** o valor que cabe ao motoboy; **não efetua transferência bancária/Pix automática**. Para pagamentos automáticos, será necessária uma integração financeira específica, com autorização, conciliação e tratamento de falhas.

Os pedidos antigos **não são recalculados retroativamente**. Pedidos do modelo antigo podem ter snapshots com fórmulas anteriores. Confira os fechamentos que abrangem o período de transição. Pedidos `PENDING` não devem entrar em fechamento até terem o bairro e a tarifa confirmados.

## Implantação segura

1. Faça backup do MongoDB e dos repositórios atuais. Use ambiente de homologação com dados de teste.
2. Atualize o **backend Heroku**. Execute `npm ci`, `npm run build`, `npm run test:qa-offline` e verifique a inicialização, conexão Mongo, rotas autenticadas `/regions` e logs de requisições aos serviços de mapas.
3. Atualize o **frontend Vercel**. Execute `npm ci`, `npm run build` e `node scripts-qa-delivery-performance.cjs` (com TypeScript disponível).
4. Em **Cidades**, selecione `taxa por bairro` e configure a retenção do Rappidex. Em **Gerenciar bairros**, selecione o município de origem correto e confirme a importação. Revise os nomes, edite/ative/desative bairros conforme necessário.
5. Na loja, configure o valor total por bairro e habilite os atendidos; valide com pedidos de teste em dois bairros, simulando as fontes manual, iFood e Menu Flow, além de mudanças de status e relatórios.
6. Confirme que `R$ 10 loja → R$ 3 Rappidex + R$ 7 motoboy` aparece corretamente em pedido, relatório e fechamento. Também teste tarifa menor que a retenção, pedidos sem bairro e alteração de taxa após fechamento.
7. Confirme a classificação do ranking de terça-feira a segunda-feira. Ela permanece preservada pela atualização.

## Testes executados neste ambiente

- 26 testes offline do backend **aprovados**, com mocks de repositórios/serviços externos e validação da escolha do município de origem e cálculo financeiro.
- 17 testes isolados do cálculo de desempenho no frontend **aprovados**.
- 188 arquivos TypeScript/TSX inspecionados quanto a sintaxe e imports relativos **sem erros**.
- **Não** foram concluídos o build TypeScript completo com dependências, a consulta real aos serviços OSM/Nominatim/Overpass e os testes ponta a ponta com o MongoDB, Heroku, Vercel, iFood e Menu Flow. Portanto, a V6 é **para homologação, não liberação imediata em produção**.
