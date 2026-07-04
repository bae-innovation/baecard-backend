import { frontendAsset } from '@frontend/lib/brand';
import { ls } from '@frontend/lib/localized';
import type { MarketingContent } from '@frontend/types/marketing-content';

export const DEFAULT_MARKETING_CONTENT: MarketingContent = {
  hero: {
    title: ls(
      "Bangladesh's Smart NFC Digital Business Card",
      'বাংলাদেশের স্মার্ট এনএফসি ডিজিটাল বিজনেস কার্ড',
    ),
    subtitle: ls(
      'Share your contact info with just a tap or scan.',
      'একটি ট্যাপ বা স্ক্যানে যোগাযোগের তথ্য শেয়ার করুন।',
    ),
    ctaPrimary: ls('Get Started', 'শুরু করুন'),
    ctaSecondary: ls('Book a Demo', 'ডেমো বুক করুন'),
  },
  orderSteps: [
    {
      id: 'order',
      title: ls('Order', 'অর্ডার'),
      body: ls(
        'Place your order from the website or contact us on WhatsApp.',
        'ওয়েবসাইট থেকে অর্ডার করুন অথবা WhatsApp-এ যোগাযোগ করুন।',
      ),
    },
    {
      id: 'design',
      title: ls('Design', 'ডিজাইন'),
      body: ls(
        'Designed with your logo, colors, fonts and branding. Front and back are customizable.',
        'আপনার লোগো, রঙ, ফন্ট ও ব্র্যান্ডিং দিয়ে ডিজাইন। সামনে-পেছনে কাস্টমাইজেশন।',
      ),
    },
    {
      id: 'setup',
      title: ls('Setup', 'সেটআপ'),
      body: ls(
        'After receiving the card, set up your profile yourself in minutes.',
        'কার্ড পাওয়ার পর কয়েক মিনিটে নিজেই প্রোফাইল সেটআপ করুন।',
      ),
    },
  ],
  howItWorksSteps: [
    {
      id: 'order',
      label: ls('1. Order', '১. অর্ডার'),
      content: ls(
        'Place your order for a personalized NFC BAE Card through our platform.',
        'আমাদের প্ল্যাটফর্মের মাধ্যমে ব্যক্তিগতকৃত NFC BAE Card অর্ডার করুন।',
      ),
    },
    {
      id: 'design',
      label: ls('2. Design', '২. ডিজাইন'),
      content: ls(
        'Collaborate with our design team to create a unique card that matches your style.',
        'আপনার স্টাইলের সাথে মিলিয়ে অনন্য কার্ড তৈরি করতে ডিজাইন টিমের সাথে কাজ করুন।',
      ),
    },
    {
      id: 'setup',
      label: ls('3. Setup', '৩. সেটআপ'),
      content: ls(
        'Follow our straightforward instructions for a quick, hassle-free setup.',
        'দ্রুত ও ঝামেলামুক্ত সেটআপের জন্য আমাদের সহজ নির্দেশনা অনুসরণ করুন।',
      ),
    },
  ],
  features: [
    {
      icon: frontendAsset('Get card2.svg'),
      title: ls('Get your BAE CARD', 'আপনার BAE CARD নিন'),
      description: ls(
        'Receive a premium NFC business card crafted for modern professionals. Share your brand identity instantly at meetings, events, and everyday encounters — no paper cards, no reprints.',
        'আধুনিক পেশাদারদের জন্য প্রিমিয়াম NFC বিজনেস কার্ড। মিটিং, ইভেন্ট ও দৈনন্দিন পরিচিতিতে তৎক্ষণাৎ ব্র্যান্ড পরিচয় শেয়ার করুন — কাগজের কার্ড বা পুনর্মুদ্রণের ঝামেলা নেই।',
      ),
    },
    {
      icon: frontendAsset('Profile2.svg'),
      title: ls('BAE CARD PROFILE', 'BAE CARD প্রোফাইল'),
      description: ls(
        'Build a stunning digital profile with photo, bio, social links, services, and contact details. Update anytime from your dashboard — your card always reflects your latest information.',
        'ছবি, বায়ো, সোশ্যাল লিংক, সেবা ও যোগাযোগের তথ্য দিয়ে আকর্ষণীয় ডিজিটাল প্রোফাইল তৈরি করুন। ড্যাশবোর্ড থেকে যেকোনো সময় আপডেট করুন।',
      ),
    },
    {
      icon: frontendAsset('Share2.svg'),
      title: ls('Effortless Sharing', 'সহজ শেয়ারিং'),
      description: ls(
        'One tap on any NFC-enabled smartphone opens your full profile instantly. No app download required for the person receiving your details — networking made frictionless.',
        'যেকোনো NFC স্মার্টফোনে একটি ট্যাপেই সম্পূর্ণ প্রোফাইল খুলে যায়। গ্রহণকারীর অ্যাপ ডাউনলোডের প্রয়োজন নেই — নেটওয়ার্কিং এখন ঝামেলামুক্ত।',
      ),
    },
    {
      icon: frontendAsset('QR2.svg'),
      title: ls('QR Code', 'QR কোড'),
      description: ls(
        'Every card includes a scannable QR code for devices without NFC. Universal compatibility ensures you never miss a connection, whether at conferences or casual meetups.',
        'প্রতিটি কার্ডে NFC-বিহীন ডিভাইসের জন্য স্ক্যানযোগ্য QR কোড। সার্বজনীন সামঞ্জস্যতা মানে কোনো সংযোগ মিস হবে না।',
      ),
    },
  ],
  security: [
    {
      icon: frontendAsset('encryption2.svg'),
      title: ls('Encryption', 'এনক্রিপশন'),
      description: ls(
        'Your data is safe with us. We encrypt all data at the storage level using AES-256 bit encryption.',
        'আপনার ডেটা নিরাপদ। AES-256 এনক্রিপশনে স্টোরেজ লেভেলে সুরক্ষিত।',
      ),
    },
    {
      icon: frontendAsset('ssl security2.svg'),
      title: ls('SSL Security', 'SSL সিকিউরিটি'),
      description: ls(
        'All data transferred is encrypted before exchange following the SSL standard.',
        'SSL স্ট্যান্ডার্ড অনুযায়ী সব ডেটা ট্রান্সফার এনক্রিপ্টেড।',
      ),
    },
    {
      icon: frontendAsset('firewall2.svg'),
      title: ls('Firewall', 'ফায়ারওয়াল'),
      description: ls(
        'We implemented best-in-class security measures against unwanted traffic.',
        'অবাঞ্ছিত ট্রাফিকের বিরুদ্ধে শ্রেষ্ঠ নিরাপত্তা ব্যবস্থা।',
      ),
    },
    {
      icon: frontendAsset('hosting2.svg'),
      title: ls('Hosting', 'হোস্টিং'),
      description: ls(
        'Our hosting providers are committed to delivering best-in-class security.',
        'আমাদের হোস্টিং প্রোভাইডাররা শ্রেষ্ঠ নিরাপত্তা নিশ্চিত করে।',
      ),
    },
  ],
  faq: [
    {
      question: ls('How does BAE CARD work?', 'BAE CARD কীভাবে কাজ করে?'),
      answer: ls(
        'BAE Card is a digital NFC business card with a built-in NFC chip. After purchase, create a profile with your picture, name, company, designation, website, social links, phone, and email. Tap your card on a smartphone to share your profile instantly — no app required for the receiver.',
        'BAE Card একটি ডিজিটাল NFC বিজনেস কার্ড। কেনার পর প্রোফাইল তৈরি করুন এবং স্মার্টফোনে ট্যাপ করে তৎক্ষণাৎ শেয়ার করুন — রিসিভারের অ্যাপ লাগবে না।',
      ),
    },
    {
      question: ls('Do I need to order 1000 pcs?', '১০০০ পিস অর্ডার করতে হবে?'),
      answer: ls(
        'No. BAE Card solves the problem of ordering thousands of paper cards. Your information is stored digitally on our server. Keep your physical card — do not give it away.',
        'না। হাজার হাজার কাগজের কার্ডের বদলে একটি স্মার্ট কার্ডই যথেষ্ট। তথ্য ডিজিটালি সংরক্ষিত থাকে।',
      ),
    },
    {
      question: ls(
        'Do I need a new card every time I change profile information?',
        'প্রোফাইল পরিবর্তনে নতুন কার্ড লাগবে?',
      ),
      answer: ls(
        'No. Edit your profile as often as you like. To change the physical card design, place a new order.',
        'না। প্রোফাইল যতবার ইচ্ছা এডিট করুন। শুধু ফিজিক্যাল ডিজাইন বদলাতে নতুন অর্ডার করুন।',
      ),
    },
    {
      question: ls('What phones are compatible with BAE Card?', 'কোন ফোনগুলো সাপোর্ট করে?'),
      answer: ls(
        'Most modern smartphones with NFC, including Apple iPhone 7+, Samsung Galaxy S7+, Google Pixel 2+, and OnePlus 6+.',
        'NFC সহ বেশিরভাগ আধুনিক স্মার্টফোন, যেমন iPhone 7+, Galaxy S7+, Pixel 2+, OnePlus 6+।',
      ),
    },
  ],
  offers: [
    {
      id: 'new-year-25',
      badge: ls('New Year', 'নতুন বছর'),
      message: ls(
        '🌸 New year, new start — enjoy 25% off!',
        '🌸 নতুন বছরে নতুন শুরু, সাথে থাকুক ২৫% ছাড়!',
      ),
      href: '/products',
      enabled: true,
    },
    {
      id: 'free-shipping',
      badge: ls('Shipping', 'ডেলিভারি'),
      message: ls(
        '🚀 Free delivery on your first BAE CARD order',
        '🚀 প্রথম BAE CARD অর্ডারে ফ্রি ডেলিভারি',
      ),
      href: '/products',
      enabled: true,
    },
    {
      id: 'corporate-bulk',
      badge: ls('Corporate', 'কর্পোরেট'),
      message: ls(
        '💼 Bulk pricing for teams — customize your smart NFC cards',
        '💼 টিমের জন্য বাল্ক প্রাইসিং — স্মার্ট NFC কার্ড কাস্টমাইজ করুন',
      ),
      href: '/corporate',
      enabled: true,
    },
  ],
  pages: {
    about: {
      title: ls('About Us', 'আমাদের সম্পর্কে'),
      paragraphs: [
        ls(
          "At Bae Innovation, we're a passionate team of problem solvers fueled by a love for creative solutions and seamless connections.",
          'Bae Innovation-এ আমরা সৃজনশীল সমাধান ও seamless connection-এ বিশ্বাসী একটি দল।',
        ),
        ls(
          'Our dedication to innovation has led us to develop the revolutionary BAE CARD — a Smart NFC card that redefines how you connect with your audience.',
          'আমাদের উদ্ভাবনের ফলে জন্ম BAE CARD — যা আপনার অডিয়েন্সের সাথে সংযোগের ধরন বদলে দেয়।',
        ),
        ls(
          'The BAE CARD allows you to share your contact information, website, social media profiles, and more with a simple tap.',
          'একটি সimple tap-এ যোগাযোগ, ওয়েবসাইট, সোশ্যাল মিডিয়া ও আরও অনেক কিছু শেয়ার করুন।',
        ),
      ],
    },
    terms: {
      title: ls('Terms of Service', 'সেবার শর্তাবলী'),
      paragraphs: [
        ls(
          'By using BAE Card services you agree to our terms regarding product use, data handling, and acceptable use of NFC sharing features.',
          'BAE Card সেবা ব্যবহারের মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মত হচ্ছেন।',
        ),
        ls(
          'Orders are subject to confirmation. Custom designs require approval before production.',
          'অর্ডার নিশ্চিতকরণের subject। কাস্টম ডিজাইন প্রোডাকশনের আগে অনুমোদন প্রয়োজন।',
        ),
      ],
    },
    policy: {
      title: ls('Privacy Policy', 'গোপনীয়তা নীতি'),
      paragraphs: [
        ls(
          'We collect only the information necessary to provide NFC profile services and process orders.',
          'NFC প্রোফাইল সেবা ও অর্ডার প্রক্রিয়াকরণের জন্য প্রয়োজনীয় তথ্যই সংগ্রহ করি।',
        ),
        ls(
          'Your profile data is encrypted at rest and transmitted over SSL. We do not sell personal data to third parties.',
          'প্রোফাইল ডেটা এনক্রিপ্টেড এবং SSL-এ ট্রান্সফার হয়। তৃতীয় পক্ষে বিক্রি করি না।',
        ),
      ],
    },
    corporate: {
      title: ls('Corporate Solutions', 'কর্পোরেট সমাধান'),
      subtitle: ls(
        'Equip your entire team with BAE Cards for smart networking and lead capture.',
        'স্মার্ট নেটওয়ার্কিং ও লিড ক্যাপচারের জন্য পুরো টিমকে BAE Card দিন।',
      ),
      paragraphs: [
        ls(
          'Bulk pricing, unified branding, and dedicated support for organizations of any size.',
          'যেকোনো আকারের প্রতিষ্ঠানের জন্য বাল্ক প্রাইস, একীভূত ব্র্যান্ডিং ও dedicated support।',
        ),
      ],
    },
    contact: {
      title: ls('Contact Us', 'যোগাযোগ'),
      subtitle: ls('We are here to help you get started.', 'শুরু করতে আমরা আপনার পাশে আছি।'),
      paragraphs: [],
    },
    products: {
      title: ls('Products', 'পণ্যসমূহ'),
      subtitle: ls('Match your style & need', 'আপনার স্টাইল ও প্রয়োজন মেটান'),
      paragraphs: [
        ls(
          'Choose from our range of NFC smart business cards. Order online and set up your digital profile after delivery.',
          'NFC স্মার্ট বিজনেস কার্ডের রেঞ্জ থেকে বেছে নিন। অনলাইনে অর্ডার করুন এবং ডেলিভারির পর প্রোফাইল সেটআপ করুন।',
        ),
      ],
    },
    security: {
      title: ls('Security', 'নিরাপত্তা'),
      subtitle: ls('Why BAE Card is the smart choice', 'কেন BAE Card স্মার্ট পছন্দ'),
      paragraphs: [
        ls(
          'Trusted by professionals everywhere. Your data security is our top priority.',
          'পেশাদারদের বিশ্বাস। আপনার ডেটা নিরাপত্তা আমাদের অগ্রাধিকার।',
        ),
      ],
    },
    faq: {
      title: ls('FAQ', 'প্রশ্নোত্তর'),
      subtitle: ls('Common questions and answers', 'সাধারণ প্রশ্ন ও উত্তর'),
      paragraphs: [],
    },
  },
  navigation: [
    { label: ls('Home', 'হোম'), href: '/', route: '/' },
    { label: ls('Products', 'পণ্য'), href: '/products', route: '/products' },
    { label: ls('Security', 'নিরাপত্তা'), href: '/security', route: '/security' },
    { label: ls('Corporate', 'কর্পোরেট'), href: '/corporate', route: '/corporate' },
    { label: ls('About Us', 'আমাদের সম্পর্কে'), href: '/about', route: '/about' },
    { label: ls('Contact', 'যোগাযোগ'), href: '/contact', route: '/contact' },
    { label: ls('FAQ', 'FAQ'), href: '/faq', route: '/faq' },
  ],
  contact: {
    heading: ls('Get in Touch', 'যোগাযোগ করুন'),
    subheading: ls('Reach out anytime — we respond quickly.', 'যেকোনো সময় লিখুন — দ্রুত উত্তর দেব।'),
  },
  corporate: {
    heading: ls('Corporate Inquiry', 'কর্পোরেট ইনকোয়ারি'),
    subheading: ls('Tell us about your team size and branding needs.', 'টিম সাইজ ও ব্র্যান্ডিং প্রয়োজনীয়তা জানান।'),
    bullets: [
      ls('Bulk pricing for teams', 'টিমের জন্য বাল্ক প্রাইস'),
      ls('Unified brand design', 'একীভূত ব্র্যান্ড ডিজাইন'),
      ls('Dedicated account support', 'ডেডিকেটেড সাপোর্ট'),
    ],
  },
  seo: {
    home: {
      title: ls('BAE Card — Smart NFC Business Cards', 'BAE Card — স্মার্ট NFC বিজনেস কার্ড'),
      description: ls(
        'Share contact info with a tap. Modern NFC digital business cards for professionals in Bangladesh.',
        'একটি ট্যাপে যোগাযোগ শেয়ার করুন। বাংলাদেশের পেশাদারদের জন্য NFC ডিজিটাল বিজনেস কার্ড।',
      ),
    },
    products: {
      title: ls('Products — BAE Card', 'পণ্য — BAE Card'),
      description: ls('Browse NFC smart business cards and order online.', 'NFC স্মার্ট কার্ড ব্রাউজ করুন ও অর্ডার করুন।'),
    },
    corporate: {
      title: ls('Corporate — BAE Card', 'কর্পোরেট — BAE Card'),
      description: ls('Team NFC cards with bulk pricing and branding.', 'বাল্ক প্রাইস ও ব্র্যান্ডিং সহ টিম NFC কার্ড।'),
    },
    security: {
      title: ls('Security — BAE Card', 'নিরাপত্তা — BAE Card'),
      description: ls('AES-256 encryption, SSL, and enterprise-grade hosting.', 'AES-256, SSL ও enterprise-grade hosting।'),
    },
    contact: {
      title: ls('Contact — BAE Card', 'যোগাযোগ — BAE Card'),
      description: ls('Message us or book an appointment.', 'মেসেজ করুন বা অ্যাপয়েন্টমেন্ট বুক করুন।'),
    },
    faq: {
      title: ls('FAQ — BAE Card', 'FAQ — BAE Card'),
      description: ls('Answers to common questions about BAE Card.', 'BAE Card সম্পর্কে সাধারণ প্রশ্নের উত্তর।'),
    },
    about: {
      title: ls('About Us — BAE Card', 'আমাদের সম্পর্কে — BAE Card'),
      description: ls('Learn about Bae Innovation and BAE Card.', 'Bae Innovation ও BAE Card সম্পর্কে জানুন।'),
    },
  },
  sectionHeadings: {
    catalog: {
      title: ls('CATALOG', 'ক্যাটালগ'),
      subtitle: ls('Match your style & Need', 'আপনার স্টাইল ও প্রয়োজন'),
    },
    howItWorks: {
      title: ls('ORDER & SETUP', 'অর্ডার ও সেটআপ'),
      subtitle: ls('Get started in 3 simple steps', '৩টি সহজ ধাপে শুরু করুন'),
    },
    features: {
      title: ls('FEATURES', 'বৈশিষ্ট্য'),
      subtitle: ls('Why professionals choose BAE Card', 'কেন পেশাদাররা BAE Card বেছে নেন'),
    },
    reviews: {
      title: ls('REVIEWS', 'রিভিউ'),
      subtitle: ls('What our customers say', 'গ্রাহকরা কী বলেন'),
    },
    security: {
      title: ls('SECURITY', 'নিরাপত্তা'),
      subtitle: ls('Trusted by professionals everywhere', 'পেশাদারদের বিশ্বাস'),
    },
    faq: {
      title: ls('FAQ', 'প্রশ্নোত্তর'),
      subtitle: ls('Common questions and answers', 'সাধারণ প্রশ্ন ও উত্তর'),
    },
    corporate: {
      title: ls('CORPORATE', 'কর্পোরেট'),
      subtitle: ls('Empower your team with smart NFC cards', 'স্মার্ট NFC কার্ডে টিমকে শক্তিশালী করুন'),
    },
    trust: {
      title: ls('As trusted by', 'যাদের বিশ্বাস'),
    },
  },
};
