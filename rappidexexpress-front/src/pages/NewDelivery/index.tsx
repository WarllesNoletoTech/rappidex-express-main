/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

import { DeliveryContext } from '../../context/DeliveryContext';
import api from '../../services/api';
import { 
    BaseInput,
    Container,
    ContainerButtons,
    FormContainer,
    BaseButton,
    BaseInputMask,
} from "./styles";
import { Loader } from '../../components/Loader';
import { Motoboy, User } from '../../shared/interfaces';

const DeliveryFormValidationSchema = zod.object({
    clientName: zod.string().min(3, 'Informe o nome do cliente.'),
    clientPhone: zod.string(),
    value: zod.string(),
    observation: zod.string(),
  })
  
type DeliveryFormData = zod.infer<typeof DeliveryFormValidationSchema>

export function NewDelivery(){
    const { token, permission } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false)
    
    const [shopkeepers, setShopkeepers] = useState<User[]>([]);
    const [motoboys, setMotoboys] = useState([]);

    const [establishmentId, setEstablishmentId] = useState('')
    const [motoboyId, setMotoboyId] = useState('')
    const [payment, setPayment] = useState('')
    const [soda, setSoda] = useState('')
    const [addressNeighborhood, setAddressNeighborhood] = useState('')
    const [neighborhoodMode,setNeighborhoodMode] = useState(false)
    const [ratesUnavailable,setRatesUnavailable] = useState(false)
    const [availableNeighborhoods,setAvailableNeighborhoods] = useState<string[]>([])

    const profileFormData = useForm<DeliveryFormData>({
        resolver: zodResolver(DeliveryFormValidationSchema),
        defaultValues: {
            clientName: '',
            clientPhone: '',
            value: '',
            observation: '',
        },
    })

    const { handleSubmit, watch, register, reset } = profileFormData

    async function handleSave(data: DeliveryFormData) {
        if(loading){
            return
        }

        setLoading(true)
        if(ratesUnavailable){
            alert('Não foi possível consultar as taxas da loja. Recarregue a página antes de solicitar uma entrega.')
            setLoading(false)
            return
        }
        if(neighborhoodMode && !availableNeighborhoods.includes(addressNeighborhood)){
            alert('Selecione um bairro atendido pela loja e com repasse do motoboy configurado pela administração.')
            setLoading(false)
            return
        }

        if(data.clientPhone.includes('_')){
            alert("Numero de telefone está faltando algum digito!")
            setLoading(false)
            return
        }

        try {
            const normalizedMotoboyId = motoboyId.trim() || null

            await api.post('/delivery', {
                ...data,
                clientPhone: data.clientPhone.replace('(', '').replace(')', '').replace(' ', '').replace('-', ''),
                status: "PENDENTE",
                establishmentId,
                ...(normalizedMotoboyId ? { motoboyId: normalizedMotoboyId } : {}),
                payment,
                soda,
                addressNeighborhood,
                observation,
            })
            reset()
            setLoading(false)
            alert("Nova solicitação de entrega criado com sucesso!")
        } catch (error: any) {
            setLoading(false)
            alert(error.response.data.message)
        }
    }

    const clientName = watch('clientName')
    const clientPhone = watch('clientPhone')
    const value = watch('value')
    const observation = watch('observation')
    const isSubmitDisabled = ratesUnavailable || !clientName || !clientPhone || !establishmentId || !value || !payment || (neighborhoodMode && !availableNeighborhoods.includes(addressNeighborhood))

    async function getData(){
        try {
            let motoboysResponse = { data: [] }
            if ( ( permission === 'admin' || permission === 'superadmin' ) || permission === 'motoboy' || permission === 'shopkeeperadmin' ) {
                motoboysResponse = await api.get('/user/motoboys')
            }

            const shopkeepersResponse = await api.get('/user?type=shopkeeper')
            setMotoboys(motoboysResponse.data)
            setShopkeepers(shopkeepersResponse.data.data)

            setLoadingInitial(false)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    useEffect(()=>{
        const shop=shopkeepers.find(x=>x.id===establishmentId)
        let canceled=false
        // Fail closed while loading rates and ignore results of a previously selected shop.
        setRatesUnavailable(true)
        setAvailableNeighborhoods([])
        setAddressNeighborhood('')
        if(!shop?.cityId)return () => {canceled=true}
        api.get(`/regions/${shop.cityId}/stores/${shop.id}/rates`).then(response=>{
            if(canceled)return
            setRatesUnavailable(false)
            setNeighborhoodMode(response.data.feeMode==='neighborhood')
            setAvailableNeighborhoods((response.data.rates||[]).filter((r:any)=>r.active&&r.enabled&&Number.isFinite(Number(r.deliveryFee))&&Number(r.deliveryFee)>=Number(response.data.platformServiceFee||0)).map((r:any)=>r.name))
        }).catch(()=>{if(!canceled){setRatesUnavailable(true);setAvailableNeighborhoods([])}})
        return () => {canceled=true}
    },[establishmentId,shopkeepers]);

    useEffect(() => {
        if(shopkeepers.length === 1){
            setEstablishmentId(shopkeepers[0].id)
        }
    }, [shopkeepers])

    useEffect(() => {
        if(loadingInitial) {
            getData()
        }
    })

    return (
        <Container>
            <form onSubmit={handleSubmit(handleSave)} action="">

                <FormContainer>
                    
                    <label htmlFor="clientName">Nome do cliente:</label>
                    <BaseInput
                        type="text"
                        id="clientName"
                        placeholder="Informe o nome do cliente."
                        {...register('clientName')}
                    />

                    <label htmlFor="clientPhone">Whatsapp do cliente:</label>
                    <BaseInputMask
                        type="text"
                        mask='(99) 99999-9999' 
                        id="clientPhone"
                        placeholder="Informe o whatsapp do cliente."
                        {...register('clientPhone')}
                    />

                    <label htmlFor="value">Valor do pedido:</label>
                    <BaseInput
                        type="text"
                        id="value"
                        placeholder="Informe o valor do pedido."
                        {...register('value')}
                    />

                    {/* <label htmlFor="observation">Observação:</label>
                    <BaseInput
                        type="text"
                        id="observation"
                        placeholder="Algo relevante ao pedido."
                        {...register('observation')}
                    /> */}

                    <label htmlFor="payment">Tipo de pagamento:</label>
                    <select 
                        value={payment}
                        onChange={e => setPayment(e.target.value)}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="PIX">Pix</option>
                        <option value="DINHEIRO">Dinheiro</option>
                        <option value="CARTAO">Cartão</option>
                        <option value="PAGO">Pago</option>
                    </select>

                    <label htmlFor="addressNeighborhood">Bairro do destino (obrigatório em cidades com taxa por bairro):</label>
                    {neighborhoodMode ? <select id="addressNeighborhood" value={addressNeighborhood} onChange={e=>setAddressNeighborhood(e.target.value)}>
                        <option value="">Selecione o bairro atendido</option>
                        {availableNeighborhoods.map(name=><option key={name} value={name}>{name}</option>)}
                    </select> : <BaseInput id="addressNeighborhood" value={addressNeighborhood} onChange={e=>setAddressNeighborhood(e.target.value)} placeholder="Bairro do cliente" />}
                    <label htmlFor="refrigerante">Tem refrigerante:</label>
                    <select 
                        value={soda}
                        onChange={e => setSoda(e.target.value)}
                    >
                        <option value="">Selecione uma opção:</option>
                        <option value="NÂO">Não</option>
                        <option value="SIM">Sim</option>
                    </select>

                    <label htmlFor="establishmentId">Qual o estabelecimento:</label>
                    <select 
                        value={establishmentId}
                        onChange={e => setEstablishmentId(e.target.value)}
                    >
                        <option value="">Selecione uma opção:</option>
                        {
                            shopkeepers.map((shopkeeper: User) => 
                                <option key={shopkeeper.id} value={shopkeeper.id}>{shopkeeper.name}</option>
                            )
                        }
                    </select>   

                    {
                        (( permission === 'admin' || permission === 'superadmin') || permission === 'shopkeeperadmin') && (
                            <>
                                <label htmlFor="motoboyId">Qual o motoboy:</label>
                                <select 
                                    value={motoboyId}
                                    onChange={e => setMotoboyId(e.target.value)}
                                >
                                    <option value="">Selecione uma opção:</option>
                                    {
                                        motoboys.map((motoboy: Motoboy) => 
                                            <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                                        )
                                    }
                                </select>   
                            </>
                        )
                    }

                    <ContainerButtons>
                        <BaseButton disabled={isSubmitDisabled} type="submit">
                            {loading ?
                                <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                                "Solicitar entrega"
                            }
                        </BaseButton>
                        
                    </ContainerButtons>
                </FormContainer>
            </form>
        </Container>
    )
}