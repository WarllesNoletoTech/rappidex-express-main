# Rappidex V8 — Bairros manuais, CSV e tarifas independentes

## Escopo da mudança

- **Sem sincronização automática**: removidas do frontend e backend as rotas de busca de municípios, sugestões e importação por APIs externas. Nenhuma consulta IBGE/OSM será feita pela aba de bairros.
- Na aba **Cidades → Gerenciar bairros**, **admin** (somente sua cidade) e **superadmin** (todas as cidades) podem **adicionar, renomear, ativar/desativar, editar preços ou excluir bairros**. O backend valida a permissão em todas as alterações.
- **Dois preços independentes por bairro**: (1) `deliveryFee`, taxa integral de entrega que o lojista repassa ao Rappidex; (2) `motoboyFee`, valor destinado ao motoboy. Não há campo de taxa administrativa adicional nem dedução automática no novo cálculo.
- **Loja/lojista**: pode consultar as taxas, mas não editar. As configurações `neighborhoodRates` antigas nos usuários não participam mais da precificação por bairro. A tela de criação/edição e o perfil da loja são somente consulta.
- **Taxa fixa existente**: mantém a regra anterior para cidades que continuam no modo fixo.
- **CSV:** `bairro;taxa_entrega;repasse_motoboy;ativo`. O aplicativo aceita CSV com `;`, `,` ou tabulação, cabeçalho opcional e campos entre aspas. O separador `;` é recomendado para valores em formato brasileiro (`10,00`). Limite de 500 registros e 1 MB por arquivo. Uma importação não sobrescreve bairros existentes: nomes repetidos são ignorados e podem ser editados pela interface.

## Exemplo

| Bairro | Taxa integral cobrada da loja | Repasse ao motoboy | Diferença operacional |
|---|---:|---:|---:|
| Centro | R$ 10,00 | R$ 7,00 | R$ 3,00 |
| Bacuri | R$ 12,00 | R$ 9,00 | R$ 3,00 |

A diferença é apenas um resultado contábil, **não** uma taxa administrativa adicional. O backend nunca soma um terceiro valor.

## Migração segura e situações pendentes

- Bairros já cadastrados na V7 continuam no banco com os mesmos nomes/IDs. Como a V7 não armazenava taxa integral e repasse no cadastro central, **é obrigatório informar ambos os valores por bairro** antes de precificar novos pedidos. Se faltar algum valor ou o bairro não for encontrado, o pedido recebe status de tarifa `PENDING` e precisa de regularização administrativa antes do fechamento.
- Não são criadas tarifas fictícias com valor zero para dados ausentes. Zero real é aceito somente quando gravado explicitamente por administrador.
- Pedidos antigos que já possuem `establishmentDeliveryCharge` e `motoboyDeliveryFee` registrados **não são recalculados** pela alteração dos bairros. Não apague históricos nem as coleções atuais.
- Pedidos do iFood/Menu Flow com bairro não reconhecido podem continuar chegando como pendentes de tarifa; a equipe deve confirmar o bairro antes do fechamento.
- Repasse ao motoboy deve ser menor ou igual ao valor integral da entrega; valores negativos e decimais acima de duas casas são rejeitados.
- O endpoint antigo de edição de taxas por loja ainda responde, mas **recusa gravações** para impedir que versões anteriores do frontend alterem valores.

## Publicação / homologação

1. Faça backup do MongoDB e preserve seu repositório antes de substituir arquivos.
2. Em ambiente de testes, atualize **primeiro o backend no Heroku** e depois o **frontend na Vercel**.
3. Execute `npm ci` e `npm run build` em **ambas** as pastas (com acesso às dependências). O build completo **não pôde ser executado neste ambiente**, pois faltam pacotes no cache npm.
4. Teste com admin e superadmin o CRUD, CSV e validação dos valores; com lojista, confira que preços aparecem mas não podem ser alterados nem via API.
5. Teste pedido manual, iFood, Menu Flow, entrega com bairro ausente, repasse, histórico e fechamento PDF/WhatsApp. A validação real com MongoDB/Heroku não foi realizada aqui.
6. Configure pelo menos um bairro com **ambos os valores** e valide o cálculo. Só promova a atualização para produção após os testes reais.

## Verificações realizadas localmente

- 16 testes funcionais isolados com repositórios simulados: permissões, CSV, valores, duplicados, alteração e exclusão, congelamento dos valores, taxa fixa e pendências.
- Análise sintática dos 186 arquivos TS/TSX: zero erros de sintaxe.
- Compilação TypeScript completa: **pendente**, pois não existem `node_modules` instalados no ambiente para React/Nest e suas tipagens.

Esta é uma versão para **homologação**, não uma publicação automática nem uma migração em produção.
