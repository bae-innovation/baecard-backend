<?php

namespace App\Support;

/**
 * Default marketing content — mirrors resources/js/frontend/config/marketing-content.defaults.ts
 */
class MarketingDefaults
{
    private static function ls(string $en, string $bn): array
    {
        return ['en' => $en, 'bn' => $bn];
    }

    public static function payload(): array
    {
        return [
            'hero' => [
                'title' => self::ls("Bangladesh's Smart NFC Digital Business Card", 'বাংলাদেশের স্মার্ট এনএফসি ডিজিটাল বিজনেস কার্ড'),
                'subtitle' => self::ls('Share your contact info with just a tap or scan. Update anytime.', 'একটি ট্যাপ বা স্ক্যানে যোগাযোগের তথ্য শেয়ার করুন।'),
                'ctaPrimary' => self::ls('Get Started', 'শুরু করুন'),
                'ctaSecondary' => self::ls('Book a Demo', 'ডেমো বুক করুন'),
            ],
            'orderSteps' => [
                ['id' => 'order', 'title' => self::ls('Order', 'অর্ডার'), 'body' => self::ls('Place your order from the website or contact us on WhatsApp.', 'ওয়েবসাইট থেকে অর্ডার করুন।')],
                ['id' => 'design', 'title' => self::ls('Design', 'ডিজাইন'), 'body' => self::ls('Designed with your logo, colors, fonts and branding.', 'আপনার ব্র্যান্ডিং দিয়ে ডিজাইন।')],
                ['id' => 'setup', 'title' => self::ls('Setup', 'সেটআপ'), 'body' => self::ls('Set up your profile yourself in minutes.', 'কয়েক মিনিটে প্রোফাইল সেটআপ করুন।')],
            ],
            'howItWorksSteps' => [
                ['id' => 'order', 'label' => self::ls('1. Order', '১. অর্ডার'), 'content' => self::ls('Place your order for a personalized NFC BAE Card.', 'ব্যক্তিগতকৃত NFC BAE Card অর্ডার করুন।')],
                ['id' => 'design', 'label' => self::ls('2. Design', '২. ডিজাইন'), 'content' => self::ls('Create a unique card that matches your style.', 'আপনার স্টাইলের অনন্য কার্ড তৈরি করুন।')],
                ['id' => 'setup', 'label' => self::ls('3. Setup', '৩. সেটআপ'), 'content' => self::ls('Quick, hassle-free setup instructions.', 'দ্রুত সেটআপ নির্দেশনা।')],
            ],
            'features' => [],
            'security' => [],
            'faq' => [],
            'offers' => [
                ['id' => 'new-year-25', 'badge' => self::ls('New Year', 'নতুন বছর'), 'message' => self::ls('🌸 New year, new start — enjoy 25% off!', '🌸 নতুন বছরে নতুন শুরু, সাথে থাকুক ২৫% ছাড়!'), 'href' => '/products', 'enabled' => true],
            ],
            'pages' => [
                'about' => ['title' => self::ls('About Us', 'আমাদের সম্পর্কে'), 'paragraphs' => [self::ls('At Bae Innovation, we build smart connection tools.', 'Bae Innovation-এ আমরা স্মার্ট সংযোগের টুল তৈরি করি।')]],
                'terms' => ['title' => self::ls('Terms of Service', 'সেবার শর্তাবলী'), 'paragraphs' => [self::ls('By using BAE Card you agree to our terms.', 'BAE Card ব্যবহারের মাধ্যমে আপনি শর্তাবলীতে সম্মত।')]],
                'policy' => ['title' => self::ls('Privacy Policy', 'গোপনীয়তা নীতি'), 'paragraphs' => [self::ls('We protect your personal data.', 'আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখি।')]],
                'corporate' => ['title' => self::ls('Corporate Solutions', 'কর্পোরেট সমাধান'), 'subtitle' => self::ls('Team NFC cards', 'টিম NFC কার্ড'), 'paragraphs' => []],
                'contact' => ['title' => self::ls('Contact Us', 'যোগাযোগ'), 'subtitle' => self::ls('We are here to help.', 'আমরা সাহায্যের জন্য আছি।'), 'paragraphs' => []],
                'products' => ['title' => self::ls('Products', 'পণ্যসমূহ'), 'subtitle' => self::ls('Match your style', 'আপনার স্টাইল'), 'paragraphs' => []],
                'security' => ['title' => self::ls('Security', 'নিরাপত্তা'), 'subtitle' => self::ls('Why BAE Card is secure', 'কেন BAE Card নিরাপদ'), 'paragraphs' => []],
                'faq' => ['title' => self::ls('FAQ', 'প্রশ্নোত্তর'), 'subtitle' => self::ls('Common questions', 'সাধারণ প্রশ্ন'), 'paragraphs' => []],
            ],
            'navigation' => [
                ['label' => self::ls('Home', 'হোম'), 'href' => '/', 'route' => '/'],
                ['label' => self::ls('Products', 'পণ্য'), 'href' => '/products', 'route' => '/products'],
                ['label' => self::ls('Security', 'নিরাপত্তা'), 'href' => '/security', 'route' => '/security'],
                ['label' => self::ls('Corporate', 'কর্পোরেট'), 'href' => '/corporate', 'route' => '/corporate'],
                ['label' => self::ls('About Us', 'আমাদের সম্পর্কে'), 'href' => '/about', 'route' => '/about'],
                ['label' => self::ls('Contact', 'যোগাযোগ'), 'href' => '/contact', 'route' => '/contact'],
                ['label' => self::ls('FAQ', 'FAQ'), 'href' => '/faq', 'route' => '/faq'],
            ],
            'contact' => [
                'heading' => self::ls('Get in Touch', 'যোগাযোগ করুন'),
                'subheading' => self::ls('Reach out anytime.', 'যেকোনো সময় লিখুন।'),
            ],
            'corporate' => [
                'heading' => self::ls('Corporate Inquiry', 'কর্পোরেট ইনকোয়ারি'),
                'subheading' => self::ls('Tell us about your team.', 'টিম সম্পর্কে জানান।'),
                'bullets' => [self::ls('Bulk pricing', 'বাল্ক প্রাইস'), self::ls('Unified branding', 'একীভূত ব্র্যান্ডিং')],
            ],
            'seo' => [
                'home' => ['title' => self::ls('BAE Card', 'BAE Card'), 'description' => self::ls('Smart NFC cards', 'স্মার্ট NFC কার্ড')],
            ],
            'sectionHeadings' => [
                'catalog' => ['title' => self::ls('CATALOG', 'ক্যাটালগ'), 'subtitle' => self::ls('Match your style', 'আপনার স্টাইল')],
                'howItWorks' => ['title' => self::ls('ORDER & SETUP', 'অর্ডার ও সেটআপ'), 'subtitle' => self::ls('3 simple steps', '৩ ধাপ')],
                'features' => ['title' => self::ls('FEATURES', 'বৈশিষ্ট্য'), 'subtitle' => self::ls('Why BAE Card', 'কেন BAE Card')],
                'reviews' => ['title' => self::ls('REVIEWS', 'রিভিউ'), 'subtitle' => self::ls('Customer feedback', 'গ্রাহক মতামত')],
                'security' => ['title' => self::ls('SECURITY', 'নিরাপত্তা'), 'subtitle' => self::ls('Trusted', 'বিশ্বস্ত')],
                'faq' => ['title' => self::ls('FAQ', 'FAQ'), 'subtitle' => self::ls('Questions', 'প্রশ্ন')],
                'corporate' => ['title' => self::ls('CORPORATE', 'কর্পোরেট'), 'subtitle' => self::ls('For teams', 'টিমের জন্য')],
                'trust' => ['title' => self::ls('As trusted by', 'যাদের বিশ্বাস')],
            ],
        ];
    }

    /**
     * Default CMS content for a given entry key.
     *
     * @return array<string, mixed>
     */
    public static function contentForKey(string $key): array
    {
        $payload = self::payload();

        return match ($key) {
            'section.hero' => $payload['hero'],
            'section.order_steps' => ['items' => $payload['orderSteps']],
            'section.how_it_works' => ['items' => $payload['howItWorksSteps']],
            'section.features' => ['items' => $payload['features']],
            'section.security' => ['items' => $payload['security']],
            'section.faq' => ['items' => $payload['faq']],
            'section.offers' => ['items' => $payload['offers']],
            'section.navigation' => ['items' => $payload['navigation']],
            'section.section_headings' => $payload['sectionHeadings'],
            'section.contact' => $payload['contact'],
            'section.corporate' => $payload['corporate'],
            'seo.all' => $payload['seo'],
            default => self::pageContentForKey($key, $payload),
        };
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private static function pageContentForKey(string $key, array $payload): array
    {
        if (! str_starts_with($key, 'page.')) {
            return [];
        }

        $slug = substr($key, 5);

        return $payload['pages'][$slug] ?? [
            'title' => self::ls('', ''),
            'subtitle' => self::ls('', ''),
            'paragraphs' => [],
        ];
    }
}
