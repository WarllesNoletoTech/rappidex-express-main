# Rappidex V5 — importação automática de bairros (homologação)

## O que mudou

1. Em **Cidades**, ao criar uma cidade no modo **Taxa por bairro** ou alterná-la pela primeira vez para esse modo, o painel abre **Cidades → Gerenciar bairros**.
2. Se ainda não houver bairros cadastrados, o painel solicita automaticamente ao backend a importação (`POST /regions/:cityId/neighborhoods/auto-import`).
3. O backend consulta Nominatim para localizar o município e Overpass/OpenStreetMap para obter bairros mapeados. Há dois servidores Overpass e fallback por área retangular quando a consulta à área municipal não encontra nomes.
4. Os bairros obtidos são **acrescentados**, sem substituir cadastros, tarifas ou repasses existentes. Nomes repetidos são descartados por normalização de acentos. O backend preserva nomes anteriores dos bairros editados (`aliases`) para evitar que uma nova sincronização recrie o nome antigo.
5. O administrador pode **editar o nome diretamente na tela**, ativar/desativar, acrescentar nomes manualmente e sincronizar novamente em **Sincronizar bairros automaticamente (OSM)**.
6. A importação preserva o repasse por bairro do entregador (definido na cidade), as tarifas por bairro definidas por cada loja e o adicional de serviço do Rappidex.

## Limitações importantes

- Nenhuma fonte pública cobre obrigatoriamente 100% dos bairros brasileiros. Dados OpenStreetMap são colaborativos e podem estar incompletos ou variar quanto à denominação oficial. Não há garantia de que a importação trará todos os bairros de Palmas (TO) ou de outras cidades.
- Se a API de mapas não estiver acessível, o Rappidex **não fabrica bairros**: mostra o aviso e oferece cadastro manual e sincronização posterior.
- Os bairros importados são inicialmente habilitados na cidade, mas **não habilitados nas lojas**. Antes de enviar pedidos: configure o **repasse do motoboy** em cada bairro, as **taxas e áreas atendidas** de cada loja e confira pedidos pendentes.
- O sistema consulta serviços públicos de mapas somente no backend, com cache temporário e sem chaves/tokens adicionais. A primeira importação pode demorar alguns segundos.
- A rotina automática é acionada na primeira abertura da tela se a lista estiver vazia; para buscar novos bairros de uma cidade que já tem cadastro, use o botão **Sincronizar**. A atualização é aditiva, não apaga bairros removidos/renomeados.

## API

- `POST /regions/:cityId/neighborhoods/auto-import` — apenas admin/superadmin habilitado na cidade; retorna `{added,neighborhoods,totalFound,source,complete:false,warning}`.
- APIs legadas de cadastro e edição permanecem: `GET/POST /regions/:cityId/neighborhoods`, `PUT /regions/:cityId/neighborhoods/:neighborhoodId`, `PUT /regions/:cityId/stores/:storeId/rates`.

## Arquivos principais modificados

- `rappidexexpress-back/src/regions/neighborhood-import.ts` (novo)
- `rappidexexpress-back/src/regions/regions.service.ts`
- `rappidexexpress-back/src/regions/regions.controller.ts`
- `rappidexexpress-back/src/database/entities/city.entity.ts`
- `rappidexexpress-back/scripts/qa-offline.cjs` (testes adicionais)
- `rappidexexpress-front/src/pages/Neighborhoods/index.tsx`
- `rappidexexpress-front/src/pages/Cities/index.tsx`

## Verificação e implantação

1. Faça backup do banco MongoDB e use um ambiente de **homologação**.
2. Publique **backend no Heroku primeiro** e confirme a disponibilidade de `POST /regions/:cityId/neighborhoods/auto-import` autenticado.
3. Publique **frontend na Vercel** com o backend V5.
4. Em Cidades, selecione **Palmas — TO**, modo **Taxa por bairro**, abra **Gerenciar bairros** e aguarde a busca automática. Confira nomes e possíveis ausências. Se não houver resultados, tente sincronizar novamente ou cadastre manualmente.
5. Edite um nome, salve, sincronize novamente e confirme que o nome editado não voltou ao anterior; confirme que status, repasses e tarifas existentes não se alteraram.
6. Defina o repasse de cada bairro, habilite bairros e tarifas no perfil de pelo menos uma loja, e simule uma entrega de bairro conhecido, outra de bairro não atendido e outra de bairro não reconhecido.
7. Confira fechamento do lojista, valores do entregador, pedidos integrados (iFood e Menu Flow) e relatório do ranking.

## Testes locais disponíveis

- Backend: **22/22 cenários de QA offline aprovados** com `NODE_PATH=<typescript-global> node scripts/qa-offline.cjs`. Testes não usam banco nem APIs reais.
- Frontend: **17/17 cenários de QA isolados aprovados** com `node scripts-qa-delivery-performance.cjs`.
- Os arquivos modificados passaram pela **verificação sintática** via TypeScript.
- **Build completo não verificado**: `npm ci --offline` falhou por dependência indisponível (`zod@3.22.4`), e `tsc` sem `node_modules` reporta declarações ausentes. Execute `npm ci && npm run build` em Vercel/Heroku ou no ambiente local com acesso ao npm.
- **Importação real não validada** contra Nominatim/Overpass nesta sessão. A fonte externa pode sofrer timeout, rate limit ou não ter todos os bairros.

**Status: versão para homologação, não liberada como versão de produção.**
