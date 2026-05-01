export interface ApiKeyState {
  key: string | null;
  status: 'idle' | 'validating' | 'connected' | 'demo' | 'invalid';
}

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  doi?: string;
  pmid?: string;
  citationCount?: number;
  openAccessPdf?: string;
  source: 'pubmed' | 'semantic' | 'crossref';
}

export interface ManuscriptScore {
  overall: number;
  scientificRigor: number;
  novelty: number;
  methods: number;
  clarity: number;
  structure: number;
}

export interface ReviewStage {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

export interface PrismaNumbers {
  identified: number;
  duplicatesRemoved: number;
  screened: number;
  excluded: number;
  soughtRetrieval: number;
  notRetrieved: number;
  assessed: number;
  excludedFull: number;
  included: number;
}

export interface Guideline {
  id: string;
  name: string;
  fullName: string;
  description: string;
  studyType: string;
  itemCount: number;
  color: string;
}

export interface GuidelineCheckResult {
  item: string;
  requirement: string;
  status: 'present' | 'partial' | 'absent';
  location?: string;
  suggestion?: string;
}

export interface StatisticalTest {
  name: string;
  description: string;
  assumptions: string[];
  rCode: string;
  pythonCode: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface PICOItem {
  population: string;
  intervention: string;
  comparator: string;
  outcome: string;
  studyDesign?: string;
}

export interface ExtractionField {
  label: string;
  value: string;
}

export interface ReviewProtocol {
  title: string;
  background: string;
  objectives: string;
  pico: PICOItem;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  databases: string[];
  searchStrategy: string;
  dataExtraction: ExtractionField[];
}
