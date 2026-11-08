# Rappidex V7 — Sincronização de bairros via APIs (homologação)

## Problema identificado na V6

- Consulta Overpass apontava para `overpass.kumi.systems`, cujo endpoint atualizado foi publicado em `overpass.private.coffee`.
- Dependia do Nominatim para reconhecer o município e de dados de bairros mapeados no OpenStreetMap.
- Quando o fornecedor falhava ou não devolvia bairros, a interface podia apenas informar "nenhum bairro", sem explicar o motivo.
- Não havia integração com a malha territorial municipal do IBGE para excluir resultados de outros municípios.

## Correções

1. **Pesquisa oficial de municípios pelo IBGE**: `GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`. O administrador escolhe a origem por nome e UF.
2. **Malha municipal do IBGE**: `GET https://servicodados.ibge.gov.br/api/v3/malhas/municipios/{codigo}?formato=application/vnd.geo+json&qualidade=minima`. O servidor usa o polígono para validar a origem geográfica de cada bairro.
3. **Bairros via OpenStreetMap / Overpass**: `POST https://overpass.private.coffee/api/interpreter`, com alternativa `https://overpass-api.de/api/interpreter`. Consulta nodes/ways/relations que representam bairros, retornando o centro geométrico quando disponível.
4. **Busca alternativa de municípios**: botão “Tentar fonte alternativa (OSM)” via Nominatim, útil se o IBGE falhar ou não possuir a malha da cidade.
5. **Erros mais claros**: mensagem específica para API indisponível, excesso de consultas HTTP 429, ou ausência de bairros mapeados. Resultados vazios/falhas não são armazenados no cache e não são tratados como importação concluída.
6. **Preservação de configurações**: a importação só acrescenta nomes, nunca altera nomes editados, aliases, status ativo/inativo, tarifas das lojas nem histórico de pedidos. A origem da cidade só é salva após retorno de bairros.

Os municípios vêm do IBGE, mas os **nomes dos bairros ainda dependem do mapeamento OSM**, que pode estar incompleto. O cadastro manual continua disponível. Nenhuma API pública garante todos os bairros de todas as cidades.

## Ordem correta para testar

1. Faça backup do MongoDB; mantenha o ambiente principal sem alterações até concluir a homologação.
2. Publique primeiro `Rappidex_V7_BACK_Heroku.zip` no repositório do backend, e verifique se o deploy terminou sem erro.
3. Publique `Rappidex_V7_FRONT_Vercel.zip` no repositório do frontend.
4. Entre em **Cidades → Palmas/TO → Gerenciar bairros**.
5. Verifique se o seletor encontra **Palmas — TO (IBGE)**. Se o IBGE falhar, clique em **Tentar fonte alternativa (OSM)**.
6. Selecione a origem correta, confirme e clique em **Importar bairros do município selecionado**.
7. Confira a quantidade adicionada, edite nomes, ative/desative bairros, configure tarifas da loja. Repita a importação e confirme que não duplica nomes nem redefine tarifas.
8. Teste outras cidades, incluindo alguma em que não haja dados OSM. É esperado aparecer uma mensagem de ausência de cobertura, sem dados inventados.
9. Valide pedidos iFood/Menu Flow e valores de cobrança (a V7 não modifica as fórmulas financeiras da V6).

### Diagnóstico em produção

- Se a lista de municípios estiver vazia, confira as chamadas autenticadas do navegador para `GET /regions/:cityId/neighborhoods/municipalities?q=...` e status HTTP, além da conectividade do Heroku com `servicodados.ibge.gov.br`.
- Se o município aparecer mas a importação falhar, confira `POST /regions/:cityId/neighborhoods/auto-import` e sua resposta JSON: os campos `warning`, `added` e `totalFound` explicam o retorno. Confira saída HTTPS do Heroku para as APIs IBGE e Overpass.
- Se receber 429, aguarde e use a alternativa; não tente fazer dezenas de requisições em sequência.
- Se as APIs responderem sem nomes, a região pode não estar suficientemente mapeada no OpenStreetMap. Complete manualmente ou considere futuramente uma fonte comercial/Correios (com credenciais autorizadas e custo próprio).

### Testes executados neste ambiente

- 27 verificações isoladas de integração feitas com repositório MongoDB e HTTP externos **simulados**.
- Transpilação/verificação sintática de 187 arquivos TypeScript e TSX.
- Compilação dos helpers puros de IBGE/OSM via `tsc --strict`.
- **Não executados**: build completo com dependências, consultas HTTP reais aos provedores e integração com MongoDB de homologação. A instalação `npm ci --offline` falhou por pacotes fora do cache.

### Para homologação na sua máquina/CI

Backend: `npm ci && npm run build && npm test -- --runInBand regions`

Frontend: `npm ci && npm run build`

Não é preciso cadastrar chave de API para IBGE/OSM. São serviços públicos, com disponibilidade e cobertura não garantidas. Respeite os termos de uso e a atribuição OpenStreetMap.
