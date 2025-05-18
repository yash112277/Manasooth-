
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Phone, LifeBuoy, ShieldAlert, MapPin, MessageSquareHeart } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface Helpline {
  id: string;
  name: string;
  contact: string; 
  description: string;
  icon: React.ElementType;
  availability?: string;
  notes?: string;
}

const governmentHelplines: Helpline[] = [
  {
    id: 'kiran-helpline',
    name: 'KIRAN (Ministry of Social Justice & Empowerment)',
    contact: '1800-599-0019',
    description: 'A 24x7 toll-free mental health rehabilitation helpline offering support in 13 languages. Provides early screening, first-aid, psychological support, distress management, and referrals.',
    icon: LifeBuoy,
    availability: '24×7 (Toll-Free)',
    notes: 'Available in 13 languages.',
  },
  {
    id: 'nimhans-psychosocial-support',
    name: 'NIMHANS Psychosocial Support (Ministry of Health & Family Welfare)',
    contact: '080-46110007',
    description: 'A national psychosocial support helpline by NIMHANS, Bengaluru, offering counselling and support for mental health concerns.',
    icon: LifeBuoy,
    availability: '24×7 (Toll-Free)',
  },
];

const ngoAndPrivateHelplines: Helpline[] = [
  {
    id: 'vandrevala-foundation',
    name: 'Vandrevala Foundation',
    contact: '+91-9999-666-555 (Call or WhatsApp)',
    description: 'Provides free psychological counselling and crisis mediation by professionally trained counsellors.',
    icon: MessageSquareHeart,
    availability: '24×7×365',
  },
  {
    id: 'aasra',
    name: 'AASRA (Mumbai-based Suicide Prevention & Counselling)',
    contact: '022-2754-6669 / +91-9820466726',
    description: 'Offers confidential support for individuals in distress and those experiencing suicidal thoughts.',
    icon: LifeBuoy,
    availability: '24×7 (Confidential)',
  },
  {
    id: 'icall-tiss',
    name: 'iCall (TISS School of Human Ecology)',
    contact: '91529-87821',
    description: 'Provides professional and confidential counselling, information, and referral services via telephone and email.',
    icon: Phone,
    availability: 'Mon–Sat, 10 am–8 pm',
  },
  {
    id: '1life',
    name: '1Life',
    contact: '07893-078930',
    description: 'A suicide prevention helpline offering emotional support to those who are in distress or despair.',
    icon: LifeBuoy,
    availability: '24×7',
  },
  {
    id: 'lifeline-foundation-kolkata',
    name: 'Lifeline Foundation (Kolkata)',
    contact: '+91-9088030303 / 033-40447437',
    description: 'Offers emotional support to people who are in distress, despair or suicidal.',
    icon: Phone,
    availability: '10 am–10 pm Daily',
  },
  {
    id: 'samaritans-mumbai',
    name: 'Samaritans Mumbai',
    contact: '+91-84229-84530 / +91-84229-84528 / +91-84229-84529',
    description: 'Provides confidential emotional support to anyone in distress or despair, including those who are suicidal.',
    icon: Phone,
    availability: 'Daily, 3 pm–9 pm',
  },
  {
    id: 'sneha-chennai',
    name: 'Sneha (Chennai)',
    contact: '044-24640050 / 044-24640060',
    description: 'Offers unconditional emotional support to people in distress, despair, or suicidal.',
    icon: Phone,
    availability: '24×7',
  },
  {
    id: 'muktaa-lgbtq-helpline',
    name: 'Muktaa Charitable Foundation (Maharashtra LGBTQ Helpline)',
    contact: '07887-889882',
    description: 'A dedicated helpline providing support for LGBTQ individuals in Maharashtra.',
    icon: MessageSquareHeart,
    availability: 'Mon–Sat, 12 pm–8 pm',
  },
  {
    id: 'jeevan-aastha-helpline',
    name: 'Jeevan Aastha Helpline (Gandhinagar Police Initiative)',
    contact: '1800-233-3330',
    description: 'A 24x7 suicide prevention helpline initiated by Gandhinagar Police.',
    icon: Phone,
    availability: '24×7',
  },
  {
    id: 'parivarthan-counselling',
    name: 'Parivarthan Counselling',
    contact: '+91-7676-602-602',
    description: 'Offers counselling, training, and awareness programs related to mental health.',
    icon: Phone,
    availability: 'Timings vary',
  },
  {
    id: 'roshni-trust-hyderabad',
    name: 'Roshni Trust (Hyderabad)',
    contact: '040-66202000 / 040-66202001 / +91-8142020033',
    description: 'Provides free and confidential emotional support to people who are in distress or despair.',
    icon: Phone,
    availability: 'Daily, 11 am to 9 pm',
  },
   {
    id: 'ngo-space-lgbtq-helpline',
    name: 'NGO Space LGBTQ Helpline',
    contact: '1800-111-015',
    description: 'A 24x7 helpline dedicated to supporting the LGBTQ community across India.',
    icon: MessageSquareHeart,
    availability: '24×7',
   },
];

const localHelplinesText = {
  en: {
    title: "Local Support & Helplines in India",
    description: "Find important contact numbers for emergency situations and mental health support across India.",
    summaryTitle: "Accessing Mental Health Support in India",
    summary: "India offers national government helplines like KIRAN and the NIMHANS psychosocial support line, operating around the clock in multiple languages. Additionally, numerous NGOs and private foundations provide free, confidential counselling via phone and WhatsApp. This network ensures that mental health assistance is just a call away, regardless of where you are in India.",
    immediateDangerTitle: "Immediate Danger?",
    immediateDangerDesc: "If you or someone you know is in immediate life-threatening danger, please call 112 (India’s universal emergency number) or go to the nearest emergency room.",
    governmentTitle: "Government-Run Helplines",
    governmentDesc: "National helplines managed by government bodies.",
    ngoTitle: "NGO & Private-Foundation Helplines",
    ngoDesc: "Confidential support lines run by non-governmental organizations and private foundations.",
    findingLocalTitle: "Finding More Local Resources",
    findingLocalDesc: "Many of these national helplines can also direct you to local resources, therapists, and support groups in your area. Don’t hesitate to ask them for referrals. You can also search online for 'mental health services near me' or contact your primary care doctor.",
    disclaimerTitle: "Disclaimer",
    disclaimerDesc: "Manasooth provides these resources for informational purposes only. We are not affiliated with these organizations. The information provided here is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
    pageFooter: "If you or someone you know is in immediate danger, please also consider dialing 112 (India’s universal emergency number) or contacting local emergency services. For non-crisis support, the above helplines are staffed by trained volunteers and professionals ready to listen and guide you toward further help."
  },
  hi: {
    title: "भारत में स्थानीय सहायता और हेल्पलाइन",
    description: "पूरे भारत में आपातकालीन स्थितियों और मानसिक स्वास्थ्य सहायता के लिए महत्वपूर्ण संपर्क नंबर खोजें।",
    summaryTitle: "भारत में मानसिक स्वास्थ्य सहायता तक पहुँचना",
    summary: "भारत में किरण और निमहंस मनोसामाजिक सहायता लाइन जैसी राष्ट्रीय सरकारी हेल्पलाइन हैं, जो कई भाषाओं में चौबीसों घंटे काम करती हैं। इसके अतिरिक्त, कई गैर सरकारी संगठन और निजी फाउंडेशन फोन और व्हाट्सएप के माध्यम से मुफ्त, गोपनीय परामर्श प्रदान करते हैं। यह नेटवर्क सुनिश्चित करता है कि आप भारत में कहीं भी हों, मानसिक स्वास्थ्य सहायता बस एक कॉल की दूरी पर है।",
    immediateDangerTitle: "तत्काल खतरा?",
    immediateDangerDesc: "यदि आप या आपका कोई जानने वाला व्यक्ति तत्काल जीवन-घातक खतरे में है, तो कृपया 112 (भारत का सार्वभौमिक आपातकालीन नंबर) पर कॉल करें या निकटतम आपातकालीन कक्ष में जाएँ।",
    governmentTitle: "सरकारी हेल्पलाइन",
    governmentDesc: "सरकारी निकायों द्वारा प्रबंधित राष्ट्रीय हेल्पलाइन।",
    ngoTitle: "गैर-सरकारी संगठन और निजी फाउंडेशन हेल्पलाइन",
    ngoDesc: "गैर-सरकारी संगठनों और निजी फाउंडेशनों द्वारा संचालित गोपनीय सहायता लाइनें।",
    findingLocalTitle: "अधिक स्थानीय संसाधन ढूँढना",
    findingLocalDesc: "इनमें से कई राष्ट्रीय हेल्पलाइन आपको अपने क्षेत्र में स्थानीय संसाधनों, चिकित्सक और सहायता समूहों के लिए भी निर्देशित कर सकती हैं। उनसे रेफरल मांगने में संकोच न करें। आप 'मेरे आस-पास मानसिक स्वास्थ्य सेवाएं' के लिए ऑनलाइन भी खोज सकते हैं या अपने प्राथमिक देखभाल चिकित्सक से संपर्क कर सकते हैं।",
    disclaimerTitle: "अस्वीकरण",
    disclaimerDesc: "मनोसूथ इन संसाधनों को केवल सूचनात्मक उद्देश्यों के लिए प्रदान करता है। हम इन संगठनों से संबद्ध नहीं हैं। यहां दी गई जानकारी पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। किसी भी चिकित्सीय स्थिति के संबंध में आपके किसी भी प्रश्न के लिए हमेशा अपने चिकित्सक या अन्य योग्य स्वास्थ्य प्रदाता की सलाह लें।",
    pageFooter: "यदि आप या आपका कोई जानने वाला व्यक्ति तत्काल खतरे में है, तो कृपया 112 (भारत का सार्वभौमिक आपातकालीन नंबर) डायल करने या स्थानीय आपातकालीन सेवाओं से संपर्क करने पर भी विचार करें। गैर-संकट सहायता के लिए, उपरोक्त हेल्पलाइन प्रशिक्षित स्वयंसेवकों और पेशेवरों द्वारा संचालित हैं जो सुनने और आपको आगे की सहायता के लिए मार्गदर्शन करने के लिए तैयार हैं।"
  }
};


export default function LocalSupportPage() {
  const { translate } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <LifeBuoy className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{translate(localHelplinesText.en.title)}</h1>
        <p className="text-xl text-muted-foreground">
          {translate(localHelplinesText.en.description)}
        </p>
      </header>

      <Card className="shadow-lg bg-card">
        <CardHeader>
            <CardTitle>{translate(localHelplinesText.en.summaryTitle)}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{translate(localHelplinesText.en.summary)}</p>
        </CardContent>
      </Card>


      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
        <ShieldAlert className="h-5 w-5 text-destructive" />
        <AlertTitle className="font-semibold text-destructive">{translate(localHelplinesText.en.immediateDangerTitle)}</AlertTitle>
        <AlertDescription className="text-destructive/90">
          {translate(localHelplinesText.en.immediateDangerDesc)}
        </AlertDescription>
      </Alert>

      <Card className="shadow-xl hover:shadow-primary/10 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <ShieldAlert className="mr-3 h-7 w-7 text-primary" /> {translate(localHelplinesText.en.governmentTitle)}
          </CardTitle>
          <CardDescription>{translate(localHelplinesText.en.governmentDesc)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {governmentHelplines.map((helpline) => (
            <HelplineCard key={helpline.id} helpline={helpline} />
          ))}
        </CardContent>
      </Card>
      
      <div className="rounded-lg overflow-hidden shadow-lg aspect-video my-8">
        <Image
          src="https://placehold.co/600x338.png"
          alt={translate({en: "Image representing a supportive community or helpline services", hi: "एक सहायक समुदाय या हेल्पलाइन सेवाओं का प्रतिनिधित्व करने वाली छवि"})}
          width={600}
          height={338}
          className="object-cover w-full h-full"
          data-ai-hint="support network graphic"
        />
      </div>

      <Card className="shadow-xl hover:shadow-primary/10 transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <MessageSquareHeart className="mr-3 h-7 w-7 text-primary" /> {translate(localHelplinesText.en.ngoTitle)}
          </CardTitle>
          <CardDescription>{translate(localHelplinesText.en.ngoDesc)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ngoAndPrivateHelplines.map((helpline) => (
            <HelplineCard key={helpline.id} helpline={helpline} />
          ))}
        </CardContent>
      </Card>

      <Alert variant="default" className="bg-accent/10 border-accent/30">
        <MapPin className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent-foreground/90">{translate(localHelplinesText.en.findingLocalTitle)}</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          {translate(localHelplinesText.en.findingLocalDesc)}
        </AlertDescription>
      </Alert>

       <Card className="mt-12 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{translate(localHelplinesText.en.disclaimerTitle)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {translate(localHelplinesText.en.disclaimerDesc)}
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>
            {translate(localHelplinesText.en.pageFooter)}
        </p>
      </div>
    </div>
  );
}

interface HelplineCardProps {
  helpline: Helpline;
}

function HelplineCard({ helpline }: HelplineCardProps) {
  const IconComponent = helpline.icon;
  const { translate } = useLanguage();

  return (
    <Card className="bg-card hover:bg-muted/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <CardTitle className="text-xl">{helpline.name}</CardTitle> 
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pl-14"> 
        <p className="text-2xl font-bold text-primary">{helpline.contact}</p>
        <p className="text-sm text-muted-foreground">
            {translate({en: helpline.description, hi: helpline.description})} 
        </p>
        {helpline.availability && (
            <p className="text-xs text-muted-foreground pt-1">
                <strong>{translate({en: "Availability:", hi: "उपलब्धता:"})}</strong> {translate({en: helpline.availability, hi: helpline.availability})}
            </p>
        )}
        {helpline.notes && (
            <p className="text-xs text-accent-foreground/80 pt-1">
                <em>{translate({en:"Note:", hi:"ध्यान दें:"})} {translate({en: helpline.notes, hi: helpline.notes})}</em>
            </p>
        )}
      </CardContent>
    </Card>
  );
}
