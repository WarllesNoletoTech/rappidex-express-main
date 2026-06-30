import { Modal, Typography, Box } from '@mui/material'
import { BaseButton, BaseInput } from './styles'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(92vw, 28rem)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '1rem',
  boxShadow: '0 1.5rem 4rem rgba(0, 0, 0, 0.45)',
  p: { xs: 2, sm: 3 },
  background: 'linear-gradient(145deg, #29292E, #202024)',
  color: '#E1E1E6',
}

export interface ModalProps {
  isVisible: boolean
  handleClose: () => void
  observation: string
  isSaving?: boolean
  onObservationChange: (text: string) => void
  onConfirmObservation: () => void
}

export function BaseModal({ isVisible, handleClose, observation, isSaving = false, onObservationChange, onConfirmObservation }: ModalProps) {
  return (
    <Modal
      open={isVisible}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.72)', backdropFilter: 'blur(4px)' },
        },
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
          Observação
        </Typography>
        <BaseInput
          type="text"
          id="user"
          placeholder="Opcional"
          value={observation}
          onChange={(event) => { onObservationChange(event.target.value) }}
        />
        <BaseButton onClick={onConfirmObservation} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Adicionar'}
        </BaseButton>
      </Box>
    </Modal>
  )
}
