/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import '../regional-admin.css';

type Rule = {id:string;title:string;active:boolean;order:number};
type Driver = {id:string;name:string};
type Entry = {id:string;motoboyName:string;points:number;ruleTitleSnapshot:string;awardedAt:string;reversedAt?:string};
type Score = {position:number;motoboyId:string;name:string;points:number};
export function Ranking(){
  const {token,permission} = useContext(DeliveryContext);
  const admin = ['admin','superadmin'].includes(permission);
  const [cities,setCities] = useState<Array<{id:string;name:string;state?:string}>>([]);
  const [cityId,setCityId] = useState('');
  const [week,setWeek] = useState('');
  const [currentWeek,setCurrentWeek] = useState('');
  const [board,setBoard] = useState<Score[]>([]);
  const [rules,setRules] = useState<Rule[]>([]);
  const [drivers,setDrivers] = useState<Driver[]>([]);
  const [entries,setEntries] = useState<Entry[]>([]);
  const [driverId,setDriverId] = useState('');
  const [ruleId,setRuleId] = useState('');
  const [points,setPoints] = useState(10);
  const [note,setNote] = useState('');
  const [ruleName,setRuleName] = useState('');
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  api.defaults.headers.Authorization=`Bearer ${token}`;
  useEffect(()=>{Promise.all([api.get('/city'),api.get('/user/myself')]).then(([c,u])=>{
    const list=Array.isArray(c.data?.data)?c.data.data:c.data;
    setCities(Array.isArray(list)?list:[]);
    setCityId(u.data.cityId||list?.[0]?.id||'');
  }).catch((e:any)=>setError(e.response?.data?.message||'Erro ao carregar cidades.'));},[token]);
  async function reload(currentCity=cityId,currentWeek=week){
    if(!currentCity)return;
    const suffix=currentWeek?`?week=${encodeURIComponent(currentWeek)}`:'';
    try{
      const promises:any[]=[api.get(`/ranking/${currentCity}${suffix}`),api.get(`/ranking/${currentCity}/rules`)];
      if(admin){promises.push(api.get(`/ranking/${currentCity}/drivers`),api.get(`/ranking/${currentCity}/points${suffix}`));}
      const responses=await Promise.all(promises);
      setBoard(responses[0].data.top5||[]);setRules(responses[1].data||[]);
      if(!currentWeek){
        const start=String(responses[0].data.weekStart).slice(0,10);
        setWeek(start);setCurrentWeek(start);
      }
      if(admin){setDrivers(responses[2].data||[]);setEntries(responses[3].data||[]);}
    }catch(e:any){setError(e.response?.data?.message||'Falha ao carregar ranking.');}
  }
  useEffect(()=>{if(cityId){setWeek('');setCurrentWeek('');reload(cityId,'');}},[cityId]);
  async function addPoints(){
    if(!driverId||!ruleId||!Number.isInteger(points)||points<1)return;
    setSaving(true);setError('');setNotice('');
    try{await api.post(`/ranking/${cityId}/points`,{motoboyId:driverId,ruleId,points,note});
      setNotice('Pontuação registrada.');setNote('');await reload();
    }catch(e:any){setError(e.response?.data?.message||'Não foi possível registrar os pontos.');}finally{setSaving(false);}
  }
  async function createRule(){if(!ruleName.trim())return;try{await api.post(`/ranking/${cityId}/rules`,{title:ruleName});setRuleName('');await reload();}catch(e:any){setError(e.response?.data?.message||'Falha ao adicionar regra.');}}
  async function editRule(rule:Rule,patch:Partial<Rule>){try{await api.put(`/ranking/${cityId}/rules/${rule.id}`,patch);await reload();}catch(e:any){setError(e.response?.data?.message||'Falha ao editar regra.');}}
  async function reverse(id:string){if(!window.confirm('Estornar esta pontuação? O histórico será preservado.'))return;
    try{await api.post(`/ranking/${cityId}/points/${id}/reverse`);await reload();}catch(e:any){setError(e.response?.data?.message||'Falha ao estornar.');}}
  function previousWeek(){const date=new Date(`${week}T12:00:00Z`);date.setUTCDate(date.getUTCDate()-7);const next=date.toISOString().slice(0,10);setWeek(next);reload(cityId,next);}
  function nextWeek(){const date=new Date(`${week}T12:00:00Z`);date.setUTCDate(date.getUTCDate()+7);const next=date.toISOString().slice(0,10);setWeek(next);reload(cityId,next);}
  return <main className="rpx-page">
    <h1>🏆 Ranking semanal de entregadores</h1>
    <p>Pontuação manual, com regras editáveis e apenas os cinco primeiros colocados na classificação pública. Cada semana vai de terça-feira a segunda-feira (horário de Belém).</p>
    {error&&<div className="rpx-error" role="alert">{error}</div>}{notice&&<div className="rpx-notice">{notice}</div>}
    <section className="rpx-card">
      <label>Cidade</label><select value={cityId} onChange={e=>setCityId(e.target.value)}>{cities.map(c=><option key={c.id} value={c.id}>{c.name} — {c.state}</option>)}</select>
      <div className="rpx-inline"><button className="rpx-small" onClick={previousWeek} disabled={!week}>◀ Semana anterior</button><strong>{week?`Semana iniciada em ${new Date(`${week}T12:00:00Z`).toLocaleDateString('pt-BR',{timeZone:'UTC'})}`:'Semana atual'}</strong><button className="rpx-small" onClick={nextWeek} disabled={!week}>Próxima semana ▶</button></div>
      <h2>Top 5</h2>
      {board.length?board.map((s,i)=><div className="rpx-list-row" key={s.motoboyId}><strong className="rpx-medal">{['🥇','🥈','🥉','4º','5º'][i]}</strong><span>{s.name}</span><span className="rpx-score">{s.points} pontos</span></div>):<p>Nenhuma pontuação cadastrada para esta semana.</p>}
    </section>
    {admin&&<>
      <section className="rpx-card"><h2>Adicionar pontuação manual</h2>
        {week!==currentWeek&&<p>Esta semana está encerrada ou ainda não começou. Os lançamentos só são permitidos na semana atual.</p>}
        <div className="rpx-grid">
        <div><label>Entregador</label><select value={driverId} onChange={e=>setDriverId(e.target.value)}><option value="">Selecionar</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        <div><label>Regra da avaliação</label><select value={ruleId} onChange={e=>setRuleId(e.target.value)}><option value="">Selecionar</option>{rules.filter(r=>r.active).map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></div>
        <div><label>Pontos</label><input type="number" min={1} max={1000} value={points} onChange={e=>setPoints(Number(e.target.value))}/><div className="rpx-inline">{[2,5,10].map(n=><button key={n} className="rpx-small" onClick={()=>setPoints(n)}>{n} pts</button>)}</div></div>
      </div><label>Observação (opcional)</label><textarea value={note} maxLength={500} onChange={e=>setNote(e.target.value)} rows={2}/>
      <button disabled={saving||week!==currentWeek||!driverId||!ruleId||points<1||!Number.isInteger(points)} onClick={addPoints}>Adicionar pontos</button></section>
      <section className="rpx-card"><h2>Regras do ranking (editáveis)</h2>
        <p>Edite o texto, ative ou desative e altere a ordem. Lançamentos antigos mantêm o nome original da regra.</p>
        {rules.sort((a,b)=>a.order-b.order).map((r,i)=><div key={r.id} className="rpx-list-row">
          <span><b>{i+1}.</b> {r.title}</span>
          <label className="rpx-check"><input type="checkbox" checked={r.active} onChange={e=>editRule(r,{active:e.target.checked})}/>Ativa</label>
          <button className="rpx-small" onClick={()=>{const name=window.prompt('Editar critério:',r.title);if(name&&name.trim()!==r.title)editRule(r,{title:name});}}>Editar</button>
          <button className="rpx-small" onClick={()=>{if(i>0)editRule(r,{order:rules[i-1].order});}} disabled={i===0} aria-label="Mover regra para cima">↑</button>
          <button className="rpx-small" onClick={()=>{if(i<rules.length-1)editRule(r,{order:rules[i+1].order});}} disabled={i===rules.length-1} aria-label="Mover regra para baixo">↓</button>
        </div>)}
        <div className="rpx-inline"><input placeholder="Novo critério de avaliação" value={ruleName} onChange={e=>setRuleName(e.target.value)}/><button onClick={createRule} disabled={!ruleName.trim()}>Adicionar regra</button></div>
      </section>
      <section className="rpx-card"><h2>Histórico de pontuações</h2><p>Estornos não apagam o histórico de lançamentos.</p>
        {entries.length===0&&<p>Sem registros nesta semana.</p>}
        {entries.map(e=><div className="rpx-list-row" key={e.id}><span><b>{e.motoboyName}</b> — {e.ruleTitleSnapshot}<br/><small>{new Date(e.awardedAt).toLocaleString('pt-BR')} {e.reversedAt?'— ESTORNADO':''}</small></span><strong>{e.points} pts</strong>{!e.reversedAt&&week===currentWeek&&<button className="rpx-small" onClick={()=>reverse(e.id)}>Estornar</button>}</div>)}
      </section>
    </>}
  </main>;
}
