export interface User {
  id: string;
  userName: string;
  country: string;
  createdAt: string;
} 
export interface UserNote {
  userId: string;
  note: string;
}

export interface CountryModalProps {
  showCountryModal: boolean;
  setShowCountryModal: (show: boolean) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
}

export interface NoteModalProps {
  showNoteModal: boolean;
  setShowNoteModal: (show: boolean) => void;
  currentNote: string;
  setCurrentNote: (note: string) => void;
  handleSaveNote: () => void;
}
