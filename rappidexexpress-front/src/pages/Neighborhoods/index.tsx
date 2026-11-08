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
  const [autoImporting,setAutoImporting] = useState(false);
  const [editingId,setEditingId] = useState<string|null>(null);
  const [editingName,setEditingName] = useState('');
  const [loadingNeighborhoods,setLoadingNeighborhoods] = useState(false);
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
    let cancelled=false;
    setError('');setMessage('');setRates([]);setShops([]);
    setNeighborhoods([]);setLoadingNeighborhoods(true);
    async function loadNeighborhoods(){
      try {
        const [n,s,p]=await Promise.all([
          api.get(`/regions/${cityId}/neighborhoods`),
          admin?api.get(`/regions/${cityId}/stores`):Promise.resolve({data:[]}),
          admin?api.get(`/regions/${cityId}/pending-fees`):Promise.resolve({data:[]}),
        ]);
        let listed:Neighborhood[]=n.data.neighborhoods||[];
        // Primeira abertura: consulta e cadastra automaticamente, sem substituir
        // edições do administrador. Não faz solicitações se já existem bairros.
        if(admin && n.data.feeMode==='neighborhood' && listed.length===0){
          if(!cancelled)setAutoImporting(true);
          try {
            const imported=await api.post(`/regions/${cityId}/neighborhoods/auto-import`);
            listed=imported.data.neighborhoods||[];
            if(!cancelled)setMessage(imported.data.added>0
              ? `${imported.data.added} bairros cadastrados automaticamente a partir do OpenStreetMap. Confira a lista e configure os repasses. ${imported.data.warning||''}`
              : `A busca automática não encontrou novos bairros. ${imported.data.warning||'Você pode cadastrá-los manualmente.'}`);
          }catch(err:any){
            if(!cancelled)setMessage(`A importação automática não foi concluída: ${err.response?.data?.message||'serviço indisponível'}. É possível cadastrar manualmente ou sincronizar novamente.`);
          }finally{if(!cancelled)setAutoImporting(false);}
        }
        if(cancelled)return;
        setNeighborhoods(listed);setShops(s.data||[]);setPending(p.data||[]);
        setShopId(old=>admin
          ? (s.data||[]).some((x:Store)=>x.id===old)?old:(s.data?.[0]?.id||'')
          : currentUserId);
      }catch(err:any){if(!cancelled)setError(err.response?.data?.message||'Erro ao carregar bairros.');}
      finally{if(!cancelled)setLoadingNeighborhoods(false);}
    }
    void loadNeighborhoods();
    return ()=>{cancelled=true};
  },[cityId,admin,currentUserId]);
  useEffect(()=>{
    if (!cityId || !shopId) return;
    api.get(`/regions/${cityId}/stores/${shopId}/rates`).then(r=>setRates(r.data.rates||[]))
      .catch((err:any)=>setError(err.response?.data?.message||'Não foi possível carregar as tarifas.'));
  },[cityId,shopId]);
  const selectedCity = cities.find(x=>x.id===cityId);
  const enabled = useMemo(()=>rates.filter(r=>r.active&&r.enabled).length,[rates]);
  async function syncOnline(){
    if(!cityId)return;
    setSearching(true);setError('');setMessage('');
    try{
      const response=await api.post(`/regions/${cityId}/neighborhoods/auto-import`);
      const result=response.data;
      setNeighborhoods(result.neighborhoods||[]);
      setMessage(result.added>0
        ? `${result.added} novos bairros adicionados. Os bairros e valores já configurados foram preservados. ${result.warning||''}`
        : `Nenhum bairro novo foi encontrado. ${result.warning||''}`);
      if(shopId){const ratesResponse=await api.get(`/regions/${cityId}/stores/${shopId}/rates`);setRates(ratesResponse.data.rates||[]);}
    }catch(err:any){setError(err.response?.data?.message||'Não foi possível sincronizar bairros.');}
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
      return true;
    }catch(err:any){setError(err.response?.data?.message||'Erro ao alterar bairro.');return false;}
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
      {(loadingNeighborhoods||autoImporting)&&<div className="rpx-notice">Buscando automaticamente bairros da cidade e preparando o cadastro...</div>}
      {!loadingNeighborhoods&&neighborhoods.length===0&&<div className="rpx-notice">Não há bairros cadastrados para esta cidade. Se a busca automática não trouxe resultados, use <b>Sincronizar bairros</b> ou adicione os nomes manualmente.</div>}
      <p>Os bairros são importados automaticamente na primeira abertura desta tela, quando a cidade está no modo por bairro. Você pode sincronizar novamente, corrigir nomes, ativar/desativar ou adicionar bairros que faltarem. A importação não substitui configurações existentes.</p>
      <button className="rpx-small" disabled={searching||autoImporting||loadingNeighborhoods} onClick={syncOnline}>{searching?'Sincronizando...':'Sincronizar bairros automaticamente (OSM)'}</button>
      <p style={{marginBottom:4}}>Adicionar bairros que faltarem (um por linha, vírgula ou ponto e vírgula):</p>
      <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} placeholder={'Centro\nBacuri\nSanta Rita'}/>
      <button onClick={add} disabled={saving||!input.trim()}>Adicionar bairros informados</button>
      <div className="rpx-list">{neighborhoods.map(n=><div className="rpx-list-row" key={n.id}>
        <span>{editingId===n.id?<>
          <input aria-label={`Editar nome do bairro ${n.name}`} value={editingName} maxLength={110}
            onChange={e=>setEditingName(e.target.value)} style={{maxWidth:250,marginRight:6}}/>
          <button className="rpx-small" disabled={!editingName.trim()} onClick={async()=>{
            if(await changeNeighborhood(n,{name:editingName.trim()}))setEditingId(null);
          }}>Salvar nome</button>
          <button className="rpx-small" onClick={()=>setEditingId(null)}>Cancelar</button>
        </>:<b>{n.name}</b>}<br/><small>Repasse do entregador é independente da taxa da loja.</small></span>
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
        {editingId!==n.id&&<button className="rpx-small" onClick={()=>{setEditingId(n.id);setEditingName(n.name);}}>Editar nome</button>}
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
