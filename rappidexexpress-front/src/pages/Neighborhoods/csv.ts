export type NeighborhoodCsvRow = {name:string; active?:boolean};

// CSV com ; (preferido), vírgula ou tab; suporta aspas e quebras de linha.
export function parseNeighborhoodCsv(content:string): NeighborhoodCsvRow[] {
  const text=content.replace(/^\uFEFF/,'');
  if(text.length>1_000_000)throw Error('Arquivo CSV muito grande (máximo 1 MB).');
  const first=(text.split(/\r?\n/)[0]||'');
  const delimiter=first.includes(';')?';':first.includes('\t')?'\t':',';
  const records:string[][]=[];let row:string[]=[];let cell='';let quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){
      if(quoted&&text[i+1]==='"'){cell+='"';i++;}
      else quoted=!quoted;
    }else if(ch===delimiter&&!quoted){row.push(cell.trim());cell='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){
      if(ch==='\r'&&text[i+1]==='\n')i++;
      row.push(cell.trim()); if(row.some(v=>v.length))records.push(row);
      row=[];cell='';
    }else cell+=ch;
  }
  if(quoted)throw Error('CSV com aspas não fechadas.');
  row.push(cell.trim());if(row.some(v=>v.length))records.push(row);
  if(!records.length)throw Error('Arquivo CSV vazio.');
  const header=records[0].map(x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\s-]+/g,'_'));
  const hasHeader=header.some(x=>['bairro','nome','neighborhood','taxa_entrega','repasse_motoboy','motoboy'].includes(x));
  const idx=(names:string[],fallback:number)=>hasHeader?header.findIndex(x=>names.includes(x)):fallback;
  const ni=idx(['bairro','nome','neighborhood'],0);
  const ai=idx(['ativo','ativa','active'],hasHeader? -1 : (records[0]?.length===2?1:3));
  if(ni<0)throw Error('CSV sem coluna bairro. Use: bairro;ativo');
  const rows=records.slice(hasHeader?1:0).map((r,i)=>{
    const line=i+(hasHeader?2:1);
    const name=String(r[ni]||'').trim();
    if(!name||name.length>110)throw Error(`Linha ${line}: nome de bairro inválido.`);
    const rawActive=ai>=0?r[ai]?.trim().toLowerCase():undefined;
    if(rawActive&&!['sim','não','nao','s','n','1','0','true','false','ativo','inativo'].includes(rawActive))
      throw Error(`Linha ${line}: situação inválida (${rawActive}).`);
    const active=rawActive?['sim','s','1','true','ativo'].includes(rawActive):true;
    return {name,active};
  });
  if(rows.length>500)throw Error('Importe até 500 bairros por arquivo.');
  return rows;
}
