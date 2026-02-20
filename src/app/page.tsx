'use client';
import CareerCompassLayout from "@/components/career-compass/career-compass-layout";
import PageLoader from "@/components/career-compass/page-loader";
import TwinklingStars from "@/components/career-compass/twinkling-stars";
import { useAppContext } from "@/contexts/app-context";

export default function Home() {
  const { isLoadingAuth, isProfileChecked } = useAppContext();

  // Show loader while Firebase auth is initializing
  if (isLoadingAuth || !isProfileChecked) {
    return <PageLoader />;
  }

  // Once authentication is resolved, show the full Infralith platform
  return <CareerCompassLayout />;
}