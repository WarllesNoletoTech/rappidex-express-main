/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { DeliveryContext } from '../../context/DeliveryContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export type ShopRateDraft = {
  neighborhoodId: string;
  name: string;
  cityActive: boolean;
  enabled: boolean;
  deliveryFee: number;
};

type Props = {
  cityId: string;
  storeId?: string;
  onChange?: (draft: ShopRateDraft[]) => void;
  // A tela de cadastro salva junto com a criação; o perfil permite salvar diretamente.
  allowDirectSave?: boolean;
  heading?: string;
};

/** Mesmo editor no cadastro, na edição administrativa e no perfil do lojista. */
export function StoreRatesEditor({cityId,storeId,onChange,allowDirectSave=false,heading='Bairros atendidos e taxas'}:Props){
  const navigate=useNavigate();
  const {permission}=useContext(DeliveryContext);
  const canManageCity=permission==='admin'||permission==='superadmin';
  const [mode,setMode]=useState<'fixed'|'neighborhood'>('fixed');
  const [rates,setRates]=useState<ShopRateDraft[]>([]);
  const [busy,setBusy]=useState(false);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [platformServiceFee,setPlatformServiceFee]=useState(0);

  useEffect(()=>{
    let active=true;
    setLoaded(false);setError('');setNotice('');setRates([]);onChange?.([]);
    if(!cityId)return ()=>{active=false};
    setBusy(true);
    const request=storeId
      ?api.get(`/regions/${cityId}/stores/${storeId}/rates`)
      :api.get(`/regions/${cityId}/neighborhoods`);
    request.then(response=>{
      if(!active)return;
      setMode(response.data.feeMode==='neighborhood'?'neighborhood':'fixed');
      setPlatformServiceFee(response.data.platformServiceFee||0);
      const next:ShopRateDraft[]=(response.data.rates||response.data.neighborhoods||[]).map((r:any)=>({
        neighborhoodId:String(r.neighborhoodId||r.id),name:String(r.name||''),
        cityActive:r.active!==false,enabled:r.enabled===true && r.active!==false,
        deliveryFee:Number(r.deliveryFee||0),
      }));
      setRates(next);onChange?.(next);setLoaded(true);
    }).catch((err:any)=>{if(active)setError(err.response?.data?.message||'Falha ao consultar bairros desta cidade.');})
      .finally(()=>{if(active)setBusy(false)});
    return ()=>{active=false};
    // onChange é notificação ao formulário pai, não é uma dependência da busca.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cityId,storeId]);
  function update(id:string,partial:Partial<ShopRateDraft>){
    const next=rates.map(r=>r.neighborhoodId===id?{...r,...partial}:r);
    setRates(next);onChange?.(next);setNotice('');
  }
  async function save(){
    if(!cityId||!storeId||saving)return;
    setError('');setSaving(true);
    try{
      const payload=rates.map(r=>({neighborhoodId:r.neighborhoodId,enabled:r.enabled&&r.cityActive,deliveryFee:r.deliveryFee}));
      await api.put(`/regions/${cityId}/stores/${storeId}/rates`,{rates:payload});
      setNotice('Bairros e tarifas salvos com sucesso.');
    }catch(e:any){setError(e.response?.data?.message||'Não foi possível salvar os bairros da loja.');}
    finally{setSaving(false);}
  }
  if(!cityId)return <section className="rpx-embedded"><h3>{heading}</h3><p>Selecione uma cidade para configurar os bairros.</p></section>;
  return <section className="rpx-embedded" aria-label="Configuração de bairros da loja">
    <h3>{heading}</h3>
    {error&&<div role="alert" className="rpx-error">{error}</div>}
    {notice&&<div className="rpx-notice">{notice}</div>}
    {busy&&<p>Carregando bairros da cidade...</p>}
    {loaded&&mode==='fixed'&&<p>Esta cidade trabalha com taxa fixa. O administrador pode mudar o modelo na aba Cidades.</p>}
    {loaded&&mode==='neighborhood'&&<>
      <p>O administrador cadastra os bairros e o valor pago ao entregador na cidade. A loja escolhe quais bairros atende e quanto cobra em cada um. Taxa adicional da plataforma: <b>R$ {platformServiceFee.toFixed(2).replace('.',',')}</b>.</p>
      {rates.some(r=>r.enabled&&!r.cityActive)&&<p role="alert">Há bairros selecionados que foram desativados pela administração.</p>}
      {rates.length===0?<div className="rpx-notice">
        Nenhum bairro foi cadastrado para esta cidade. Primeiro cadastre ou importe os bairros na aba Cidades.
        {canManageCity&&<div><button className="rpx-secondary" type="button" onClick={()=>navigate(`/cidades/${cityId}/bairros`)}>Abrir bairros da cidade</button></div>}
      </div>:<>
        <div className="rpx-tablehead"><span>Bairro</span><span>Atender</span><span>Taxa da loja (R$)</span></div>
        {rates.map(r=><div className="rpx-embedded-row" key={r.neighborhoodId}>
          <span>{r.name}{!r.cityActive&&<small> (desativado na cidade)</small>}</span>
          <label><input type="checkbox" checked={r.enabled&&r.cityActive} disabled={!r.cityActive} onChange={e=>update(r.neighborhoodId,{enabled:e.target.checked})}/> Ativo</label>
          <input aria-label={`Taxa da loja para ${r.name}`} type="number" min="0" step="0.01" value={r.deliveryFee} disabled={!r.cityActive} onChange={e=>update(r.neighborhoodId,{deliveryFee:Number(e.target.value)})}/>
        </div>)}
        <p>{rates.filter(r=>r.enabled&&r.cityActive).length} de {rates.length} bairros atendidos.</p>
        {allowDirectSave?<button type="button" disabled={saving} onClick={save}>{saving?'Salvando...':'Salvar bairros e taxas'}</button>
          :<small>As tarifas serão gravadas ao salvar o cadastro ou as informações da loja.</small>}
      </>}
    </>}
  </section>;
}
