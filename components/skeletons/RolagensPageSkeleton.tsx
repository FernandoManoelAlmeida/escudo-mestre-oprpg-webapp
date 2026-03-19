"use client";

import styled from "styled-components";
import { SkeletonBox } from "@/components/ui/Skeleton";

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled(SkeletonBox)`
  width: 140px;
  height: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled(SkeletonBox)`
  width: 180px;
  height: 1.125rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export function RolagensPageSkeleton() {
  return (
    <Page>
      <Title aria-hidden />
      <Section>
        <SectionTitle aria-hidden />
        <Row>
          <SkeletonBox $width="120px" $height="44px" aria-hidden />
          <SkeletonBox $width="80px" $height="44px" aria-hidden />
        </Row>
      </Section>
      <Section>
        <SectionTitle aria-hidden />
        <Row>
          <SkeletonBox $width="100px" $height="44px" aria-hidden />
          <SkeletonBox $width="140px" $height="44px" aria-hidden />
        </Row>
      </Section>
      <Section>
        <SectionTitle aria-hidden />
        <Row>
          <SkeletonBox $width="120px" $height="44px" aria-hidden />
          <SkeletonBox $width="100px" $height="44px" aria-hidden />
        </Row>
      </Section>
    </Page>
  );
}
