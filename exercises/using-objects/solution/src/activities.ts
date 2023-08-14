import axios from 'axios';
import { TranslationActivityInput, TranslationActivityOutput } from './shared';

export async function translateTerm(input: TranslationActivityInput): Promise<TranslationActivityOutput> {
  const lang = encodeURIComponent(input.languageCode);
  const term = encodeURIComponent(input.term);

  const url = `http://localhost:9998/translate?lang=${lang}&term=${term}`;
  const response = await axios.get(url);
  const responseData = response.data;

  return { translation: responseData };
}
