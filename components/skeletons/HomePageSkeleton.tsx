"use client";

import styled from "styled-components";
import { SkeletonBox } from "@/components/ui/Skeleton";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const TitleSkeleton = styled(SkeletonBox)`
  width: 280px;
  height: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Line = styled(SkeletonBox)`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  height: 0.875rem;
`;

const SectionTitle = styled(SkeletonBox)`
  width: 160px;
  height: 1.25rem;
  margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export function HomePageSkeleton() {
  return (
    <Page>
      <TitleSkeleton aria-hidden />
      <Line $width="100%" aria-hidden />
      <Line $width="95%" aria-hidden />
      <Line $width="88%" aria-hidden />
      <Line $width="70%" aria-hidden />
      <Line $width="90%" aria-hidden />
      <Line $width="60%" aria-hidden />
      <SectionTitle aria-hidden />
      <InputRow>
        <SkeletonBox $height="44px" $width="200px" aria-hidden />
        <SkeletonBox $height="44px" $width="80px" aria-hidden />
      </InputRow>
    </Page>
  );
}
