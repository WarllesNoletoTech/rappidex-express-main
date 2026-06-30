/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import {
  DownloadSimple,
  FilePdf,
  PencilSimple,
  WhatsappLogo,
} from "phosphor-react";

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
} from "./styles";
import api from "../../services/api";
import { DeliveryContext } from "../../context/DeliveryContext";
import { User, Report } from "../../shared/interfaces";
import { Loader } from "../../components/Loader";

export function Reports() {
  const { token, permission } = useContext(DeliveryContext);
  api.defaults.headers.Authorization = `Bearer ${token}`;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  const [motoboys, setMotoboys] = useState([]);
  const [shopkeepers, setShopkeepers] = useState<User[]>([]);

  const [reports, setReports] = useState<Report[]>([]);
  const [reportsCount, setReportsCount] = useState(0);

  const [loadingMoreReports, setLoadingMoreReports] = useState(false);
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [settlementFeedback, setSettlementFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [page, setPage] = useState(2);

  const [selectedStatus, setSelectedStatus] = useState("FINALIZADO");
  const [selectedMotoboy, setSelectedMotoboy] = useState("");
  const [selectedEstablishment, setSelectedEstablishment] = useState("");
  const [createdIn, setCreatedIn] = useState("");
  const [createdUntil, setCreatedUntil] = useState("");

  const isAdminUser = permission === "admin" || permission === "superadmin";

  function formatNumber(number: string) {
    const cleaned = ("" + number).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4}|\d{5})(\d{4})$/);

    if (match) {
      return ["(", match[2], ")", match[3], "-", match[4]].join("");
    }
    return "";
  }

  function getReportFiltersParam() {
    const params = new URLSearchParams({
      status: selectedStatus,
      itemsPerPage: "50",
    });

    if (selectedMotoboy) {
      params.set("motoboyId", selectedMotoboy);
    }
    if (selectedEstablishment) {
      params.set("establishmentId", selectedEstablishment);
    }
    if (createdIn) {
      params.set("createdIn", createdIn);
      params.set("createdUntil", createdUntil || createdIn);
    }

    return params;
  }

  async function onClickSearch() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const params = getReportFiltersParam();
      const response = await api.get(`/delivery?${params.toString()}`);
      setReports(response.data.data);
      setPage(2);
      setReportsCount(response.data.count);
      setLoading(false);
    } catch (error: any) {
      alert(getErrorMessage(error, "Não foi possível buscar os relatórios."));
      setLoading(false);
    }
  }

  async function getData() {
    try {
      const motoboysResponse = await api.get("/user?type=motoboy");
      const shopkeepersResponse = await api.get("/user?type=shopkeeper");
      setMotoboys(motoboysResponse.data.data);
      setShopkeepers(shopkeepersResponse.data.data);
      setLoadingInitial(false);
    } catch (error: any) {
      alert(error.response.data.message);
    }
  }

  async function moreReports() {
    if (loadingMoreReports) {
      return;
    }

    setLoadingMoreReports(true);

    try {
      const params = getReportFiltersParam();
      params.set("page", String(page));
      const response = await api.get(`/delivery?${params.toString()}`);
      setReports([...reports, ...response.data.data]);
      setPage(page + 1);
      setReportsCount(response.data.count);
      setLoadingMoreReports(false);
    } catch (error: any) {
      alert(getErrorMessage(error, "Não foi possível carregar mais relatórios."));
      setLoadingMoreReports(false);
    }
  }

  function getDate(date: string) {
    const dateArray = date.split("T")[0].split("-");
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }

  function getHours(date: string) {
    return date.split("T")[1].substring(0, 5);
  }

  function extractIfoodOrderNumber(observation?: string) {
    if (!observation) return null;

    const match = observation.match(
      /Pedido\s*(?:do\s*)?iFood(?:\s*(?:n[ºo°.]|n[uú]mero))?\s*[:#-]?\s*([A-Za-z0-9-]+)/i,
    );

    return match?.[1] || null;
  }

  function getObservation(report: Report) {
    const originalObservation = report.observation?.trim() || "";

    const isIfoodOrder = Boolean(
      report.isIfoodOrder ||
      report.ifoodDisplayId ||
      report.ifoodOrderId ||
      originalObservation.includes("Pedido iFood"),
    );

    if (!isIfoodOrder) {
      return originalObservation;
    }

    const oldObservationWasOverwritten =
      originalObservation.toLowerCase() === "sem observação." ||
      originalObservation.toLowerCase() === "sem observação" ||
      originalObservation.includes("Pedido iFood importado automaticamente");

    const orderNumber =
      report.ifoodDisplayId ||
      report.ifoodOrderId ||
      extractIfoodOrderNumber(originalObservation) ||
      "não informado";

    const addressParts = [
      report.clientAddress,
      report.addressNeighborhood
        ? `Bairro: ${report.addressNeighborhood}`
        : null,
      [report.addressCity, report.addressState].filter(Boolean).join("/") ||
        null,
      report.addressZipCode ? `CEP: ${report.addressZipCode}` : null,
    ].filter(Boolean);

    const addressText = addressParts.join(" | ");

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
    ].filter(Boolean);

    return parts.join(" | ");
  }

  function getErrorMessage(error: any, fallback: string) {
    const responseMessage = error.response?.data?.message;
    const metaMessage = error.response?.data?.metaMessage;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(" ")
      : (responseMessage ?? error?.message ?? fallback);

    if (metaMessage && metaMessage !== message) {
      return `${message} Detalhe: ${metaMessage}`;
    }

    return message;
  }

  function buildFinancialSettlementParams() {
    if (!selectedEstablishment) {
      throw new Error("Selecione um estabelecimento para gerar o fechamento.");
    }

    if (!createdIn || !createdUntil) {
      throw new Error("Informe o período inicial e final do fechamento.");
    }

    const params = new URLSearchParams({
      establishmentId: selectedEstablishment,
      createdIn,
      createdUntil,
      status: selectedStatus,
    });

    return params;
  }

  async function downloadFinancialSettlementPdf(params: URLSearchParams) {
    const response = await api.get(
      `/financial-settlement/pdf?${params.toString()}`,
      { responseType: "blob" },
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const disposition = response.headers?.["content-disposition"] as
      | string
      | undefined;
    const filename =
      disposition?.match(/filename="?([^";]+)"?/)?.[1] ??
      "fechamento-rappidex.pdf";
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return filename;
  }

  async function handleGeneratePdf() {
    if (settlementLoading) return;

    setSettlementLoading(true);
    setSettlementFeedback(null);
    try {
      const params = buildFinancialSettlementParams();
      await downloadFinancialSettlementPdf(params);
      setSettlementFeedback({
        type: "success",
        message: "PDF do fechamento gerado e baixado com sucesso.",
      });
    } catch (error: any) {
      setSettlementFeedback({
        type: "error",
        message: getErrorMessage(
          error,
          "Não foi possível gerar o PDF do fechamento.",
        ),
      });
    } finally {
      setSettlementLoading(false);
    }
  }

  async function handleSendWhatsapp() {
    if (settlementLoading) return;

    const whatsappWindow = window.open("", "_blank");

    setSettlementLoading(true);
    setSettlementFeedback(null);
    try {
      const params = buildFinancialSettlementParams();
      await downloadFinancialSettlementPdf(params);
      const response = await api.post(
        `/financial-settlement/send-whatsapp?${params.toString()}`,
      );
      const whatsappUrl = response.data?.whatsappUrl;

      if (!whatsappUrl) {
        throw new Error("Link do WhatsApp não foi gerado.");
      }

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, "_blank");
      }

      setSettlementFeedback({
        type: "success",
        message:
          response.data?.message ??
          "PDF gerado e WhatsApp aberto com a mensagem pronta. Anexe o PDF manualmente antes de enviar.",
      });
    } catch (error: any) {
      whatsappWindow?.close();
      setSettlementFeedback({
        type: "error",
        message: getErrorMessage(
          error,
          "Não foi possível preparar o envio manual pelo WhatsApp.",
        ),
      });
    } finally {
      setSettlementLoading(false);
    }
  }

  async function handleGeneratePdfAndSendWhatsapp() {
    await handleSendWhatsapp();
  }

  useEffect(() => {
    if (loadingInitial) {
      getData();
    }
  });

  return (
    <Container>
      {!loadingInitial && (
        <PageHeader>
          <h1>Relatórios</h1>
        </PageHeader>
      )}
      {loadingInitial ? (
        <Loader size={40} biggestColor="gray" smallestColor="gray" />
      ) : (
        <FiltersContainer>
          <h2>Filtros</h2>
          <DataContainer>
            <form>
              <label htmlFor="birthday">De:</label>
              <input
                type="date"
                value={createdIn}
                onChange={(e) => {
                  setCreatedIn(e.target.value);
                  if (createdUntil && e.target.value > createdUntil) {
                    setCreatedUntil(e.target.value);
                  }
                }}
              />{" "}
              <br />
            </form>
          </DataContainer>

          <DataContainer>
            <form>
              <label htmlFor="birthday">Até:</label>
              <input
                disabled={!createdIn}
                type="date"
                min={createdIn}
                value={createdUntil}
                onChange={(e) => setCreatedUntil(e.target.value)}
              />
            </form>
          </DataContainer>

          <Filter>
            <p>Status:</p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
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
              onChange={(e) => setSelectedMotoboy(e.target.value)}
            >
              <option value="">Todos</option>
              {motoboys.map((motoboy: User) => (
                <option key={motoboy.id} value={motoboy.id}>
                  {motoboy.name}
                </option>
              ))}
            </select>
          </Filter>

          <Filter>
            <p>Estabelecimento:</p>
            <select
              value={selectedEstablishment}
              onChange={(e) => setSelectedEstablishment(e.target.value)}
            >
              <option value="">Todos</option>
              {shopkeepers.map((shopkeeper: User) => (
                <option key={shopkeeper.id} value={shopkeeper.id}>
                  {shopkeeper.name}
                </option>
              ))}
            </select>
          </Filter>

          <SearchButton onClick={onClickSearch}>
            {loading ? (
              <Loader size={20} biggestColor="gray" smallestColor="gray" />
            ) : (
              "Buscar"
            )}
          </SearchButton>

          {isAdminUser && (
            <SettlementSummary>
              <strong>Fechamento financeiro</strong>
              <p>
                Selecione um lojista e período para gerar o PDF. No envio pelo
                WhatsApp, o PDF será baixado e o WhatsApp será aberto com a
                mensagem pronta; anexe o PDF manualmente antes de enviar.
              </p>
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
}
