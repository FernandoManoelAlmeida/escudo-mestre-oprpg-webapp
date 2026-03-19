import styled from "styled-components";

export const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.bottomNavHeight};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 -1px 0 0 ${({ theme }) => theme.colors.borderHighlight};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const Tooltip = styled.span<{ $visible?: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 6px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: 500;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 10;
`;

export const NavItemWrap = styled.span`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 64px;
  min-height: 44px;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background 0.15s, color 0.15s;
  ${({ theme, $active }) =>
    $active ? `text-shadow: 0 0 12px ${theme.colors.primaryGlow};` : ""}

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

export const NavIcon = styled.img<{ $active?: boolean }>`
  width: 24px;
  height: 24px;
  display: block;
  object-fit: contain;
  filter: invert(1);
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  transition: opacity 0.15s;
`;

/** Botão central (Início) em estilo FAB: círculo maior que sobressai da barra */
const FAB_SIZE = 56;
const FAB_RAISE = 18;

export const CentralButtonWrap = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -${FAB_RAISE}px;
  width: ${FAB_SIZE}px;
  height: ${FAB_SIZE}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  box-shadow:
    0 0 0 3px ${({ theme }) => theme.colors.primaryGlow},
    0 4px 12px ${({ theme }) => theme.colors.primaryGlow};
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  z-index: 1;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow:
      0 0 0 3px ${({ theme }) => theme.colors.primaryGlow},
      0 6px 16px ${({ theme }) => theme.colors.primaryGlow};
  }
`;

export const CentralButtonIcon = styled.img`
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
  filter: brightness(0) invert(1);
`;
