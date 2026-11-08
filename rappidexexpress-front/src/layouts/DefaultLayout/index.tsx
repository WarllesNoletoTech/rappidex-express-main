import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header'
import { LayoutContainer } from './styles'
import { RankingEvaluationNotice } from '../../components/RankingEvaluationNotice'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <RankingEvaluationNotice />
      <Outlet />
    </LayoutContainer>
  )
}
