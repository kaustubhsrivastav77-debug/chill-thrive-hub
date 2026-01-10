import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Skeleton className="h-8 w-32 mx-auto rounded-full" />
          <Skeleton className="h-12 sm:h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
      </div>
    </section>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-7 w-2/3 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div className="rounded-2xl overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-5/6 rounded" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="space-y-2 pt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-48 rounded" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-32 rounded-lg mt-6" />
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8 space-y-6 h-full">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-5 rounded-full" />
        ))}
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function GalleryImageSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton className="aspect-square w-full" />
    </div>
  );
}

export function BookingStepSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-xl" />
            {i < 3 && <Skeleton className="h-1 w-16 mx-2 rounded" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-border/50 space-y-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimeSlotSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5 max-w-md mx-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-32 w-full rounded-xl mt-6" />
    </div>
  );
}

export function GridSkeleton({ count = 6, type = "card" }: { count?: number; type?: "card" | "service" | "testimonial" | "gallery" }) {
  const SkeletonComponent = {
    card: CardSkeleton,
    service: ServiceCardSkeleton,
    testimonial: TestimonialSkeleton,
    gallery: GalleryImageSkeleton,
  }[type];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <div className="container mx-auto px-4 py-16">
        <GridSkeleton count={6} type="card" />
      </div>
    </div>
  );
}
