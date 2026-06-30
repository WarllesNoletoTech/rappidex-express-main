import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import {
  Hamburger,
  Scroll,
  User,
  SignOut,
  FilePlus,
  UserPlus,
  MapPin,
  Storefront,
  List,
  X,
} from 'phosphor-react'

import {
  DesktopMenu,
  HeaderContainer,
  MobileCloseButton,
  MobileMenuButton,
  MobileMenuDrawer,
  MobileMenuHeader,
  MobileMenuLink,
  MobileMenuList,
  MobileMenuOverlay,
  RappidexLogo,
} from './styles'
import { DeliveryContext } from '../../context/DeliveryContext'

export function Header() {
  const { logout, permission } = useContext(DeliveryContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  function handleLogout(){
    logout()
  }

  function handleMobileLogout() {
    closeMobileMenu()
    logout()
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((state) => !state)
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  const canAccessAdminMenu = permission === 'admin' || permission === 'superadmin'
  const canCreateDelivery =
    permission === 'admin' ||
    permission === 'superadmin' ||
    permission === 'shopkeeper' ||
    permission === 'shopkeeperadmin'

  return (
    <HeaderContainer>
      <NavLink to="/" title="Entregas" onClick={closeMobileMenu}>
        <RappidexLogo src="https://i.pinimg.com/736x/a5/9f/17/a59f176343c6fd0d83adea72eaf0c57f.jpg" />
      </NavLink>
      <DesktopMenu>
        {canAccessAdminMenu &&
          <NavLink to="/novo-usuario" title="Novo Usuário">
            <UserPlus  size={24} />
          </NavLink>
        }
        {canAccessAdminMenu &&
          <NavLink to="/clientes-ifood" title="Empresas Cadastradas">
            <Storefront size={24} />
          </NavLink>
        }
        {permission === 'superadmin' &&
          <NavLink to="/cidades" title="Cidades">
            <MapPin size={24} />
          </NavLink>
        }
        {canCreateDelivery &&
          <NavLink to="/nova-entrega" title="Nova entrega">
            <FilePlus  size={24} />
          </NavLink>
        }
        <NavLink to="/" title="Entregas">
          <Hamburger  size={24} />
        </NavLink>
        <NavLink to="/relatorios" title="Relatórios">
          <Scroll size={24} />
        </NavLink>
        <NavLink to="/perfil" title="Perfil">
          <User  size={24} />
        </NavLink>
        <NavLink to="/" onClick={handleLogout} title="Sair">
          <SignOut size={24} />
        </NavLink>
      </DesktopMenu>

      <MobileMenuButton
        type="button"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMobileMenuOpen}
      >
        <List size={26} />
      </MobileMenuButton>

      {isMobileMenuOpen && createPortal(
        <MobileMenuOverlay onClick={closeMobileMenu}>
          <MobileMenuDrawer onClick={(event) => event.stopPropagation()}>
            <MobileMenuHeader>
              <strong>Menu</strong>
              <MobileCloseButton
                type="button"
                onClick={closeMobileMenu}
                aria-label="Fechar menu"
              >
                <X size={22} />
              </MobileCloseButton>
            </MobileMenuHeader>

            <MobileMenuList aria-label="Navegação mobile">
              {canAccessAdminMenu && (
                <MobileMenuLink to="/novo-usuario" onClick={closeMobileMenu}>
                  <UserPlus size={21} />
                  <span>Novo Usuário</span>
                </MobileMenuLink>
              )}
              {canAccessAdminMenu && (
                <MobileMenuLink to="/clientes-ifood" onClick={closeMobileMenu}>
                  <Storefront size={21} />
                  <span>Lojas iFood</span>
                </MobileMenuLink>
              )}
              {permission === 'superadmin' && (
                <MobileMenuLink to="/cidades" onClick={closeMobileMenu}>
                  <MapPin size={21} />
                  <span>Localização</span>
                </MobileMenuLink>
              )}
              {canCreateDelivery && (
                <MobileMenuLink to="/nova-entrega" onClick={closeMobileMenu}>
                  <FilePlus size={21} />
                  <span>Nova entrega</span>
                </MobileMenuLink>
              )}
              <MobileMenuLink to="/" end onClick={closeMobileMenu}>
                <Hamburger size={21} />
                <span>Pedidos</span>
              </MobileMenuLink>
              <MobileMenuLink to="/relatorios" onClick={closeMobileMenu}>
                <Scroll size={21} />
                <span>Relatórios</span>
              </MobileMenuLink>
              <MobileMenuLink to="/perfil" onClick={closeMobileMenu}>
                <User size={21} />
                <span>Perfil</span>
              </MobileMenuLink>
              <MobileMenuLink
                to="/"
                data-ignore-active="true"
                onClick={handleMobileLogout}
              >
                <SignOut size={21} />
                <span>Sair</span>
              </MobileMenuLink>
            </MobileMenuList>
          </MobileMenuDrawer>
        </MobileMenuOverlay>,
        document.body,
      )}
    </HeaderContainer>
  )
}
