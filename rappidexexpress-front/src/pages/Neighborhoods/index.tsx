/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import '../regional-admin.css';

type Neighborhood = {id:string;name:string;active:boolean;motoboyFee?:number};
type Store = {id:string;name:string;type:string};
type Rate = Neighborhood & {enabled:boolean;deliveryFee:number};
const money = (value:number) => Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function Neighborhoods() {
  const navigate=useNavigate();
  const {cityId:cityFromRoute}=useParams<{cityId:string}>();
  const {token, permission} = useContext(DeliveryContext);
  const admin = permission === 'admin' || permission === 'superadmin';
  const [cities,setCities] = useState<Array<{id:string;name:string;state:string;feeMode?:string;platformServiceFee?:number}>>([]);
  const [cityId,setCityId] = useState('');
  const [currentUserId,setCurrentUserId] = useState('');
  const [neighborhoods,setNeighborhoods] = useState<Neighborhood[]>([]);
  const [shops,setShops] = useState<Store[]>([]);
  const [shopId,setShopId] = useState('');
  const [rates,setRates] = useState<Rate[]>([]);
  const [input,setInput] = useState('');
  const [error,setError] = useState('');
  const [message,setMessage] = useState('');
  const [saving,setSaving] = useState(false);
  const [searching,setSearching] = useState(false);
  const [pending,setPending] = useState<Array<{id:string;clientName:string;storeName:string;addressNeighborhood:string;status:string}>>([]);
  const [resolveNeighborhood,setResolveNeighborhood] = useState<Record<string,string>>({});
  api.defaults.headers.Authorization = `Bearer ${token}`;
  useEffect(()=>{
    Promise.all([api.get('/city'),api.get('/user/myself')]).then(([c,u])=>{
      const list = Array.isArray(c.data?.data)?c.data.data:c.data;
      setCities(Array.isArray(list)?list:[]);
      setCurrentUserId(u.data.id);
      setCityId(old=>cityFromRoute||old||String(u.data.cityId||list?.[0]?.id||''));
    }).catch((err:any)=>setError(err.response?.data?.message||'Falha ao carregar cidades.'));
  },[token,cityFromRoute]);
  useEffect(()=>{
    if (!cityId) return;
    setError('');setMessage('');setRates([]);setShops([]);
    Promise.all([api.get(`/regions/${cityId}/neighborhoods`),admin?api.get(`/regions/${cityId}/stores`):Promise.resolve({data:[]}),admin?api.get(`/regions/${cityId}/pending-fees`):Promise.resolve({data:[]})])
      .then(([n,s,p])=>{setPending(p.data||[]);setNeighborhoods(n.data.neighborhoods||[]);setShops(s.data||[]);
        setShopId(old=>admin ? (s.data||[]).some((x:Store)=>x.id===old)?old:(s.data?.[0]?.id||'') : currentUserId);
      }).catch((err:any)=>setError(err.response?.data?.message||'Erro ao carregar bairros.'));
  },[cityId,admin,currentUserId]);
  useEffect(()=>{
    if (!cityId || !shopId) return;
    api.get(`/regions/${cityId}/stores/${shopId}/rates`).then(r=>setRates(r.data.rates||[]))
      .catch((err:any)=>setError(err.response?.data?.message||'Não foi possível carregar as tarifas.'));
  },[cityId,shopId]);
  const selectedCity = cities.find(x=>x.id===cityId);
  const enabled = useMemo(()=>rates.filter(r=>r.active&&r.enabled).length,[rates]);
  async function searchOnline(){
    setSearching(true);setError('');setMessage('');
    try{const response=await api.get(`/regions/${cityId}/neighborhoods/suggestions`);
      const names=response.data.names||[];
      setInput(prev=>[prev,...names].filter(Boolean).join('\n'));
      setMessage(names.length
        ? `${names.length} sugestões encontradas. Revise os nomes e clique em "Cadastrar / importar". A busca não salva automaticamente. ${response.data.warning||''}`
        : `Nenhum bairro retornado pela consulta online. Adicione manualmente os bairros conhecidos, um por linha. ${response.data.warning||''}`);
    }catch(e:any){setError(e.response?.data?.message||'Não foi possível pesquisar bairros online.');}
    finally{setSearching(false);}
  }
  async function add() {
    const names = input.split(/[\n;,]+/).map(s=>s.trim()).filter(Boolean);
    if (!names.length) return;
    setSaving(true);setError('');
    try {
      const response = await api.post(`/regions/${cityId}/neighborhoods`,{names});
      setNeighborhoods(response.data.neighborhoods);setInput('');
      setMessage(`${response.data.added} bairros adicionados. Novos bairros começam desativados nas lojas.`);
      if(shopId){const r=await api.get(`/regions/${cityId}/stores/${shopId}/rates`);setRates(r.data.rates);}
    } catch(err:any){setError(err.response?.data?.message||'Não foi possível importar os bairros.');} finally{setSaving(false);}
  }
  async function changeNeighborhood(n:Neighborhood,patch:Partial<Omit<Neighborhood,'motoboyFee'>> & {motoboyFee?:number|null}) {
    try{const result=await api.put(`/regions/${cityId}/neighborhoods/${n.id}`,patch);
      setNeighborhoods(result.data.neighborhoods);
      if(shopId){const r=await api.get(`/regions/${cityId}/stores/${shopId}/rates`);setRates(r.data.rates);}
    }catch(err:any){setError(err.response?.data?.message||'Erro ao alterar bairro.');}
  }
  async function resolveFee(id:string){
    if(!resolveNeighborhood[id])return;
    try{await api.put(`/regions/${cityId}/deliveries/${id}/resolve-fee`,{neighborhoodId:resolveNeighborhood[id]});
      setPending(old=>old.filter(x=>x.id!==id));setMessage('Tarifa do pedido registrada.');
    }catch(e:any){setError(e.response?.data?.message||'Erro ao regularizar pedido.');}
  }
  async function saveRates(){
    setSaving(true);setError('');setMessage('');
    try{const payload = rates.map(r=>({neighborhoodId:r.id,enabled:r.active&&r.enabled,deliveryFee:Number(r.deliveryFee)}));
      const result = await api.put(`/regions/${cityId}/stores/${shopId}/rates`,{rates:payload});
      setRates(result.data.rates);setMessage('Tarifas da loja salvas com sucesso.');
    }catch(err:any){setError(err.response?.data?.message||'Falha ao salvar tarifas.');}finally{setSaving(false);}
  }
  return <main className="rpx-page">
    {admin&&cityFromRoute&&<button className="rpx-small" onClick={()=>navigate('/cidades')}>← Voltar para Cidades</button>}
    <h1>Bairros e taxas de entrega</h1>
    <p>O cadastro dos bairros pertence à cidade. A administração define o repasse do entregador em cada bairro; cada loja define sua própria tarifa e a cobertura.</p>
    {error && <div className="rpx-error" role="alert">{error}</div>}
    {message && <div className="rpx-notice">{message}</div>}
    <section className="rpx-card">
      <label>Cidade</label>
      <select value={cityId} disabled={Boolean(cityFromRoute)} onChange={e=>setCityId(e.target.value)}>{cities.map(c=><option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}</select>
      <p><strong>Modalidade:</strong> {selectedCity?.feeMode==='neighborhood'?'Por bairro':'Taxa fixa'} • <strong>Taxa adicional Rappidex:</strong> {money(selectedCity?.platformServiceFee||0)}</p>
      {selectedCity?.feeMode!=='neighborhood'&&<p>Para ativar valores por bairro, primeiro altere a modalidade na aba Cidades. Cidades atuais permanecem com taxa fixa por padrão.</p>}
    </section>
    {admin && <section className="rpx-card">
      <h2>Cadastro centralizado de bairros ({neighborhoods.length})</h2>
      {neighborhoods.length===0&&<div className="rpx-notice">Esta cidade ainda não tem bairros cadastrados. Clique em <b>Buscar sugestões de bairros online</b>, confira o resultado e depois em <b>Cadastrar / importar</b>. Se a busca não retornar nomes, informe-os manualmente.</div>}
      <p>Adicione bairros individualmente ou cole uma lista (um nome por linha, vírgula ou ponto e vírgula). Nomes repetidos são ignorados.</p>
      <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} placeholder={'Centro\nBacuri\nSanta Rita'}/>
      <button className="rpx-small" disabled={searching} onClick={searchOnline}>{searching?'Buscando...':'Buscar sugestões de bairros online (OSM)'}</button>
      <button onClick={add} disabled={saving||!input.trim()}>Cadastrar / importar nomes revisados</button>
      <div className="rpx-list">{neighborhoods.map(n=><div className="rpx-list-row" key={n.id}>
        <span><b>{n.name}</b><br/><small>Repasse do entregador é independente da taxa da loja.</small></span>
        <label>Motoboy R$
          <input className="rpx-currency" aria-label={`Repasse ao motoboy para ${n.name}`} type="number" min="0" step="0.01" key={`${n.id}-${n.motoboyFee??'empty'}`} defaultValue={n.motoboyFee??''} placeholder="Definir" onBlur={e=>{
            const val=e.currentTarget.value.trim();
            if(val==='' && n.motoboyFee===undefined)return;
            if(val!==''&&Number(val)===n.motoboyFee)return;
            if(val!==''&&(!Number.isFinite(Number(val))||Number(val)<0)){setError('Repasse inválido.');return;}
            changeNeighborhood(n,{motoboyFee:val===''?null:Number(val)});
          }}/>
        </label>
        <label className="rpx-check"><input type="checkbox" checked={n.active} onChange={e=>changeNeighborhood(n,{active:e.target.checked})}/>Ativo na cidade</label>
        <button className="rpx-small" onClick={()=>{const newName=window.prompt('Nome corrigido do bairro:',n.name);if(newName&&newName.trim()!==n.name)changeNeighborhood(n,{name:newName});}}>Editar</button>
      </div>)}</div>
      <p>Ao editar o campo <b>Motoboy R$</b>, clique fora dele para salvar. Sem repasse definido, novos pedidos do bairro ficam pendentes de configuração.</p>
    </section>}
    <section className="rpx-card">
      <h2>Tarifas e cobertura da loja</h2>
      {admin && <><label>Estabelecimento</label><select value={shopId} onChange={e=>setShopId(e.target.value)}><option value="">Selecione uma loja</option>{shops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></>}
      {!shopId?<p>Selecione uma loja para configurar.</p>:<>
        <p>{enabled} bairros atendidos de {rates.length} cadastrados. A loja controla sua tarifa; a administração define o repasse do motoboy e a taxa adicional do Rappidex.</p>
        {rates.length===0&&<div className="rpx-notice">Nenhum bairro foi cadastrado nesta cidade. O administrador precisa cadastrá-los em <b>Cidades → Gerenciar bairros</b> antes da configuração de tarifas.</div>}
        <div className="rpx-list">{rates.map(rate=><div className="rpx-list-row" key={rate.id}>
          <span>{rate.name} {!rate.active&&<small> (inativo na cidade)</small>}</span>
          <label className="rpx-check"><input type="checkbox" checked={rate.active&&rate.enabled} disabled={!rate.active} onChange={e=>setRates(prev=>prev.map(x=>x.id===rate.id?{...x,enabled:e.target.checked}:x))}/>Atender</label>
          <label>Taxa da loja R$ <input className="rpx-currency" type="number" min="0" step="0.01" value={rate.deliveryFee} disabled={!rate.active} onChange={e=>setRates(prev=>prev.map(x=>x.id===rate.id?{...x,deliveryFee:Number(e.target.value)}:x))}/></label>
        </div>)}</div>
        <button disabled={saving||!rates.length||!shopId} onClick={saveRates}>Salvar tarifas da loja</button>
      </>}
    </section>
    {admin&&pending.length>0&&<section className="rpx-card">
      <h2>Entregas com bairro pendente de confirmação</h2>
      <p>Pedidos externos continuam chegando mesmo sem bairro reconhecido, mas não entram no fechamento financeiro até terem sua tarifa validada.</p>
      {pending.length===0?<p>Nenhum pedido pendente encontrado.</p>:pending.map(d=><div className="rpx-list-row" key={d.id}>
        <span><b>{d.storeName}</b> — {d.clientName}<br/><small>Bairro recebido: {d.addressNeighborhood||'não informado'} • {d.status}</small></span>
        <select style={{maxWidth:240,margin:0}} value={resolveNeighborhood[d.id]||''} onChange={e=>setResolveNeighborhood(old=>({...old,[d.id]:e.target.value}))}>
          <option value="">Confirmar bairro</option>{neighborhoods.filter(n=>n.active).map(n=><option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
        <button disabled={!resolveNeighborhood[d.id]} onClick={()=>resolveFee(d.id)}>Validar tarifa</button>
      </div>)}
    </section>}
  </main>;
}
