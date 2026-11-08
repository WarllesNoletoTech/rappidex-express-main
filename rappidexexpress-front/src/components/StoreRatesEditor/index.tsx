/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export type ShopRateDraft={neighborhoodId:string;name:string;cityActive:boolean;enabled:boolean;deliveryFee:number};
type Props={cityId:string;storeId?:string;onChange?:(draft:ShopRateDraft[])=>void;allowDirectSave?:boolean;heading?:string};
const money=(v:number|null|undefined)=>v==null?'Pendente':Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function StoreRatesEditor({cityId,heading='Bairros e taxas da cidade'}:Props){
  const navigate=useNavigate();
  const [mode,setMode]=useState('fixed');
  const [rows,setRows]=useState<Array<{id:string;name:string;active:boolean;deliveryFee?:number;motoboyFee?:number}>>([]);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    if(!cityId){setRows([]);return;}
    let active=true;setLoading(true);setError('');
    api.get(`/regions/${cityId}/neighborhoods`).then(r=>{
      if(!active)return;setRows(r.data.neighborhoods||[]);setMode(r.data.feeMode||'fixed');
    }).catch(e=>{if(active)setError(e.response?.data?.message||'Erro ao consultar bairros.');})
      .finally(()=>{if(active)setLoading(false)});
    return ()=>{active=false};
  },[cityId]);
  return <section className="rpx-embedded"><h3>{heading}</h3>
    {error&&<div className="rpx-error">{error}</div>}
    {loading&&<p>Carregando valores...</p>}
    {!cityId?<p>Selecione a cidade primeiro.</p>:mode==='fixed'?<p>Esta cidade utiliza taxa fixa.</p>:<>
      <p>A taxa integral da entrega e o repasse do motoboy são definidos pela administração em Cidades → Gerenciar bairros. Este quadro é somente para consulta.</p>
      {rows.filter(r=>r.active).map(r=><div className="rpx-embedded-row" key={r.id}>
        <span>{r.name}</span><span>Entrega: <b>{money(r.deliveryFee)}</b></span><span>Motoboy: <b>{money(r.motoboyFee)}</b></span>
      </div>)}
      {!rows.length&&<p>Nenhum bairro cadastrado.</p>}
      <small>Para alterar os valores, acesse a aba Cidades com uma conta de administrador.</small>
      <button className="rpx-secondary" type="button" onClick={()=>navigate(`/cidades/${cityId}/bairros`)}>Consultar bairros da cidade</button>
    </>}
  </section>;
}
