import api from "../../services/api";

/**
 * O seletor do Dashboard e o botão Selecionar de Cidades precisam apontar
 * para a MESMA cidade persistida no perfil do administrador.
 * O endpoint existente aceita cityId isoladamente; não reenviamos os outros
 * campos pessoais, permissões ou integrações do usuário.
 */
export async function saveAdminSelectedCity(userId: string, cityId: string): Promise<void> {
  const normalizedUserId = String(userId || "").trim();
  const normalizedCityId = String(cityId || "").trim();

  if (!normalizedUserId || !normalizedCityId) {
    throw new Error("Administrador ou cidade não identificados.");
  }

  await api.put(`/user/${encodeURIComponent(normalizedUserId)}`, {
    cityId: normalizedCityId,
  });
}
