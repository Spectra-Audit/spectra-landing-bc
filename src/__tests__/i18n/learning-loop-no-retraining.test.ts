import fs from 'fs'
import path from 'path'

/**
 * The learning-loop diagram must not claim the model gets retrained.
 *
 * Why it is worth a test. The whitepaper publishes a fixed weight table, and
 * the weights are module-level constants in the backend with no retraining or
 * recalibration code anywhere near them. The claim has already come back once
 * after a commit whose message said it was gone: the aria-label is an
 * attribute, and the check that cleared it read rendered text, which cannot
 * see attributes.
 *
 * Both files are covered deliberately. The locale files are what the page
 * renders; scripts/diagram-i18n-data.json is what re-seeds them, so fixing one
 * and not the other lets the next run of the seeder put the claim straight
 * back.
 *
 * RETRAINING_TERMS is per-locale on purpose. A /retrain|Retraining/i pattern
 * only matches English: of the sixteen labels this diagram actually shipped it
 * matches one, not Modelltraining, not Yeniden Egitim, not Pereobuchenie, so it
 * would pass on a revert. Every term below was verified to appear in that
 * locale's text at d2666871 and to be absent from it now.
 *
 * What this guards, exactly: a revert, a re-seed, and copy that reuses a
 * locale's existing retraining term. That covers the regression that actually
 * happened here twice.
 *
 * What it does not guard, measured rather than assumed. The term appears inside
 * the retired node label in only five locales (ar, bn, en, ja, ko). For the
 * other eleven the node assertion is the exact-value comparison alone, which is
 * case- and diacritic-sensitive, so all of these get through:
 *
 *   modelltraining        lowercased
 *   Yeniden Egitim        diacritic stripped
 *   Model Re-training     hyphenated
 *   Modell-Neutraining    a different compound
 *   Dooboochenie          a real Russian synonym the old copy never used
 *
 * Case-folding and NFD-normalising the comparison would catch the first two and
 * still miss the rest, so it is deliberately not built: a newly invented synonym
 * is out of scope for a string guard and belongs to copy review. Do not read
 * this test as proof that no locale can ever say "retrain" again. It proves the
 * specific wording this repo has already shipped twice cannot come back.
 */
const LOCALES_DIR = path.join(__dirname, '..', '..', 'i18n', 'locales')
const SEED_FILE = path.join(__dirname, '..', '..', '..', 'scripts', 'diagram-i18n-data.json')

const RETRAINING_TERMS: Record<string, string> = {
  ar: 'إعادة تدريب',
  bn: 'পুনঃপ্রশিক্ষণ',
  de: 'erneuten Training',
  en: 'retrain',
  es: 'reentrenar',
  fr: 'réentraîner',
  hi: 'पुनः प्रशिक्षित',
  ja: '再学習',
  ko: '재학습',
  mr: 'पुन्हा प्रशिक्षित',
  pt: 'retreinar',
  ru: 'переобучения',
  ta: 'மீண்டும் பயிற்சி',
  te: 'మళ్లీ శిక్షణ',
  tr: 'yeniden eğitmek',
  zh: '重新训练',
}

/** The node labels this diagram shipped before the claim was removed. */
const RETIRED_NODE_LABELS: Record<string, string> = {
  ar: 'إعادة تدريب النموذج',
  bn: 'মডেল পুনঃপ্রশিক্ষণ',
  de: 'Modelltraining',
  en: 'Model Retraining',
  es: 'Reentrenamiento',
  fr: 'Réentraînement',
  hi: 'मॉडल पुनःप्रशिक्षण',
  ja: 'モデル再学習',
  ko: '모델 재학습',
  mr: 'मॉडेल पुनःप्रशिक्षण',
  pt: 'Retreinamento',
  ru: 'Переобучение',
  ta: 'மாதிரி மறுபயிற்சி',
  te: 'మోడల్ పునఃశిక్షణ',
  tr: 'Yeniden Eğitim',
  zh: '模型再训练',
}

const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'))
const locales = fs
  .readdirSync(LOCALES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.basename(f, '.json'))
  .sort()

const expectNoRetraining = (locale: string, ariaLabel: string, nodeLabel: string) => {
  const term = RETRAINING_TERMS[locale]
  expect(typeof ariaLabel).toBe('string')
  expect(typeof nodeLabel).toBe('string')
  expect(ariaLabel.toLowerCase()).not.toContain(term.toLowerCase())
  expect(nodeLabel.toLowerCase()).not.toContain(term.toLowerCase())
  expect(nodeLabel).not.toBe(RETIRED_NODE_LABELS[locale])
}

describe('learning-loop diagram claims no model retraining', () => {
  it('covers every locale, so the loops below cannot pass by iterating nothing', () => {
    expect(locales).toHaveLength(16)
    expect(Object.keys(RETRAINING_TERMS).sort()).toEqual(locales)
    expect(Object.keys(RETIRED_NODE_LABELS).sort()).toEqual(locales)
    expect(fs.existsSync(SEED_FILE)).toBe(true)
  })

  it.each(locales)('%s locale file says update, not retrain', (locale) => {
    const diagram = readJson(path.join(LOCALES_DIR, `${locale}.json`)).learningLoop.diagram
    expectNoRetraining(locale, diagram.ariaLabel, diagram.nodes.retraining)
  })

  it.each(locales)('%s seed data cannot re-introduce the claim', (locale) => {
    const seed = readJson(SEED_FILE)[locale].l
    expectNoRetraining(locale, seed.ariaLabel, seed.retraining)
  })
})
