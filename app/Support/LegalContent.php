<?php

namespace App\Support;

/**
 * Full legal page content mirrored from resources/js/frontend/config/legal-content.ts
 */
class LegalContent
{
    private static function ls(string $en, string $bn = ''): array
    {
        return ['en' => $en, 'bn' => $bn !== '' ? $bn : $en];
    }

    private static function section(string $titleEn, string $bodyEn): array
    {
        return [
            'title' => self::ls($titleEn),
            'body' => self::ls($bodyEn),
        ];
    }

  /**
   * @return array<string, mixed>
   */
    public static function termsPage(): array
    {
        return [
            'title' => self::ls('Terms of Service', 'সেবার শর্তাবলী'),
            'paragraphs' => [],
            'sections' => [
                self::section(
                    'Welcome to BAE Card Ltd.',
                    'BAE Card Ltd. ("us", "we", or "our") maintains www.baecard.info (the "Service"). The website is owned by Bae Innovation Ltd., a business formed under the Companies Act of 1994 (Act XVIII). Our Privacy Policy further regulates your use of our Service and outlines how we collect, protect, and distribute information obtained from our web pages. These Terms and our Privacy Policy are part of your agreement with us ("Agreements"). You confirm that you have read and understood the Agreements, and you agree to be bound by them. If you do not agree to (or are unable to comply with) the Agreements, you may not use the Service; however, please notify us via email at support@baecard.info so that we can try to find a solution. These conditions apply to all visitors, users, and others who want to access or use the Service.',
                ),
                self::section(
                    'Communications',
                    'By using our Service, you consent to receive newsletters, advertising or promotional materials, and any other information we may provide. You may opt-out of receiving any or all of these emails from us by following the unsubscribe link or by emailing support@baecard.info.',
                ),
                self::section(
                    'Purchases',
                    'You may be asked to provide certain information relevant to your Purchase if you wish to purchase any product or service made available through the Service ("Purchase"), including but not limited to your credit or debit card number, the expiration date of your card, your billing address, and your shipping information. You represent and guarantee that: (a) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and (b) the information you provide to us is true, correct, and complete. For the purpose of facilitating payment and the completion of Purchases, we may use third-party services. By entering your details, you allow us permission to share it with these third parties that comply with our Privacy Policy. We retain the right to refuse or cancel your purchase at any time for a variety of reasons, including product or service availability, faults in the product or service description or pricing, an error in your order, or other reasons. If we suspect fraud or an illegal or illegitimate transaction, we preserve the right to refuse or revoke your order.',
                ),
                self::section(
                    'Services',
                    'We provide you a revocable, mutually exclusive, non-transferable, limited license to access and use our Services for your own personal networking reasons. Public Profiles: You comprehend and agree that making your contact information public through a "smart profile" is a significant feature of the Service. Any personal information you make available on your smart profile within the Services will be published at a publicly accessible and searchable URL, and you understand and agree to that. You also acknowledge and accept that your Smart Card operates by providing a link to your public profile URL and that it is not a protected method to share your contact information.',
                ),
                self::section(
                    'Fee Changes',
                    'BAE Card has the right to alter smart card prices at any moment at its sole discretion. Any modifications to fees and charges will take effect at the conclusion of the current Billing Cycle.',
                ),
                self::section(
                    'Refunds',
                    'BAE CARD is committed to delivering 100% client satisfaction. If you are displeased with our product, you can return it within 7 days and we will issue a full refund. Non-refundable items include customized cards and damage due to misuse. After receiving and assessing returned items, we will handle your replacement or refund request within at least 10 working days.',
                ),
                self::section(
                    'Links To Other Web Sites',
                    'Our Service can include links to third-party websites or services that are not maintained or controlled by BAE CARD. BAE CARD has no authority over, and takes no responsibility for, any third-party websites or services. We strongly recommend reviewing the terms of service and privacy policies of any third-party websites or services.',
                ),
                self::section(
                    'Disclaimer of Warranty',
                    'The company provides these services on an "as is" and "as available" basis. You acknowledge that use of our services is at your exclusive risk. This company disclaims all warranties of any kind, express or implied, statutory or otherwise.',
                ),
                self::section(
                    'Changes to Service',
                    'We retain the right, at our sole discretion, to cancel or amend our Service, in addition to any features or content we provide via it, without notice.',
                ),
                self::section(
                    'Amendments to Terms',
                    'We reserve the right to change the Terms at any point by posting the amended terms on this website. You agree to be bound by the amended terms if you continue to access or use our Service after the changes become effective.',
                ),
                self::section(
                    'Acknowledgment',
                    'You confirm that you have read these Terms of Service and accept to be bound by them by using the Service or other services we offer.',
                ),
                self::section(
                    'Contact Us',
                    'Please convey your feedback, comments, and requests for technical support by email: support@baecard.info',
                ),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function policyPage(): array
    {
        return [
            'title' => self::ls('Privacy Policy', 'গোপনীয়তা নীতি'),
            'paragraphs' => [],
            'sections' => [
                self::section(
                    'Information Collection and Use',
                    'To provide and improve our services to you, we gather a wide range of data for a number of purposes.',
                ),
                self::section(
                    'Types of Data Collected',
                    'Personal Data includes email address, name, phone number, address, cookies and usage data, company name, business address, and profile information. Usage Data includes IP address, browser type, pages viewed, and diagnostic data. Tracking Cookies Data is used to administer and improve our Service.',
                ),
                self::section(
                    'Examples of Cookies we use',
                    'Session Cookies, Preference Cookies, Security Cookies, and Advertising Cookies.',
                ),
                self::section(
                    'Use of Data',
                    'BAE CARD utilizes collected data to offer and manage our Service, provide customer service, improve our service, detect technical difficulties, and send communications unless you have opted out.',
                ),
                self::section(
                    'Transfer of Data',
                    'We retain Personal Data only as long as required to fulfill the objectives outlined in this Privacy Policy and to meet legal obligations.',
                ),
                self::section(
                    'Disclosure of Data',
                    'Personal information may be disclosed in a business transaction, to subsidiaries and affiliates, contractors and service providers, or when required to protect rights, property, or safety.',
                ),
                self::section(
                    'Data Security',
                    'We prioritize the security of your information using industry-standard methods, although no method can guarantee complete safety.',
                ),
                self::section(
                    'Service Providers',
                    'Third parties assisting us may access Personal Data solely to fulfill their assigned responsibilities and are prohibited from disclosing or utilizing the data for other purposes.',
                ),
                self::section(
                    'Data analysis and Behavioral Remarketing',
                    'We utilize third-party providers to monitor Service usage and may use retargeting services with cookies based on your past usage.',
                ),
                self::section(
                    'Payments',
                    'Payments are processed via third-party processors such as SSL Commerz. Your payment card information is not stored on our servers.',
                ),
                self::section(
                    'Links to Other Sites',
                    'Links to external websites may appear within our service. We are not responsible for third-party content or privacy practices.',
                ),
                self::section(
                    'Changes to This Privacy Policy',
                    'We may amend our Privacy Policy from time to time by publishing updates on this page. This Privacy Policy was published for www.baecard.info on 23/05/2024.',
                ),
                self::section(
                    'Contact Us',
                    'If you have any queries concerning this Privacy Policy, please contact us by email: support@baecard.info',
                ),
            ],
        ];
    }
}
