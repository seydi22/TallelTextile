
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import Heading from '@/components/Heading';
import { SectionTitle } from '@/components';

const AboutPage = () => {
  return (
    <div className="bg-brand-bg-primary min-h-screen">
      <SectionTitle title="À propos de nous" path="Home | À propos" />
      <div className="container-custom section">
        
        {/* Founder Section */}
        <section className="mb-16 md:mb-24 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <ProfileCard
              imageUrl="/randomuser.jpg"
              name="DJIBRIL Tall"
              title="Fondateur et Directeur de TALLEL TEXTILE"
              birthDate="24 septembre 1990 à Nouakchott"
              bio={
                <>
                  <p>Papis Tall est un entrepreneur mauritanien passionné de mode, de culture et d'innovation. Fondateur de la marque TALLEL TEXTILE, il incarne une nouvelle génération de créateurs africains qui mêlent tradition et modernité, raffinement et identité.</p>
                  <p>Issu d'un environnement riche en valeurs et en diversité culturelle, Papis Tall grandit avec une sensibilité particulière pour l'élégance et le détail. Très tôt, il développe un goût prononcé pour l'habillement soigné et l'esthétique vestimentaire. Ce qui n'était d'abord qu'un intérêt personnel devient, avec le temps, une vocation : celle de créer une marque de vêtements qui incarne la noblesse du style africain tout en répondant aux standards internationaux.</p>
                  <p>En 2023, il fonde TALLEL TEXTILE, une maison de mode née du désir de proposer une élégance nouvelle : authentique, accessible et profondément enracinée dans la culture mauritanienne et sahélienne. Sous sa direction, la marque se spécialise dans la création de vêtements haut de gamme, alliant coupes modernes, tissus de qualité et inspirations traditionnelles. Chaque pièce raconte une histoire, rend hommage à un héritage et valorise le savoir-faire local.</p>
                  <p>Visionnaire et déterminé, Papis Tall ne se contente pas de créer des vêtements : il bâtit un univers. À travers TALLEL TEXTILE, il souhaite aussi redonner confiance à la jeunesse africaine, en prouvant qu'il est possible de rêver grand, de créer localement et de rayonner à l'échelle internationale.</p>
                  <p>Homme de terrain et de réflexion, il croit au pouvoir du textile comme vecteur d'expression, d'émancipation et de rayonnement culturel. En mettant l'élégance au cœur de sa démarche, il ambitionne de faire de TALLEL TEXTILE une référence dans la mode africaine contemporaine.</p>
                  <p>Aujourd'hui, Papis Tall continue de développer sa marque avec passion, entouré d'une équipe engagée. Il travaille activement à l'élargissement de ses collections, à la collaboration avec des artisans locaux, et à la conquête de nouveaux marchés en Afrique et au-delà.</p>
                </>
              }
            />
          </div>
        </section>

        {/* Product Section */}
        <section className="mb-16 md:mb-24 animate-slide-up">
          <div className="card">
            <div className="card-body">
              <Heading 
                title="Boubou Prestige – Made in Mauritanie" 
                subtitle="L'excellence du savoir-faire traditionnel mauritanien"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-brand-primary mb-4">
                    L'expression parfaite de l'élégance africaine.
                  </h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Ce boubou est confectionné avec soin au cœur de Nouakchott, dans le respect du savoir-faire traditionnel mauritanien.
                  </p>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Tissu noble, broderies raffinées, coupe majestueuse : chaque détail célèbre l'identité et la dignité.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-brand-text-secondary mt-6">
                    <li><span className="font-semibold text-brand-text-primary">100% fait main</span></li>
                    <li>Origine : Nouakchott, Mauritanie</li>
                    <li>Disponible en plusieurs coloris</li>
                    <li>Tailles sur mesure / standard</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-brand-primary mb-4">
                    Costume Africain – L'Art de l'Élégance
                  </h3>
                  <p className="text-brand-text-secondary leading-relaxed">
                    Conçu avec raffinement et porté avec fierté, ce costume africain traditionnel incarne l'élégance sahélienne dans sa forme la plus noble. Fabriqué à Nouakchott par des artisans passionnés, chaque modèle reflète un héritage culturel fort, allié à une finition moderne et luxueuse.
                  </p>
                  <div className="mt-6">
                    <h4 className="font-serif text-xl font-semibold text-brand-text-primary mb-3">
                      Tissus disponibles :
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-brand-text-secondary">
                      <li><span className="font-semibold text-brand-text-primary">Getzner :</span> brillance élégante et texture premium</li>
                      <li><span className="font-semibold text-brand-text-primary">Bazin Riche :</span> incontournable et cérémonial</li>
                      <li><span className="font-semibold text-brand-text-primary">Super Cent :</span> confort suprême et tombé fluide</li>
                      <li><span className="font-semibold text-brand-text-primary">Fil-à-Fil :</span> sobriété chic et légèreté</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="animate-fade-in">
          <Heading 
            title="Une Équipe, Une Vision, Une Passion Partagée"
            subtitle="Rencontrez les talents qui façonnent l'identité de TALLEL TEXTILE"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <ProfileCard
              imageUrl="/SALIMA.jpg"
              name="SALIMA ADAMA DIENG"
              title="Styliste principale"
              birthDate="25 octobre 2000"
              education="Diplômée en formation OG Textile – Sandaga, Sénégal"
              bio={
                <p>Visionnaire, créative et inspirée, Salima est la styliste en chef de TALLEL TEXTILE. Spécialisée dans la conception de tenues africaines contemporaines, elle allie finesse des coupes, audace des matières et respect des traditions. Elle donne vie à chaque collection avec un regard moderne sur l'héritage vestimentaire sahélien.</p>
              }
            />
            <ProfileCard
              imageUrl="/MOHAMED.jpg"
              name="MOHAMED CISSÉ"
              title="Chargé de communication"
              birthDate="10 décembre 1994"
              education="Master en marketing et communication"
              bio={
                <p>Stratège de l'image et de la marque, Mohamed est le lien entre l'univers de TALLEL TEXTILE et le public. Grâce à son expertise en marketing et storytelling, il valorise les créations, développe la présence digitale de la marque et conçoit des campagnes qui reflètent notre identité.</p>
              }
            />
            <ProfileCard
              imageUrl="/ALIOU.jpg"
              name="ALIOU SOW"
              title="Couturier principal"
              birthDate="17 octobre 1997"
              education="Diplômé du centre de formation Idrissa Sy – Keur Ma Sarr, Sénégal"
              bio={
                <p>Artisan de l'excellence, Aliou incarne la précision et la maîtrise du geste. Chaque pièce qu'il confectionne est le fruit d'un travail minutieux, hérité d'un savoir-faire traditionnel. Sa main experte donne à nos créations la qualité et la finition qui font la réputation de TALLEL TEXTILE.</p>
              }
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
