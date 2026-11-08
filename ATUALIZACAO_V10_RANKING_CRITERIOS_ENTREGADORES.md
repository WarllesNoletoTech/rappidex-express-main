# Rappidex V10 — Critérios visíveis aos entregadores

## Mudança

A tela `/ranking` exibe, logo abaixo do Top 5, a seção **Critérios de avaliação dos entregadores** para todos os perfis autenticados que tenham acesso à cidade, inclusive motoboys.

- Mostra **somente critérios ativos** da cidade, na ordem estabelecida pelo administrador.
- Os critérios são lidos do endpoint existente `GET /ranking/:cityId/rules`, sem regras fixas no frontend.
- Mantém os controles de edição e lançamento de pontos exclusivos de admin/superadmin.
- Inclui um botão **Atualizar critérios** para refletir mudanças feitas pela administração.
- Ao consultar semanas anteriores, informa que os critérios atuais podem ser diferentes dos históricos.
- A pontuação continua exclusivamente manual, com semana de terça-feira a segunda-feira.

## Arquivos alterados

- `rappidexexpress-front/src/pages/Ranking/index.tsx`
- `rappidexexpress-front/src/pages/regional-admin.css`

## Implantação

**Somente frontend (Vercel)**: não é necessário publicar o backend por esta alteração.
1. Faça backup ou commit da versão atual do frontend.
2. Substitua esses dois arquivos ou publique o conteúdo do ZIP FRONT.
3. Faça o commit no repositório da Vercel e aguarde o build.
4. Autentique como motoboy, acesse `/ranking`, verifique a lista de critérios ativos sob o Top 5.
5. Autentique como admin, desative/edite um critério da cidade, atualize a página do motoboy e confirme o resultado.
6. Confirme que motoboy não visualiza formulários de pontuação, edição ou histórico privado.

## Limitações da verificação

A sintaxe de arquivos TypeScript/TSX e o CSS foram analisados, e condições de visibilidade/ordem foram verificadas isoladamente. O build completo com `npm run build`, integração real com API e teste em navegadores precisam ser feitos em homologação.
