export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionField {
  id: string;
  label: string;
  placeholder?: string;
  type?: string; 
}

export interface Question {
  id: string;
  text: string;
  type: 'radio' | 'number-inputs';
  options?: QuestionOption[];
  fields?: QuestionField[];
  parentId?: string;
  parentValue?: string;
}

export const stepTwoQuestions: Question[] = [
  {
    id: 'household_size',
    text: 'Wie viele personen leben aktuell in Ihrem Haushalt?',
    type: 'radio',
    options: [
      { label: '1 Person', value: '1' },
      { label: '2 Personen', value: '2' }
    ]
  },
  {
    id: 'age_range',
    parentId: 'household_size',
    parentValue: '1',
    text: 'Wie alt sind Sie?',
    type: 'radio',
    options: [
      { label: 'Sind Sie 18 - 25 Jahre alt?', value: '1' },
      { label: 'Sind Sie 26 Jahre oder älter?', value: '2' }
    ]
  },
  {
    id: 'degree_finished',
    parentId: 'age_range',
    parentValue: '1',
    text: 'Haben Sie Ihre Erste Ausbildung abgeschlossen?',
    type: 'radio',
    options: [
      { label: 'Ja', value: 'ja' },
      { label: 'Nein', value: 'nein' }
    ]
  },
  {
    id: 'currently_training',
    parentId: 'age_range',
    parentValue: '1',
    text: 'Sind Sie aktuell in einer Ausbildung?',
    type: 'radio',
    options: [
      { label: 'Ja', value: 'ja' },
      { label: 'Nein', value: 'nein' }
    ]
  },
  {
    id: 'partner_status',
    parentId: 'household_size',
    parentValue: '2',
    text: 'Leben Sie Zusammen mit Ihrem Ehepartner?',
    type: 'radio',
    options: [
      { label: 'Mit Ehepartner', value: '1' },
      { label: 'Mit Partner (Nicht verheiratet)', value: '2' },
      { label: 'Nein', value: '3' }
    ]
  },
  {
    id: 'household_composition',
    parentId: 'household_size',
    parentValue: '2',
    text: 'Wie setzt sich Ihr Haushalt zusammen?',
    type: 'number-inputs',
    fields: [
      { id: 'child_count', label: 'Anzahl Kinder von 0 bis 17 Jahren', type: 'number' },
      { id: 'adult_count', label: 'Anzahl Erwachsene ab 18 Jahren (ohne Ehepartner)', type: 'number' }
    ]
  }
];
