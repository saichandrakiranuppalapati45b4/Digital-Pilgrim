'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Waves,
  ShieldCheck,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export default function PushkaraluPage() {
  const { t, language } = useLanguage();

  const guidelines = [
    {
      en: 'Perform holy bath only at approved ghats secured with safety barricades and non-slip stepping stones.',
      te: 'భద్రతా బారికేడ్లు మరియు పటిష్టమైన రాతి మెట్లు కలిగిన ప్రభుత్వ అనుమతి పొందిన ఘాట్ల వద్ద మాత్రమే స్నానం ఆచరించండి.',
    },
    {
      en: 'Carefully follow all guidance from river safety personnel, lifeguards, and NDRF/SDRF disaster teams.',
      te: 'లైఫ్ గార్డులు, విపత్తు నిర్వహణ బృందాలు మరియు పోలీసుల భద్రతా సూచనలను ఎల్లవేళలా పాటించండి.',
    },
    {
      en: 'Preserve the sanctity of the river: do not dispose of plastics, synthetic garments, or chemical cleansing agents into the river currents.',
      te: 'గోదావరి పవిత్రతను కాపాడండి: నదీ ప్రవాహంలో ప్లాస్టిక్, కృత్రిమ వస్త్రాలు లేదా రసాయన సబ్బులను విడవవద్దు.',
    },
    {
      en: 'Keep elderly family members and children close. Use wristbands with contact information in crowded areas.',
      te: 'రద్దీగా ఉండే ప్రాంతాలలో వృద్ధులు మరియు పిల్లల పట్ల అప్రమత్తంగా ఉండండి. సంప్రదింపు సమాచారం తెలిపే ట్యాగ్‌లు వాడండి.',
    },
    {
      en: 'Utilize official RO drinking water posts and hygienic sanitation units stationed along the river promenade.',
      te: 'నదీ తీరంలో ఏర్పాటు చేసిన శుద్ధ తాగునీటి కేంద్రాలు మరియు ఆధునిక పారిశుధ్య కేంద్రాలను ఉపయోగించండి.',
    },
  ];

  const ghats = [
    {
      name: { en: 'Pushkar Ghat (Rajahmundry)', te: 'పుష్కర ఘాట్ (రాజమండ్రి)' },
      desc: {
        en: 'The epicentre of cultural celebrations, Godavari Harati ceremonies, and the largest congregation of devotees.',
        te: 'సాంస్కృతిక కార్యక్రమాలు, గోదావరి నిత్య హారతి మరియు లక్షలాది భక్తుల పుష్కర స్నానాలకు ప్రధాన వేదిక.',
      },
    },
    {
      name: { en: 'Kotilingala Ghat (Rajahmundry)', te: 'కోటిలింగాల ఘాట్ (రాజమండ్రి)' },
      desc: {
        en: 'Centuries of spiritual austerity beside the sacred Kotilingeswara temple complex.',
        te: 'కోటిలింగేశ్వర స్వామి సన్నిధిలోని ప్రాచీన మరియు ప్రశాంత స్నాన ఘట్టం.',
      },
    },
    {
      name: { en: 'Goshpada Kshetra Ghat (Kovvur)', te: 'గోష్పాద క్షేత్ర ఘాట్ (కొవ్వూరు)' },
      desc: {
        en: 'Historic ghat opposite Rajahmundry across the rail-cum-road bridge, famous for sacred ancestral rituals.',
        te: 'రాజమండ్రికి ఎదురుగా కొవ్వూరు వైపు గల పవిత్ర గోష్పాద క్షేత్రం, పితృకార్యాలకు అత్యంత ప్రసిద్ధి.',
      },
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Pushkaralu Header Banner */}
      <section className="bg-gradient-to-b from-primary-maroon to-[#541524] text-white pt-16 pb-20 border-b border-heritage-gold/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-heritage-gold border border-heritage-gold/40">
            <Waves className="h-4 w-4" />
            <span>{t('pushkaralu.badge')}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('pushkaralu.title')}
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed">
            {t('pushkaralu.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Narrative: Spiritual Significance & Historical Origin */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Significance Card */}
          <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary-maroon font-serif text-xl font-bold">
              <Sparkles className="h-6 w-6 text-heritage-gold" />
              <h2>{t('pushkaralu.significanceTitle')}</h2>
            </div>
            <p className="text-sm text-secondary-text leading-relaxed">
              {t('pushkaralu.significanceDesc')}
            </p>
            <p className="text-sm text-secondary-text leading-relaxed">
              {language === 'te'
                ? 'పుష్కరుడు అనే పవిత్ర తీర్థరాజు గోదావరి నదిలో ప్రవేశించి 12 రోజుల పాటు సమస్త పవిత్ర తీర్థాల శక్తులను గోదావరి జలాలలో నిక్షిప్తం చేస్తారని నమ్మకం. ఈ కాలంలో గంగా, యమున, సరస్వతి వంటి సమస్త దివ్య నదులు గోదావరిలోనే కొలువై ఉంటాయని పురాణాలు వర్ణిస్తున్నాయి.'
                : 'According to sacred scriptural traditions, Pushkara — the lord of all holy waters — resides in the Godavari for twelve days, sanctifying its waters with the essence of all three-and-a-half crore sacred rivers across Bharata.'}
            </p>
          </div>

          {/* Historical Chronicle Card */}
          <div className="rounded-2xl border border-border-heritage bg-white p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-primary-maroon font-serif text-xl font-bold">
              <BookOpen className="h-6 w-6 text-saffron" />
              <h2>{t('pushkaralu.historyTitle')}</h2>
            </div>
            <p className="text-sm text-secondary-text leading-relaxed">
              {t('pushkaralu.historyDesc')}
            </p>
            <p className="text-sm text-secondary-text leading-relaxed">
              {language === 'te'
                ? 'తూర్పు చాళుక్య రాజైన రాజరాజ నరేంద్రుని కాలం నుండి నేటి వరకు రాజమహేంద్రవరం గోదావరి పుష్కరాలకు ప్రధాన సాంస్కృతిక కేంద్రంగా భాసిల్లుతోంది. కాకతీయులు, విజయనగర రాజులు మరియు రెడ్డి రాజులు ఘాట్ల నిర్మాణాలను బలోపేతం చేశారు.'
                : 'From the reign of Eastern Chalukya monarch Rajaraja Narendra in Rajamahendravaram to the present modern era, the celebration has served as a unifying cultural summit bringing together poets, artists, and millions of families.'}
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Bathing Ghats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-border-heritage pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron">
            {language === 'te' ? 'పుణ్య స్నాన ఘాట్లు' : 'Sacred Riverfronts'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary-maroon">
            {language === 'te' ? 'ప్రధాన పుష్కర ఘాట్లు' : 'Prominent Bathing Ghats'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ghats.map((ghat, idx) => (
            <div key={idx} className="rounded-xl border border-border-heritage bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary-maroon font-serif font-bold text-base">
                <MapPin className="h-4 w-4 text-saffron" />
                <span>{language === 'te' ? ghat.name.te : ghat.name.en}</span>
              </div>
              <p className="text-xs text-secondary-text leading-relaxed">
                {language === 'te' ? ghat.desc.te : ghat.desc.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visitor Safety Guidelines */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-heritage-gold/40 bg-white p-8 sm:p-10 shadow-heritage space-y-6">
          <div className="flex items-center gap-3 text-primary-maroon font-serif text-xl sm:text-2xl font-bold">
            <ShieldCheck className="h-7 w-7 text-heritage-gold" />
            <h2>{t('pushkaralu.guidelinesTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map((g, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-lg bg-ivory-subtle p-4 border border-border-heritage">
                <CheckCircle2 className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">
                  {language === 'te' ? g.te : g.en}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-saffron/10 p-4 border border-saffron/30 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-saffron-dark shrink-0" />
            <p className="text-xs text-secondary-text leading-relaxed">
              {language === 'te'
                ? 'గమనిక: అత్యవసర సమయాల్లో 108 (అంబులెన్స్) లేదా స్థానిక పుష్కర సమాచార కేంద్రాలను సంప్రదించండి.'
                : 'Important: In case of any medical emergencies or assistance, immediately approach designated aid kiosks or dial 108.'}
            </p>
          </div>
        </div>
      </section>

      {/* Direct to Directory */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Link
          href="/heritage"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-maroon px-8 py-4 text-sm font-bold text-white shadow-heritage hover:bg-primary-hover transition-all"
        >
          <span>{language === 'te' ? 'పుణ్యక్షేత్రాలను దర్శించండి' : 'Explore Godavari Heritage Directory'}</span>
          <ArrowRight className="h-4 w-4 text-heritage-gold" />
        </Link>
      </section>
    </div>
  );
}
