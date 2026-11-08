# Rappidex V11 — Aviso persistente de avaliação do motoboy

## Mudanças
- O motoboy não vê mais o seletor de cidade no ranking nem a cidade em seu perfil.
- Administradores mantêm a seleção da cidade no ranking.
- Ao registrar pontuação no ranking, o backend marca o novo lançamento como aviso pendente.
- O motoboy recebe um modal no padrão Rappidex (preto, cinza e amarelo) com critério, pontos, observação e data.
- O modal é consultado ao entrar no painel, a cada 20 segundos com a aba visível e quando a aba recebe foco.
- Se o motoboy estiver desconectado, o aviso permanece no MongoDB e será exibido no próximo acesso.
- O aviso só é marcado como lido após confirmar **Entendi, obrigado!**; múltiplos avisos aparecem um após outro.
- Um aviso estornado antes da visualização não é exibido. Registros criados antes da V11 não se tornam avisos retroativos.
- A API só devolve notificações do próprio motoboy autenticado (identificado pelo JWT, sem aceitar `motoboyId` do cliente).

## Endpoints adicionados
- `GET /api/ranking/my-notifications` — lista de avisos pendentes do motoboy autenticado.
- `POST /api/ranking/my-notifications/:pointId/ack` — confirma leitura de aviso do próprio motoboy.

## Homologação recomendada
1. Atualize primeiro o backend de homologação no Heroku e depois o frontend na Vercel.
2. Faça login como administrador e crie uma pontuação para um motoboy na mesma cidade.
3. Com o motoboy online, confirme o pop-up em até 20 segundos com a aba visível; ao entrar novamente deve aparecer imediatamente.
4. Clique em **Entendi, obrigado!**; confirme que não reaparece após atualizar a página ou sair/entrar.
5. Crie duas avaliações e confira a fila. Teste um estorno antes do primeiro acesso.
6. Teste com outro motoboy e verifique que ele não recebe a notificação de terceiros.
7. Confirme que contas de lojista, admin e superadmin não veem esse aviso.
8. Confira o ranking e o perfil do motoboy, sem informação de cidade; administradores continuam com o seletor.

**Estado de validação**: arquivos alterados e testes locais isolados; testes completos com login/MongoDB e build de implantação ainda necessários.
