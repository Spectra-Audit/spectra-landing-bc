#!/usr/bin/env python3
"""One-off: add faq + whitepaper.metadata keys to every locale file."""
import json
import os

LOCALES_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'i18n', 'locales')

FAQ = {
    'en': {
        'title': 'Frequently Asked Questions',
        'q1': 'How long does a smart contract audit take?',
        'a1': 'Spectra Audit completes most audits in 20 minutes or less, compared to the days or weeks a traditional manual audit takes.',
        'q2': 'What types of vulnerabilities can Spectra Audit detect?',
        'a2': 'Spectra Audit detects 15+ vulnerability categories, including reentrancy, overflow/underflow, access control issues, and economic attack vectors.',
        'q3': "Is Spectra Audit's security audit really free?",
        'a3': 'Yes. Spectra Audit offers free comprehensive security audits with no credit card required. Premium features are available for advanced monitoring.',
        'q4': "How accurate are Spectra Audit's findings?",
        'a4': 'Spectra Audit detects up to 95% of known vulnerability patterns. All findings are produced by AI analysis and include verifiable evidence you can inspect. Results are informational and do not guarantee project safety.',
        'q5': 'Does Spectra Audit support multiple blockchains?',
        'a5': 'Yes. Spectra Audit supports Ethereum, BSC, Polygon, Arbitrum, Optimism, and other major EVM-compatible blockchains.',
    },
    'es': {
        'title': 'Preguntas frecuentes',
        'q1': '¿Cuánto tarda una auditoría de contratos inteligentes?',
        'a1': 'Spectra Audit completa la mayoría de las auditorías en 20 minutos o menos, frente a los días o semanas de una auditoría manual tradicional.',
        'q2': '¿Qué tipos de vulnerabilidades puede detectar Spectra Audit?',
        'a2': 'Spectra Audit detecta más de 15 categorías de vulnerabilidades, incluidas reentrancy, desbordamientos (overflow/underflow), problemas de control de acceso y vectores de ataque económicos.',
        'q3': '¿La auditoría de seguridad de Spectra Audit es realmente gratuita?',
        'a3': 'Sí. Spectra Audit ofrece auditorías de seguridad completas y gratuitas, sin tarjeta de crédito. Hay funciones premium disponibles para monitoreo avanzado.',
        'q4': '¿Qué tan precisos son los hallazgos de Spectra Audit?',
        'a4': 'Spectra Audit detecta hasta el 95 % de los patrones de vulnerabilidad conocidos. Todos los hallazgos provienen de análisis con IA e incluyen evidencia verificable que puedes inspeccionar. Los resultados son informativos y no garantizan la seguridad del proyecto.',
        'q5': '¿Spectra Audit es compatible con varias blockchains?',
        'a5': 'Sí. Spectra Audit es compatible con Ethereum, BSC, Polygon, Arbitrum, Optimism y otras blockchains compatibles con EVM.',
    },
    'pt': {
        'title': 'Perguntas frequentes',
        'q1': 'Quanto tempo leva uma auditoria de contrato inteligente?',
        'a1': 'A Spectra Audit conclui a maioria das auditorias em 20 minutos ou menos, em vez dos dias ou semanas de uma auditoria manual tradicional.',
        'q2': 'Que tipos de vulnerabilidades a Spectra Audit detecta?',
        'a2': 'A Spectra Audit detecta mais de 15 categorias de vulnerabilidades, incluindo reentrancy, overflow/underflow, falhas de controle de acesso e vetores de ataque econômico.',
        'q3': 'A auditoria de segurança da Spectra Audit é realmente gratuita?',
        'a3': 'Sim. A Spectra Audit oferece auditorias de segurança completas e gratuitas, sem cartão de crédito. Recursos premium estão disponíveis para monitoramento avançado.',
        'q4': 'Quão precisos são os resultados da Spectra Audit?',
        'a4': 'A Spectra Audit detecta até 95% dos padrões de vulnerabilidade conhecidos. Todos os resultados vêm de análise por IA e incluem evidências verificáveis que você pode inspecionar. Os resultados são informativos e não garantem a segurança do projeto.',
        'q5': 'A Spectra Audit suporta várias blockchains?',
        'a5': 'Sim. A Spectra Audit suporta Ethereum, BSC, Polygon, Arbitrum, Optimism e outras blockchains compatíveis com EVM.',
    },
    'fr': {
        'title': 'Questions fréquentes',
        'q1': "Combien de temps dure un audit de smart contract ?",
        'a1': "Spectra Audit termine la plupart des audits en 20 minutes ou moins, contre des jours, voire des semaines, pour un audit manuel traditionnel.",
        'q2': "Quels types de vulnérabilités Spectra Audit peut-il détecter ?",
        'a2': "Spectra Audit détecte plus de 15 catégories de vulnérabilités, dont la réentrance, les dépassements (overflow/underflow), les défauts de contrôle d'accès et les vecteurs d'attaque économiques.",
        'q3': "L'audit de sécurité de Spectra Audit est-il vraiment gratuit ?",
        'a3': "Oui. Spectra Audit propose des audits de sécurité complets et gratuits, sans carte bancaire. Des fonctionnalités premium sont disponibles pour la surveillance avancée.",
        'q4': "Quelle est la précision des résultats de Spectra Audit ?",
        'a4': "Spectra Audit détecte jusqu'à 95 % des schémas de vulnérabilité connus. Tous les résultats proviennent d'une analyse par IA et incluent des preuves vérifiables que vous pouvez inspecter. Ils sont fournis à titre informatif et ne garantissent pas la sûreté du projet.",
        'q5': "Spectra Audit prend-il en charge plusieurs blockchains ?",
        'a5': "Oui. Spectra Audit prend en charge Ethereum, BSC, Polygon, Arbitrum, Optimism et d'autres blockchains compatibles EVM.",
    },
    'de': {
        'title': 'Häufig gestellte Fragen',
        'q1': 'Wie lange dauert ein Smart-Contract-Audit?',
        'a1': 'Spectra Audit schließt die meisten Audits in 20 Minuten oder weniger ab – statt der Tage oder Wochen eines traditionellen manuellen Audits.',
        'q2': 'Welche Arten von Schwachstellen erkennt Spectra Audit?',
        'a2': 'Spectra Audit erkennt über 15 Schwachstellen-Kategorien, darunter Reentrancy, Overflow/Underflow, Zugriffskontrollprobleme und ökonomische Angriffsvektoren.',
        'q3': 'Ist das Sicherheits-Audit von Spectra Audit wirklich kostenlos?',
        'a3': 'Ja. Spectra Audit bietet kostenlose, umfassende Sicherheits-Audits ohne Kreditkarte. Premium-Funktionen für erweitertes Monitoring sind verfügbar.',
        'q4': 'Wie genau sind die Ergebnisse von Spectra Audit?',
        'a4': 'Spectra Audit erkennt bis zu 95 % der bekannten Schwachstellenmuster. Alle Ergebnisse stammen aus KI-Analysen und enthalten überprüfbare Belege. Die Ergebnisse sind informativ und garantieren nicht die Sicherheit eines Projekts.',
        'q5': 'Unterstützt Spectra Audit mehrere Blockchains?',
        'a5': 'Ja. Spectra Audit unterstützt Ethereum, BSC, Polygon, Arbitrum, Optimism und weitere EVM-kompatible Blockchains.',
    },
    'zh': {
        'title': '常见问题',
        'q1': '智能合约审计需要多长时间？',
        'a1': 'Spectra Audit 大多数审计可在 20 分钟内完成，而传统人工审计通常需要数天甚至数周。',
        'q2': 'Spectra Audit 能检测哪些类型的漏洞？',
        'a2': 'Spectra Audit 可检测 15 类以上的漏洞，包括重入攻击、上溢/下溢、访问控制缺陷以及经济攻击向量。',
        'q3': 'Spectra Audit 的安全审计真的免费吗？',
        'a3': '是的。Spectra Audit 提供免费的全面安全审计，无需信用卡。高级监控功能可通过付费方案获得。',
        'q4': 'Spectra Audit 的检测结果有多准确？',
        'a4': 'Spectra Audit 可检测多达 95% 的已知漏洞模式。所有结果均由 AI 分析生成，并附带可供查验的证据。结果仅供参考，不构成项目安全的保证。',
        'q5': 'Spectra Audit 支持多条区块链吗？',
        'a5': '支持。Spectra Audit 支持以太坊、BSC、Polygon、Arbitrum、Optimism 以及其他主流 EVM 兼容链。',
    },
    'ja': {
        'title': 'よくある質問',
        'q1': 'スマートコントラクト監査にはどのくらい時間がかかりますか？',
        'a1': 'Spectra Audit はほとんどの監査を20分以内に完了します。従来の手動監査では数日から数週間かかります。',
        'q2': 'Spectra Audit はどのような脆弱性を検出できますか？',
        'a2': 'リエントランシー、オーバーフロー/アンダーフロー、アクセス制御の不備、経済的攻撃ベクトルなど、15以上のカテゴリーの脆弱性を検出します。',
        'q3': 'Spectra Audit のセキュリティ監査は本当に無料ですか？',
        'a3': 'はい。クレジットカード不要で、包括的なセキュリティ監査を無料で提供しています。高度なモニタリング向けのプレミアム機能もあります。',
        'q4': 'Spectra Audit の検出結果はどの程度正確ですか？',
        'a4': '既知の脆弱性パターンの最大95%を検出します。すべての結果はAI分析によるもので、確認可能な証拠が付属します。結果は参考情報であり、プロジェクトの安全性を保証するものではありません。',
        'q5': 'Spectra Audit は複数のブロックチェーンに対応していますか？',
        'a5': 'はい。Ethereum、BSC、Polygon、Arbitrum、Optimism などの主要な EVM 互換チェーンに対応しています。',
    },
    'ko': {
        'title': '자주 묻는 질문',
        'q1': '스마트 컨트랙트 감사는 얼마나 걸리나요?',
        'a1': 'Spectra Audit는 대부분의 감사를 20분 이내에 완료합니다. 기존 수동 감사는 며칠에서 몇 주가 걸립니다.',
        'q2': 'Spectra Audit는 어떤 유형의 취약점을 탐지하나요?',
        'a2': '재진입(reentrancy), 오버플로/언더플로, 접근 제어 결함, 경제적 공격 벡터 등 15개 이상의 취약점 범주를 탐지합니다.',
        'q3': 'Spectra Audit의 보안 감사는 정말 무료인가요?',
        'a3': '네. 신용카드 없이 무료로 종합 보안 감사를 제공합니다. 고급 모니터링을 위한 프리미엄 기능도 제공됩니다.',
        'q4': 'Spectra Audit의 결과는 얼마나 정확한가요?',
        'a4': '알려진 취약점 패턴의 최대 95%를 탐지합니다. 모든 결과는 AI 분석으로 생성되며 직접 확인할 수 있는 증거가 포함됩니다. 결과는 참고용이며 프로젝트의 안전을 보장하지 않습니다.',
        'q5': 'Spectra Audit는 여러 블록체인을 지원하나요?',
        'a5': '네. Ethereum, BSC, Polygon, Arbitrum, Optimism 및 기타 주요 EVM 호환 체인을 지원합니다.',
    },
    'ar': {
        'title': 'الأسئلة الشائعة',
        'q1': 'كم يستغرق تدقيق العقد الذكي؟',
        'a1': 'تُكمل Spectra Audit معظم عمليات التدقيق في 20 دقيقة أو أقل، مقارنة بأيام أو أسابيع للتدقيق اليدوي التقليدي.',
        'q2': 'ما أنواع الثغرات التي يمكن لـ Spectra Audit اكتشافها؟',
        'a2': 'تكتشف Spectra Audit أكثر من 15 فئة من الثغرات، بما في ذلك إعادة الدخول (reentrancy)، والتجاوزات الحسابية، ومشكلات التحكم في الوصول، ونواقل الهجوم الاقتصادية.',
        'q3': 'هل تدقيق الأمان من Spectra Audit مجاني حقًا؟',
        'a3': 'نعم. تقدم Spectra Audit تدقيقات أمان شاملة مجانية دون الحاجة إلى بطاقة ائتمان. تتوفر ميزات مدفوعة للمراقبة المتقدمة.',
        'q4': 'ما مدى دقة نتائج Spectra Audit؟',
        'a4': 'تكتشف Spectra Audit ما يصل إلى 95% من أنماط الثغرات المعروفة. جميع النتائج ناتجة عن تحليل بالذكاء الاصطناعي وتتضمن أدلة يمكن التحقق منها. النتائج معلوماتية ولا تضمن سلامة المشروع.',
        'q5': 'هل تدعم Spectra Audit عدة سلاسل كتل؟',
        'a5': 'نعم. تدعم Spectra Audit شبكات Ethereum وBSC وPolygon وArbitrum وOptimism وغيرها من الشبكات المتوافقة مع EVM.',
    },
    'ru': {
        'title': 'Часто задаваемые вопросы',
        'q1': 'Сколько времени занимает аудит смарт-контракта?',
        'a1': 'Spectra Audit завершает большинство аудитов за 20 минут или быстрее — вместо дней или недель традиционного ручного аудита.',
        'q2': 'Какие типы уязвимостей обнаруживает Spectra Audit?',
        'a2': 'Spectra Audit обнаруживает более 15 категорий уязвимостей, включая reentrancy, переполнения (overflow/underflow), ошибки контроля доступа и экономические векторы атак.',
        'q3': 'Аудит безопасности Spectra Audit действительно бесплатный?',
        'a3': 'Да. Spectra Audit предоставляет бесплатные комплексные аудиты безопасности без банковской карты. Премиум-функции доступны для расширенного мониторинга.',
        'q4': 'Насколько точны результаты Spectra Audit?',
        'a4': 'Spectra Audit обнаруживает до 95% известных шаблонов уязвимостей. Все результаты получены с помощью ИИ-анализа и включают проверяемые доказательства. Результаты носят информационный характер и не гарантируют безопасность проекта.',
        'q5': 'Поддерживает ли Spectra Audit несколько блокчейнов?',
        'a5': 'Да. Spectra Audit поддерживает Ethereum, BSC, Polygon, Arbitrum, Optimism и другие основные EVM-совместимые блокчейны.',
    },
    'tr': {
        'title': 'Sık Sorulan Sorular',
        'q1': 'Bir akıllı sözleşme denetimi ne kadar sürer?',
        'a1': "Spectra Audit çoğu denetimi 20 dakika veya daha kısa sürede tamamlar; geleneksel manuel denetimler ise günler hatta haftalar sürer.",
        'q2': 'Spectra Audit hangi tür güvenlik açıklarını tespit edebilir?',
        'a2': "Spectra Audit; reentrancy, taşma (overflow/underflow), erişim kontrolü sorunları ve ekonomik saldırı vektörleri dahil 15'ten fazla güvenlik açığı kategorisini tespit eder.",
        'q3': "Spectra Audit'in güvenlik denetimi gerçekten ücretsiz mi?",
        'a3': 'Evet. Spectra Audit, kredi kartı gerektirmeden ücretsiz kapsamlı güvenlik denetimleri sunar. Gelişmiş izleme için premium özellikler mevcuttur.',
        'q4': "Spectra Audit'in bulguları ne kadar doğru?",
        'a4': "Spectra Audit, bilinen güvenlik açığı kalıplarının %95'ine kadarını tespit eder. Tüm bulgular yapay zekâ analiziyle üretilir ve inceleyebileceğiniz doğrulanabilir kanıtlar içerir. Sonuçlar bilgilendirme amaçlıdır ve proje güvenliğini garanti etmez.",
        'q5': 'Spectra Audit birden fazla blokzinciri destekliyor mu?',
        'a5': 'Evet. Spectra Audit; Ethereum, BSC, Polygon, Arbitrum, Optimism ve diğer büyük EVM uyumlu blokzincirleri destekler.',
    },
    'hi': {
        'title': 'अक्सर पूछे जाने वाले प्रश्न',
        'q1': 'स्मार्ट कॉन्ट्रैक्ट ऑडिट में कितना समय लगता है?',
        'a1': 'Spectra Audit अधिकांश ऑडिट 20 मिनट या उससे कम में पूरा करता है, जबकि पारंपरिक मैनुअल ऑडिट में दिन या हफ़्ते लगते हैं।',
        'q2': 'Spectra Audit किस प्रकार की कमज़ोरियाँ पहचान सकता है?',
        'a2': 'Spectra Audit 15+ श्रेणियों की कमज़ोरियाँ पहचानता है, जिनमें reentrancy, overflow/underflow, एक्सेस कंट्रोल की खामियाँ और आर्थिक हमलों के तरीक़े शामिल हैं।',
        'q3': 'क्या Spectra Audit का सिक्योरिटी ऑडिट वाक़ई मुफ़्त है?',
        'a3': 'हाँ। Spectra Audit बिना क्रेडिट कार्ड के मुफ़्त, व्यापक सिक्योरिटी ऑडिट देता है। उन्नत मॉनिटरिंग के लिए प्रीमियम सुविधाएँ उपलब्ध हैं।',
        'q4': 'Spectra Audit के नतीजे कितने सटीक हैं?',
        'a4': 'Spectra Audit ज्ञात कमज़ोरी पैटर्न के 95% तक की पहचान करता है। सभी नतीजे AI विश्लेषण से बनते हैं और इनमें जाँचने योग्य प्रमाण शामिल होते हैं। नतीजे केवल जानकारी के लिए हैं और प्रोजेक्ट की सुरक्षा की गारंटी नहीं देते।',
        'q5': 'क्या Spectra Audit कई ब्लॉकचेन सपोर्ट करता है?',
        'a5': 'हाँ। Spectra Audit Ethereum, BSC, Polygon, Arbitrum, Optimism और अन्य प्रमुख EVM-संगत ब्लॉकचेन सपोर्ट करता है।',
    },
    'bn': {
        'title': 'সচরাচর জিজ্ঞাসা',
        'q1': 'একটি স্মার্ট কন্ট্রাক্ট অডিটে কত সময় লাগে?',
        'a1': 'Spectra Audit বেশিরভাগ অডিট ২০ মিনিট বা তার কম সময়ে সম্পন্ন করে, যেখানে প্রচলিত ম্যানুয়াল অডিটে দিন বা সপ্তাহ লেগে যায়।',
        'q2': 'Spectra Audit কী ধরনের দুর্বলতা শনাক্ত করতে পারে?',
        'a2': 'Spectra Audit ১৫টিরও বেশি শ্রেণির দুর্বলতা শনাক্ত করে, যার মধ্যে রয়েছে reentrancy, overflow/underflow, অ্যাক্সেস নিয়ন্ত্রণের ত্রুটি এবং অর্থনৈতিক আক্রমণের কৌশল।',
        'q3': 'Spectra Audit-এর নিরাপত্তা অডিট কি সত্যিই বিনামূল্যে?',
        'a3': 'হ্যাঁ। Spectra Audit ক্রেডিট কার্ড ছাড়াই বিনামূল্যে পূর্ণাঙ্গ নিরাপত্তা অডিট প্রদান করে। উন্নত মনিটরিংয়ের জন্য প্রিমিয়াম ফিচার রয়েছে।',
        'q4': 'Spectra Audit-এর ফলাফল কতটা নির্ভুল?',
        'a4': 'Spectra Audit পরিচিত দুর্বলতার প্যাটার্নের ৯৫% পর্যন্ত শনাক্ত করে। সব ফলাফল AI বিশ্লেষণ থেকে আসে এবং যাচাইযোগ্য প্রমাণ অন্তর্ভুক্ত থাকে। ফলাফল কেবল তথ্যের জন্য; এটি প্রকল্পের নিরাপত্তার নিশ্চয়তা দেয় না।',
        'q5': 'Spectra Audit কি একাধিক ব্লকচেইন সমর্থন করে?',
        'a5': 'হ্যাঁ। Spectra Audit Ethereum, BSC, Polygon, Arbitrum, Optimism এবং অন্যান্য প্রধান EVM-সামঞ্জস্যপূর্ণ ব্লকচেইন সমর্থন করে।',
    },
    'te': {
        'title': 'తరచుగా అడిగే ప్రశ్నలు',
        'q1': 'స్మార్ట్ కాంట్రాక్ట్ ఆడిట్‌కు ఎంత సమయం పడుతుంది?',
        'a1': 'Spectra Audit చాలా ఆడిట్‌లను 20 నిమిషాలు లేదా అంతకన్నా తక్కువ సమయంలో పూర్తి చేస్తుంది; సంప్రదాయ మాన్యువల్ ఆడిట్‌లకు రోజులు లేదా వారాలు పడతాయి.',
        'q2': 'Spectra Audit ఏ రకాల దుర్బలత్వాలను గుర్తించగలదు?',
        'a2': 'Reentrancy, overflow/underflow, యాక్సెస్ కంట్రోల్ లోపాలు, ఆర్థిక దాడి మార్గాలు సహా 15+ వర్గాల దుర్బలత్వాలను Spectra Audit గుర్తిస్తుంది.',
        'q3': 'Spectra Audit సెక్యూరిటీ ఆడిట్ నిజంగా ఉచితమేనా?',
        'a3': 'అవును. క్రెడిట్ కార్డ్ అవసరం లేకుండా Spectra Audit ఉచిత, సమగ్ర సెక్యూరిటీ ఆడిట్‌లను అందిస్తుంది. అధునాతన పర్యవేక్షణ కోసం ప్రీమియం ఫీచర్లు అందుబాటులో ఉన్నాయి.',
        'q4': 'Spectra Audit ఫలితాలు ఎంత ఖచ్చితమైనవి?',
        'a4': 'తెలిసిన దుర్బలత్వ నమూనాల్లో 95% వరకు Spectra Audit గుర్తిస్తుంది. అన్ని ఫలితాలు AI విశ్లేషణ ద్వారా రూపొందుతాయి; మీరు పరిశీలించగల ధృవీకరించదగిన ఆధారాలు ఉంటాయి. ఫలితాలు సమాచారం కోసమే; ప్రాజెక్ట్ భద్రతకు హామీ ఇవ్వవు.',
        'q5': 'Spectra Audit బహుళ బ్లాక్‌చెయిన్‌లకు మద్దతు ఇస్తుందా?',
        'a5': 'అవును. Ethereum, BSC, Polygon, Arbitrum, Optimism సహా ఇతర ప్రధాన EVM-అనుకూల బ్లాక్‌చెయిన్‌లకు Spectra Audit మద్దతు ఇస్తుంది.',
    },
    'ta': {
        'title': 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
        'q1': 'ஸ்மார்ட் காண்ட்ராக்ட் தணிக்கைக்கு எவ்வளவு நேரம் ஆகும்?',
        'a1': 'Spectra Audit பெரும்பாலான தணிக்கைகளை 20 நிமிடங்கள் அல்லது அதற்குக் குறைவாக முடிக்கிறது; பாரம்பரிய கைமுறை தணிக்கைகளுக்கு நாட்கள் அல்லது வாரங்கள் ஆகும்.',
        'q2': 'Spectra Audit எவ்வகை பாதிப்புகளைக் கண்டறியும்?',
        'a2': 'Reentrancy, overflow/underflow, அணுகல் கட்டுப்பாட்டு குறைபாடுகள், பொருளாதார தாக்குதல் வழிகள் உள்ளிட்ட 15+ வகை பாதிப்புகளை Spectra Audit கண்டறிகிறது.',
        'q3': 'Spectra Audit-இன் பாதுகாப்பு தணிக்கை உண்மையில் இலவசமா?',
        'a3': 'ஆம். கிரெடிட் கார்டு தேவையின்றி இலவச, விரிவான பாதுகாப்பு தணிக்கைகளை Spectra Audit வழங்குகிறது. மேம்பட்ட கண்காணிப்புக்கு பிரீமியம் அம்சங்கள் உள்ளன.',
        'q4': 'Spectra Audit முடிவுகள் எவ்வளவு துல்லியமானவை?',
        'a4': 'அறியப்பட்ட பாதிப்பு வடிவங்களில் 95% வரை Spectra Audit கண்டறிகிறது. அனைத்து முடிவுகளும் AI பகுப்பாய்வால் உருவாக்கப்படுகின்றன; நீங்கள் சரிபார்க்கக்கூடிய சான்றுகள் இணைக்கப்படுகின்றன. முடிவுகள் தகவலுக்காக மட்டுமே; திட்டத்தின் பாதுகாப்பிற்கு உத்தரவாதம் அல்ல.',
        'q5': 'Spectra Audit பல பிளாக்செயின்களை ஆதரிக்கிறதா?',
        'a5': 'ஆம். Ethereum, BSC, Polygon, Arbitrum, Optimism மற்றும் பிற முக்கிய EVM-இணக்கப் பிளாக்செயின்களை Spectra Audit ஆதரிக்கிறது.',
    },
    'mr': {
        'title': 'वारंवार विचारले जाणारे प्रश्न',
        'q1': 'स्मार्ट कॉन्ट्रॅक्ट ऑडिटला किती वेळ लागतो?',
        'a1': 'Spectra Audit बहुतेक ऑडिट 20 मिनिटांत किंवा त्याहून कमी वेळेत पूर्ण करते; पारंपरिक मॅन्युअल ऑडिटला दिवस किंवा आठवडे लागतात.',
        'q2': 'Spectra Audit कोणत्या प्रकारच्या त्रुटी शोधू शकते?',
        'a2': 'Reentrancy, overflow/underflow, अॅक्सेस कंट्रोलमधील दोष आणि आर्थिक हल्ल्यांचे मार्ग यांसह 15+ प्रकारच्या त्रुटी Spectra Audit शोधते.',
        'q3': 'Spectra Audit चे सुरक्षा ऑडिट खरोखर मोफत आहे का?',
        'a3': 'होय. क्रेडिट कार्डशिवाय Spectra Audit मोफत, सर्वसमावेशक सुरक्षा ऑडिट देते. प्रगत मॉनिटरिंगसाठी प्रीमियम वैशिष्ट्ये उपलब्ध आहेत.',
        'q4': 'Spectra Audit चे निष्कर्ष किती अचूक आहेत?',
        'a4': 'ज्ञात त्रुटी-नमुन्यांपैकी 95% पर्यंत Spectra Audit शोधते. सर्व निष्कर्ष AI विश्लेषणातून येतात आणि तपासता येणारे पुरावे सोबत असतात. निष्कर्ष केवळ माहितीसाठी आहेत; ते प्रकल्पाच्या सुरक्षिततेची हमी देत नाहीत.',
        'q5': 'Spectra Audit अनेक ब्लॉकचेनला सपोर्ट करते का?',
        'a5': 'होय. Ethereum, BSC, Polygon, Arbitrum, Optimism आणि इतर प्रमुख EVM-सुसंगत ब्लॉकचेनला Spectra Audit सपोर्ट करते.',
    },
}

WP_META = {
    'en': {
        'title': 'The 5-Dimensional Security Audit Framework | Spectra Audit',
        'description': 'How Spectra Audit scores smart contracts across code, distribution, tokenomics, liquidity, and sentiment — one transparent grade backed by verifiable evidence.',
    },
    'es': {
        'title': 'El marco de auditoría de seguridad de 5 dimensiones | Spectra Audit',
        'description': 'Cómo Spectra Audit califica contratos inteligentes en código, distribución, tokenomics, liquidez y sentimiento: una calificación transparente con evidencia verificable.',
    },
    'pt': {
        'title': 'O framework de auditoria de segurança em 5 dimensões | Spectra Audit',
        'description': 'Como a Spectra Audit avalia contratos inteligentes em código, distribuição, tokenomics, liquidez e sentimento — uma nota transparente com evidências verificáveis.',
    },
    'fr': {
        'title': "Le cadre d'audit de sécurité en 5 dimensions | Spectra Audit",
        'description': "Comment Spectra Audit note les smart contracts selon le code, la distribution, la tokenomics, la liquidité et le sentiment — une note transparente avec des preuves vérifiables.",
    },
    'de': {
        'title': 'Das 5-dimensionale Sicherheits-Audit-Framework | Spectra Audit',
        'description': 'Wie Spectra Audit Smart Contracts nach Code, Verteilung, Tokenomics, Liquidität und Sentiment bewertet – eine transparente Note mit überprüfbaren Belegen.',
    },
    'zh': {
        'title': '五维安全审计框架 | Spectra Audit',
        'description': '了解 Spectra Audit 如何从代码、分布、代币经济学、流动性和情绪五个维度为智能合约评分——一个透明的等级，附可验证的证据。',
    },
    'ja': {
        'title': '5次元セキュリティ監査フレームワーク | Spectra Audit',
        'description': 'Spectra Audit がコード、分布、トークノミクス、流動性、センチメントの5つの観点からスマートコントラクトを採点する仕組み。検証可能な証拠付きの透明なグレード。',
    },
    'ko': {
        'title': '5차원 보안 감사 프레임워크 | Spectra Audit',
        'description': 'Spectra Audit가 코드, 분포, 토크노믹스, 유동성, 센티먼트의 5개 차원에서 스마트 컨트랙트를 평가하는 방법 — 검증 가능한 증거가 있는 투명한 등급.',
    },
    'ar': {
        'title': 'إطار تدقيق الأمان خماسي الأبعاد | Spectra Audit',
        'description': 'كيف تُقيِّم Spectra Audit العقود الذكية عبر الكود والتوزيع واقتصاد الرموز والسيولة والمشاعر — درجة شفافة مدعومة بأدلة يمكن التحقق منها.',
    },
    'ru': {
        'title': 'Пятимерная система аудита безопасности | Spectra Audit',
        'description': 'Как Spectra Audit оценивает смарт-контракты по коду, распределению, токеномике, ликвидности и настроениям — прозрачная оценка с проверяемыми доказательствами.',
    },
    'tr': {
        'title': '5 Boyutlu Güvenlik Denetimi Çerçevesi | Spectra Audit',
        'description': "Spectra Audit'in akıllı sözleşmeleri kod, dağıtım, tokenomik, likidite ve duyarlılık boyutlarında nasıl puanladığı — doğrulanabilir kanıtlarla şeffaf bir not.",
    },
    'hi': {
        'title': '5-आयामी सिक्योरिटी ऑडिट फ्रेमवर्क | Spectra Audit',
        'description': 'Spectra Audit कोड, वितरण, टोकनॉमिक्स, लिक्विडिटी और सेंटिमेंट के आधार पर स्मार्ट कॉन्ट्रैक्ट्स को कैसे स्कोर करता है — सत्यापन योग्य प्रमाण के साथ एक पारदर्शी ग्रेड।',
    },
    'bn': {
        'title': '৫-মাত্রিক নিরাপত্তা অডিট ফ্রেমওয়ার্ক | Spectra Audit',
        'description': 'Spectra Audit কীভাবে কোড, বণ্টন, টোকেনমিক্স, তারল্য ও সেন্টিমেন্টের ভিত্তিতে স্মার্ট কন্ট্রাক্ট স্কোর করে — যাচাইযোগ্য প্রমাণসহ একটি স্বচ্ছ গ্রেড।',
    },
    'te': {
        'title': '5-డైమెన్షనల్ సెక్యూరిటీ ఆడిట్ ఫ్రేమ్‌వర్క్ | Spectra Audit',
        'description': 'కోడ్, పంపిణీ, టోకనామిక్స్, లిక్విడిటీ, సెంటిమెంట్ ఆధారంగా Spectra Audit స్మార్ట్ కాంట్రాక్టులను ఎలా స్కోర్ చేస్తుందో తెలుసుకోండి — ధృవీకరించదగిన ఆధారాలతో పారదర్శక గ్రేడ్.',
    },
    'ta': {
        'title': '5-பரிமாண பாதுகாப்பு தணிக்கை கட்டமைப்பு | Spectra Audit',
        'description': 'கோட், விநியோகம், டோக்கனாமிக்ஸ், பணப்புழக்கம், உணர்வு ஆகியவற்றின் அடிப்படையில் Spectra Audit ஸ்மார்ட் காண்ட்ராக்ட்களை எப்படி மதிப்பிடுகிறது — சரிபார்க்கக்கூடிய சான்றுகளுடன் வெளிப்படையான தரம்.',
    },
    'mr': {
        'title': '5-आयामी सुरक्षा ऑडिट फ्रेमवर्क | Spectra Audit',
        'description': 'कोड, वितरण, टोकनॉमिक्स, तरलता आणि सेंटिमेंट या आधारे Spectra Audit स्मार्ट कॉन्ट्रॅक्टला कसे गुण देते — तपासता येणाऱ्या पुराव्यांसह पारदर्शक ग्रेड.',
    },
}

# Trimmed to <=160 chars for SERP display (was 173)
EN_DESCRIPTION = (
    'One clear security grade with the evidence behind it. Real-time AI audits '
    'you can verify — free smart contract analysis in minutes, no registration.'
)


def main():
    for locale, faq in FAQ.items():
        path = os.path.join(LOCALES_DIR, f'{locale}.json')
        with open(path, encoding='utf-8') as f:
            data = json.load(f)

        data['faq'] = faq
        data.setdefault('whitepaper', {})['metadata'] = WP_META[locale]
        if locale == 'en':
            data['metadata']['description'] = EN_DESCRIPTION

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f'updated {locale}.json')


if __name__ == '__main__':
    main()
