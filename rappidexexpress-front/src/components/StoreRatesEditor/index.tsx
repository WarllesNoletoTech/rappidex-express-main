/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { DeliveryContext } from '../../context/DeliveryContext';
import { parseStoreCsv, normalizeStoreNeighborhood } from './storeCsv';

export type ShopRateDraft={neighborhoodId:string;name:string;cityActive:boolean;enabled:boolean;deliveryFee:number|null;motoboyFee:number|null};
type Props={cityId:string;storeId?:string;onChange?:(draft:ShopRateDraft[])=>void;allowDirectSave?:boolean;heading?:string};
type Rate={neighborhoodId:string;name:string;active:boolean;enabled:boolean;deliveryFee:number|null;motoboyFee:number|null};
type Draft={neighborhoodId:string;name:string;active:boolean;enabled:boolean;deliveryFee:string;motoboyFee:string};
const formatted=(v:number|null)=>v==null?'':String(v).replace('.',',');
function parseAmount(v:string):number|null{
  const s=v.trim().replace(/R\$/gi,'').replace(/\s/g,'');
  if(!s)return null;
  const n=Number(s.includes(',')?s.replace(/\./g,'').replace(',','.'):s);
  if(!Number.isFinite(n)||n<0||n>100000||Math.abs(Math.round(n*100)-n*100)>1e-6)throw Error('Informe valores de 0 a 100.000,00 com até duas casas decimais.');
  return Math.round(n*100)/100;
}
export function StoreRatesEditor({cityId,storeId,allowDirectSave=false,heading='Tarifas por bairro da loja'}:Props){
  const navigate=useNavigate();
  const {permission}=useContext(DeliveryContext);
  const admin=permission==='admin'||permission==='superadmin';
  const [mode,setMode]=useState('fixed');
  const [rows,setRows]=useState<Draft[]>([]);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [importMessage,setImportMessage]=useState('');
  useEffect(()=>{
    if(!cityId || !storeId){setRows([]);return;}
    let active=true;setLoading(true);setError('');setMessage('');
    api.get(`/regions/${cityId}/stores/${storeId}/rates`).then(r=>{
      if(!active)return;
      setMode(r.data.feeMode||'fixed');
      setRows((r.data.rates||[]).map((x:Rate)=>({neighborhoodId:x.neighborhoodId,name:x.name,active:x.active,
        enabled:x.enabled,deliveryFee:formatted(x.deliveryFee),motoboyFee:formatted(x.motoboyFee)})));
    }).catch(e=>{if(active)setError(e.response?.data?.message||'Erro ao carregar as taxas desta loja.');})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[cityId,storeId]);
  const update=(id:string,change:Partial<Draft>)=>setRows(old=>old.map(r=>r.neighborhoodId===id?{...r,...change}:r));
  function downloadStoreCsv(){
    const header='bairro;taxa_entrega;repasse_motoboy;atender';
    const lines=rows.map(row=>[row.name,row.deliveryFee,row.motoboyFee,row.enabled?'sim':'não'].join(';'));
    const blob=new Blob(['\uFEFF'+[header,...lines].join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
    a.download='tarifas_estabelecimento_rappidex.csv';a.click();URL.revokeObjectURL(url);
  }
  async function loadStoreCsv(file:File|undefined){
    if(!file)return;
    setError('');setImportMessage('');
    try{
      const parsed=parseStoreCsv(await file.text());
      const byName=new Map(rows.map(row=>[normalizeStoreNeighborhood(row.name),row]));
      for(const entry of parsed){
        const match=byName.get(normalizeStoreNeighborhood(entry.name));
        if(!match)throw Error(`Bairro "${entry.name}" não está cadastrado nesta cidade. Cadastre-o em Cidades antes.`);
        if(entry.enabled&&!match.active)throw Error(`Bairro "${entry.name}" está desativado na cidade.`);
        const delivery=parseAmount(entry.deliveryFee),motoboy=parseAmount(entry.motoboyFee);
        if(entry.enabled&&(delivery===null||motoboy===null))throw Error(`Configure valores para ${entry.name}.`);
        if(delivery!==null&&motoboy!==null&&motoboy>delivery)throw Error(`Repasse superior à entrega em ${entry.name}.`);
      }
      const imported=new Map(parsed.map(entry=>[normalizeStoreNeighborhood(entry.name),entry]));
      setRows(old=>old.map(row=>{
        const entry=imported.get(normalizeStoreNeighborhood(row.name));
        return entry?{...row,deliveryFee:entry.deliveryFee,motoboyFee:entry.motoboyFee,enabled:entry.enabled}:row;
      }));
      setImportMessage(`${parsed.length} bairro(s) preenchido(s) na tela. Revise e clique em Salvar taxas desta loja.`);
    }catch(e:any){setError(e.message||'CSV inválido.');}
  }
  async function save(){
    if(!admin||!storeId||!cityId)return;
    setError('');setMessage('');setSaving(true);
    try{
      const rates=rows.map(r=>{
        const deliveryFee=parseAmount(r.deliveryFee),motoboyFee=parseAmount(r.motoboyFee);
        if(r.enabled&&(!r.active||deliveryFee===null||motoboyFee===null))throw Error(`Defina os dois valores para ativar ${r.name}.`);
        if(deliveryFee!==null&&motoboyFee!==null&&motoboyFee>deliveryFee)throw Error(`Repasse maior que taxa de entrega em ${r.name}.`);
        return {neighborhoodId:r.neighborhoodId,enabled:r.enabled,deliveryFee,motoboyFee};
      });
      const response=await api.put(`/regions/${cityId}/stores/${storeId}/rates`,{rates});
      setRows((response.data.rates||[]).map((x:Rate)=>({neighborhoodId:x.neighborhoodId,name:x.name,active:x.active,
        enabled:x.enabled,deliveryFee:formatted(x.deliveryFee),motoboyFee:formatted(x.motoboyFee)})));
      setMessage('Tarifas e repasses desta loja atualizados. Pedidos antigos mantêm seus valores.');
    }catch(e:any){setError(e.response?.data?.message||e.message||'Não foi possível salvar as tarifas.');}
    finally{setSaving(false);}
  }
  return <section className="rpx-embedded"><h3>{heading}</h3>
    {error&&<div className="rpx-error" role="alert">{error}</div>}
    {message&&<div className="rpx-notice">{message}</div>}
    {!cityId?<p>Selecione a cidade.</p>:!storeId?<p>Salve o cadastro da loja primeiro. Depois, abra o perfil para configurar seus bairros e valores.</p>:loading?<p>Carregando valores...</p>:mode==='fixed'?<p>Esta cidade utiliza taxa fixa. Não há tarifas individuais por bairro.</p>:<>
      <p>Valores exclusivos desta loja. Taxa de entrega é o valor integral cobrado; repasse do motoboy é definido separadamente. {admin?'Somente administradores podem alterar.':'Somente consulta.'}</p>
      {admin&&allowDirectSave&&<div style={{marginBottom:16}}>
        <label>Importar valores desta loja por CSV (<code>bairro;taxa_entrega;repasse_motoboy;atender</code>)</label>
        <button className="rpx-small" type="button" onClick={downloadStoreCsv} disabled={!rows.length}>Baixar modelo com bairros desta loja</button>
        <input type="file" aria-label="Importar valores de bairros para esta loja" accept=".csv,.txt,text/csv" onChange={e=>{void loadStoreCsv(e.target.files?.[0]);e.target.value='';}}/>
        {importMessage&&<p className="rpx-notice">{importMessage}</p>}
        <small>A importação apenas preenche a tabela desta loja. Clique em Salvar para confirmar.</small>
      </div>}
      {!rows.length&&<p>Nenhum bairro cadastrado na cidade. {admin&&<button className="rpx-small" type="button" onClick={()=>navigate(`/cidades/${cityId}/bairros`)}>Cadastrar bairros</button>}</p>}
      <div className="rpx-list">{rows.map(r=><div key={r.neighborhoodId} className="rpx-list-row" style={{alignItems:'center',gap:12}}>
        <span style={{flex:'1 1 160px'}}><b>{r.name}</b><br/><small>{r.active?'Ativo na cidade':'Inativo na cidade'}</small></span>
        <label className="rpx-check" style={{whiteSpace:'nowrap'}}><input type="checkbox" checked={r.enabled} disabled={!admin||!allowDirectSave||!r.active||saving} onChange={e=>update(r.neighborhoodId,{enabled:e.target.checked})}/> Atender</label>
        <label style={{flex:'0 1 140px'}}>Entrega R$
          <input aria-label={`Taxa de entrega ${r.name}`} type="text" inputMode="decimal" value={r.deliveryFee} placeholder="10,00" disabled={!admin||!allowDirectSave||saving} onChange={e=>update(r.neighborhoodId,{deliveryFee:e.target.value})}/>
        </label>
        <label style={{flex:'0 1 140px'}}>Motoboy R$
          <input aria-label={`Repasse motoboy ${r.name}`} type="text" inputMode="decimal" value={r.motoboyFee} placeholder="7,00" disabled={!admin||!allowDirectSave||saving} onChange={e=>update(r.neighborhoodId,{motoboyFee:e.target.value})}/>
        </label>
      </div>)}</div>
      {admin&&allowDirectSave&&<button type="button" disabled={saving||!rows.length} onClick={()=>void save()}>{saving?'Salvando...':'Salvar taxas desta loja'}</button>}
      {!admin&&<small>Peça ao administrador do Rappidex para editar os valores desta loja.</small>}
    </>}
  </section>;
}
