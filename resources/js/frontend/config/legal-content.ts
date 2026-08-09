import { ls } from '@frontend/lib/localized';
import type { LocalizedString, PageContent } from '@frontend/types/marketing-content';

function section(titleEn: string, bodyEn: string, titleBn = '', bodyBn = ''): {
  title: LocalizedString;
  body: LocalizedString;
} {
  return {
    title: ls(titleEn, titleBn || titleEn),
    body: ls(bodyEn, bodyBn || bodyEn),
  };
}

const TERMS_SECTIONS = [
  section(
    'Welcome to BAE Card Ltd.',
    'BAE Card Ltd. ("us", "we", or "our") maintains www.baecard.info (the "Service"). The website is owned by Bae Innovation Ltd., a business formed under the Companies Act of 1994 (Act XVIII). Our Privacy Policy further regulates your use of our Service and outlines how we collect, protect, and distribute information obtained from our web pages. These Terms and our Privacy Policy are part of your agreement with us ("Agreements"). You confirm that you have read and understood the Agreements, and you agree to be bound by them. If you do not agree to (or are unable to comply with) the Agreements, you may not use the Service; however, please notify us via email at support@baecard.info so that we can try to find a solution. These conditions apply to all visitors, users, and others who want to access or use the Service.',
  ),
  section(
    'Communications',
    'By using our Service, you consent to receive newsletters, advertising or promotional materials, and any other information we may provide. You may opt-out of receiving any or all of these emails from us by following the unsubscribe link or by emailing support@baecard.info.',
  ),
  section(
    'Purchases',
    'You may be asked to provide certain information relevant to your Purchase if you wish to purchase any product or service made available through the Service ("Purchase"), including but not limited to your credit or debit card number, the expiration date of your card, your billing address, and your shipping information. You represent and guarantee that: (a) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and (b) the information you provide to us is true, correct, and complete. For the purpose of facilitating payment and the completion of Purchases, we may use third-party services. By entering your details, you allow us permission to share it with these third parties that comply with our Privacy Policy. We retain the right to refuse or cancel your purchase at any time for a variety of reasons, including product or service availability, faults in the product or service description or pricing, an error in your order, or other reasons. If we suspect fraud or an illegal or illegitimate transaction, we preserve the right to refuse or revoke your order.',
  ),
  section(
    'Services',
    'We provide you a revocable, mutually exclusive, non-transferable, limited license to access and use our Services for your own personal networking reasons. The quantity of your right of access and use may be determined by (a) whether you create an account with the Service, and (b) if you subscribe for premium services. Public Profiles: You comprehend and agree that making your contact information public through a "smart profile," which is a dedicated URL containing the contact and other information that you wish to share and that you may modify through the Service, is a significant feature of the Service. Any personal information you make available on your smart profile within the Services will be published at a publicly accessible and searchable URL, and you understand and agree to that. Through that URL, any third party will be able to see your smart profile. You also acknowledge and accept that your Smart Card operates by providing a link to your public profile URL and that it is not a protected method to share your contact information.',
  ),
  section(
    'Fee Changes',
    'BAE Card has the right to alter smart card prices at any moment at its sole discretion. Any modifications to fees and charges will take effect at the conclusion of the current Billing Cycle.',
  ),
  section(
    'Refunds',
    'BAE CARD is committed to delivering 100% client satisfaction. If you are displeased with our product, you can return it within 7 days and we will issue a full refund. Non-refundable items: unfortunately, we are unable to provide a refund or replacement if 7 days have gone by since your purchase; customized cards (such as name, designation, company name, logo engraved); any form of damage due to accident, misuse, or inappropriate use of BAE CARD by the customer. After receiving and assessing the condition of your returned item(s), we will handle your replacement or refund request. Please allow at least 10 working days from receipt of your item(s) to process your request. Refunds may take 1 to 2 billing cycles to reflect on your credit card statement, depending on your credit card issuer. We will tell you by email when your return has been processed. Purchases made from companies other than the BAE CARD website are not eligible for replacement, credit, or refund. If you have questions concerning your return, please contact us on the chat line or call us.',
  ),
  section(
    'Links To Other Web Sites',
    'Our Service can include links to third-party websites or services that are not maintained or controlled by BAE CARD. BAE CARD has no authority over, and takes no responsibility for, any third-party websites or services, including their content, privacy policies, or practices. We make no claims or warranties concerning these entities/individuals or their websites. You accept that the company shall not be held accountable or liable, directly or indirectly, for any damage or loss caused or allegedly caused by or in connection with the use of or dependence on any such material, goods, or services accessible on or through any such third-party web sites or services. We strongly recommend reviewing the terms of service and privacy policies of any third-party websites or services.',
  ),
  section(
    'Disclaimer of Warranty',
    'The company provides these services on an "as is" and "as available" basis. Company offers no express or implied representations or warranties about the functioning of its services, or the information, content, or materials contained therein. You acknowledge that use of our services, its content, and any services or things obtained from us is at your exclusive risk. Neither company nor anyone associated with the company provides any warranty or assurance regarding the services\' completeness, security, reliability, quality, correctness, or availability. This company disclaims all warranties of any kind, express or implied, statutory or otherwise, including but not limited to warranties of merchantability, non-infringement, and fitness for a particular purpose. The above does not impact any implicit guarantees that cannot be omitted or limited under applicable legislation.',
  ),
  section(
    'Changes to Service',
    'We retain the right, at our sole discretion, to cancel or amend our Service, in addition to any features or content we provide via it, without notice. We shall not be accountable if all or part of the Service is unavailable at any time or for any period due to any cause whatsoever. We may restrict access to any parts of the Service, or the entire Service, to users, including registered users, from time to time.',
  ),
  section(
    'Amendments to Terms',
    'We reserve the right to change the Terms at any point by posting the amended terms on this website. It is your responsibility to check these Terms on a regular basis. You understand and consent to the modifications if you continue to use the Platform after the updated Terms are posted. You agree to be bound by the amended terms if you continue to access or use our Service after the changes become effective. You are no longer permitted to use the Service if you do not agree to the revised conditions.',
  ),
  section(
    'Acknowledgment',
    'You confirm that you have read these Terms of Service and accept to be bound by them by using the Service or other services we offer.',
  ),
  section(
    'Contact Us',
    'Please convey your feedback, comments, and requests for technical support by email: support@baecard.info',
  ),
];

const POLICY_SECTIONS = [
  section(
    'Information Collection and Use',
    'To provide and improve our services to you, we gather a wide range of data for a number of purposes.',
  ),
  section(
    'Types of Data Collected',
    'Personal Data: Users may be required to have a current and valid account in order to use our services. Users can choose the information and third-party connections they want to associate with their account for sharing with others ("User Profile"). We might require you to provide us with personally identifiable information ("Personal Data") that will allow us to contact or identify you. Data that can be used to identify you includes but is not limited to: email address; first name and last name; phone number; address, country, state, province, ZIP/postal code, city; cookies and usage data; company name; business address; business phone number; and information the user chooses to include in their profile. We might reach you with newsletters, marketing or advertising materials, and other content that may be of interest to you based on your Personal Data. By emailing us at support@baecard.info, you can opt-out of receiving any or all of these emails from us. Usage Data: We may also collect "Usage Data," which is information transmitted by your browser whenever you visit our Service or access it via any device. This usage information may include your computer\'s Internet Protocol address, browser type, browser version, the pages of our Service that you view, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data. Tracking Cookies Data: We track the activity on our Service using cookies and other tracking technologies, and we preserve some information. You may set your browser to refuse all cookies or to inform you when one is received. You may not be able to utilize some sections of our Service if you refuse to accept cookies.',
  ),
  section(
    'Examples of Cookies we use',
    'Session Cookies: used to administer our Service. Preference Cookies: used to remember your various settings and preferences. Security Cookies: used for security considerations. Advertising Cookies: used to offer you adverts that may be relevant to you and your interests.',
  ),
  section(
    'Use of Data',
    'BAE CARD utilizes the data that it collects to: offer and manage our Service; notify you of service modifications; enable you to engage in interactive parts of our Service; provide customer service; gather data or analysis to improve our service; monitor how our service is being used; detect, prevent, and resolve technical difficulties; fulfill our obligations and enforce our rights under contracts; send account and subscription-related communications; send news, special offers, and general information about similar goods and services (unless you have opted out); and for any other purpose with your consent.',
  ),
  section(
    'Transfer of Data',
    'We will only retain your Personal Data for as long as it is required to fulfill the objectives outlined in this Privacy Policy. To the extent required to fulfill our legal obligations, resolve conflicts, and uphold our legal agreements and policies, we will retain and use your personal information. We will also retain usage data for internal analysis unless we are legally obligated to maintain this data for extended periods of time.',
  ),
  section(
    'Disclosure of Data',
    'Personal information you give us or that we gather may be disclosed in the following ways. Business Transaction: Your Personal Data may be transferred in the event of a merger, acquisition, or asset sale involving us or our subsidiaries. Other cases: We may disclose information to our subsidiaries and affiliates; contractors, service providers, and other third parties that help us run our business; to fulfill the purpose for which you provide it; to allow us to use your company\'s logo on our website; for any other purpose we disclose to you at the time you provide the information; with your consent; or if we believe disclosure is required to protect the rights, property, or safety of the Company, our clients, or others.',
  ),
  section(
    'Data Security',
    'We prioritize the security of your information, although no method of Internet transmission or computer storage can guarantee complete safety. Although we strive to ensure the security of your Personal Data using industry-standard methods, we cannot provide a complete guarantee of its security.',
  ),
  section(
    'Service Providers',
    'We may engage third-party organizations and individuals to assist us in delivering our Service, to provide Service on our behalf, perform Service-related tasks, or analyze the usage of our Service. These third parties are granted access to your Personal Data solely for the purpose of fulfilling their assigned responsibilities on our behalf. They are strictly prohibited from disclosing or utilizing the data for any other purpose.',
  ),
  section(
    'Data analysis and Behavioral Remarketing',
    'We utilize third-party Service Providers to closely monitor and analyze the utilization of our Service. We might use retargeting services to show you advertisements on websites owned by third parties after you have visited our service. We and our third-party providers use cookies to inform, optimize, and display ads based on your past usage of our service.',
  ),
  section(
    'Payments',
    'Within the Service, we might provide paid goods and/or services. In that instance, we process payments using third-party services (such as payment processors). Your payment card information will not be kept on file or gathered. This data is sent straight to SSL Commerz, one of our third-party payment processors, whose Privacy Policy controls how they utilize your personal information.',
  ),
  section(
    'Links to Other Sites',
    'Links to external websites that are not run by us may be found within our service. A third party\'s website will be displayed to you if you click on one of their links. Every site you visit should have a Privacy Policy that you should read. The content, privacy practices, or other policies of any third-party websites or services are beyond our control and responsibility.',
  ),
  section(
    'Changes to This Privacy Policy',
    'We may amend our Privacy Policy from time to time. Any modifications will be disclosed to you by publishing the amended Privacy Policy on this page. We will update the effective date and send you an email and/or clear notice prior to the modification taking effect. It is advised that you regularly review this Privacy Policy. This Privacy Policy was published for www.baecard.info on 23/05/2024.',
  ),
  section(
    'Contact Us',
    'If you have any queries concerning this Privacy Policy, please contact us by email: support@baecard.info',
  ),
];

export const TERMS_PAGE: PageContent = {
  title: ls('Terms of Service', 'সেবার শর্তাবলী'),
  paragraphs: [],
  sections: TERMS_SECTIONS,
};

export const POLICY_PAGE: PageContent = {
  title: ls('Privacy Policy', 'গোপনীয়তা নীতি'),
  paragraphs: [],
  sections: POLICY_SECTIONS,
};
