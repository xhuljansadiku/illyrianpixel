import { buildMetadata } from "@/lib/seo";
import { caseStudies } from "@/lib/caseStudies";
import PageHero from "@/components/PageHero";
import CaseStudyCard from "@/components/CaseStudyCard";
import GlobalCTA from "@/components/GlobalCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = buildMetadata("Work", "Selected work: case studies me rezultate të matshme dhe prezencë premium.");

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg text-text pt-14 md:pt-16">
        <PageHero
          label="SELECTED WORK"
          title="Studime reale, rezultate reale."
          description="Çdo projekt dokumenton problemin, vendimet dhe rezultatin e matshëm."
          image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
        />
        <section className="cinematic-section !min-h-0 border-t border-white/10 py-0 md:!min-h-0">
          <div className="section-wrap py-16 md:py-20">
            <div className="grid gap-5 md:grid-cols-2">
              {caseStudies.map((item) => (
                <CaseStudyCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>
        <GlobalCTA title="Le ta ndërtojmë studimin tënd të ardhshëm." />
      </main>
      <Footer />
    </>
  );
}
