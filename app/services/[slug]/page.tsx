import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getServiceBySlug, services } from "../serviceData";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const service of services) {
    params.push({ slug: service.slug });
    for (const alias of service.aliases ?? []) {
      params.push({ slug: alias });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Owlistic Studio",
    };
  }

  return {
    title: `${service.title} | Owlistic Studio`,
    description: service.short,
    alternates: {
      canonical: absoluteUrl(`/services/${service.slug}`),
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <Header />
      <main className="srv-detail-page">
        {/* HERO */}
        <section className="as-hero srv-page-hero">
          <div className="container srv-page-hero-grid">
            <div className="as-hero-copy">
              <span className="pill-tag">SERVICE DETAILS</span>
              <h1>{service.title}</h1>
              <p>{service.short}</p>
              <div className="srv-breadcrumb">
                <Link href="/services">All Services</Link>
                <span aria-hidden="true">/</span>
                <span>{service.title}</span>
              </div>
              <div className="as-hero-actions">
                <Link href="/contact" className="btn btn-primary">Get Started</Link>
                <Link href="/services" className="btn btn-outline">All Services</Link>
              </div>
            </div>
            <div className="srv-page-hero-media">
              <img src={service.image} alt={service.alt} />
            </div>
          </div>
        </section>

        {/* MAIN SERVICE DETAIL BLOCK */}
        <section className="as-section srv-page-main">
          <div className="container srv-page-main-grid">
            <div className="srv-page-main-copy">
              <span className="srv-detail-tag">{service.tag}</span>
              <h2>{service.mainHeading}</h2>
              <p>{service.description}</p>
            </div>
            <div className="srv-page-main-card">
              <span className="srv-detail-card-label">What We Provide</span>
              <ul>
                {service.includes.map((item) => (
                  <li key={item}><span aria-hidden="true">✦</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT HELPS + TOOLS */}
        <section className="as-section srv-page-info">
          <div className="container srv-page-info-grid">
            <article className="srv-info-card">
              <span className="pill-tag">HOW IT HELPS YOUR BUSINESS</span>
              <ul className="srv-info-list">
                {service.helps.map((item) => (
                  <li key={item}>
                    <span className="srv-info-bullet" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="srv-info-card srv-info-card-dark">
              <span className="pill-tag pill-on-dark">TOOLS / DELIVERABLES</span>
              <div className="srv-tools">
                {service.tools.map((tool) => (
                  <span key={tool} className="srv-tool-chip">{tool}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* EXPLORE OTHER SERVICES */}
        <section className="as-section srv-related">
          <div className="container">
            <div className="srv-intro">
              <span className="pill-tag">EXPLORE OTHER SERVICES</span>
              <h2>Pair this service with the rest of your visual system</h2>
            </div>

            <div className="srv-grid srv-grid-related">
              {relatedServices.map((item) => (
                <Link key={item.slug} href={`/services/${item.slug}`} className="srv-card">
                  <div className="srv-card-media">
                    <img src={item.image} alt={item.alt} />
                  </div>
                  <div className="srv-card-body">
                    <span className="srv-card-tag">{item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.short}</p>
                    <span className="srv-card-arrow" aria-hidden="true">
                      <svg viewBox="0 0 32 12" fill="none">
                        <path d="M0 6h28M22 1l6 5-6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="as-section as-process-cta">
          <div className="container">
            <div className="as-cta-panel" id="srv-page-cta">
              <div className="as-cta-glow" aria-hidden="true" />
              <span className="pill-tag pill-on-dark">READY TO GROW?</span>
              <h2>Launch Your Brand&apos;s Next Digital Era</h2>
              <p>
                Tell me about your project and I&apos;ll suggest the best next step for your {service.title.toLowerCase()} work.
              </p>
              <div className="as-cta-actions">
                <Link href="/contact" className="btn btn-primary">Get Started</Link>
                <Link href="/services" className="btn btn-outline">All Services</Link>
              </div>
              <div className="as-cta-contact">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                <span aria-hidden="true">·</span>
                <a href="https://www.fiverr.com/block_design" target="_blank" rel="noopener noreferrer">
                  Fiverr: fiverr.com/block_design ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
