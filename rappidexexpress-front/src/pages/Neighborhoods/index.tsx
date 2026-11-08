/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import '../regional-admin.css';

type Neighborhood = {id:string;name:string;active:boolean};
type SourceCity = {id:string;name:string;state:string;label:string};
type Store = {id:string;name:string;type:string};
type Rate = Neighborhood & {enabled:boolean;deliveryFee:number};
const money = (value:number) => Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function Neighborhoods() {
  const navigate=useNavigate();
  const {cityId:cityFromRoute}=useParams<{cityId:string}>();
  const {token, permission} = useContext(DeliveryContext);
  const admin = permission === 'admin' || permission === 'superadmin';
  const [cities,setCities] = useState<Array<{id:string;name:string;state:string;feeMode?:string;platformServiceFee?:number;neighborhoodOsmSourceId?:string;neighborhoodOsmSourceLabel?:string}>>([]);
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
  const [citySearch,setCitySearch] = useState('');
  const [sourceCities,setSourceCities] = useState<SourceCity[]>([]);
  const [sourceCityId,setSourceCityId] = useState('');
  const [sourceProvider,setSourceProvider] = useState('');
  const [loadingSources,setLoadingSources] = useState(false);
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
        const listed:Neighborhood[]=n.data.neighborhoods||[];
        // A origem deve ser conferida e selecionada pelo administrador.
        // Nenhum bairro é importado de outra cidade sem essa confirmação.
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
  // A lista de cidades do mapa é procurada automaticamente, mas a importação
  // exige a escolha explícita da origem para prevenir bairros de outro município.
  useEffect(()=>{
    if(!admin || !cityId || !cities.length)return;
    const target=cities.find(c=>c.id===cityId);
    if(!target)return;
    let active=true;
    const q=`${target.name}, ${target.state}, Brasil`;
    setCitySearch(q);setSourceCityId('');setSourceCities([]);setLoadingSources(true);
    api.get(`/regions/${cityId}/neighborhoods/municipalities`,{params:{q}}).then(r=>{
      if(!active)return;
      const opts:SourceCity[]=r.data.options||[];
      setSourceCities(opts);setSourceProvider(r.data.source||'');
      if(!opts.length)setMessage(r.data.warning || 'Não foram encontrados municípios. Revise o nome e o estado.');
      const linked=target.neighborhoodOsmSourceId;
      if(linked && opts.some(c=>c.id===linked))setSourceCityId(linked);
    }).catch(()=>{if(active)setMessage('Não foi possível consultar os municípios no IBGE ou no mapa. Tente novamente ou cadastre manualmente.');})
    .finally(()=>{if(active)setLoadingSources(false)});
    return ()=>{active=false};
  },[admin,cityId,cities]);
  async function searchSourceCities(provider?:'osm'){
    if(!cityId||citySearch.trim().length<2)return;
    setLoadingSources(true);setError('');setSourceCityId('');setSourceCities([]);
    try{
      const response=await api.get(`/regions/${cityId}/neighborhoods/municipalities`,{params:{q:citySearch.trim(),...(provider?{provider}: {})}});
      setSourceCities(response.data.options||[]);setSourceProvider(response.data.source||'');
      setMessage(response.data.warning || ((response.data.options||[]).length ? 'Confira o nome e o estado antes de selecionar.' : 'Nenhuma cidade encontrada.'));
    }catch(err:any){setError(err.response?.data?.message||'Erro ao buscar cidades no mapa.');}
    finally{setLoadingSources(false);}
  }
  useEffect(()=>{
    if (!cityId || !shopId) return;
    api.get(`/regions/${cityId}/stores/${shopId}/rates`).then(r=>setRates(r.data.rates||[]))
      .catch((err:any)=>setError(err.response?.data?.message||'Não foi possível carregar as tarifas.'));
  },[cityId,shopId]);
  const selectedCity = cities.find(x=>x.id===cityId);
  const enabled = useMemo(()=>rates.filter(r=>r.active&&r.enabled).length,[rates]);
  async function syncOnline(){
    if(!cityId||!sourceCityId)return;
    const origin=sourceCities.find(c=>c.id===sourceCityId);
    if(!window.confirm(`Importar bairros de ${origin?.label||sourceCityId} para ${selectedCity?.name} — ${selectedCity?.state} no Rappidex?\nConfira a cidade de origem antes de continuar.`))return;
    setSearching(true);setError('');setMessage('');
    try{
      const response=await api.post(`/regions/${cityId}/neighborhoods/auto-import`,{sourceOsmId:sourceCityId});
      const result=response.data;
      setNeighborhoods(result.neighborhoods||[]);
      const selected=sourceCities.find(c=>c.id===sourceCityId);
      if(!result.totalFound){setError(result.warning || 'Nenhum bairro encontrado pelas APIs. Você pode adicionar bairros manualmente.');return;}
      setCities(old=>old.map(c=>c.id===cityId?{...c,neighborhoodOsmSourceId:sourceCityId,neighborhoodOsmSourceLabel:selected?.label}:c));
      setMessage(result.added>0
        ? `${result.added} bairros importados de ${selected?.label||'cidade selecionada'} para a cidade no Rappidex. Os dados existentes foram preservados. ${result.warning||''}`
        : `Nenhum bairro novo foi encontrado em ${selected?.label||'cidade selecionada'}. ${result.warning||''}`);
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
  async function changeNeighborhood(n:Neighborhood,patch:Partial<Neighborhood>) {
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
    try{
      const fee=Number(selectedCity?.platformServiceFee||0);
      if(rates.some(r=>r.active&&r.enabled&&r.deliveryFee<fee)){
        setError(`O valor total de cada bairro atendido deve ser igual ou superior à taxa administrativa (${money(fee)}).`);return;
      }
      const payload = rates.map(r=>({neighborhoodId:r.id,enabled:r.active&&r.enabled,deliveryFee:Number(r.deliveryFee)}));
      const result = await api.put(`/regions/${cityId}/stores/${shopId}/rates`,{rates:payload});
      setRates(result.data.rates);setMessage('Tarifas da loja salvas com sucesso.');
    }catch(err:any){setError(err.response?.data?.message||'Falha ao salvar tarifas.');}finally{setSaving(false);}
  }
  return <main className="rpx-page">
    {admin&&cityFromRoute&&<button className="rpx-small" onClick={()=>navigate('/cidades')}>← Voltar para Cidades</button>}
    <h1>Bairros e taxas de entrega</h1>
    <p>A loja repassa integralmente sua tarifa ao Rappidex; o Rappidex retém a taxa administrativa configurada na cidade e paga o restante ao entregador.</p>
    {error && <div className="rpx-error" role="alert">{error}</div>}
    {message && <div className="rpx-notice">{message}</div>}
    <section className="rpx-card">
      <label>Cidade cadastrada no Rappidex (destino)</label>
      <select value={cityId} disabled={!admin} onChange={e=>{setCityId(e.target.value);if(cityFromRoute)navigate(`/cidades/${e.target.value}/bairros`);}}>{cities.map(c=><option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}</select>
      <p><strong>Modalidade:</strong> {selectedCity?.feeMode==='neighborhood'?'Por bairro':'Taxa fixa'} • <strong>Taxa administrativa retida pelo Rappidex:</strong> {money(selectedCity?.platformServiceFee||0)}</p>
      {selectedCity?.feeMode!=='neighborhood'&&<p>Para ativar valores por bairro, primeiro altere a modalidade na aba Cidades. Cidades atuais permanecem com taxa fixa por padrão.</p>}
    </section>
    {admin && <section className="rpx-card">
      <h2>Cadastro centralizado de bairros ({neighborhoods.length})</h2>
      {loadingNeighborhoods&&<div className="rpx-notice">Carregando os bairros cadastrados...</div>}
      {!loadingNeighborhoods&&neighborhoods.length===0&&<div className="rpx-notice">Nenhum bairro cadastrado. Selecione o município de origem no IBGE e confirme a sincronização. Também é possível adicionar bairros manualmente.</div>}
      <p>Escolha o município correspondente no IBGE (ou no OpenStreetMap, se o IBGE estiver indisponível) para vincular os bairros à cidade acima. A consulta de bairros usa a API Overpass/OpenStreetMap, filtrada pelo limite geográfico do IBGE. A sincronização só adiciona bairros novos; nomes editados e tarifas existentes são preservados.</p>
      <div className="rpx-embedded" style={{marginBottom:14}}>
        <label>Pesquisar município no IBGE (origem)</label>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input style={{flex:'1 1 220px'}} value={citySearch} onChange={e=>setCitySearch(e.target.value)} placeholder="Ex.: Palmas, Tocantins, Brasil" />
          <button className="rpx-small" disabled={loadingSources||citySearch.trim().length<2} onClick={()=>void searchSourceCities()}>{loadingSources?'Pesquisando...':'Pesquisar cidades'}</button>
          <button className="rpx-small" disabled={loadingSources||citySearch.trim().length<2} onClick={()=>void searchSourceCities('osm')}>Tentar fonte alternativa (OSM)</button>
        </div>
        {sourceProvider&&<p><strong>Fonte de municípios:</strong> {sourceProvider}. Os bairros são consultados no OpenStreetMap.</p>}
        {selectedCity?.neighborhoodOsmSourceLabel&&<p><b>Origem vinculada anteriormente:</b> {selectedCity.neighborhoodOsmSourceLabel}</p>}
        <label>Selecione o município correto encontrado</label>
        <select value={sourceCityId} onChange={e=>setSourceCityId(e.target.value)} disabled={loadingSources||!sourceCities.length}>
          <option value="">{loadingSources?'Buscando...':'Selecione um município e confira a UF'}</option>
          {sourceCities.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <p><strong>Destino Rappidex:</strong> {selectedCity?.name} — {selectedCity?.state}<br/>
          <strong>Origem selecionada:</strong> {sourceCities.find(c=>c.id===sourceCityId)?.label||'Nenhuma cidade selecionada'}</p>
        <button className="rpx-small" disabled={!sourceCityId||searching||loadingSources||loadingNeighborhoods} onClick={syncOnline}>
          {searching?'Sincronizando bairros...':'Importar bairros do município selecionado'}
        </button>
      </div>
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
        </>:<b>{n.name}</b>}<br/><small>O repasse ao motoboy é calculado automaticamente conforme a tarifa da loja.</small></span>
        <label className="rpx-check"><input type="checkbox" checked={n.active} onChange={e=>changeNeighborhood(n,{active:e.target.checked})}/>Ativo na cidade</label>
        {editingId!==n.id&&<button className="rpx-small" onClick={()=>{setEditingId(n.id);setEditingName(n.name);}}>Editar nome</button>}
      </div>)}</div>
      <p>Dados de mapas: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a> e IBGE. A taxa administrativa é cadastrada em Cidades. O repasse do entregador é calculado por pedido: <strong>tarifa da loja − taxa administrativa</strong>.</p>
    </section>}
    <section className="rpx-card">
      <h2>Tarifas e cobertura da loja</h2>
      {admin && <><label>Estabelecimento</label><select value={shopId} onChange={e=>setShopId(e.target.value)}><option value="">Selecione uma loja</option>{shops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></>}
      {!shopId?<p>Selecione uma loja para configurar.</p>:<>
        <p>{enabled} bairros atendidos de {rates.length} cadastrados. A loja configura o valor integral de entrega; o Rappidex retém a taxa administrativa e transfere o restante ao motoboy.</p>
        {rates.length===0&&<div className="rpx-notice">Nenhum bairro foi cadastrado nesta cidade. O administrador precisa cadastrá-los em <b>Cidades → Gerenciar bairros</b> antes da configuração de tarifas.</div>}
        <div className="rpx-list">{rates.map(rate=><div className="rpx-list-row" key={rate.id}>
          <span>{rate.name} {!rate.active&&<small> (inativo na cidade)</small>}</span>
          <label className="rpx-check"><input type="checkbox" checked={rate.active&&rate.enabled} disabled={!rate.active} onChange={e=>setRates(prev=>prev.map(x=>x.id===rate.id?{...x,enabled:e.target.checked}:x))}/>Atender</label>
          <label>Taxa total R$ <input className="rpx-currency" type="number" min={selectedCity?.platformServiceFee||0} step="0.01" value={rate.deliveryFee} disabled={!rate.active} onChange={e=>setRates(prev=>prev.map(x=>x.id===rate.id?{...x,deliveryFee:Number(e.target.value)}:x))}/></label>
          <small>Motoboy: {rate.deliveryFee >= Number(selectedCity?.platformServiceFee||0) ? money(Math.round((rate.deliveryFee-Number(selectedCity?.platformServiceFee||0))*100)/100) : "valor inferior à taxa administrativa"}</small>
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
