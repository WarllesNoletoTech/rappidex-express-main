# Rappidex — pedidos iFood concluídos sem evento CON autenticado

## Situação tratada

Um pedido pode aparecer como CONCLUÍDO no Gestor iFood e, mesmo assim, seguir
`AGUARDANDO_CODIGO` no Rappidex. A validação automática deve retornar
`SEM_EVENTO_CONCLUSAO_IFOOD` quando não existe evento CON autenticado salvo
no MongoDB. **Isso não é prova de que o iFood considera o pedido aberto.**

## Duas rotas separadas

1. **Finalizar pelo iFood (Super Admin)**: usa exclusivamente evento CON autenticado
   por polling/webhook, vinculando orderId e merchantId. É confirmação técnica.
2. **Regularizar com comprovante (Super Admin)**: serve para pedidos antigos sem
   evento verificável. É declaração administrativa baseada em conferência externa
   do Gestor iFood ou suporte oficial, NÃO confirmação da API.

A segunda rota exige confirmação expressa da conclusão no iFood, número de pedido
coincidente com o vínculo existente, referência do comprovante e descrição com
motivo, data e hora. Exige `SUPERADMIN` tanto no JWT quanto no registro de
usuário salvo no MongoDB. Bloqueia cancelamentos já conhecidos e status fora de
`AGUARDANDO_CODIGO`. Usa atualização condicional atômica para evitar conclusão
duplicada. Armazena a evidência e o autor no registro da entrega, além de um log.
Não envia atualização para o iFood e não utiliza código fictício.

**Limite de segurança:** não há consulta por API que autentique a declaração
externa nessa operação. O responsável deve conferir o pedido no Gestor iFood,
ter o comprovante e guardá-lo no repositório de evidências da operação.
Informar dados falsos permitirá registrar uma conclusão indevida. Por isso o
botão é separado, excepcional e exclusivo do super admin.

## Implantação

Publicar frontend (Vercel) e backend (Heroku), pois os dois foram alterados.
Fazer backup do MongoDB e validar num ambiente de testes primeiro. Em produção,
entrar com SUPERADMIN, localizar o pedido iFood 2177, conferir o histórico no
Gestor iFood, guardar o comprovante e usar **Regularizar com comprovante**.

Executar antes da publicação:

- `npm ci && npm run build && npm test -- --runInBand` no backend
- `npm ci && npm run build` no frontend

Neste ambiente foi possível validar a sintaxe das alterações TypeScript,
mas não executar o build ou o Jest por ausência das dependências.

Verificar especialmente se a finalização local altera corretamente os relatórios,
repasses e vínculos do entregador no ambiente real.
