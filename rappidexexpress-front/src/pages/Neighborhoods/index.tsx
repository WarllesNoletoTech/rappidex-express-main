/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import { parseNeighborhoodCsv, NeighborhoodCsvRow } from './csv';
import '../regional-admin.css';

type Neighborhood={id:string;name:string;active:boolean;deliveryFee?:number|null;motoboyFee?:number|null};
type City={id:string;name:string;state:string;feeMode?:string};
type Pending={id:string;clientName:string;storeName:string;addressNeighborhood:string;status:string};
const money=(n:number|undefined|null)=>n==null?'Não definido':Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const moneyInput=(s:string)=>{
  const raw=s.replace(/R\$/gi,'').trim();
  if(!raw)return null;
  const n=Number(raw.includes(',')?raw.replace(/\./g,'').replace(',','.'):raw);
  if(!Number.isFinite(n)||n<0||n>100000||Math.abs(Math.round(n*100)-n*100)>1e-6)throw Error('Informe um valor válido com até duas casas decimais.');
  return Math.round(n*100)/100;
};
export function Neighborhoods(){
  const navigate=useNavigate();
  const {cityId:cityFromRoute}=useParams<{cityId:string}>();
  const {token,permission}=useContext(DeliveryContext);
  const admin=permission==='admin'||permission==='superadmin';
  const [cities,setCities]=useState<City[]>([]);
  const [cityId,setCityId]=useState('');
  const [neighborhoods,setNeighborhoods]=useState<Neighborhood[]>([]);
  const [pending,setPending]=useState<Pending[]>([]);
  const [resolveNeighborhood,setResolveNeighborhood]=useState<Record<string,string>>({});
  const [input,setInput]=useState('');
  const [csv,setCsv]=useState<NeighborhoodCsvRow[]>([]);
  const [csvFile,setCsvFile]=useState('');
  const [editingId,setEditingId]=useState<string|null>(null);
  const [draft,setDraft]=useState({name:'',deliveryFee:'',motoboyFee:'',active:true});
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  api.defaults.headers.Authorization=`Bearer ${token}`;
  useEffect(()=>{
    api.get('/city').then(response=>{
      const values=Array.isArray(response.data?.data)?response.data.data:response.data;
      const rows:Array<City>=Array.isArray(values)?values:[];
      setCities(rows);setCityId(cityFromRoute||rows[0]?.id||'');
    }).catch((err:any)=>setError(err.response?.data?.message||'Erro ao carregar cidades.'));
  },[cityFromRoute,token]);
  async function reload(id=cityId){
    if(!id)return;
    setLoading(true);
    try{
      const results=await Promise.all([api.get(`/regions/${id}/neighborhoods`),admin?api.get(`/regions/${id}/pending-fees`):Promise.resolve({data:[]})]);
      setNeighborhoods(results[0].data.neighborhoods||[]);setPending(results[1].data||[]);
    }catch(err:any){setError(err.response?.data?.message||'Erro ao consultar bairros da cidade.');}
    finally{setLoading(false);}
  }
  useEffect(()=>{
    setNeighborhoods([]);setCsv([]);setInput('');setEditingId(null);setError('');setMessage('');
    void reload(cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cityId,admin]);
  const selectedCity=cities.find(c=>c.id===cityId);
  async function addRows(items:NeighborhoodCsvRow[]){
    if(!admin||!cityId||!items.length)return;
    setSaving(true);setError('');setMessage('');
    try{
      const response=await api.post(`/regions/${cityId}/neighborhoods`,{items});
      setNeighborhoods(response.data.neighborhoods||[]);
      setMessage(`${response.data.added} bairro(s) cadastrado(s). ${response.data.duplicates||0} duplicado(s) ignorado(s).`);
      setInput('');setCsv([]);setCsvFile('');
    }catch(e:any){setError(e.response?.data?.message||e.message||'Erro ao cadastrar bairros.');}
    finally{setSaving(false);}
  }
  async function addNames(){
    const items=input.split(/[\n;,]+/).map(name=>({name:name.trim()})).filter(x=>x.name);
    if(!items.length)return;
    await addRows(items);
  }
  async function loadCsv(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];if(!file)return;
    setError('');setMessage('');
    try{const parsed=parseNeighborhoodCsv(await file.text());setCsv(parsed);setCsvFile(file.name);}
    catch(error:any){setCsv([]);setCsvFile('');setError(error.message||'CSV inválido.');}
    e.target.value='';
  }
  function downloadModel(){
    const content='\uFEFFbairro;taxa_entrega;repasse_motoboy;ativo\r\nCentro;10,00;7,00;sim\r\nBacuri;12,00;9,00;sim\r\n';
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
    a.download='modelo_bairros_rappidex.csv';a.click();URL.revokeObjectURL(a.href);
  }
  function startEdit(n:Neighborhood){
    setEditingId(n.id);setDraft({name:n.name,active:n.active,
      deliveryFee:n.deliveryFee==null?'':String(n.deliveryFee).replace('.',','),
      motoboyFee:n.motoboyFee==null?'':String(n.motoboyFee).replace('.',',')});
  }
  async function update(id:string,payload:any){
    if(!admin)return;
    setSaving(true);setError('');setMessage('');
    try{const response=await api.put(`/regions/${cityId}/neighborhoods/${id}`,payload);
      setNeighborhoods(response.data.neighborhoods||[]);setEditingId(null);
      setMessage('Bairro e valores atualizados. Alterações não modificam entregas anteriores.');
    }catch(err:any){setError(err.response?.data?.message||err.message||'Erro ao atualizar bairro.');}
    finally{setSaving(false);}
  }
  async function saveDraft(id:string){
    try{
      const deliveryFee=moneyInput(draft.deliveryFee),motoboyFee=moneyInput(draft.motoboyFee);
      if(deliveryFee!==null&&motoboyFee!==null&&motoboyFee>deliveryFee)throw Error('Repasse do motoboy não pode superar a taxa da entrega.');
      await update(id,{name:draft.name.trim(),deliveryFee,motoboyFee,active:draft.active});
    }catch(e:any){setError(e.message);}
  }
  async function remove(n:Neighborhood){
    if(!admin||!window.confirm(`Excluir o bairro "${n.name}" da cidade? Pedidos anteriores manterão seus valores, mas novas entregas não poderão usar este bairro.`))return;
    setSaving(true);setError('');
    try{const response=await api.delete(`/regions/${cityId}/neighborhoods/${n.id}`);
      setNeighborhoods(response.data.neighborhoods||[]);setMessage(`Bairro ${n.name} excluído.`);
    }catch(e:any){setError(e.response?.data?.message||'Erro ao excluir bairro.');}
    finally{setSaving(false);}
  }
  async function resolveFee(id:string){
    if(!resolveNeighborhood[id]||!admin)return;
    try{await api.put(`/regions/${cityId}/deliveries/${id}/resolve-fee`,{neighborhoodId:resolveNeighborhood[id]});
      setPending(old=>old.filter(item=>item.id!==id));setMessage('Tarifa do pedido confirmada.');
    }catch(e:any){setError(e.response?.data?.message||'Erro ao confirmar tarifa.');}
  }
  return <main className="rpx-page">
    {admin&&<button className="rpx-small" onClick={()=>navigate('/cidades')}>← Voltar para Cidades</button>}
    <h1>Bairros e taxas de entrega</h1>
    <p>Cadastro manual por cidade. <b>Taxa de entrega integral</b> e <b>repasse ao motoboy</b> são valores independentes definidos apenas por administradores.</p>
    {error&&<div className="rpx-error" role="alert">{error}</div>}
    {message&&<div className="rpx-notice">{message}</div>}
    <section className="rpx-card">
      <label>Cidade no Rappidex</label>
      <select value={cityId} disabled={!admin} onChange={e=>{setCityId(e.target.value);if(cityFromRoute)navigate(`/cidades/${e.target.value}/bairros`);}}>
        {cities.map(c=><option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}
      </select>
      <p><b>Modalidade:</b> {selectedCity?.feeMode==='neighborhood'?'Taxa por bairro':'Taxa fixa'}</p>
      {selectedCity?.feeMode!=='neighborhood'&&<p>O modelo por bairro pode ser habilitado em Cidades. A taxa fixa atual permanece inalterada.</p>}
    </section>
    {admin&&<section className="rpx-card">
      <h2>Gerenciar bairros ({neighborhoods.length})</h2>
      <p>Não há sincronização automática. Adicione os bairros manualmente ou importe um arquivo CSV. Você pode editar, desativar ou excluir bairros a qualquer momento.</p>
      <label>Adicionar bairros (um por linha, vírgula ou ponto e vírgula)</label>
      <textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} placeholder={'Centro\nBacuri\nSanta Rita'}/>
      <button disabled={saving||!input.trim()} onClick={()=>void addNames()}>Adicionar bairros</button>
      <div className="rpx-embedded" style={{marginTop:16,marginBottom:16}}>
        <h3>Importar bairros por CSV</h3>
        <p>Colunas: <code>bairro;taxa_entrega;repasse_motoboy;ativo</code>. Valores em reais, com vírgula decimal. Não substitui bairros existentes.</p>
        <button className="rpx-small" type="button" onClick={downloadModel}>Baixar modelo CSV</button>
        <input aria-label="Escolher arquivo CSV de bairros" type="file" accept=".csv,.txt,text/csv,text/plain" onChange={e=>void loadCsv(e)} />
        {csv.length>0&&<><p><b>{csvFile}</b>: {csv.length} linha(s) válidas. Prévia:</p>
          <div className="rpx-list">{csv.slice(0,8).map((x,i)=><div key={`${x.name}-${i}`} className="rpx-list-row"><span>{x.name}</span><small>Entrega: {money(x.deliveryFee)} • Motoboy: {money(x.motoboyFee)}</small></div>)}</div>
          <button disabled={saving} onClick={()=>void addRows(csv)}>Confirmar importação de {csv.length} bairros</button>
          <button className="rpx-small" disabled={saving} onClick={()=>{setCsv([]);setCsvFile('');}}>Cancelar importação</button>
        </>}
      </div>
      {loading&&<p>Carregando bairros...</p>}
      {!loading&&!neighborhoods.length&&<div className="rpx-notice">Nenhum bairro cadastrado. Use o formulário ou o CSV acima.</div>}
      <div className="rpx-list">{neighborhoods.map(n=><div key={n.id} className="rpx-list-row" style={{alignItems:'start'}}>
        {editingId===n.id?<>
          <div style={{flex:'1 1 230px'}}>
            <label>Nome do bairro</label><input value={draft.name} maxLength={110} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/>
            <label>Taxa de entrega (valor cheio R$)</label><input type="text" inputMode="decimal" value={draft.deliveryFee} placeholder="Ex.: 10,00" onChange={e=>setDraft(d=>({...d,deliveryFee:e.target.value}))}/>
            <label>Repasse ao motoboy (R$)</label><input type="text" inputMode="decimal" value={draft.motoboyFee} placeholder="Ex.: 7,00" onChange={e=>setDraft(d=>({...d,motoboyFee:e.target.value}))}/>
            <label className="rpx-check"><input type="checkbox" checked={draft.active} onChange={e=>setDraft(d=>({...d,active:e.target.checked}))}/> Ativo</label>
            <div style={{display:'flex',gap:8,marginTop:8}}><button className="rpx-small" disabled={saving||!draft.name.trim()} onClick={()=>void saveDraft(n.id)}>Salvar alterações</button>
            <button className="rpx-small" disabled={saving} onClick={()=>setEditingId(null)}>Cancelar</button></div>
          </div>
        </>:<>
          <span style={{flex:'1 1 240px'}}><b>{n.name}</b><br/><small>{n.active?'Ativo':'Desativado'} • {n.deliveryFee==null||n.motoboyFee==null?'Valores pendentes de cadastro':'Valores configurados'}</small></span>
          <span>Entrega: <b>{money(n.deliveryFee)}</b><br/>Motoboy: <b>{money(n.motoboyFee)}</b></span>
          <button className="rpx-small" disabled={saving} onClick={()=>startEdit(n)}>Editar</button>
          <button className="rpx-small" disabled={saving} onClick={()=>void update(n.id,{active:!n.active})}>{n.active?'Desativar':'Ativar'}</button>
          <button className="rpx-small" disabled={saving} onClick={()=>void remove(n)}>Excluir</button>
        </>}
      </div>)}</div>
      <p><small>Valores ainda não definidos não são assumidos como R$ 0,00. Entregas desses bairros precisam de configuração antes do fechamento.</small></p>
    </section>}
    {!admin&&<section className="rpx-card"><h2>Tarifas da cidade (consulta)</h2>
      {neighborhoods.filter(n=>n.active).map(n=><div className="rpx-list-row" key={n.id}><span>{n.name}</span><span>Entrega: {money(n.deliveryFee)} • Motoboy: {money(n.motoboyFee)}</span></div>)}
      <p>Alterações disponíveis somente para admin e superadmin.</p>
    </section>}
    {admin&&pending.length>0&&<section className="rpx-card"><h2>Entregas com bairro pendente</h2>
      <p>Pedidos sem tarifa definida precisam de confirmação antes de entrar no fechamento.</p>
      {pending.map(d=><div className="rpx-list-row" key={d.id}>
        <span><b>{d.storeName}</b> — {d.clientName}<br/><small>Bairro: {d.addressNeighborhood||'não informado'} • {d.status}</small></span>
        <select style={{maxWidth:260,margin:0}} value={resolveNeighborhood[d.id]||''} onChange={e=>setResolveNeighborhood(old=>({...old,[d.id]:e.target.value}))}>
          <option value="">Confirmar bairro</option>
          {neighborhoods.filter(n=>n.active&&n.deliveryFee!=null&&n.motoboyFee!=null).map(n=><option key={n.id} value={n.id}>{n.name}</option>)}
        </select><button disabled={!resolveNeighborhood[d.id]} onClick={()=>void resolveFee(d.id)}>Confirmar</button>
      </div>)}
    </section>}
  </main>;
}
