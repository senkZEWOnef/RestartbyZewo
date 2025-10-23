import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
              <span className="text-lg md:text-xl font-bold">Restart</span>
            </div>
            <p className="text-gray-400 text-sm md:text-base">
              {t('home.trustedPartner')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerServices')}</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
              <li>{t('home.footerServicesDiscovery')}</li>
              <li>{t('home.footerServicesChiropractic')}</li>
              <li>{t('home.footerServicesRecovery')}</li>
              <li>{t('home.footerServicesRehabilitation')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerCompany')}</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('home.footerContact')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('home.footerPrivacyPolicy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('home.footerTermsOfService')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t('home.footerContactTitle')}</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-sm md:text-base">
              <li>Carr. 693 Km 1.7 Bo. Canovanillas</li>
              <li>Carolina, PR 00987</li>
              <li>(787) 404-6909</li>
              <li>info@restartquiro.com</li>
              <li className="text-xs text-gray-500 mt-2">{t('home.footerHours')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-xs md:text-sm">{t('home.footerCopyright')}</p>
            <Link 
              href="/admin" 
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded border border-gray-700 hover:border-gray-500"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}