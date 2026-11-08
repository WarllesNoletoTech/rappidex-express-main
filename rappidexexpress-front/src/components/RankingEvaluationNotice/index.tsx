import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from '@mui/material';
import { Trophy, Star, CheckCircle } from 'phosphor-react';
import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import './styles.css';

type RankingNotice = {
  id: string;
  ruleTitle: string;
  points: number;
  note?: string;
  awardedAt: string;
  weekStart: string;
};

// O servidor controla as notificacoes pendentes. Nao depende de localStorage nem da aba aberta.
export function RankingEvaluationNotice() {
  const { token, permission } = useContext(DeliveryContext);
  const [notices, setNotices] = useState<RankingNotice[]>([]);
  const [acknowledging, setAcknowledging] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const active = Boolean(token) && permission === 'motoboy';

  const fetchPending = useCallback(async () => {
    if (!active || !token || inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await api.get('/ranking/my-notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setNotices(res.data);
    } catch {
      // Falhas transitorias nao marcam avisos como lidos. Proxima consulta tenta novamente.
    } finally {
      inFlight.current = false;
    }
  }, [active, token]);

  useEffect(() => {
    setNotices([]);
    setError('');
    if (!active) return;
    void fetchPending();
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchPending();
    }, 20000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void fetchPending();
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [active, fetchPending]);

  const notice = active ? notices[0] : undefined;
  async function acknowledge() {
    if (!notice || !token || acknowledging) return;
    setAcknowledging(true);
    setError('');
    try {
      await api.post(`/ranking/my-notifications/${encodeURIComponent(notice.id)}/ack`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(previous => previous.filter(item => item.id !== notice.id));
      // A proxima avaliacao pendente aparece em seguida; se havia mais de 20, recarrega.
      if (notices.length <= 1) void fetchPending();
    } catch {
      setError('Nao foi possivel confirmar a leitura. Verifique sua conexao e tente novamente.');
    } finally {
      setAcknowledging(false);
    }
  }

  return (
    <Modal
      open={Boolean(notice)}
      disableEscapeKeyDown
      aria-labelledby="rpx-new-evaluation-title"
      aria-describedby="rpx-new-evaluation-description"
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,.82)', backdropFilter: 'blur(5px)' } } }}
    >
      <div className="rpx-evaluation-dialog" role="dialog" aria-modal="true">
        {notice && <>
          <div className="rpx-evaluation-trophy"><Trophy size={32} weight="fill" /></div>
          <span className="rpx-evaluation-kicker"><Star size={15} weight="fill" /> RANKING RAPPIDEX</span>
          <h2 id="rpx-new-evaluation-title">Você recebeu uma nova avaliação!</h2>
          <p id="rpx-new-evaluation-description" className="rpx-evaluation-subtitle">
            Uma nova pontuação foi registrada pela administração no seu ranking semanal.
          </p>
          <div className="rpx-evaluation-score">
            <strong>+{notice.points}</strong>
            <span>{notice.points===1?'ponto':'pontos'}</span>
          </div>
          <div className="rpx-evaluation-detail">
            <span className="rpx-evaluation-label">Critério avaliado</span>
            <p>{notice.ruleTitle}</p>
            {Boolean(notice.note?.trim()) && <>
              <span className="rpx-evaluation-label">Observação</span>
              <p>{notice.note}</p>
            </>}
            <small>Recebida em {new Date(notice.awardedAt).toLocaleString('pt-BR',{timeZone:'America/Belem'})}</small>
          </div>
          {notices.length > 1 && <p className="rpx-evaluation-more">Você tem mais {notices.length-1} {notices.length===2?'avaliação pendente':'avaliações pendentes'}.</p>}
          {error && <p className="rpx-evaluation-error" role="alert">{error}</p>}
          <button type="button" className="rpx-evaluation-ack" onClick={acknowledge} disabled={acknowledging}>
            <CheckCircle size={19} weight="bold" /> {acknowledging?'Confirmando...':'Entendi, obrigado!'}
          </button>
        </>}
      </div>
    </Modal>
  );
}
