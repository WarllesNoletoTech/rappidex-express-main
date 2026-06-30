/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { DownloadSimple, PencilSimple  } from "phosphor-react";

<<<<<<< HEAD
import {
  Container,
  ContainerInfo,
  ContainerOrder,
  ContainerShopkeeper,
  DataContainer,
  Delivery,
  Filter,
  FiltersContainer,
  ProfileImageContainer,
  ReportsContainer,
  SearchButton,
  ShopkeeperInfo,
  ShopkeeperProfileImage,
  EditContainer,
  OnClickLink,
  PageHeader,
  ActionBar,
  ActionButton,
  SettlementSummary,
  SettlementFeedback,
  CheckboxLabel,
=======
import { 
    Container, 
    ContainerInfo, 
    ContainerOrder, 
    ContainerShopkeeper, 
    DataContainer, 
    Delivery, 
    Filter, 
    FiltersContainer, 
    ProfileImageContainer, 
    ReportsContainer, 
    SearchButton, 
    ShopkeeperInfo, 
    ShopkeeperProfileImage,
    EditContainer,
    OnClickLink,
>>>>>>> parent of 613ac8c (atualização front)
} from "./styles";
import api from "../../services/api";
import { DeliveryContext } from "../../context/DeliveryContext";
import { User, Report } from "../../shared/interfaces";
import { Loader } from "../../components/Loader";

export function Reports() {
    const { token, permission } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`
    
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    const [motoboys, setMotoboys] = useState([]);
    const [shopkeepers, setShopkeepers] = useState([]);

    const [reports, setReports] = useState<Report[]>([]);
    const [reportsCount, setReportsCount] = useState(0);

    const [loadingMoreReports, setLoadingMoreReports] = useState(false)
    const [page, setPage] = useState(2);

    const [selectedStatus, setSelectedStatus] = useState('FINALIZADO');
    const [selectedMotoboy, setSelectedMotoboy] = useState('');
    const [selectedEstablishment, setSelectedEstablishment] = useState('');
    const [createdIn, setCreatedIn] = useState('');
    const [createdUntil, setCreatedUntil] = useState('');

<<<<<<< HEAD
  const [selectedStatus, setSelectedStatus] = useState("FINALIZADO");
  const [selectedMotoboy, setSelectedMotoboy] = useState("");
  const [selectedEstablishment, setSelectedEstablishment] = useState("");
  const [createdIn, setCreatedIn] = useState("");
  const [createdUntil, setCreatedUntil] = useState("");
  const [includeMonthlyFee, setIncludeMonthlyFee] = useState(false);
=======
    function formatNumber(number: string){
        const cleaned = ('' + number).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{4}|\d{5})(\d{4})$/);
>>>>>>> parent of 613ac8c (atualização front)

        if (match) {
            return ['(', match[2], ')', match[3], '-', match[4]].join('')
        }
        return '';
    }

    async function onClickSearch(){
        if(loading){
            return
        }

        setLoading(true)

        let param = '';
        if(selectedMotoboy){
            param = `${param}&motoboyId=${selectedMotoboy}`
        }
        if(selectedEstablishment){
            param = `${param}&establishmentId=${selectedEstablishment}`
        }
        if(createdIn){
            param = `${param}&createdIn=${createdIn}T00:00:00.000Z`
        }
        if(createdUntil){
            param = `${param}&createdUntil=${createdUntil}T23:59:59.000Z`
        }

        try {
            const response = await api.get(`/delivery?status=${selectedStatus}&itemsPerPage=50${param}`)
            setReports(response.data.data)
            setPage(2)
            setReportsCount(response.data.count)
            setLoading(false)
        } catch (error: any) {
            alert(error.response.data.message)
            setLoading(false)
        }
    }

    async function getData(){
        try {
            const motoboysResponse = await api.get('/user?type=motoboy')
            const shopkeepersResponse = await api.get('/user?type=shopkeeper')

            setMotoboys(motoboysResponse.data.data)
            setShopkeepers(shopkeepersResponse.data.data)
            setLoadingInitial(false)
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    async function moreReports(){
        if(loadingMoreReports){
            return
        }

<<<<<<< HEAD
    try {
      const params = getReportFiltersParam();
      params.set("page", String(page));
      const response = await api.get(`/delivery?${params.toString()}`);
      setReports([...reports, ...response.data.data]);
      setPage(page + 1);
      setReportsCount(response.data.count);
      setLoadingMoreReports(false);
    } catch (error: any) {
      alert(
        getErrorMessage(error, "Não foi possível carregar mais relatórios."),
      );
      setLoadingMoreReports(false);
    }
  }
=======
        setLoadingMoreReports(true)
>>>>>>> parent of 613ac8c (atualização front)

        let param = '';
        if(selectedMotoboy){
            param = `${param}&motoboyId=${selectedMotoboy}`
        }
        if(selectedEstablishment){
            param = `${param}&establishmentId=${selectedEstablishment}`
        }
        if(createdIn){
            param = `${param}&createdIn=${createdIn}T00:00:00.000Z`
        }
        if(createdUntil){
            param = `${param}&createdUntil=${createdUntil}T23:59:59.000Z`
        }

        try {
            const response = await api.get(`/delivery?status=${selectedStatus}&page=${page}&itemsPerPage=50${param}`)
            setReports([...reports, ...response.data.data])
            setPage(page + 1)
            setLoadingMoreReports(false)
        } catch (error: any) {
            alert(error.response.data.message)
            setLoadingMoreReports(false)
        }
    }

    function getDate(date: string) {
        const dateArray = date.split('T')[0].split('-');
        return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
    }

    function getHours(date: string) {
        return date.split('T')[1].substring(0, 5)
    }

    function extractIfoodOrderNumber(observation?: string) {
        if (!observation) return null

        const match = observation.match(
            /Pedido\s*(?:do\s*)?iFood(?:\s*(?:n[ºo°.]|n[uú]mero))?\s*[:#-]?\s*([A-Za-z0-9-]+)/i
        )

        return match?.[1] || null
    }

    function getObservation(report: Report) {
        const originalObservation = report.observation?.trim() || ""

<<<<<<< HEAD
    if (includeMonthlyFee) {
      params.set("includeMonthlyFee", "true");
    }

    return params;
  }
=======
        const isIfoodOrder = Boolean(
            report.isIfoodOrder ||
            report.ifoodDisplayId ||
            report.ifoodOrderId ||
            originalObservation.includes("Pedido iFood")
        )
>>>>>>> parent of 613ac8c (atualização front)

        if (!isIfoodOrder) {
            return originalObservation
        }

        const oldObservationWasOverwritten =
            originalObservation.toLowerCase() === "sem observação." ||
            originalObservation.toLowerCase() === "sem observação" ||
            originalObservation.includes("Pedido iFood importado automaticamente")

        const orderNumber =
            report.ifoodDisplayId ||
            report.ifoodOrderId ||
            extractIfoodOrderNumber(originalObservation) ||
            "não informado"

        const addressParts = [
            report.clientAddress,
            report.addressNeighborhood ? `Bairro: ${report.addressNeighborhood}` : null,
            [report.addressCity, report.addressState].filter(Boolean).join("/") || null,
            report.addressZipCode ? `CEP: ${report.addressZipCode}` : null,
        ].filter(Boolean)

        const addressText = addressParts.join(" | ")

        const parts = [
            `Pedido iFood #${orderNumber}`,
            report.ifoodMerchantName || report.ifoodMerchantId
                ? `Loja iFood: ${report.ifoodMerchantName || report.ifoodMerchantId}`
                : null,
            addressText ? `Endereço: ${addressText}` : null,
            report.addressMapsUrl ? `Localização: ${report.addressMapsUrl}` : null,
            !oldObservationWasOverwritten && originalObservation
                ? originalObservation
                : null,
            report.destinationObservation
                ? `Observação destino: ${report.destinationObservation}`
                : report.destinationObservationConfirmed
                    ? "Observação destino: Sem observação."
                    : null,
        ].filter(Boolean)

        return parts.join(" | ")
    }

    useEffect(() => {
        if(loadingInitial) {
            getData()
        }
    })

    return (
        <Container>
            {loadingInitial ? 
                <Loader size={40} biggestColor='gray' smallestColor='gray' /> :
                <FiltersContainer>
                    <h2>Filtros</h2>
                    <DataContainer>
                        <form>
                            <label htmlFor="birthday">De:</label>
                            <input type="date" value={createdIn} onChange={e => setCreatedIn(e.target.value)} /> <br/>
                        </form>
                    </DataContainer>

                    <DataContainer>
                        <form>
                            <label htmlFor="birthday">Até:</label>
                            <input disabled={!createdIn} type="date" min={createdIn} value={createdUntil} onChange={e => setCreatedUntil(e.target.value)} />
                        </form>
                    </DataContainer>

                    <Filter>
                        <p>Status:</p>
                        <select 
                            value={selectedStatus}
                            onChange={e => setSelectedStatus(e.target.value)}
                        >
                            <option value="PENDENTE">PENDENTE</option>
                            <option value="ACAMINHO">A CAMINHO</option>
                            <option value="COLETADO">COLETADO</option>
                            <option value="FINALIZADO">FINALIZADO</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>           
                    </Filter>

                    <Filter>
                        <p>Motoboy:</p>
                        <select 
                            value={selectedMotoboy}
                            onChange={e => setSelectedMotoboy(e.target.value)}
                        >
                            <option value=''>Todos</option>
                            {
                                motoboys.map((motoboy: User) => 
                                    <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                                )
                            }
                        </select>           
                    </Filter>

                    <Filter>
                        <p>Estabelecimento:</p>
                        <select 
                            value={selectedEstablishment}
                            onChange={e => setSelectedEstablishment(e.target.value)}
                        >
                            <option value=''>Todos</option>
                            {
                                shopkeepers.map((shopkeeper: User) => 
                                    <option key={shopkeeper.id} value={shopkeeper.id}>{shopkeeper.name}</option>
                                )
                            }
                        </select>           
                    </Filter>

                    <SearchButton onClick={onClickSearch}>
                    {loading ?
                        <Loader size={20} biggestColor='gray' smallestColor='gray' /> :
                        "Buscar"
                    }
                    </SearchButton>
                </FiltersContainer>
            }
            {!loadingInitial &&
            <ReportsContainer>
                <h3>Quantidade de entregas: {reportsCount}</h3>
                {reports.map((report: Report) => {
                    const observation = getObservation(report)

                    return <Delivery key={report.id}>
                        <ContainerShopkeeper>
                            <ProfileImageContainer>
                                <ShopkeeperProfileImage src={report.establishmentImage} />
                            </ProfileImageContainer>
                            <ShopkeeperInfo>
                                <p>{report.establishmentName}</p>
                                {formatNumber(`+55${report.establishmentPhone}`)}
                            </ShopkeeperInfo>
                        </ContainerShopkeeper>
                        <ContainerOrder>
                            <p>Status: {report.status}</p>
                            <p>Forma de pagamento: {report.payment}</p>
                            <p>Valor: R$ {report.value}</p>
                            <p>Pix: {report.establishmentPix}</p>
                            <p>Refrigerante: {report.soda}</p>
                            {observation && 
                                <p><b>Observação: {observation}</b></p>
                            }
                        </ContainerOrder>

                        <ContainerInfo>
                            <p>Cliente: {report.clientName} </p>
                                {/* {formatNumber(`+55${report.clientPhone}`)} */}
                        </ContainerInfo>

                        <ContainerInfo>
                            <p>Motoboy: {report.motoboyName} </p>
                            {formatNumber(`+55${report.motoboyPhone}`)}
                        </ContainerInfo>

                        <ContainerInfo>
                            <p>Criado em {getDate(report.createdAt)} as {getHours(report.createdAt)}</p>
                        </ContainerInfo>

                        <ContainerInfo>
                            {report.onCoursedAt && 
                                <p>Atribuído: {getHours(report.onCoursedAt)}</p>
                            }
                            {report.collectedAt && 
                                <p>Coletado: {getHours(report.collectedAt)}</p>
                            }
                            {report.finishedAt && 
                                <p>Finalizado: {getHours(report.finishedAt)}</p>
                            }
                        </ContainerInfo>

                        {(permission === 'admin' || permission === 'superadmin') && 
                            <EditContainer>
                                <OnClickLink to='/editar-entrega' state={report}>
                                    Editar 
                                    <PencilSimple size={15} />
                                </OnClickLink>
                            </EditContainer>
                        }
                    </Delivery>
                })}

                {reports.length < reportsCount && 
                    <EditContainer onClick={moreReports}>
                        {loadingMoreReports ?
                            <Loader size={15} biggestColor='gray' smallestColor='gray' /> :
                            <OnClickLink to='#'>mais... <DownloadSimple size={15} /></OnClickLink>
                        }
                    </EditContainer>
                }

<<<<<<< HEAD
          {isAdminUser && (
            <SettlementSummary>
              <strong>Fechamento financeiro</strong>
              <p>
                Selecione um lojista e período para gerar o PDF. No envio pelo
                WhatsApp, o PDF será baixado e o WhatsApp será aberto com a
                mensagem pronta; anexe o PDF manualmente antes de enviar.
              </p>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={includeMonthlyFee}
                  onChange={(event) =>
                    setIncludeMonthlyFee(event.target.checked)
                  }
                  disabled={settlementLoading}
                />
                Incluir mensalidade no relatório
              </CheckboxLabel>
              <ActionBar>
                <ActionButton
                  type="button"
                  onClick={handleGeneratePdf}
                  disabled={settlementLoading}
                >
                  {settlementLoading ? (
                    <Loader
                      size={18}
                      biggestColor="gray"
                      smallestColor="gray"
                    />
                  ) : (
                    <FilePdf size={18} />
                  )}
                  Gerar PDF
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={handleSendWhatsapp}
                  disabled={settlementLoading}
                  $variant="whatsapp"
                >
                  {settlementLoading ? (
                    <Loader
                      size={18}
                      biggestColor="gray"
                      smallestColor="gray"
                    />
                  ) : (
                    <WhatsappLogo size={18} />
                  )}
                  Enviar WhatsApp
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={handleGeneratePdfAndSendWhatsapp}
                  disabled={settlementLoading}
                  $variant="secondary"
                >
                  <DownloadSimple size={18} />
                  Gerar PDF e Enviar WhatsApp
                </ActionButton>
              </ActionBar>
              {settlementLoading && <p>Gerando PDF e preparando WhatsApp...</p>}
              {settlementFeedback && (
                <SettlementFeedback $type={settlementFeedback.type}>
                  {settlementFeedback.message}
                </SettlementFeedback>
              )}
            </SettlementSummary>
          )}
        </FiltersContainer>
      )}
      {!loadingInitial && (
        <ReportsContainer>
          <h3>Quantidade de entregas: {reportsCount}</h3>
          {reports.map((report: Report) => {
            const observation = getObservation(report);

            return (
              <Delivery key={report.id}>
                <ContainerShopkeeper>
                  <ProfileImageContainer>
                    <ShopkeeperProfileImage src={report.establishmentImage} />
                  </ProfileImageContainer>
                  <ShopkeeperInfo>
                    <p>{report.establishmentName}</p>
                    {formatNumber(`+55${report.establishmentPhone}`)}
                  </ShopkeeperInfo>
                </ContainerShopkeeper>
                <ContainerOrder>
                  <p>Status: {report.status}</p>
                  <p>Forma de pagamento: {report.payment}</p>
                  <p>Valor: R$ {report.value}</p>
                  <p>Pix: {report.establishmentPix}</p>
                  <p>Refrigerante: {report.soda}</p>
                  {observation && (
                    <p>
                      <b>Observação: {observation}</b>
                    </p>
                  )}
                </ContainerOrder>

                <ContainerInfo>
                  <p>Cliente: {report.clientName} </p>
                  {/* {formatNumber(`+55${report.clientPhone}`)} */}
                </ContainerInfo>

                <ContainerInfo>
                  <p>Motoboy: {report.motoboyName} </p>
                  {formatNumber(`+55${report.motoboyPhone}`)}
                </ContainerInfo>

                <ContainerInfo>
                  <p>
                    Criado em {getDate(report.createdAt)} as{" "}
                    {getHours(report.createdAt)}
                  </p>
                </ContainerInfo>

                <ContainerInfo>
                  {report.onCoursedAt && (
                    <p>Atribuído: {getHours(report.onCoursedAt)}</p>
                  )}
                  {report.collectedAt && (
                    <p>Coletado: {getHours(report.collectedAt)}</p>
                  )}
                  {report.finishedAt && (
                    <p>Finalizado: {getHours(report.finishedAt)}</p>
                  )}
                </ContainerInfo>

                {(permission === "admin" || permission === "superadmin") && (
                  <EditContainer>
                    <OnClickLink to="/editar-entrega" state={report}>
                      Editar
                      <PencilSimple size={15} />
                    </OnClickLink>
                  </EditContainer>
                )}
              </Delivery>
            );
          })}

          {reports.length < reportsCount && (
            <EditContainer onClick={moreReports}>
              {loadingMoreReports ? (
                <Loader size={15} biggestColor="gray" smallestColor="gray" />
              ) : (
                <OnClickLink to="#">
                  mais... <DownloadSimple size={15} />
                </OnClickLink>
              )}
            </EditContainer>
          )}
        </ReportsContainer>
      )}
    </Container>
  );
=======
            </ReportsContainer>
            }
        </Container>
    )
>>>>>>> parent of 613ac8c (atualização front)
}
