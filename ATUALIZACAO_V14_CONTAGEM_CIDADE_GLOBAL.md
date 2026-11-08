# Rappidex V14 — Dashboard com entregas concluídas e cidade global

## Modificações

- Dashboard: mostra **Entregas concluídas** junto com Valor a receber, Repasse aos motoboys e Saldo da administração.
- A quantidade vem de `GET /delivery/counts` (`totalEntregas`) e respeita o período e a cidade do dashboard. No backend atual ela conta entregas no status `FINISHED`.
- Dashboard: o seletor de cidade do **superadmin** agora usa o mesmo `PUT /user/:id` com `{cityId}` que o botão **Selecionar** da aba Cidades.
- A cidade é gravada no cadastro do usuário e restaurada após navegar/recarregar a página.
- Após a alteração, o dashboard recarrega pedidos e totais e troca a assinatura do socket para a cidade selecionada.
- A aba Cidades foi atualizada para reutilizar a mesma função e evitar reenviar campos pessoais que não precisam mudar.
- Administradores sem permissão de escolha continuam vinculados à própria cidade.
- As datas do filtro e todas as configurações PWA da V13 foram preservadas.

## Arquivos alterados

- `src/pages/Dashboard/index.tsx`
- `src/pages/Cities/index.tsx`
- `src/shared/utils/adminCitySelection.ts` (novo)

## Validação

1. Entre como superadmin na aba Cidades e selecione Palmas.
2. Volte ao dashboard: o seletor deve mostrar Palmas e as entregas concluídas devem refletir a cidade.
3. Troque para Redenção no dashboard, aguarde concluir e abra Cidades: Redenção deve aparecer como Selecionada.
4. Atualize a página: Redenção deve continuar selecionada.
5. Verifique o período de terça a segunda e a soma dos três valores financeiros.
6. Entre como admin municipal: ele não deve conseguir trocar para outra cidade.
7. Em falha de API, o seletor não deve confirmar a troca e exibirá a mensagem de erro.

Não foi alterado o backend. Este pacote é para homologação antes da publicação final.
