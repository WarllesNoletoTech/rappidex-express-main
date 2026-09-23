# Otimizações de desempenho - sem mudança funcional

Base: `rappidex-express-main-main (12).zip`.

Alterações aplicadas com foco conservador:

- `/user/motoboys`: o padrão N+1 (COUNT + busca da última entrega por motoboy) foi substituído por uma única agregação MongoDB, preservando o mesmo formato de resposta.
- Fallback automático: se a agregação otimizada falhar por qualquer motivo, o backend usa imediatamente a consulta legada, evitando indisponibilidade do painel.
- Índices indicados pelo MongoDB Atlas Performance Advisor passam a ser garantidos de forma idempotente no startup (delivery, evento iFood, vínculo iFood e histórico de créditos).
- Métrica de tempo de ACK do iFood deixou de acumular um array sem limite em memória; agora mantém soma e quantidade, preservando a mesma média exibida nos logs.
- Não foram alterados endpoints usados pelo frontend, fluxos de status, permissões, integrações iFood/Menu Flow, telas, regras financeiras ou regras de negócio.
- O frontend foi mantido funcionalmente intacto para evitar incompatibilidade temporária entre deploys.

## Implantação segura

1. Manter o ZIP/commit atualmente em produção como rollback.
2. Fazer primeiro o deploy do backend otimizado. O frontend não precisa mudar para estas otimizações.
3. Implantar em horário de menor movimento.
4. Observar logs do Heroku e MongoDB Atlas nos primeiros minutos.
5. Se a agregação otimizada encontrar qualquer incompatibilidade, o próprio backend usa o caminho legado automaticamente.
6. Em caso de comportamento inesperado fora desse fluxo, voltar imediatamente ao build anterior.
