/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

import { 
    BaseButton,
    BaseInput,
    BlockDeliveriesButton,
    Container,
    ContainerButtons,
    FormContainer
} from "./styles";
import { Loader } from '../../components/Loader';
import api from '../../services/api';
import { DeliveryContext } from '../../context/DeliveryContext';

const AmountFormValidationSchema = zod.object({
    amount: zod.string(),
  })

  
type AmountFormData = zod.infer<typeof AmountFormValidationSchema>

export function Config() {
    const { token } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`
    
    const [loading, setLoading] = useState(true)
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingBlockButton, setLoadingBlockButton] = useState(false)
    const [blockType, setBlockType] = useState(false)
    const [cityName, setCityName] = useState('')
    const [formValues, setFormValues] = useState({
        amount: '2',
    })

    const amountFormData = useForm<AmountFormData>({
        resolver: zodResolver(AmountFormValidationSchema),
        values: formValues,
    })

    const { handleSubmit, watch, register } = amountFormData

    async function handleSave() {
        if(loadingButton) {
            return
        }

        if(!/^\d+$/.test(String(amount ?? '').trim()) || Number(amount) < 1 || Number(amount) > 50){
            alert('Informe um número inteiro entre 1 e 50 entregas.')
            return
        } 
        setLoadingButton(true)
        try {
            await api.put(`/delivery/edit/configs`, {"amountDeliverys": amount})
            setLoadingButton(false)
            alert(`Limite de entregas de ${cityName || "esta cidade"} alterado com sucesso!`)
        } catch (error: any) {
            setLoadingButton(false)
            alert(error?.response?.data?.message || 'Erro ao consultar ou alterar as configurações.')
        }
    }

    async function handleBlock(){
        if(loadingBlockButton) {
            return
        }

        setLoadingBlockButton(true)

        try {
            await api.put(`/delivery/edit/configs`, {"blockDeliverys": !blockType})
            setLoadingBlockButton(false)
            setBlockType(!blockType)
            alert(!blockType ? "Entregas bloqueadas com sucesso." : "Entregas desbloqueadas com sucesso.")
        } catch (error: any) {
            setLoadingBlockButton(false)
            alert(error?.response?.data?.message || 'Erro ao consultar ou alterar as configurações.')
        }
    }

    async function getConfigs() {
        try {
            const configs = await api.get(`/delivery/config`)
            setFormValues({ amount: String(configs.data.amount ?? 2) })
            setCityName(String(configs.data.cityName || ''))
            setBlockType(Boolean(configs.data.blockDeliverys))
            setLoading(false)
        } catch (error: any) {
            setLoading(false)
            alert(error?.response?.data?.message || 'Erro ao consultar ou alterar as configurações.')
        }
    }

    const amount = watch('amount')
    const isSubmitDisabled = !amount || !/^\d+$/.test(String(amount).trim()) || Number(amount) < 1 || Number(amount) > 50

    useEffect(() => {
        if(loading){
            getConfigs()
        }
    })

    return (
        <Container>
            {loading ? 
                <Loader size={10} biggestColor='gray' smallestColor='gray' /> :
                <>
                    <form onSubmit={handleSubmit(handleSave)} action="">
                        <p style={{ color: '#fcb900', fontWeight: 700, marginBottom: 12 }}>
                            Cidade selecionada: {cityName || 'Não configurada'}
                        </p>
                        <FormContainer>
                            <label htmlFor="amount">Máximo de entregas simultâneas por motoboy nesta cidade:</label>
                            <BaseInput
                                type="number"
                                min={1}
                                max={50}
                                step={1}
                                id="amount"
                                placeholder="Informe a quantidade."
                                {...register('amount')}
                            />

                            <ContainerButtons>
                                <BaseButton disabled={isSubmitDisabled} type="submit">
                                    {loadingButton ?
                                        <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                                        "Salvar"
                                    }
                                </BaseButton>
                            </ContainerButtons>
                        </FormContainer>
                    </form>
                    <BlockDeliveriesButton type={blockType} onClick={handleBlock}>
                        {loadingBlockButton ?
                            <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                            blockType ? "Desbloquear entregas (todas as cidades)" : "Bloquear entregas (todas as cidades)"
                        }
                    </BlockDeliveriesButton>
                </>
            }
        </Container>
    )
}