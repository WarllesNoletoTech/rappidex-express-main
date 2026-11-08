export type StoreCsvRow={name:string;deliveryFee:string;motoboyFee:string;enabled:boolean};
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
// CSV para uma loja específica. Exige nome, taxa integral e repasse para evitar aplicar a tabela errada.
export function parseStoreCsv(input:string):StoreCsvRow[]{
  const text=input.replace(/^\uFEFF/,'');
  if(text.length>1_000_000)throw Error('CSV acima de 1 MB.');
  const lines=text.split(/\r?\n/).filter(x=>x.trim());
  if(!lines.length)throw Error('CSV vazio.');
  const sep=lines[0].includes(';')?';':'\t';
  const fields=lines[0].split(sep).map(norm);
  const col=(names:string[])=>fields.findIndex(c=>names.includes(c));
  const ni=col(['bairro','nome']);
  const di=col(['taxa entrega','taxa_entrega','valor entrega','valor_entrega']);
  const mi=col(['repasse motoboy','repasse_motoboy','motoboy','repasse']);
  const ai=col(['ativo','atender','atendimento']);
  if(ni<0||di<0||mi<0)throw Error('Use o cabeçalho: bairro;taxa_entrega;repasse_motoboy;atender');
  const output:StoreCsvRow[]=[];const seen=new Set<string>();
  for(const [index,line] of lines.slice(1).entries()){
    const cells=line.split(sep).map(x=>x.trim().replace(/^"|"$/g,''));
    const name=cells[ni]||'';
    if(!name || seen.has(norm(name)))throw Error(`Linha ${index+2}: bairro vazio ou duplicado.`);
    seen.add(norm(name));
    const deliveryFee=cells[di]||'',motoboyFee=cells[mi]||'';
    const enabled=ai<0 ? true : !['não','nao','0','n','false','inativo'].includes(norm(cells[ai]||''));
    if(enabled && (!deliveryFee || !motoboyFee))throw Error(`Linha ${index+2}: taxa e repasse obrigatórios para bairro atendido.`);
    output.push({name,deliveryFee,motoboyFee,enabled});
  }
  if(output.length>500)throw Error('Máximo de 500 bairros por CSV.');
  return output;
}
export {norm as normalizeStoreNeighborhood};
