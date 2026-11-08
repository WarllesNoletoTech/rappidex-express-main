# Rappidex V16 — Campo Bairro no novo pedido

## Alteração

Em `src/pages/NewDelivery/index.tsx`, a escolha do bairro passa a ser mostrada **apenas** quando a cidade do estabelecimento utiliza modalidade `feeMode = 'neighborhood'`.

- **Cidade com taxa fixa (`fixed`)**: não exibe nem exige o campo Bairro do destino. O frontend não envia `addressNeighborhood` ao criar o pedido.
- **Cidade por bairro (`neighborhood`)**: exibe seleção de bairros habilitados para a loja e exige a escolha antes de enviar.
- Ao trocar de estabelecimento, o formulário limpa a seleção anterior e consulta a modalidade vigente daquela loja. Enquanto consulta, o envio permanece bloqueado.
- O backend permanece inalterado: `RegionsService.calculate()` já calcula o valor fixo com as configurações da cidade sem precisar de bairro.
- Nenhuma alteração no banco de dados ou nas integrações iFood e Menu Flow.

## Instalação

Para corrigir a V15 já instalada, substitua somente:
`src/pages/NewDelivery/index.tsx` no repositório do frontend (Vercel).

Também fornecidos frontend completo e projeto completo, caso prefira essa forma de atualização. **Não é necessário publicar o backend no Heroku** para essa alteração.

## Testes realizados

1. Parse do TSX pelo compilador TypeScript: sem erros sintáticos.
2. Verificações isoladas de exibição condicional, preenchimento obrigatório no modo por bairro, payload condicional e seleção por estabelecimento: aprovadas.

**Pendente:** build completo com dependências e homologação em navegador, com uma loja de taxa fixa e outra com taxa por bairro.
