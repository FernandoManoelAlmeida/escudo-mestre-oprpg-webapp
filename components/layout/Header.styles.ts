import styled from "styled-components";

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.headerHeight};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 1px 0 0 ${({ theme }) => theme.colors.borderHighlight};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.02em;
`;
