import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { env } from '../src/config/env';

if (env.MONGODB_URI.includes('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}
}
import { User } from '../src/models/User';
import { Heritage } from '../src/models/Heritage';
import { Event } from '../src/models/Event';
import { Announcement } from '../src/models/Announcement';
import { Facility } from '../src/models/Facility';
import { generateQRCodeDataUrl } from '../src/services/qrService';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected.');

    // 1. Seed Admin User (if credentials provided in environment)
    const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || env.INITIAL_ADMIN_EMAIL || '').toLowerCase();
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || env.INITIAL_ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      let admin = await User.findOne({ email: adminEmail });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      if (!admin) {
        admin = await User.create({
          name: process.env.INITIAL_ADMIN_NAME || env.INITIAL_ADMIN_NAME || 'Digital Pilgrim Administrator',
          email: adminEmail,
          passwordHash,
          role: 'admin',
          isActive: true,
        });
        console.log(`[Seed] Created admin: ${admin.email}`);
      } else {
        admin.passwordHash = passwordHash;
        await admin.save();
        console.log(`[Seed] Updated admin password: ${admin.email}`);
      }
    } else {
      console.log('[Seed] Note: Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD to seed initial admin, or run npm run create-admin.');
    }

    // 2. Clear existing demonstration records for a clean baseline
    await Promise.all([
      Heritage.deleteMany({}),
      Event.deleteMany({}),
      Announcement.deleteMany({}),
      Facility.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing records.');

    // 3. Seed Heritage Locations
    const heritageItems = [
      {
        slug: 'kotilingeswara-temple-ghat',
        name: {
          en: 'Kotilingeswara Temple & Ghat',
          te: 'కోటిలింగేశ్వర స్వామి దేవాలయం మరియు ఘాట్',
        },
        category: 'temple' as const,
        description: {
          en: 'One of the most sacred pilgrimage shrines situated on the serene banks of the Akhanda Godavari in Rajahmundry. Renowned for its ancient Shivalinga and sacred bathing steps.',
          te: 'రాజమండ్రిలోని అఖండ గోదావరి పవిత్ర తీరాన వెలసిన అత్యంత పురాతన శివక్షేత్రం. ఇక్కడి కోటిలింగాల తీర్థం పుష్కరాల సమయంలో భక్తులకు ప్రధాన స్నానఘట్టం.',
        },
        history: {
          en: 'According to regional historical chronicles and Puranic legends, Sage Gautama bathed here to absolve himself of sins, establishing Shiva lingas. The temple complex was renovated across centuries by Eastern Chalukyas, Vijayanagara monarchs, and local chieftains.',
          te: 'గౌతమ మహర్షి పాపపరిహారార్థం ఇక్కడ శివలింగ ప్రతిష్ట చేశారని స్థలపురాణం చెబుతోంది. తూర్పు చాళుక్యులు మరియు విజయనగర రాజుల కాలంలో ఈ దేవాలయం మరియు ఘాట్ విస్తరించబడ్డాయి.',
        },
        significance: {
          en: 'During Godavari Pushkaralu, the Kotilingala Ghat witnesses millions of devotees taking holy dip in the river. It offers a confluence of spiritual resonance and breathtaking sunset river vistas.',
          te: 'గోదావరి పుష్కరాల సమయంలో భక్తులు ఇక్కడి ఘాట్ వద్ద పవిత్ర పుణ్యస్నానాలు ఆచరించడం అత్యంత పుణ్యప్రదంగా భావిస్తారు. ఆధ్యాత్మికత మరియు గోదావరి సహజ సౌందర్యం ఇక్కడ కలబోసి ఉంటాయి.',
        },
        address: 'Kotilingala Ghat Road, Rajamahendravaram, East Godavari District, Andhra Pradesh 533101',
        location: {
          latitude: 16.9942,
          longitude: 81.7725,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Evening temple lamps illuminating Godavari riverside',
              te: 'గోదావరి తీరంలో సాయంత్రం వేళ ఆలయ కాంతులు',
            },
            isPrimary: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Devotees along the heritage stone ghats',
              te: 'రాతి ఘాట్లపై భక్తుల పుష్కర స్నానాలు',
            },
            isPrimary: false,
          },
        ],
        audioGuides: [
          {
            url: 'https://actions.google.com/sounds/v1/water/waves_crashing_against_rocks.ogg',
            title: {
              en: 'Spiritual Significance of Kotilingala Ghat (Overview)',
              te: 'కోటిలింగాల ఘాట్ ఆధ్యాత్మిక ప్రాశస్త్యం (ఆడియో వివరణ)',
            },
            language: 'both' as const,
            duration: 180,
          },
        ],
        status: 'published' as const,
        isFeatured: true,
      },
      {
        slug: 'draksharamam-bhimeswara-swamy',
        name: {
          en: 'Sri Bhimeswara Swamy Temple (Draksharamam)',
          te: 'శ్రీ భీమేశ్వర స్వామి దేవాలయం (ద్రాక్షారామం)',
        },
        category: 'spiritual_site' as const,
        description: {
          en: 'Celebrated as the Dakshina Kashi and one of the supreme Pancharama Kshetras, housing a magnificent 14-foot high crystal Spatika Shivalinga enshrined across two storeys.',
          te: 'దక్షిణ కాశీగా ప్రసిద్ధి చెందిన పంచారామ క్షేత్రాలలో అగ్రగణ్యమైన ఆలయం. రెండంతస్తులలో దర్శనమిచ్చే 14 అడుగుల ఎత్తైన అద్భుత స్ఫటిక లింగం ఇక్కడి విశేషం.',
        },
        history: {
          en: 'Built in the 9th-10th century CE by Eastern Chalukyan King Bhima I. The architecture features imposing Prakara walls, exquisite stone carvings, and over 400 inscriptions tracing medieval Andhra history.',
          te: 'క్రీ.శ. 9-10 శతాబ్దాలలో తూర్పు చాళుక్య రాజైన మొదటి భీముడు ఈ ఆలయాన్ని నిర్మించారు. ఆలయ ప్రాకారాలు మరియు స్తంభాలపై 400 పైగా ప్రాచీన శాసనాలు కలవు.',
        },
        significance: {
          en: 'It also enshrines Goddess Manikyamba, revered as one of the 18 prime Maha Shakthi Peethas across the subcontinent, making it a rare confluence of Shaivism and Shaktism.',
          te: 'అష్టాదశ శక్తి పీఠాలలో ఒకటైన శ్రీ మాణిక్యాంబ అమ్మవారి సన్నిధి కూడా ఈ ప్రాంగణంలోనే ఉండటం వల్ల ఇది పరమ పవిత్రమైన శక్తిక్షేత్రం.',
        },
        address: 'Draksharamam, Konaseema District, Andhra Pradesh 533262',
        location: {
          latitude: 16.7933,
          longitude: 82.0628,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Chalukyan monolithic pillars and stone courtyard',
              te: 'చాళుక్య శైలి శిల్పకళా వైభవం మరియు ఆలయ ప్రాకారం',
            },
            isPrimary: true,
          },
        ],
        audioGuides: [
          {
            url: 'https://actions.google.com/sounds/v1/ambiences/temple_bell_extended.ogg',
            title: {
              en: 'Legends of Dakshina Kashi & Pancharama (Draksharamam)',
              te: 'దక్షిణ కాశీ ద్రాక్షారామ చరిత్ర మరియు విశేషాలు',
            },
            language: 'te' as const,
            duration: 240,
          },
        ],
        status: 'published' as const,
        isFeatured: true,
      },
      {
        slug: 'pattiseema-veerabhadra-temple',
        name: {
          en: 'Sri Veerabhadra Swamy Temple (Pattiseema)',
          te: 'శ్రీ వీరభద్ర స్వామి దేవాలయం (పట్టిసీమ)',
        },
        category: 'temple' as const,
        description: {
          en: 'A scenic island temple perched atop the picturesque Devakuta Parvatha right in the center of the majestic Godavari River.',
          te: 'గోదావరి నది నడిబొడ్డున దేవకూట పర్వతంపై వెలసిన ప్రశాంతమైన ద్వీప దేవాలయం. ఇక్కడికి పడవల ద్వారా ప్రయాణం చేయడం భక్తులకు మరపురాని అనుభూతి.',
        },
        history: {
          en: 'Legend says that Lord Veerabhadra dropped his weapon (Pattisa) here after destroying Daksha’s sacrifice, lending the island its sacred name Pattiseema.',
          te: 'దక్షయజ్ఞం అనంతరం శ్రీ వీరభద్రస్వామి తన ఆయుధమైన పట్టిసమును ఇక్కడ కడిగినందువల్ల ఈ పుణ్యక్షేత్రానికి పట్టిసీమ అనే పేరు స్థిరపడింది.',
        },
        significance: {
          en: 'Surrounded entirely by the flowing waters of the Godavari, pilgrims take country boats across the river, meditating amidst natural rock formations and peaceful river currents.',
          te: 'నిత్యం ప్రవహించే గోదావరి జలాలు, కొండచరియల నడుమ ప్రకృతి శోభతో విలసిల్లే ఈ ఆలయం మానసిక ప్రశాంతతను అందిస్తుంది.',
        },
        address: 'Pattiseema Island, Polavaram Mandal, Eluru District, Andhra Pradesh 534315',
        location: {
          latitude: 17.1583,
          longitude: 81.6217,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Scenic Godavari river crossing towards Pattiseema hill',
              te: 'పట్టిసీమ కొండ వైపు గోదావరి నదిలో పడవల ప్రయాణం',
            },
            isPrimary: true,
          },
        ],
        audioGuides: [
          {
            url: 'https://actions.google.com/sounds/v1/water/gentle_stream_flowing.ogg',
            title: {
              en: 'The Island Temple of Veerabhadra — Audio Guide',
              te: 'ద్వీప దేవాలయం పట్టిసీమ చారిత్రక కథనం',
            },
            language: 'en' as const,
            duration: 150,
          },
        ],
        status: 'published' as const,
        isFeatured: true,
      },
      {
        slug: 'pushkar-ghat-rajahmundry',
        name: {
          en: 'Pushkar Ghat & Godavari Promenade',
          te: 'పుష్కర ఘాట్ మరియు గోదావరి తీర నడకదారి',
        },
        category: 'ghat' as const,
        description: {
          en: 'The historic epicentre of Godavari Pushkaralu celebrations in Rajamahendravaram, featuring broad stepped descents into the holy river, illuminated pavilions, and the evening Godavari Harati.',
          te: 'రాజమండ్రిలో గోదావరి పుష్కర ఉత్సవాలకు ప్రధాన వేదిక. విశాలమైన రాతి మెట్లు, సాయంకాల గోదావరి హారతి, సాంస్కృతిక ప్రదర్శనలతో అలరారే ముఖ్య ఘాట్.',
        },
        history: {
          en: 'Designed and expanded during successive historic administrations and modern civic developments to safely accommodate large congregations during the twelve-year celestial Pushkaram cycle.',
          te: 'పుష్కరాల సమయంలో లక్షలాది మంది యాత్రికులు ఒకేసారి పుణ్యస్నానాలు ఆచరించేందుకు వీలుగా రూపొందించబడిన ఆధునిక మరియు చారిత్రక ఘాట్.',
        },
        significance: {
          en: 'The site where sacred river worship (Godavari Nitya Harati) is conducted daily with vedic chants, oil lamps floating on the currents, and conch fanfares.',
          te: 'ప్రతిరోజూ సాయంత్రం వేదమంత్రోచ్చారణలు, మంగళ హారతులతో గోదావరి మాతకు సమర్పించే నిత్య హారతి ఇక్కడ చూడదగిన నేత్రపర్వం.',
        },
        address: 'Pushkar Ghat, Main Road, Rajamahendravaram, Andhra Pradesh 533101',
        location: {
          latitude: 17.0005,
          longitude: 81.7778,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Grand Godavari evening lamps and river reflection',
              te: 'గోదావరి నదీ తరంగాలపై దీపాల శోభ',
            },
            isPrimary: true,
          },
        ],
        audioGuides: [
          {
            url: 'https://actions.google.com/sounds/v1/crowds/outdoor_crowd_medium.ogg',
            title: {
              en: 'Guide to Taking Holy Dip and Pushkaralu Etiquette',
              te: 'పుష్కర స్నాన నియమాలు మరియు ఘాట్ మార్గదర్శకాలు',
            },
            language: 'both' as const,
            duration: 210,
          },
        ],
        status: 'published' as const,
        isFeatured: true,
      },
      {
        slug: 'dwaraka-tirumala-chinna-tirupati',
        name: {
          en: 'Sri Venkateswara Swamy Temple (Dwaraka Tirumala)',
          te: 'శ్రీ వేంకటేశ్వర స్వామి దేవాలయం (ద్వారకా తిరుమల)',
        },
        category: 'spiritual_site' as const,
        description: {
          en: 'Affectionately known as Chinna Tirupati, this hilltop sanctum is set amidst emerald paddy fields and coconut groves in the Godavari hinterland.',
          te: 'చిన్న తిరుపతిగా ప్రసిద్ధి చెందిన పుణ్యక్షేత్రం. కొండపై కొలువైన శ్రీ వేంకటేశ్వర స్వామి వారి స్వయంభూ మరియు ప్రతిష్టామూర్తుల అరుదైన సన్నిధి.',
        },
        history: {
          en: 'Sage Dwaraka penanced on this hill (Seshachala) to obtain Lord Venkateswara’s darshan. The upper portion of the Lord emerged from an ant-hill, and later Sri Ramanuja consecrated a full-length idol directly behind it.',
          te: 'ద్వారక మహర్షి తపస్సుకు మెచ్చి స్వామివారు వాల్మీకంలో ప్రత్యక్షమైనారని స్థలచరిత్ర. రామానుజాచార్యుల కాలంలో పూర్తి విగ్రహం ప్రతిష్టించబడింది.',
        },
        significance: {
          en: 'Pilgrims visiting Godavari region frequently complete their spiritual vow here before returning, celebrating Kalyanam ceremonies.',
          te: 'గోదావరి పరివాహక ప్రాంత యాత్రికులు తమ తీర్థయాత్రను సఫలం చేసుకోవడానికి ఇక్కడ నిత్య కళ్యాణోత్సవాలలో పాల్గొంటారు.',
        },
        address: 'Dwaraka Tirumala, Eluru District, Andhra Pradesh 534426',
        location: {
          latitude: 16.9536,
          longitude: 81.2589,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Temple tower rising gracefully above the green hill slopes',
              te: 'శేషాచల పర్వతంపై స్వర్ణ రాజగోపురం',
            },
            isPrimary: true,
          },
        ],
        audioGuides: [],
        status: 'published' as const,
        isFeatured: false,
      },
      {
        slug: 'dindi-godavari-delta-estuary',
        name: {
          en: 'Dindi Godavari Delta & Coconut Estuary',
          te: 'దిండి గోదావరి డెల్టా మరియు కొబ్బరి తోటల తీరం',
        },
        category: 'nature_cultural' as const,
        description: {
          en: 'A serene backwater wonderland where the river branches into tranquil tributaries before merging with the Bay of Bengal through the lush Konaseema delta.',
          te: 'కోనసీమ పచ్చదనాల నడుమ గోదావరి ఉపనదులు బంగాళాఖాతంలో సంగమించే సుందరమైన ప్రకృతి సౌందర్య ప్రాంతం.',
        },
        history: {
          en: 'The agrarian and boatcraft traditions of the Godavari delta date back millennia, sustaining rich artisan and culinary heritage including traditional Godavari cuisine and handlooms.',
          te: 'గోదావరి నదీ జలాలు సృష్టించిన సుసంపన్నమైన వ్యవసాయ సంస్కృతి, చేనేత కళలు మరియు సాంప్రదాయ రుచులకు కోనసీమ పెట్టింది పేరు.',
        },
        significance: {
          en: 'Offers visitors an authentic cultural immersion into traditional village boat rides, eco-tourism, and pristine natural waterways.',
          te: 'కాలువలు, పడవ ప్రయాణాలు మరియు సహజసిద్ధమైన పర్యావరణంతో యాత్రికులకు అద్భుతమైన శాంతియుత అనుభూతినిస్తుంది.',
        },
        address: 'Dindi, Malkipuram Mandal, Konaseema District, Andhra Pradesh 533253',
        location: {
          latitude: 16.4831,
          longitude: 81.8654,
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
            caption: {
              en: 'Quiet waterways with reflecting coconut palms at twilight',
              te: 'గోదావరి కాలువలు మరియు కొబ్బరి తోటల ప్రతిబింబాలు',
            },
            isPrimary: true,
          },
        ],
        audioGuides: [],
        status: 'published' as const,
        isFeatured: false,
      },
    ];

    for (const item of heritageItems) {
      const qrCode = await generateQRCodeDataUrl(item.slug);
      await Heritage.create({
        ...item,
        qrCode,
      });
      console.log(`[Seed] Seeded heritage: ${item.name.en} with QR code`);
    }

    // 4. Seed Demonstration Events (clearly marked as demonstration/educational)
    const events = [
      {
        title: {
          en: 'Daily Godavari Nitya Harati Ceremony',
          te: 'రోజువారీ గోదావరి నిత్య హారతి మహోత్సవం',
        },
        description: {
          en: 'Experience the mesmerizing evening river ritual conducted by Vedic priests with oil lamps, incense, conch resonance, and divine hymns along Pushkar Ghat.',
          te: 'పుష్కర ఘాట్ వద్ద ప్రతిరోజూ సాయంత్రం వేద పండితులచే నిర్వహించబడే మంగళకరమైన గోదావరి హారతి కార్యక్రమం.',
        },
        venue: 'Pushkar Ghat Main Stage, Rajamahendravaram',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        location: {
          address: 'Pushkar Ghat, Rajamahendravaram',
          latitude: 17.0005,
          longitude: 81.7778,
        },
        status: 'ongoing' as const,
      },
      {
        title: {
          en: 'Godavari Cultural & Heritage Exhibition (Demo Session)',
          te: 'గోదావరి సాంస్కృతిక మరియు శిల్పకళా ప్రదర్శన (డెమో)',
        },
        description: {
          en: 'Demonstration cultural showcase displaying traditional Kondapalli toys, Godavari handloom textiles, and classical Carnatic performances.',
          te: 'కొండపల్లి బొమ్మలు, చేనేత వస్త్రాలు మరియు శాస్త్రీయ సంగీత నృత్య ప్రదర్శనలతో కూడిన సాంస్కృతిక సదస్సు.',
        },
        venue: 'Anam Kala Kendram, Rajamahendravaram',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: {
          address: 'Subramanya Maidan, Rajamahendravaram',
          latitude: 16.9975,
          longitude: 81.7801,
        },
        status: 'upcoming' as const,
      },
    ];

    await Event.insertMany(events);
    console.log(`[Seed] Seeded ${events.length} demonstration events.`);

    // 5. Seed Announcements (clearly marked as demonstration guidelines)
    const announcements = [
      {
        title: {
          en: 'Pushkaralu Visitor Safety: Always Utilize Designate Ghat Steps',
          te: 'తీర్థయాత్రికుల భద్రత: నిర్ణీత ఘాట్ల మెట్లపై మాత్రమే స్నానాలు ఆచరించండి',
        },
        content: {
          en: 'Pilgrims are kindly requested to strictly adhere to ghat safety barricades, supervise young children closely, and follow instructions from lifeguards and volunteer staff.',
          te: 'యాత్రికులు గోదావరిలో నిర్ణయించిన భద్రతా హద్దులను దాటవద్దు. చిన్నారులను గమనిస్తూ, లైఫ్ గార్డుల సూచనలను తప్పక పాటించగలరు.',
        },
        type: 'alert' as const,
        priority: 'high' as const,
        publishedAt: new Date(),
        isPublished: true,
      },
      {
        title: {
          en: 'Digital Pilgrim QR Code Guides Now Live Across Major Locations',
          te: 'డిజిటల్ పిల్‌గ్రిమ్ క్యూఆర్ కోడ్ గైడ్‌లు ప్రముఖ క్షేత్రాలలో అందుబాటులో ఉన్నాయి',
        },
        content: {
          en: 'Scan the official bronze/wood QR plaques at temple entrances and ghat walkways with your smartphone camera to access instant bilingual audio guides and historical facts.',
          te: 'దేవాలయ ప్రవేశ ద్వారాల వద్ద గల క్యూఆర్ కోడ్‌లను మీ మొబైల్ కెమెరాతో స్కాన్ చేసి తెలుగు మరియు ఆంగ్ల ఆడియో గైడ్‌లను ఉచితంగా వినండి.',
        },
        type: 'general' as const,
        priority: 'medium' as const,
        publishedAt: new Date(),
        isPublished: true,
      },
    ];

    await Announcement.insertMany(announcements);
    console.log(`[Seed] Seeded ${announcements.length} announcements.`);

    // 6. Seed Pilgrim Facilities
    const facilities = [
      {
        name: {
          en: 'Kotilingala Ghat RO Drinking Water Station #1',
          te: 'కోటిలింగాల ఘాట్ శుద్ధ తాగునీటి కేంద్రం 1',
        },
        type: 'drinking_water' as const,
        description: {
          en: 'Free continuous purified drinking water dispensary equipped with cooled storage taps.',
          te: 'భక్తుల సౌకర్యార్థం ఉచిత చల్లని శుద్ధ తాగునీటి సరఫరా కేంద్రం.',
        },
        address: 'Kotilingala Ghat Entrance, Rajamahendravaram',
        location: {
          latitude: 16.9945,
          longitude: 81.7728,
        },
        phone: '1800-425-0001',
        operatingHours: '24 Hours',
        isVerified: true,
        isActive: true,
      },
      {
        name: {
          en: 'District Government General Hospital & Emergency Aid',
          te: 'ప్రభుత్వ సర్వజన ఆసుపత్రి మరియు అత్యవసర చికిత్సా విభాగం',
        },
        type: 'hospital' as const,
        description: {
          en: 'Round-the-clock emergency medical department with trauma care, oxygen beds, and standby ambulances.',
          te: '24 గంటల అత్యవసర వైద్య సేవలు, అంబులెన్స్ సౌకర్యం కలిగిన జిల్లా ప్రధాన ఆసుపత్రి.',
        },
        address: 'Danavaipeta, Rajamahendravaram, Andhra Pradesh 533103',
        location: {
          latitude: 17.0089,
          longitude: 81.7812,
        },
        phone: '0883-2473333',
        operatingHours: '24 Hours',
        isVerified: true,
        isActive: true,
      },
      {
        name: {
          en: 'Pushkar Ghat Clean Public Restrooms & Changing Rooms',
          te: 'పుష్కర ఘాట్ ఆధునిక మరుగుదొడ్లు మరియు వస్త్ర మార్పిడి గదులు',
        },
        type: 'restroom' as const,
        description: {
          en: 'Maintained sanitation complex with dedicated changing stalls for female and male pilgrims after river bath.',
          te: 'మహిళలు మరియు పురుషులకు ప్రత్యేక వస్త్ర మార్పిడి గదులు మరియు శుభ్రమైన మరుగుదొడ్లు.',
        },
        address: 'Near Old Godavari Bridge Approach, Pushkar Ghat',
        location: {
          latitude: 17.0012,
          longitude: 81.7769,
        },
        operatingHours: '04:00 AM - 10:00 PM',
        isVerified: true,
        isActive: true,
      },
      {
        name: {
          en: 'Godavari Harati Pilgrim Vehicle Parking Complex',
          te: 'గోదావరి హారతి యాత్రికుల వాహన పార్కింగ్ సముదాయం',
        },
        type: 'parking' as const,
        description: {
          en: 'Organized parking ground for tourist buses, cars, and two-wheelers with security surveillance.',
          te: 'బస్సులు, కార్లు మరియు ద్విచక్ర వాహనాల కోసం సురక్షితమైన విశాల పార్కింగ్ ప్రాంగణం.',
        },
        address: 'Syama Prasad Mukherjee Ground, Rajamahendravaram',
        location: {
          latitude: 17.0035,
          longitude: 81.7824,
        },
        operatingHours: '24 Hours',
        isVerified: true,
        isActive: true,
      },
      {
        name: {
          en: 'Sri Annapurna Free Prasadam & Dining Hall',
          te: 'శ్రీ అన్నపూర్ణ ఉచిత నిత్య అన్నదాన భవనం',
        },
        type: 'food_prasadam' as const,
        description: {
          en: 'Hygienic community dining hall offering fresh traditional vegetarian meals and prasadam to visiting pilgrims.',
          te: 'యాత్రికులకు శుచియైన ఉచిత సాంప్రదాయ శాకాహార భోజన ప్రసాద వితరణ శాల.',
        },
        address: 'Devasthanam Complex, Near Main Temple Street, Rajamahendravaram',
        location: {
          latitude: 16.9961,
          longitude: 81.7745,
        },
        operatingHours: '11:00 AM - 03:30 PM & 07:00 PM - 09:30 PM',
        isVerified: true,
        isActive: true,
      },
    ];

    await Facility.insertMany(facilities);
    console.log(`[Seed] Seeded ${facilities.length} pilgrim facilities.`);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
