import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/lib/constants/app";
import { ROUTES } from "@/lib/constants/routes";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-emerald-800 px-8 py-12 text-white">
        <p className="text-sm font-medium text-emerald-200">{APP_TAGLINE}</p>
        <h1 className="mt-2 text-4xl font-bold">{APP_NAME}</h1>
        <p className="mt-4 max-w-xl text-emerald-100">{APP_DESCRIPTION}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={ROUTES.public.request}>
            <Button className="bg-white text-emerald-800 hover:bg-emerald-50">
              Request a Worker
            </Button>
          </Link>
          <Link href={ROUTES.public.track}>
            <Button variant="secondary" className="border-emerald-600 bg-transparent text-white hover:bg-emerald-700">
              Track Your Job
            </Button>
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Trusted Workers", desc: "Verified local professionals in your area." },
          { title: "Simple Booking", desc: "Request help without creating an account." },
          { title: "Track Progress", desc: "Follow your job from request to completion." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-semibold text-zinc-900">{item.title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
